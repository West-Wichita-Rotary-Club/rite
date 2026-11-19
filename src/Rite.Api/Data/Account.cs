namespace Rite.Api.Data;

// A real, persisted account (ps-009) — registration/login/profile, plus coordinator
// authorization and activation state (ps-010), plus the owner of a Claim and any
// number of Memory records (ps-017) — see Claim.cs and Memory.cs.
public class Account
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public string Name { get; set; } = "";
    public string Role { get; set; } = "";
    public string Country { get; set; } = "";
    public string City { get; set; } = "";
    public string Languages { get; set; } = "";
    public string Years { get; set; } = "";
    public string Bio { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; }

    // ps-010: deliberately NOT the same as the self-declared, self-editable Role
    // string above — Role is a free-text profile field anyone can set to
    // "coordinator" via RegisterRequest/UpdateProfileRequest, so authorizing
    // against it would let any user self-promote. IsCoordinator is never bound
    // from any public request DTO; the only way to set it is a direct database
    // edit (no promote workflow exists yet).
    public bool IsCoordinator { get; set; }

    // A coordinator-deactivated account can no longer sign in or use an existing
    // session (see AccountEndpoints.CurrentAccountAsync and LoginAsync) but its
    // data is retained, not deleted — the least-destructive option for a small
    // volunteer program where deactivation may need to be undone.
    public bool IsActive { get; set; } = true;
}
