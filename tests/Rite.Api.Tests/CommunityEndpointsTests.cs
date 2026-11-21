using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Rite.Api.Data;
using Xunit;

namespace Rite.Api.Tests;

// ps-018's assurance concern: this public, anonymous surface must expose only
// Approved claims/memories, and never any account PII (AccountId, email, etc)
// beyond what the member wrote.
public class CommunityEndpointsTests : IClassFixture<RiteApiFactory>
{
    private readonly RiteApiFactory _factory;

    public CommunityEndpointsTests(RiteApiFactory factory)
    {
        _factory = factory;
    }

    private static string UniqueEmail([System.Runtime.CompilerServices.CallerMemberName] string caller = "") =>
        $"{caller.ToLowerInvariant()}-{Guid.NewGuid():N}@example.com";

    private static object RegisterPayload(string email) => new { email, password = "correct-horse", name = "Pat Lee" };

    private static readonly string JpegDataUrl =
        $"data:image/jpeg;base64,{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("fake-jpeg"))}";

    private async Task PromoteToCoordinatorAsync(string email)
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RiteDbContext>();
        var account = await db.Accounts.SingleAsync(a => a.Email == email);
        account.IsCoordinator = true;
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task List_approved_claims_requires_no_session()
    {
        var response = await _factory.CreateClient().GetAsync("/api/community/claims");
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task A_pending_claim_never_appears_in_the_public_list()
    {
        var email = UniqueEmail();
        var selfDeclaredName = $"Pat-{Guid.NewGuid():N}";
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();
        (await client.PutAsJsonAsync(
            "/api/account/claim",
            new { country = "panama", participation = new[] { new { role = "teacher", yearFrom = 2015, yearTo = (int?)null } }, matchedProfileId = "", selfDeclaredName }))
            .EnsureSuccessStatusCode();

        var publicClaims = await (await _factory.CreateClient().GetAsync("/api/community/claims")).Content.ReadFromJsonAsync<JsonElement>();
        Assert.DoesNotContain(
            publicClaims.EnumerateArray(), c => c.GetProperty("selfDeclaredName").GetString() == selfDeclaredName);
    }

    [Fact]
    public async Task An_approved_claim_appears_publicly_with_no_account_identifiers()
    {
        var email = UniqueEmail();
        var selfDeclaredName = $"Pat-{Guid.NewGuid():N}";
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();
        (await client.PutAsJsonAsync(
            "/api/account/claim",
            new { country = "panama", participation = new[] { new { role = "teacher", yearFrom = 2015, yearTo = (int?)null } }, matchedProfileId = "", selfDeclaredName }))
            .EnsureSuccessStatusCode();

        var coordinatorEmail = UniqueEmail();
        var coordinator = _factory.CreateClient();
        (await coordinator.PostAsJsonAsync("/api/account/register", RegisterPayload(coordinatorEmail))).EnsureSuccessStatusCode();
        await PromoteToCoordinatorAsync(coordinatorEmail);
        var pending = await (await coordinator.GetAsync("/api/review/claims")).Content.ReadFromJsonAsync<JsonElement>();
        var id = pending.EnumerateArray().First(c => c.GetProperty("submitterEmail").GetString() == email).GetProperty("id").GetGuid();
        (await coordinator.PostAsync($"/api/review/claims/{id}/approve", null)).EnsureSuccessStatusCode();

        var publicClaims = await (await _factory.CreateClient().GetAsync("/api/community/claims")).Content.ReadFromJsonAsync<JsonElement>();
        var match = publicClaims.EnumerateArray().First(c => c.GetProperty("selfDeclaredName").GetString() == selfDeclaredName);
        // No property named anything like an account identifier or email leaks through.
        foreach (var property in match.EnumerateObject())
        {
            Assert.DoesNotContain("account", property.Name, StringComparison.OrdinalIgnoreCase);
            Assert.DoesNotContain("email", property.Name, StringComparison.OrdinalIgnoreCase);
        }
    }

    [Fact]
    public async Task A_pending_memorys_photo_is_not_reachable_through_the_public_endpoint()
    {
        var email = UniqueEmail();
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();
        var createResponse = await client.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "Trip", text = "A story", keepPhotoIds = Array.Empty<Guid>(), newPhotos = new[] { JpegDataUrl } });
        createResponse.EnsureSuccessStatusCode();
        var created = await createResponse.Content.ReadFromJsonAsync<JsonElement>();
        var memoryId = created.GetProperty("id").GetGuid();
        var photoId = created.GetProperty("photos")[0].GetProperty("id").GetGuid();

        var publicPhoto = await _factory.CreateClient().GetAsync($"/api/community/memories/{memoryId}/photos/{photoId}");
        Assert.Equal(HttpStatusCode.NotFound, publicPhoto.StatusCode);
    }

    [Fact]
    public async Task An_approved_memorys_photo_is_reachable_anonymously_once_approved()
    {
        var email = UniqueEmail();
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();
        var createResponse = await client.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "Trip", text = "A story", keepPhotoIds = Array.Empty<Guid>(), newPhotos = new[] { JpegDataUrl } });
        createResponse.EnsureSuccessStatusCode();
        var created = await createResponse.Content.ReadFromJsonAsync<JsonElement>();
        var memoryId = created.GetProperty("id").GetGuid();
        var photoId = created.GetProperty("photos")[0].GetProperty("id").GetGuid();

        var coordinatorEmail = UniqueEmail();
        var coordinator = _factory.CreateClient();
        (await coordinator.PostAsJsonAsync("/api/account/register", RegisterPayload(coordinatorEmail))).EnsureSuccessStatusCode();
        await PromoteToCoordinatorAsync(coordinatorEmail);
        (await coordinator.PostAsync($"/api/review/memories/{memoryId}/approve", null)).EnsureSuccessStatusCode();

        var publicMemories = await (await _factory.CreateClient().GetAsync("/api/community/memories")).Content.ReadFromJsonAsync<JsonElement>();
        var match = publicMemories.EnumerateArray().First(m => m.GetProperty("id").GetGuid() == memoryId);
        foreach (var property in match.EnumerateObject())
        {
            Assert.DoesNotContain("account", property.Name, StringComparison.OrdinalIgnoreCase);
            Assert.DoesNotContain("email", property.Name, StringComparison.OrdinalIgnoreCase);
        }

        var publicPhoto = await _factory.CreateClient().GetAsync($"/api/community/memories/{memoryId}/photos/{photoId}");
        publicPhoto.EnsureSuccessStatusCode();
        Assert.Equal("image/jpeg", publicPhoto.Content.Headers.ContentType?.MediaType);
    }
}
