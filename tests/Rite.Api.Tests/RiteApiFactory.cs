using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;

namespace Rite.Api.Tests;

// Each instance gets its own temp SQLite file so parallel test runs never
// share or lock the same database.
public sealed class RiteApiFactory : WebApplicationFactory<Program>
{
    private readonly string _dbPath = Path.Combine(Path.GetTempPath(), $"rite-api-tests-{Guid.NewGuid():N}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("ConnectionStrings:RiteDb", $"Data Source={_dbPath}");
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
    }
}
