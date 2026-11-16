using Microsoft.EntityFrameworkCore;
using Rite.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("RiteDb")
    ?? $"Data Source={Path.Combine(builder.Environment.ContentRootPath, "rite.db")}";

builder.Services.AddDbContext<RiteDbContext>(options => options.UseSqlite(connectionString));

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

// AppContext.BaseDirectory, not ContentRootPath: the linked docs/content/*.json
// files are copied next to the built assembly (bin/.../content/), not into the
// project source directory that ContentRootPath points at under `dotnet run`.
var contentDirectory = Path.Combine(AppContext.BaseDirectory, "content");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<RiteDbContext>();
    await ContentSeeder.RefreshAsync(db, contentDirectory);
}

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

MapContentEndpoint(app, "timeline");
MapContentEndpoint(app, "stories");
MapContentEndpoint(app, "alumni");
MapContentEndpoint(app, "resources");
MapContentEndpoint(app, "faq");
MapContentEndpoint(app, "impact");
MapContentEndpoint(app, "program-cycle");
MapContentEndpoint(app, "schools");

app.Run();

static void MapContentEndpoint(WebApplication app, string surface)
{
    app.MapGet($"/api/{surface}", async (RiteDbContext db) =>
    {
        var document = await db.ContentDocuments.FindAsync(surface);
        return document is null
            ? Results.NotFound()
            : Results.Text(document.Json, "application/json");
    });
}

public partial class Program;
