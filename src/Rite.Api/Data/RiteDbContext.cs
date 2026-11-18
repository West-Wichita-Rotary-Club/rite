using Microsoft.EntityFrameworkCore;

namespace Rite.Api.Data;

public class RiteDbContext(DbContextOptions<RiteDbContext> options) : DbContext(options)
{
    public DbSet<ContentDocument> ContentDocuments => Set<ContentDocument>();
    public DbSet<Account> Accounts => Set<Account>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ContentDocument>(entity =>
        {
            entity.HasKey(d => d.Surface);
            entity.Property(d => d.Surface).HasMaxLength(64);
        });

        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Email).HasMaxLength(256);
            entity.HasIndex(a => a.Email).IsUnique();
        });
    }
}
