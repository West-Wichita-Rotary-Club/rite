using Microsoft.EntityFrameworkCore;

namespace Rite.Api.Data;

public class RiteDbContext(DbContextOptions<RiteDbContext> options) : DbContext(options)
{
    public DbSet<ContentDocument> ContentDocuments => Set<ContentDocument>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<AlumniClaim> AlumniClaims => Set<AlumniClaim>();
    public DbSet<Memory> Memories => Set<Memory>();

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

        modelBuilder.Entity<AlumniClaim>(entity =>
        {
            entity.HasKey(c => c.Id);
            // One claim per account: PUT /api/account/claim always updates this
            // row in place rather than ever accumulating a second one.
            entity.HasIndex(c => c.AccountId).IsUnique();
        });

        modelBuilder.Entity<Memory>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.HasIndex(m => m.AccountId);
        });
    }
}
