namespace Rite.Api.Data;

// ps-017: a real alumni-status claim, one per account — the first of the two
// pieces ps-009 deliberately left mocked. ps-018 adds the review/approve
// status below. Named AlumniClaim, not Claim, to avoid colliding with
// System.Security.Claims.Claim (AccountEndpoints.cs already uses that
// namespace for the auth cookie identity).
public class AlumniClaim
{
    public Guid Id { get; set; }
    public required Guid AccountId { get; set; }
    public string Country { get; set; } = "";

    // A JSON array of {role, yearFrom, yearTo} rows — stored as opaque JSON rather
    // than a normalized child table for the same reason ContentDocument does:
    // no real consumer has driven a query need against individual rows yet.
    public string ParticipationJson { get; set; } = "[]";

    public string? MatchedProfileId { get; set; }
    public string? SelfDeclaredName { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    // ps-018: starts Pending on every save (new or edited — an edit to an
    // already-approved claim must not keep showing stale, no-longer-accurate
    // review). Only ReviewEndpoints moves it to Approved/Rejected.
    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public string? RejectionReason { get; set; }
}
