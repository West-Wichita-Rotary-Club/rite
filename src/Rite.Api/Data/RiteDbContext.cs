using Microsoft.EntityFrameworkCore;

namespace Rite.Api.Data;

public class RiteDbContext(DbContextOptions<RiteDbContext> options) : DbContext(options)
{
    public DbSet<ContentDocument> ContentDocuments => Set<ContentDocument>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ContentDocument>(entity =>
        {
            entity.HasKey(d => d.Surface);
            entity.Property(d => d.Surface).HasMaxLength(64);
        });
    }
}
