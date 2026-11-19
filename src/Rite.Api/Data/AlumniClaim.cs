namespace Rite.Api.Data;

// ps-017: a real alumni-status claim, one per account — the first of the two
// pieces ps-009 deliberately left mocked. Not yet reviewed/approved (that's
// ps-018); this record only persists what the member submitted. Named
// AlumniClaim, not Claim, to avoid colliding with System.Security.Claims.Claim
// (AccountEndpoints.cs already uses that namespace for the auth cookie identity).
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
}
