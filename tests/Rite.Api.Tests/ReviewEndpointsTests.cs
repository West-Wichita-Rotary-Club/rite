using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Rite.Api.Data;
using Xunit;

namespace Rite.Api.Tests;

public class ReviewEndpointsTests : IClassFixture<RiteApiFactory>
{
    private readonly RiteApiFactory _factory;

    public ReviewEndpointsTests(RiteApiFactory factory)
    {
        _factory = factory;
    }

    private static string UniqueEmail([System.Runtime.CompilerServices.CallerMemberName] string caller = "") =>
        $"{caller.ToLowerInvariant()}-{Guid.NewGuid():N}@example.com";

    private static object RegisterPayload(string email) => new { email, password = "correct-horse", name = "Pat Lee" };

    private static object ClaimPayload(string country = "panama") => new
    {
        country,
        participation = new[] { new { role = "teacher", yearFrom = 2015, yearTo = (int?)2016 } },
        matchedProfileId = "",
        selfDeclaredName = "Pat Lee"
    };

    // Mirrors AccountEndpointsTests' PromoteToCoordinatorAsync — no endpoint
    // can set IsCoordinator (ps-010's whole point).
    private async Task PromoteToCoordinatorAsync(string email)
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RiteDbContext>();
        var account = await db.Accounts.SingleAsync(a => a.Email == email);
        account.IsCoordinator = true;
        await db.SaveChangesAsync();
    }

    private async Task<HttpClient> CoordinatorClientAsync()
    {
        var email = UniqueEmail();
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();
        await PromoteToCoordinatorAsync(email);
        return client;
    }

    private async Task<(HttpClient Client, string Email)> MemberWithClaimAsync()
    {
        var email = UniqueEmail();
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();
        (await client.PutAsJsonAsync("/api/account/claim", ClaimPayload())).EnsureSuccessStatusCode();
        return (client, email);
    }

    private async Task<(HttpClient Client, Guid MemoryId)> MemberWithMemoryAsync()
    {
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(UniqueEmail()))).EnsureSuccessStatusCode();
        var response = await client.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "Trip", text = "A story", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() });
        response.EnsureSuccessStatusCode();
        var id = (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetGuid();
        return (client, id);
    }

    [Fact]
    public async Task List_pending_claims_without_a_session_returns_401()
    {
        var response = await _factory.CreateClient().GetAsync("/api/review/claims");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task List_pending_claims_for_a_non_coordinator_returns_403()
    {
        var (client, _) = await MemberWithClaimAsync();
        var response = await client.GetAsync("/api/review/claims");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task List_pending_claims_includes_submitter_identity_but_only_pending_items()
    {
        var (_, email) = await MemberWithClaimAsync();
        var coordinator = await CoordinatorClientAsync();

        var response = await coordinator.GetAsync("/api/review/claims");
        response.EnsureSuccessStatusCode();
        var claims = await response.Content.ReadFromJsonAsync<JsonElement>();
        var match = claims.EnumerateArray().First(c => c.GetProperty("submitterEmail").GetString() == email);
        Assert.Equal("panama", match.GetProperty("country").GetString());
        Assert.Equal("Pat Lee", match.GetProperty("submitterName").GetString());
    }

    [Fact]
    public async Task Approve_claim_moves_it_out_of_the_pending_queue_and_is_visible_to_the_submitter()
    {
        var (memberClient, email) = await MemberWithClaimAsync();
        var coordinator = await CoordinatorClientAsync();
        var pending = await (await coordinator.GetAsync("/api/review/claims")).Content.ReadFromJsonAsync<JsonElement>();
        var id = pending.EnumerateArray().First(c => c.GetProperty("submitterEmail").GetString() == email).GetProperty("id").GetGuid();

        var approveResponse = await coordinator.PostAsync($"/api/review/claims/{id}/approve", null);
        approveResponse.EnsureSuccessStatusCode();

        var afterApproval = await (await coordinator.GetAsync("/api/review/claims")).Content.ReadFromJsonAsync<JsonElement>();
        Assert.DoesNotContain(
            afterApproval.EnumerateArray(), c => c.GetProperty("submitterEmail").GetString() == email);

        var ownClaim = await (await memberClient.GetAsync("/api/account/claim")).Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("approved", ownClaim.GetProperty("status").GetString());
    }

    [Fact]
    public async Task Approve_claim_for_a_non_coordinator_returns_403()
    {
        var (_, email) = await MemberWithClaimAsync();
        var coordinator = await CoordinatorClientAsync();
        var pending = await (await coordinator.GetAsync("/api/review/claims")).Content.ReadFromJsonAsync<JsonElement>();
        var id = pending.EnumerateArray().First(c => c.GetProperty("submitterEmail").GetString() == email).GetProperty("id").GetGuid();

        var (nonCoordinator, _) = await MemberWithClaimAsync();
        var response = await nonCoordinator.PostAsync($"/api/review/claims/{id}/approve", null);
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Approve_claim_for_an_unknown_id_returns_404()
    {
        var coordinator = await CoordinatorClientAsync();
        var response = await coordinator.PostAsync($"/api/review/claims/{Guid.NewGuid()}/approve", null);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Reject_claim_requires_a_reason()
    {
        var (_, email) = await MemberWithClaimAsync();
        var coordinator = await CoordinatorClientAsync();
        var pending = await (await coordinator.GetAsync("/api/review/claims")).Content.ReadFromJsonAsync<JsonElement>();
        var id = pending.EnumerateArray().First(c => c.GetProperty("submitterEmail").GetString() == email).GetProperty("id").GetGuid();

        var response = await coordinator.PostAsJsonAsync($"/api/review/claims/{id}/reject", new { reason = "" });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Reject_claim_with_a_reason_is_visible_to_the_submitter()
    {
        var (memberClient, email) = await MemberWithClaimAsync();
        var coordinator = await CoordinatorClientAsync();
        var pending = await (await coordinator.GetAsync("/api/review/claims")).Content.ReadFromJsonAsync<JsonElement>();
        var id = pending.EnumerateArray().First(c => c.GetProperty("submitterEmail").GetString() == email).GetProperty("id").GetGuid();

        (await coordinator.PostAsJsonAsync($"/api/review/claims/{id}/reject", new { reason = "Years don't match our records" }))
            .EnsureSuccessStatusCode();

        var ownClaim = await (await memberClient.GetAsync("/api/account/claim")).Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("rejected", ownClaim.GetProperty("status").GetString());
        Assert.Equal("Years don't match our records", ownClaim.GetProperty("rejectionReason").GetString());
    }

    [Fact]
    public async Task List_pending_memories_for_a_non_coordinator_returns_403()
    {
        var (client, _) = await MemberWithMemoryAsync();
        var response = await client.GetAsync("/api/review/memories");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Approve_memory_is_visible_to_the_submitter_and_leaves_the_queue()
    {
        var (memberClient, memoryId) = await MemberWithMemoryAsync();
        var coordinator = await CoordinatorClientAsync();

        (await coordinator.PostAsync($"/api/review/memories/{memoryId}/approve", null)).EnsureSuccessStatusCode();

        var afterApproval = await (await coordinator.GetAsync("/api/review/memories")).Content.ReadFromJsonAsync<JsonElement>();
        Assert.DoesNotContain(afterApproval.EnumerateArray(), m => m.GetProperty("id").GetGuid() == memoryId);

        var memories = await (await memberClient.GetAsync("/api/account/memories")).Content.ReadFromJsonAsync<JsonElement>();
        var own = memories.EnumerateArray().First(m => m.GetProperty("id").GetGuid() == memoryId);
        Assert.Equal("approved", own.GetProperty("status").GetString());
    }

    [Fact]
    public async Task Reject_memory_requires_a_reason_and_is_visible_to_the_submitter_once_given()
    {
        var (memberClient, memoryId) = await MemberWithMemoryAsync();
        var coordinator = await CoordinatorClientAsync();

        var blank = await coordinator.PostAsJsonAsync($"/api/review/memories/{memoryId}/reject", new { reason = "   " });
        Assert.Equal(HttpStatusCode.BadRequest, blank.StatusCode);

        (await coordinator.PostAsJsonAsync($"/api/review/memories/{memoryId}/reject", new { reason = "Please add more context" }))
            .EnsureSuccessStatusCode();

        var memories = await (await memberClient.GetAsync("/api/account/memories")).Content.ReadFromJsonAsync<JsonElement>();
        var own = memories.EnumerateArray().First(m => m.GetProperty("id").GetGuid() == memoryId);
        Assert.Equal("rejected", own.GetProperty("status").GetString());
        Assert.Equal("Please add more context", own.GetProperty("rejectionReason").GetString());
    }

    [Fact]
    public async Task Approve_memory_for_an_unknown_id_returns_404()
    {
        var coordinator = await CoordinatorClientAsync();
        var response = await coordinator.PostAsync($"/api/review/memories/{Guid.NewGuid()}/approve", null);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
