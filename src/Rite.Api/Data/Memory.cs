namespace Rite.Api.Data;

// ps-017: a real shared memory, up to MAX_MEMORIES_PER_MEMBER per account — the
// second piece ps-009 deliberately left mocked. Not yet reviewed/approved
// (that's ps-018).
public class Memory
{
    public Guid Id { get; set; }
    public required Guid AccountId { get; set; }
    public string Title { get; set; } = "";
    public string Text { get; set; } = "";

    // A JSON array of photo-id strings, in display order. Each photo's actual
    // bytes live on disk under ClaimMemoryEndpoints' media root (constitution
    // Principle X: VM filesystem, SQLite-managed metadata) — this column is the
    // metadata. Always JPEG (see ClaimMemoryEndpoints' photo validation), so no
    // per-photo content type needs recording.
    public string PhotoIdsJson { get; set; } = "[]";

    public DateTimeOffset CreatedAt { get; set; }
}
