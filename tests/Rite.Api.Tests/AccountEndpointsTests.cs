using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Rite.Api.Data;
using Xunit;

namespace Rite.Api.Tests;

public class AccountEndpointsTests : IClassFixture<RiteApiFactory>
{
    private readonly RiteApiFactory _factory;

    public AccountEndpointsTests(RiteApiFactory factory)
    {
        _factory = factory;
    }

    // Every test registers its own, uniquely-emailed account: RiteApiFactory shares
    // one SQLite database across every test in this class (IClassFixture), so a
    // fixed email would collide with the duplicate-email test.
    private static string UniqueEmail([System.Runtime.CompilerServices.CallerMemberName] string caller = "") =>
        $"{caller.ToLowerInvariant()}-{Guid.NewGuid():N}@example.com";

    private static object RegisterPayload(string email, string password = "correct-horse") => new
    {
        email,
        password,
        name = "Pat Lee",
        role = "teacher",
        country = "Panama",
        city = "Panama City",
        languages = "English, Spanish",
        years = "2019",
        bio = "A short bio."
    };

    // No endpoint can set IsCoordinator (ps-010's whole point) — tests promote
    // directly via the database, the same "no promote workflow" path a real
    // coordinator would need until one is built.
    private async Task PromoteToCoordinatorAsync(string email)
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RiteDbContext>();
        var account = await db.Accounts.SingleAsync(a => a.Email == email);
        account.IsCoordinator = true;
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task Register_creates_a_real_account_and_signs_in()
    {
        var client = _factory.CreateClient();
        var email = UniqueEmail();

        var response = await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email));
        response.EnsureSuccessStatusCode();

        var profile = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(email, profile.GetProperty("email").GetString());
        Assert.Equal("Pat Lee", profile.GetProperty("name").GetString());
        Assert.False(profile.TryGetProperty("passwordHash", out _), "the response must never include the password hash");

        var me = await client.GetAsync("/api/account/me");
        me.EnsureSuccessStatusCode();
        var meBody = await me.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(email, meBody.GetProperty("email").GetString());
    }

    [Fact]
    public async Task Register_normalizes_email_case_and_whitespace()
    {
        var client = _factory.CreateClient();
        var email = UniqueEmail();

        var response = await client.PostAsJsonAsync(
            "/api/account/register", RegisterPayload($"  {email.ToUpperInvariant()}  "));
        response.EnsureSuccessStatusCode();

        var profile = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(email, profile.GetProperty("email").GetString());
    }

    [Fact]
    public async Task Register_rejects_an_invalid_email()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/account/register", RegisterPayload("not-an-email"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("invalid-email", body.GetProperty("error").GetString());
    }

    [Fact]
    public async Task Register_rejects_a_password_under_8_characters()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync(
            "/api/account/register", RegisterPayload(UniqueEmail(), password: "short"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("weak-password", body.GetProperty("error").GetString());
    }

    [Fact]
    public async Task Register_rejects_a_duplicate_email()
    {
        var email = UniqueEmail();
        var first = _factory.CreateClient();
        (await first.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();

        var second = _factory.CreateClient();
        var response = await second.PostAsJsonAsync("/api/account/register", RegisterPayload(email));

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("duplicate-email", body.GetProperty("error").GetString());
    }

    [Fact]
    public async Task Concurrent_registration_for_the_same_email_never_surfaces_as_a_500()
    {
        var email = UniqueEmail();
        var first = _factory.CreateClient();
        var second = _factory.CreateClient();

        var responses = await Task.WhenAll(
            first.PostAsJsonAsync("/api/account/register", RegisterPayload(email)),
            second.PostAsJsonAsync("/api/account/register", RegisterPayload(email)));

        var statusCodes = responses.Select(r => r.StatusCode).OrderBy(s => s).ToArray();
        Assert.Equal([HttpStatusCode.OK, HttpStatusCode.Conflict], statusCodes);

        var conflictResponse = responses.Single(r => r.StatusCode == HttpStatusCode.Conflict);
        var body = await conflictResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("duplicate-email", body.GetProperty("error").GetString());
    }

    [Fact]
    public async Task Login_with_the_right_password_signs_in()
    {
        var email = UniqueEmail();
        var registerClient = _factory.CreateClient();
        (await registerClient.PostAsJsonAsync("/api/account/register", RegisterPayload(email)))
            .EnsureSuccessStatusCode();

        var loginClient = _factory.CreateClient();
        var response = await loginClient.PostAsJsonAsync("/api/account/login", new { email, password = "correct-horse" });
        response.EnsureSuccessStatusCode();

        var me = await loginClient.GetAsync("/api/account/me");
        me.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task Login_with_the_wrong_password_returns_401()
    {
        var email = UniqueEmail();
        var registerClient = _factory.CreateClient();
        (await registerClient.PostAsJsonAsync("/api/account/register", RegisterPayload(email)))
            .EnsureSuccessStatusCode();

        var loginClient = _factory.CreateClient();
        var response = await loginClient.PostAsJsonAsync("/api/account/login", new { email, password = "wrong-password" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_with_an_unknown_email_returns_401_not_a_distinguishable_error()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync(
            "/api/account/login", new { email = UniqueEmail(), password = "whatever1" });

        // Same status as a wrong password (above): the response never reveals
        // whether the email itself is registered.
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Me_without_a_session_returns_401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/account/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Logout_ends_the_session()
    {
        var email = UniqueEmail();
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();
        (await client.GetAsync("/api/account/me")).EnsureSuccessStatusCode();

        (await client.PostAsync("/api/account/logout", null)).EnsureSuccessStatusCode();

        var me = await client.GetAsync("/api/account/me");
        Assert.Equal(HttpStatusCode.Unauthorized, me.StatusCode);
    }

    [Fact]
    public async Task Logout_without_a_session_is_a_no_op_not_an_error()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsync("/api/account/logout", null);
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task Update_me_changes_the_signed_in_profile()
    {
        var email = UniqueEmail();
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();

        var response = await client.PutAsJsonAsync("/api/account/me", new { name = "Pat Updated", city = "Colon" });
        response.EnsureSuccessStatusCode();
        var updated = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("Pat Updated", updated.GetProperty("name").GetString());
        Assert.Equal("Colon", updated.GetProperty("city").GetString());
        // A field not included in the update request is left untouched.
        Assert.Equal("Panama", updated.GetProperty("country").GetString());

        var me = await client.GetAsync("/api/account/me");
        var meBody = await me.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("Pat Updated", meBody.GetProperty("name").GetString());
    }

    [Fact]
    public async Task Update_me_without_a_session_returns_401()
    {
        var client = _factory.CreateClient();
        var response = await client.PutAsJsonAsync("/api/account/me", new { name = "Someone" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Register_cannot_set_is_coordinator_via_the_request_body()
    {
        var client = _factory.CreateClient();
        var email = UniqueEmail();
        // A bare anonymous object with an extra field a real attacker might try --
        // RegisterRequest has no IsCoordinator property, so System.Text.Json
        // silently ignores it rather than binding it.
        var payload = new
        {
            email,
            password = "correct-horse",
            name = "Pat Lee",
            isCoordinator = true
        };
        var response = await client.PostAsJsonAsync("/api/account/register", payload);
        response.EnsureSuccessStatusCode();

        var profile = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.False(profile.GetProperty("isCoordinator").GetBoolean());

        var listResponse = await client.GetAsync("/api/account/users");
        Assert.Equal(HttpStatusCode.Forbidden, listResponse.StatusCode);
    }

    [Fact]
    public async Task List_users_without_a_session_returns_401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/account/users");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task List_users_for_a_non_coordinator_returns_403()
    {
        var client = _factory.CreateClient();
        var email = UniqueEmail();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();

        var response = await client.GetAsync("/api/account/users");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task List_users_for_a_coordinator_returns_every_account()
    {
        var coordinatorEmail = UniqueEmail();
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(coordinatorEmail)))
            .EnsureSuccessStatusCode();
        await PromoteToCoordinatorAsync(coordinatorEmail);

        var response = await client.GetAsync("/api/account/users");
        response.EnsureSuccessStatusCode();

        var users = await response.Content.ReadFromJsonAsync<JsonElement>();
        var match = users.EnumerateArray().FirstOrDefault(u => u.GetProperty("email").GetString() == coordinatorEmail);
        Assert.True(match.ValueKind == JsonValueKind.Object, "the coordinator's own account should appear in the list");
        Assert.True(match.GetProperty("isActive").GetBoolean());
        Assert.True(match.GetProperty("isCoordinator").GetBoolean());
    }

    [Fact]
    public async Task Deactivate_for_a_non_coordinator_returns_403()
    {
        var client = _factory.CreateClient();
        var email = UniqueEmail();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();

        var response = await client.PostAsync($"/api/account/users/{Guid.NewGuid()}/deactivate", null);
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Deactivate_an_unknown_id_returns_404_for_a_coordinator()
    {
        var coordinatorEmail = UniqueEmail();
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(coordinatorEmail)))
            .EnsureSuccessStatusCode();
        await PromoteToCoordinatorAsync(coordinatorEmail);

        var response = await client.PostAsync($"/api/account/users/{Guid.NewGuid()}/deactivate", null);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Deactivate_blocks_future_login_and_ends_the_current_session_immediately()
    {
        var coordinatorEmail = UniqueEmail();
        var coordinatorClient = _factory.CreateClient();
        (await coordinatorClient.PostAsJsonAsync("/api/account/register", RegisterPayload(coordinatorEmail)))
            .EnsureSuccessStatusCode();
        await PromoteToCoordinatorAsync(coordinatorEmail);

        var targetEmail = UniqueEmail();
        var targetClient = _factory.CreateClient();
        (await targetClient.PostAsJsonAsync("/api/account/register", RegisterPayload(targetEmail))).EnsureSuccessStatusCode();
        var targetProfile = await (await coordinatorClient.GetAsync("/api/account/users")).Content.ReadFromJsonAsync<JsonElement>();
        var targetSummary = targetProfile.EnumerateArray().First(u => u.GetProperty("email").GetString() == targetEmail);
        var id = targetSummary.GetProperty("id").GetGuid();

        var deactivateResponse = await coordinatorClient.PostAsync($"/api/account/users/{id}/deactivate", null);
        deactivateResponse.EnsureSuccessStatusCode();
        var deactivated = await deactivateResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.False(deactivated.GetProperty("isActive").GetBoolean());

        // The target's existing session cookie is still present, but the account
        // is now deactivated -- this must take effect immediately, not only on
        // next sign-in.
        var meAfterDeactivation = await targetClient.GetAsync("/api/account/me");
        Assert.Equal(HttpStatusCode.Unauthorized, meAfterDeactivation.StatusCode);

        var freshClient = _factory.CreateClient();
        var loginResponse = await freshClient.PostAsJsonAsync(
            "/api/account/login", new { email = targetEmail, password = "correct-horse" });
        Assert.Equal(HttpStatusCode.Unauthorized, loginResponse.StatusCode);
    }

    [Fact]
    public async Task Reactivate_restores_login_access()
    {
        var coordinatorEmail = UniqueEmail();
        var coordinatorClient = _factory.CreateClient();
        (await coordinatorClient.PostAsJsonAsync("/api/account/register", RegisterPayload(coordinatorEmail)))
            .EnsureSuccessStatusCode();
        await PromoteToCoordinatorAsync(coordinatorEmail);

        var targetEmail = UniqueEmail();
        var targetClient = _factory.CreateClient();
        (await targetClient.PostAsJsonAsync("/api/account/register", RegisterPayload(targetEmail)))
            .EnsureSuccessStatusCode();

        var usersBody = await (await coordinatorClient.GetAsync("/api/account/users")).Content.ReadFromJsonAsync<JsonElement>();
        var id = usersBody.EnumerateArray().First(u => u.GetProperty("email").GetString() == targetEmail).GetProperty("id").GetGuid();

        (await coordinatorClient.PostAsync($"/api/account/users/{id}/deactivate", null)).EnsureSuccessStatusCode();
        var reactivateResponse = await coordinatorClient.PostAsync($"/api/account/users/{id}/reactivate", null);
        reactivateResponse.EnsureSuccessStatusCode();
        var reactivated = await reactivateResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(reactivated.GetProperty("isActive").GetBoolean());

        var freshClient = _factory.CreateClient();
        var loginResponse = await freshClient.PostAsJsonAsync(
            "/api/account/login", new { email = targetEmail, password = "correct-horse" });
        loginResponse.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task Reactivate_for_a_non_coordinator_returns_403()
    {
        var client = _factory.CreateClient();
        var email = UniqueEmail();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();

        var response = await client.PostAsync($"/api/account/users/{Guid.NewGuid()}/reactivate", null);
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
