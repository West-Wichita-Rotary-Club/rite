using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
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
}
