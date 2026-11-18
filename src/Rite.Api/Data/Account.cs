namespace Rite.Api.Data;

// A real, persisted account (ps-009) — registration/login/profile only. Claim and
// memories are not modeled here yet; they stay in src/Rite.Web's browser-local
// mock until a later increment moves them onto real accounts too.
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
}
