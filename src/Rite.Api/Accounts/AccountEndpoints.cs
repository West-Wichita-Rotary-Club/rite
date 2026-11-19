using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Rite.Api.Data;

namespace Rite.Api.Accounts;

// Real registration/login for a small, known community (ps-009) — deliberately
// simple credential auth (email + password, cookie session), not a general-purpose
// identity platform: no SSO, no third-party identity provider, no email
// verification/password-reset flow yet. Claim-an-alumni-profile and memories stay
// mocked client-side (a separate, later increment).
public static class AccountEndpoints
{
    private static readonly PasswordHasher<Account> Hasher = new();

    // Used only to equalize LoginAsync's timing for an unknown email against a
    // wrong password for a real one (see LoginAsync) — never a real account.
    private static readonly Account DummyAccountForTiming = new() { Id = Guid.Empty, Email = "", PasswordHash = "" };
    private static readonly string DummyPasswordHashForTiming =
        Hasher.HashPassword(DummyAccountForTiming, "not-a-real-password-used-only-for-timing");

    public static void MapAccountEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/account").WithTags("Account");

        group.MapPost("/register", RegisterAsync)
            .WithName("RegisterAccount")
            .WithSummary("Register a new account")
            .WithDescription(
                "Creates a real, persisted account (email + password) and signs the caller in via " +
                "a session cookie. 400 for an invalid email or a password under 8 characters; 409 " +
                "if the email is already registered.")
            .Produces<AccountProfile>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status409Conflict);

        group.MapPost("/login", LoginAsync)
            .WithName("LoginAccount")
            .WithSummary("Sign in to an existing account")
            .WithDescription(
                "401 for an unknown email or a wrong password alike — the response never reveals " +
                "which one, so it can't be used to enumerate registered emails.")
            .Produces<AccountProfile>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        // Explicit (Delegate) cast: LogoutAsync's signature (a single HttpContext
        // parameter returning Task<IResult>, which is itself a Task) exactly matches
        // RequestDelegate too, and the compiler prefers that more specific overload
        // of MapPost — the one returning plain IEndpointConventionBuilder, with no
        // .Produces(...). The cast forces the Delegate overload (RouteHandlerBuilder)
        // instead. Every other handler here takes more than one parameter, or a
        // non-HttpContext first parameter, so it never hits this ambiguity.
        group.MapPost("/logout", (Delegate)LogoutAsync)
            .WithName("LogoutAccount")
            .WithSummary("Sign out of the current session")
            .Produces(StatusCodes.Status200OK);

        group.MapGet("/me", GetMeAsync)
            .WithName("GetCurrentAccount")
            .WithSummary("Get the signed-in account's profile")
            .RequireAuthorization()
            .Produces<AccountProfile>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        group.MapPut("/me", UpdateMeAsync)
            .WithName("UpdateCurrentAccount")
            .WithSummary("Update the signed-in account's profile")
            .RequireAuthorization()
            .Produces<AccountProfile>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        // ps-010: coordinator-only account management. Authorized against
        // Account.IsCoordinator (never bound from a public request body — see its
        // doc comment), not the self-declared Role field.
        group.MapGet("/users", ListUsersAsync)
            .WithName("ListAccounts")
            .WithSummary("List every account (coordinator-only)")
            .RequireAuthorization()
            .Produces<List<AccountSummary>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden);

        group.MapPost("/users/{id:guid}/deactivate", DeactivateUserAsync)
            .WithName("DeactivateAccount")
            .WithSummary("Deactivate an account (coordinator-only)")
            .WithDescription(
                "Blocks the target account from signing in or using an existing session. Data is " +
                "retained, not deleted — see ReactivateAccount to undo.")
            .RequireAuthorization()
            .Produces<AccountSummary>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/users/{id:guid}/reactivate", ReactivateUserAsync)
            .WithName("ReactivateAccount")
            .WithSummary("Reactivate a previously deactivated account (coordinator-only)")
            .RequireAuthorization()
            .Produces<AccountSummary>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<IResult> RegisterAsync(RegisterRequest request, RiteDbContext db, HttpContext http)
    {
        var email = NormalizeEmail(request.Email);
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
        {
            return Results.BadRequest(new ErrorResponse("invalid-email"));
        }
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
        {
            return Results.BadRequest(new ErrorResponse("weak-password"));
        }
        if (await db.Accounts.AnyAsync(a => a.Email == email))
        {
            return Results.Conflict(new ErrorResponse("duplicate-email"));
        }

        var account = new Account
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = "",
            Name = request.Name ?? "",
            Role = request.Role ?? "",
            Country = request.Country ?? "",
            City = request.City ?? "",
            Languages = request.Languages ?? "",
            Years = request.Years ?? "",
            Bio = request.Bio ?? "",
            CreatedAt = DateTimeOffset.UtcNow
        };
        account.PasswordHash = Hasher.HashPassword(account, request.Password);

        db.Accounts.Add(account);
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // A second line of defense behind the pre-check above: two concurrent
            // registrations for the same email can both pass that check before
            // either writes, so the loser hits the unique index on Email here
            // instead of silently creating a duplicate account.
            return Results.Conflict(new ErrorResponse("duplicate-email"));
        }

        await SignInAsync(http, account);
        return Results.Ok(ToProfile(account));
    }

    private static async Task<IResult> LoginAsync(LoginRequest request, RiteDbContext db, HttpContext http)
    {
        var email = NormalizeEmail(request.Email);
        var account = await db.Accounts.FirstOrDefaultAsync(a => a.Email == email);
        if (account is null || !account.IsActive)
        {
            // Run the same deliberately slow hash verification the wrong-password
            // path below runs, against a fixed dummy hash, so this path's latency
            // doesn't reveal that the email isn't registered or is deactivated.
            Hasher.VerifyHashedPassword(DummyAccountForTiming, DummyPasswordHashForTiming, request.Password ?? "");
            return Results.Unauthorized();
        }

        var verification = Hasher.VerifyHashedPassword(account, account.PasswordHash, request.Password ?? "");
        if (verification == PasswordVerificationResult.Failed)
        {
            return Results.Unauthorized();
        }

        await SignInAsync(http, account);
        return Results.Ok(ToProfile(account));
    }

    private static async Task<IResult> LogoutAsync(HttpContext http)
    {
        // Idempotent and allowed even when not signed in: calling this with no
        // active session just does nothing, which is what a client that isn't
        // sure of its own session state needs.
        await http.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Results.Ok();
    }

    private static async Task<IResult> GetMeAsync(HttpContext http, RiteDbContext db)
    {
        var account = await CurrentAccountAsync(http, db);
        return account is null ? Results.Unauthorized() : Results.Ok(ToProfile(account));
    }

    private static async Task<IResult> UpdateMeAsync(UpdateProfileRequest request, HttpContext http, RiteDbContext db)
    {
        var account = await CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }

        account.Name = request.Name ?? account.Name;
        account.Role = request.Role ?? account.Role;
        account.Country = request.Country ?? account.Country;
        account.City = request.City ?? account.City;
        account.Languages = request.Languages ?? account.Languages;
        account.Years = request.Years ?? account.Years;
        account.Bio = request.Bio ?? account.Bio;

        await db.SaveChangesAsync();
        return Results.Ok(ToProfile(account));
    }

    private static async Task SignInAsync(HttpContext http, Account account)
    {
        var identity = new ClaimsIdentity(
        [
            new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
            new Claim(ClaimTypes.Email, account.Email)
        ], CookieAuthenticationDefaults.AuthenticationScheme);
        await http.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }

    // Internal, not private: ClaimMemoryEndpoints (ps-017) reuses this exact
    // IsActive-filtering behavior rather than duplicating it.
    internal static Task<Account?> CurrentAccountAsync(HttpContext http, RiteDbContext db)
    {
        var idValue = http.User.FindFirstValue(ClaimTypes.NameIdentifier);
        // Excludes a deactivated account even for an existing, still-valid cookie:
        // deactivation takes effect immediately, not only on next sign-in.
        return idValue is not null && Guid.TryParse(idValue, out var id)
            ? db.Accounts.FirstOrDefaultAsync(a => a.Id == id && a.IsActive)
            : Task.FromResult<Account?>(null);
    }

    private static async Task<IResult> ListUsersAsync(HttpContext http, RiteDbContext db)
    {
        var account = await CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }
        if (!account.IsCoordinator)
        {
            return Results.Forbid();
        }

        // Materialize first, then map: ToSummary isn't an EF-translatable expression.
        var accounts = await db.Accounts.OrderBy(a => a.Email).ToListAsync();
        return Results.Ok(accounts.Select(ToSummary).ToList());
    }

    private static async Task<IResult> DeactivateUserAsync(Guid id, HttpContext http, RiteDbContext db)
    {
        var caller = await CurrentAccountAsync(http, db);
        if (caller is null)
        {
            return Results.Unauthorized();
        }
        if (!caller.IsCoordinator)
        {
            return Results.Forbid();
        }

        var target = await db.Accounts.FindAsync(id);
        if (target is null)
        {
            return Results.NotFound();
        }

        target.IsActive = false;
        await db.SaveChangesAsync();
        return Results.Ok(ToSummary(target));
    }

    private static async Task<IResult> ReactivateUserAsync(Guid id, HttpContext http, RiteDbContext db)
    {
        var caller = await CurrentAccountAsync(http, db);
        if (caller is null)
        {
            return Results.Unauthorized();
        }
        if (!caller.IsCoordinator)
        {
            return Results.Forbid();
        }

        var target = await db.Accounts.FindAsync(id);
        if (target is null)
        {
            return Results.NotFound();
        }

        target.IsActive = true;
        await db.SaveChangesAsync();
        return Results.Ok(ToSummary(target));
    }

    private static string NormalizeEmail(string? email) => (email ?? "").Trim().ToLowerInvariant();

    private static AccountProfile ToProfile(Account account) => new(
        account.Email, account.Name, account.Role, account.Country, account.City,
        account.Languages, account.Years, account.Bio, account.IsCoordinator);

    private static AccountSummary ToSummary(Account account) => new(
        account.Id, account.Email, account.Name, account.Role, account.IsActive,
        account.IsCoordinator, account.CreatedAt);
}

public record RegisterRequest(
    string Email, string Password, string? Name, string? Role, string? Country,
    string? City, string? Languages, string? Years, string? Bio);

public record LoginRequest(string Email, string Password);

public record UpdateProfileRequest(
    string? Name, string? Role, string? Country, string? City, string? Languages, string? Years, string? Bio);

// The response shape for register/login/me: never includes PasswordHash. IsCoordinator
// is included (read-only here) so src/Rite.Web can decide whether to show the
// coordinator-only user-management UI at all.
public record AccountProfile(
    string Email, string Name, string Role, string Country, string City, string Languages,
    string Years, string Bio, bool IsCoordinator);

// The response shape for the coordinator-only user-management endpoints.
public record AccountSummary(
    Guid Id, string Email, string Name, string Role, bool IsActive, bool IsCoordinator, DateTimeOffset CreatedAt);

public record ErrorResponse(string Error);
