namespace Rite.Api.Data;

// Refreshes every content surface from its source file on each startup, so the
// database stays a faithful mirror of docs/content/*.json without needing a new
// migration whenever that content changes. No write endpoint exists to diverge
// from it.
public static class ContentSeeder
{
    private static readonly string[] FileBackedSurfaces =
    [
        "timeline", "stories", "alumni", "resources", "faq", "impact", "program-cycle"
    ];

    public static async Task RefreshAsync(RiteDbContext db, string contentDirectory, CancellationToken cancellationToken = default)
    {
        await db.Database.EnsureCreatedAsync(cancellationToken);

        var now = DateTimeOffset.UtcNow;

        foreach (var surface in FileBackedSurfaces)
        {
            var path = Path.Combine(contentDirectory, $"{surface}.json");
            if (!File.Exists(path))
            {
                throw new FileNotFoundException(
                    $"Expected seed content for surface '{surface}' at {path}.", path);
            }

            var json = await File.ReadAllTextAsync(path, cancellationToken);
            Upsert(db, surface, json, now);
        }

        Upsert(db, "schools", SchoolsSeed.ToJson(), now);

        await db.SaveChangesAsync(cancellationToken);
    }

    private static void Upsert(RiteDbContext db, string surface, string json, DateTimeOffset seededAt)
    {
        var existing = db.ContentDocuments.Find(surface);
        if (existing is null)
        {
            db.ContentDocuments.Add(new ContentDocument { Surface = surface, Json = json, SeededAt = seededAt });
        }
        else
        {
            existing.Json = json;
            existing.SeededAt = seededAt;
        }
    }
}
