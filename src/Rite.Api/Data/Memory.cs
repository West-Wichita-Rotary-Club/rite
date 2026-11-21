namespace Rite.Api.Data;

// ps-017: a real shared memory, up to MAX_MEMORIES_PER_MEMBER per account — the
// second piece ps-009 deliberately left mocked. ps-018 adds the review/approve
// status below.
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

    // ps-018: starts Pending on every save (new or edited — see AlumniClaim's
    // matching field for why an edit resets it). Only ReviewEndpoints moves it
    // to Approved/Rejected.
    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public string? RejectionReason { get; set; }
}
