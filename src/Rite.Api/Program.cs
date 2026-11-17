using ApiTestSpark;
using Microsoft.EntityFrameworkCore;
using Rite.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("RiteDb")
    ?? $"Data Source={Path.Combine(builder.Environment.ContentRootPath, "rite.db")}";

builder.Services.AddDbContext<RiteDbContext>(options => options.UseSqlite(connectionString));
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
            """;
        return Task.CompletedTask;
    });
});

const string PublicReadCorsPolicy = "PublicRead";
builder.Services.AddCors(options =>
{
    // Every surface here is already public, read-only content with no auth or
    // cookies involved, so an open GET-only policy is intentional, not an
    // oversight. Revisit once accounts/auth (a later PS) introduce anything
    // that needs a narrower origin list or credentials.
    options.AddPolicy(PublicReadCorsPolicy, policy =>
        policy.AllowAnyOrigin().WithMethods("GET").AllowAnyHeader());
});

var app = builder.Build();

app.UseCors(PublicReadCorsPolicy);

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
