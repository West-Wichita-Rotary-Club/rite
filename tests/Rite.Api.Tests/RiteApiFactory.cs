using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;

namespace Rite.Api.Tests;

// Each instance gets its own temp SQLite file and temp media directory so
// parallel test runs never share or lock the same database or photo storage.
public sealed class RiteApiFactory : WebApplicationFactory<Program>
{
    private readonly string _dbPath = Path.Combine(Path.GetTempPath(), $"rite-api-tests-{Guid.NewGuid():N}.db");
    private readonly string _mediaRoot = Path.Combine(Path.GetTempPath(), $"rite-api-tests-media-{Guid.NewGuid():N}");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("ConnectionStrings:RiteDb", $"Data Source={_dbPath}");
        builder.UseSetting("MediaStorage:Root", _mediaRoot);
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        // Sqlite's connection pool can outlive the disposed DbContext/host and
        // hold the file open; clear it before deleting the temp file.
        SqliteConnection.ClearAllPools();
        if (File.Exists(_dbPath))
        {
            File.Delete(_dbPath);
        }
        if (Directory.Exists(_mediaRoot))
        {
            Directory.Delete(_mediaRoot, recursive: true);
        }
    }
}
