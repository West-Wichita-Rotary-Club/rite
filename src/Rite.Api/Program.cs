using ApiTestSpark;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Rite.Api.Accounts;
using Rite.Api.Community;
using Rite.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("RiteDb")
    ?? $"Data Source={Path.Combine(builder.Environment.ContentRootPath, "rite.db")}";

builder.Services.AddDbContext<RiteDbContext>(options => options.UseSqlite(connectionString));

// ps-017: where memory photos live on disk (constitution Principle X — VM
// filesystem, SQLite-managed metadata). Overridable the same way RiteDb's
// connection string is, so tests get an isolated temp directory instead.
var mediaRoot = builder.Configuration["MediaStorage:Root"]
    ?? Path.Combine(builder.Environment.ContentRootPath, "media");
builder.Services.AddSingleton(new MediaStorage(mediaRoot));

// ps-009: deliberately simple cookie-session auth, sized to a small known
// community — no SSO, no third-party identity provider (constitution Principle
// IX, relaxed by CAP-2026-003). The default cookie handler redirects an
// unauthenticated request to an HTML login page; this is a JSON API, so both
// redirect events are overridden to plain status codes instead.
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.Name = "rite.auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.ExpireTimeSpan = TimeSpan.FromDays(30);
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "RITE Content API";
        document.Info.Version = "v1";
        document.Info.Description = """
            Read-only, bilingual (English/Spanish) content for the RITE Community Archive,
            mirrored from `docs/content/*.json` on every startup (ps-006). Each surface below
            returns its whole document as-is — there are no query/filter parameters yet.

            | Surface | Endpoint |
            | --- | --- |
            | History timeline | `GET /api/timeline` |
            | Story archive | `GET /api/stories` |
            | Alumni directory | `GET /api/alumni` |
            | Resources | `GET /api/resources` |
            | FAQ | `GET /api/faq` |
            | Impact metrics | `GET /api/impact` |
            | Program cycle | `GET /api/program-cycle` |
            | Schools and clubs | `GET /api/schools` |

            Real, persisted account registration/login (email + password, cookie session):

            | Action | Endpoint |
            | --- | --- |
            | Register | `POST /api/account/register` |
            | Sign in | `POST /api/account/login` |
            | Sign out | `POST /api/account/logout` |
            | Get own profile | `GET /api/account/me` |
            | Update own profile | `PUT /api/account/me` |

            Real alumni-status claim and shared memories/photos, for the signed-in account's own
            data only. Every save (new or edited) starts at Status "pending"; a coordinator's
            review (below) moves it to "approved" or "rejected" (with a RejectionReason) — an
            edit to a previously-reviewed claim/memory resets it to "pending" again:

            | Action | Endpoint |
            | --- | --- |
            | Get own claim | `GET /api/account/claim` |
            | Save own claim | `PUT /api/account/claim` |
            | Withdraw own claim | `DELETE /api/account/claim` |
            | List own memories | `GET /api/account/memories` |
            | Share a new memory | `POST /api/account/memories` |
            | Edit own memory | `PUT /api/account/memories/{id}` |
            | Delete own memory | `DELETE /api/account/memories/{id}` |
            | Get a memory's photo | `GET /api/account/memories/{id}/photos/{photoId}` |

            Coordinator-only review queue for pending claims/memories (constitution Principle
            III), authorized the same way as the user-management endpoints above:

            | Action | Endpoint |
            | --- | --- |
            | List pending claims | `GET /api/review/claims` |
            | Approve a claim | `POST /api/review/claims/{id}/approve` |
            | Reject a claim | `POST /api/review/claims/{id}/reject` |
            | List pending memories | `GET /api/review/memories` |
            | Approve a memory | `POST /api/review/memories/{id}/approve` |
            | Reject a memory | `POST /api/review/memories/{id}/reject` |

            Public, anonymous surface for claims/memories a coordinator has approved — separate
            from, and unrelated to, the static Alumni directory/Story archive above:

            | Action | Endpoint |
            | --- | --- |
            | List approved claims | `GET /api/community/claims` |
            | List approved memories | `GET /api/community/memories` |
            | Get an approved memory's photo | `GET /api/community/memories/{id}/photos/{photoId}` |
            """;
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// src/Rite.Web's production build is copied into wwwroot/ at deploy time (ps-008)
// and served from this same process/origin, so the SPA's API calls are same-origin
// — no CORS policy is needed. UseStaticFiles/MapFallbackToFile also give the SPA's
// client-side routes (e.g. /schools/:slug) a working deep-link refresh, in-process,
// with no IIS rewrite rule required.
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapOpenApi();
app.MapApiTestSpark(options =>
{
    // app.MapOpenApi() serves /openapi/v1.json, not ApiTestSpark's own
    // "/openapi.json" default, so autodiscovery needs the real path.
    options.OpenApiUrl = "/openapi/v1.json";
    options.Environments = ["Development"];
    options.EnableDemoIntegrations = false;
});

// AppContext.BaseDirectory, not ContentRootPath: the linked docs/content/*.json
// files are copied next to the built assembly (bin/.../content/), not into the
// project source directory that ContentRootPath points at under `dotnet run`.
var contentDirectory = Path.Combine(AppContext.BaseDirectory, "content");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<RiteDbContext>();
    await ContentSeeder.RefreshAsync(db, contentDirectory);
}

app.MapGet("/health", () => TypedResults.Ok(new HealthResponse("ok")))
    .WithName("GetHealth")
    .WithTags("System: Health")
    .WithSummary("Check API health")
    .WithDescription("Returns `{ \"status\": \"ok\" }` when the process is up; does not check the database.");

MapContentEndpoint(app, "timeline", "GetTimeline", "History timeline", "Get the history timeline",
    "Bilingual milestones in the RITE exchange's history, seeded from `docs/content/timeline.json`.");
MapContentEndpoint(app, "stories", "GetStories", "Story archive", "Get the story archive",
    "Bilingual participant and community stories, seeded from `docs/content/stories.json`.");
MapContentEndpoint(app, "alumni", "GetAlumni", "Alumni directory", "Get the alumni directory",
    "Bilingual alumni profiles, including each person's participation years, seeded from " +
    "`docs/content/alumni.json`.");
MapContentEndpoint(app, "resources", "GetResources", "Resources", "Get the resources",
    "Bilingual curriculum and classroom resources shared by the program, seeded from " +
    "`docs/content/resources.json`.");
MapContentEndpoint(app, "faq", "GetFaq", "FAQ", "Get the FAQ",
    "Bilingual frequently asked questions about the exchange, seeded from `docs/content/faq.json`.");
MapContentEndpoint(app, "impact", "GetImpact", "Impact metrics", "Get the impact metrics",
    "Bilingual summary statistics about the program's reach and impact, seeded from " +
    "`docs/content/impact.json`.");
MapContentEndpoint(app, "program-cycle", "GetProgramCycle", "Program cycle", "Get the program cycle",
    "Bilingual description of the exchange's yearly program cycle, seeded from " +
    "`docs/content/program-cycle.json`.");
MapContentEndpoint(app, "schools", "GetSchools", "Schools and clubs", "Get the schools and clubs",
    "Bilingual directory of participating schools and Rotary clubs. Unlike the other surfaces, " +
    "this one has no `docs/content/` file of its own — it's mirrored from `docs/js/content.js`'s " +
    "hardcoded array (see `Rite.Api.Data.SchoolsSeed`).");

app.MapAccountEndpoints();
app.MapClaimAndMemoryEndpoints();
app.MapReviewEndpoints();
app.MapCommunityEndpoints();

// An unmatched /api/* path (a typo'd surface, say) must keep 404ing rather than
// silently falling through to the SPA's index.html below — MapFallbackToFile only
// catches requests that don't match any endpoint, and without this, a more specific
// unmatched /api/* request wouldn't match anything either and would also fall
// through to it once wwwroot/index.html exists (it doesn't yet in tests/CI, which
// is why Unknown_surface_returns_404 doesn't currently catch this).
app.MapGet("/api/{**catchall}", () => Results.NotFound())
    .ExcludeFromDescription();

// Must come after every endpoint mapping above: it only matches requests that
// didn't hit another endpoint, so it can never shadow them.
app.MapFallbackToFile("index.html");

app.Run();

// Each surface is stored as one opaque JSON document (see Rite.Api.Data.ContentDocument),
// not a fixed per-field schema, so the response body itself isn't declared as a C# type here
// — that would fabricate a shape ApiTestSpark would show as fact. The status codes and
// content type are declared so the harness still gets response badges.
static void MapContentEndpoint(
    WebApplication app, string surface, string operationName, string displayName, string summary,
    string description)
{
    app.MapGet($"/api/{surface}", async (RiteDbContext db) =>
    {
        var document = await db.ContentDocuments.FindAsync(surface);
        return document is null
            ? Results.NotFound()
            : Results.Text(document.Json, "application/json");
    })
    .WithName(operationName)
    .WithTags($"Content: {displayName}")
    .WithSummary(summary)
    .WithDescription($"{description} Returns the whole document; 404 if this surface was never seeded.")
    .Produces(StatusCodes.Status200OK, contentType: "application/json")
    .Produces(StatusCodes.Status404NotFound);
}

record HealthResponse(string Status);

public partial class Program;
