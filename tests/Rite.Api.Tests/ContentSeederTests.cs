using System.Text.Json;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Rite.Api.Data;
using Xunit;

namespace Rite.Api.Tests;

public class ContentSeederTests : IDisposable
{
    private static readonly string[] ExpectedSurfaces =
    [
        "timeline", "stories", "alumni", "resources", "faq", "impact", "program-cycle", "schools"
    ];

    private readonly string _dbPath = Path.Combine(Path.GetTempPath(), $"rite-seeder-tests-{Guid.NewGuid():N}.db");
    private readonly string _contentDirectory = Path.Combine(AppContext.BaseDirectory, "content");

    private RiteDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<RiteDbContext>()
            .UseSqlite($"Data Source={_dbPath}")
            .Options;
        return new RiteDbContext(options);
    }

    [Fact]
    public async Task RefreshAsync_seeds_every_expected_surface()
    {
        using var db = CreateContext();
        await ContentSeeder.RefreshAsync(db, _contentDirectory);

        var surfaces = await db.ContentDocuments.Select(d => d.Surface).ToListAsync();
        Assert.Equal(ExpectedSurfaces.OrderBy(s => s), surfaces.OrderBy(s => s));
    }

    [Theory]
    [InlineData("timeline")]
    [InlineData("stories")]
    [InlineData("alumni")]
    [InlineData("resources")]
    [InlineData("faq")]
    [InlineData("impact")]
    [InlineData("program-cycle")]
    public async Task RefreshAsync_stores_the_source_file_verbatim(string surface)
    {
        using var db = CreateContext();
        await ContentSeeder.RefreshAsync(db, _contentDirectory);

        var expected = await File.ReadAllTextAsync(Path.Combine(_contentDirectory, $"{surface}.json"));
        var stored = await db.ContentDocuments.FindAsync(surface);

        Assert.NotNull(stored);
        Assert.Equal(expected, stored!.Json);
    }

    [Fact]
    public async Task RefreshAsync_seeds_schools_as_valid_json_with_four_entries()
    {
        using var db = CreateContext();
        await ContentSeeder.RefreshAsync(db, _contentDirectory);

        var stored = await db.ContentDocuments.FindAsync("schools");
        Assert.NotNull(stored);

        using var parsed = JsonDocument.Parse(stored!.Json);
        var schools = parsed.RootElement.GetProperty("schools");
        Assert.Equal(4, schools.GetArrayLength());
        Assert.Equal("Rotary Club of West Wichita", schools[3].GetProperty("name").GetString());
    }

    [Fact]
    public async Task RefreshAsync_is_idempotent_and_refreshes_rather_than_duplicates()
    {
        using var db = CreateContext();
        await ContentSeeder.RefreshAsync(db, _contentDirectory);
        var firstSeededAt = (await db.ContentDocuments.FindAsync("schools"))!.SeededAt;

        await Task.Delay(10);
        await ContentSeeder.RefreshAsync(db, _contentDirectory);

        var count = await db.ContentDocuments.CountAsync();
        Assert.Equal(ExpectedSurfaces.Length, count);

        var secondSeededAt = (await db.ContentDocuments.FindAsync("schools"))!.SeededAt;
        Assert.True(secondSeededAt > firstSeededAt);
    }

    public void Dispose()
    {
        SqliteConnection.ClearAllPools();
        if (File.Exists(_dbPath))
        {
            File.Delete(_dbPath);
        }
    }
}
