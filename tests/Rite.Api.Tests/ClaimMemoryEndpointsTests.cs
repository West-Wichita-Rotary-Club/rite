using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Rite.Api.Data;
using Xunit;

namespace Rite.Api.Tests;

public class ClaimMemoryEndpointsTests : IClassFixture<RiteApiFactory>
{
    private readonly RiteApiFactory _factory;

    public ClaimMemoryEndpointsTests(RiteApiFactory factory)
    {
        _factory = factory;
    }

    private static string UniqueEmail([System.Runtime.CompilerServices.CallerMemberName] string caller = "") =>
        $"{caller.ToLowerInvariant()}-{Guid.NewGuid():N}@example.com";

    private static object RegisterPayload(string email) => new
    {
        email,
        password = "correct-horse",
        name = "Pat Lee"
    };

    // A fixture here is any base64 payload after the data-URL prefix — the
    // endpoint only validates the envelope (prefix, base64, size), never that
    // the bytes decode to a real image, so this is enough to exercise it.
    private static string FakeJpegDataUrl(string tag = "x") => $"data:image/jpeg;base64,{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"fake-jpeg-{tag}"))}";

    private async Task<HttpClient> SignedInClientAsync()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/account/register", RegisterPayload(UniqueEmail()));
        response.EnsureSuccessStatusCode();
        return client;
    }

    private static object ClaimPayload(string country = "panama", string? matchedProfileId = "", string? selfDeclaredName = "") => new
    {
        country,
        participation = new[] { new { role = "teacher", yearFrom = 2015, yearTo = (int?)2016 } },
        matchedProfileId,
        selfDeclaredName
    };

    [Fact]
    public async Task Get_claim_without_a_session_returns_401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/account/claim");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Get_claim_returns_204_when_none_exists()
    {
        var client = await SignedInClientAsync();
        var response = await client.GetAsync("/api/account/claim");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task Save_claim_rejects_an_unknown_role()
    {
        var client = await SignedInClientAsync();
        var payload = new
        {
            country = "panama",
            participation = new[] { new { role = "astronaut", yearFrom = 2015, yearTo = (int?)null } },
            matchedProfileId = "",
            selfDeclaredName = "Pat"
        };
        var response = await client.PutAsJsonAsync("/api/account/claim", payload);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Save_claim_rejects_a_year_outside_the_program_range()
    {
        var client = await SignedInClientAsync();
        var payload = new
        {
            country = "panama",
            participation = new[] { new { role = "teacher", yearFrom = 1980, yearTo = (int?)null } },
            matchedProfileId = "",
            selfDeclaredName = "Pat"
        };
        var response = await client.PutAsJsonAsync("/api/account/claim", payload);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Save_claim_then_get_returns_it_back()
    {
        var client = await SignedInClientAsync();
        var saveResponse = await client.PutAsJsonAsync("/api/account/claim", ClaimPayload(selfDeclaredName: "Pat Lee"));
        saveResponse.EnsureSuccessStatusCode();

        var getResponse = await client.GetAsync("/api/account/claim");
        getResponse.EnsureSuccessStatusCode();
        var claim = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("panama", claim.GetProperty("country").GetString());
        Assert.Equal("Pat Lee", claim.GetProperty("selfDeclaredName").GetString());
    }

    [Fact]
    public async Task Saving_a_claim_twice_updates_in_place_rather_than_duplicating()
    {
        var client = await SignedInClientAsync();
        (await client.PutAsJsonAsync("/api/account/claim", ClaimPayload(country: "panama"))).EnsureSuccessStatusCode();
        (await client.PutAsJsonAsync("/api/account/claim", ClaimPayload(country: "argentina"))).EnsureSuccessStatusCode();

        var getResponse = await client.GetAsync("/api/account/claim");
        var claim = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("argentina", claim.GetProperty("country").GetString());
    }

    // ps-018: directly moves a claim/memory to Approved/Rejected via the
    // database, mirroring AccountEndpointsTests' PromoteToCoordinatorAsync —
    // there is still no endpoint that can do this other than ReviewEndpoints
    // itself, which these tests deliberately avoid depending on.
    private async Task SetClaimStatusAsync(string email, ReviewStatus status, string? rejectionReason = null)
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RiteDbContext>();
        var account = await db.Accounts.SingleAsync(a => a.Email == email);
        var claim = await db.AlumniClaims.SingleAsync(c => c.AccountId == account.Id);
        claim.Status = status;
        claim.RejectionReason = rejectionReason;
        await db.SaveChangesAsync();
    }

    private async Task SetMemoryStatusAsync(Guid memoryId, ReviewStatus status, string? rejectionReason = null)
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RiteDbContext>();
        var memory = await db.Memories.SingleAsync(m => m.Id == memoryId);
        memory.Status = status;
        memory.RejectionReason = rejectionReason;
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task A_newly_saved_claim_is_pending_with_no_rejection_reason()
    {
        var client = await SignedInClientAsync();
        var saveResponse = await client.PutAsJsonAsync("/api/account/claim", ClaimPayload());
        saveResponse.EnsureSuccessStatusCode();
        var claim = await saveResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("pending", claim.GetProperty("status").GetString());
        Assert.True(claim.GetProperty("rejectionReason").ValueKind is JsonValueKind.Null);
    }

    [Fact]
    public async Task Editing_an_approved_claim_resets_it_to_pending_and_clears_the_rejection_reason()
    {
        var email = UniqueEmail();
        var client = _factory.CreateClient();
        (await client.PostAsJsonAsync("/api/account/register", RegisterPayload(email))).EnsureSuccessStatusCode();
        (await client.PutAsJsonAsync("/api/account/claim", ClaimPayload())).EnsureSuccessStatusCode();
        await SetClaimStatusAsync(email, ReviewStatus.Rejected, "Needs more detail");

        var editResponse = await client.PutAsJsonAsync("/api/account/claim", ClaimPayload(country: "argentina"));
        editResponse.EnsureSuccessStatusCode();
        var claim = await editResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("pending", claim.GetProperty("status").GetString());
        Assert.True(claim.GetProperty("rejectionReason").ValueKind is JsonValueKind.Null);
    }

    [Fact]
    public async Task Withdraw_claim_removes_it_and_is_idempotent()
    {
        var client = await SignedInClientAsync();
        (await client.PutAsJsonAsync("/api/account/claim", ClaimPayload())).EnsureSuccessStatusCode();

        (await client.DeleteAsync("/api/account/claim")).EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.NoContent, (await client.GetAsync("/api/account/claim")).StatusCode);

        // Idempotent: withdrawing again with nothing left to withdraw still succeeds.
        (await client.DeleteAsync("/api/account/claim")).EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task List_memories_without_a_session_returns_401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/account/memories");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task List_memories_is_empty_for_a_new_account()
    {
        var client = await SignedInClientAsync();
        var response = await client.GetAsync("/api/account/memories");
        response.EnsureSuccessStatusCode();
        var memories = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(0, memories.GetArrayLength());
    }

    [Fact]
    public async Task Create_memory_rejects_a_blank_title()
    {
        var client = await SignedInClientAsync();
        var response = await client.PostAsJsonAsync(
            "/api/account/memories", new { title = "", text = "A story", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_memory_rejects_more_than_three_photos()
    {
        var client = await SignedInClientAsync();
        var photos = Enumerable.Range(0, 4).Select(i => FakeJpegDataUrl(i.ToString())).ToArray();
        var response = await client.PostAsJsonAsync(
            "/api/account/memories", new { title = "Trip", text = "A story", keepPhotoIds = Array.Empty<Guid>(), newPhotos = photos });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_memory_rejects_a_non_jpeg_data_url()
    {
        var client = await SignedInClientAsync();
        var response = await client.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "Trip", text = "A story", keepPhotoIds = Array.Empty<Guid>(), newPhotos = new[] { "data:image/png;base64,abc" } });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_memory_with_photos_and_fetch_a_photo_back()
    {
        var client = await SignedInClientAsync();
        var response = await client.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "My first seminar", text = "It was unforgettable.", keepPhotoIds = Array.Empty<Guid>(), newPhotos = new[] { FakeJpegDataUrl() } });
        response.EnsureSuccessStatusCode();

        var memory = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("My first seminar", memory.GetProperty("title").GetString());
        var photos = memory.GetProperty("photos");
        Assert.Equal(1, photos.GetArrayLength());
        var photoUrl = photos[0].GetProperty("url").GetString()!;

        var photoResponse = await client.GetAsync(photoUrl);
        photoResponse.EnsureSuccessStatusCode();
        Assert.Equal("image/jpeg", photoResponse.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Create_memory_fails_once_the_per_account_cap_is_reached()
    {
        var client = await SignedInClientAsync();
        for (var i = 0; i < 10; i++)
        {
            (await client.PostAsJsonAsync(
                "/api/account/memories",
                new { title = $"Memory {i}", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() }))
                .EnsureSuccessStatusCode();
        }

        var overflow = await client.PostAsJsonAsync(
            "/api/account/memories", new { title = "One too many", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() });
        Assert.Equal(HttpStatusCode.BadRequest, overflow.StatusCode);
    }

    [Fact]
    public async Task Update_memory_can_drop_an_existing_photo_and_add_a_new_one()
    {
        var client = await SignedInClientAsync();
        var createResponse = await client.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "Trip", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = new[] { FakeJpegDataUrl("old") } });
        createResponse.EnsureSuccessStatusCode();
        var created = await createResponse.Content.ReadFromJsonAsync<JsonElement>();
        var memoryId = created.GetProperty("id").GetGuid();
        var oldPhotoUrl = created.GetProperty("photos")[0].GetProperty("url").GetString()!;

        var updateResponse = await client.PutAsJsonAsync(
            $"/api/account/memories/{memoryId}",
            new { title = "Trip (edited)", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = new[] { FakeJpegDataUrl("new") } });
        updateResponse.EnsureSuccessStatusCode();
        var updated = await updateResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("Trip (edited)", updated.GetProperty("title").GetString());
        Assert.Equal(1, updated.GetProperty("photos").GetArrayLength());

        // The dropped photo's file is gone; the new one is reachable.
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync(oldPhotoUrl)).StatusCode);
        var newPhotoUrl = updated.GetProperty("photos")[0].GetProperty("url").GetString()!;
        (await client.GetAsync(newPhotoUrl)).EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task A_newly_created_memory_is_pending_with_no_rejection_reason()
    {
        var client = await SignedInClientAsync();
        var response = await client.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "Trip", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() });
        response.EnsureSuccessStatusCode();
        var memory = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("pending", memory.GetProperty("status").GetString());
        Assert.True(memory.GetProperty("rejectionReason").ValueKind is JsonValueKind.Null);
    }

    [Fact]
    public async Task Editing_a_rejected_memory_resets_it_to_pending_and_clears_the_rejection_reason()
    {
        var client = await SignedInClientAsync();
        var createResponse = await client.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "Trip", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() });
        createResponse.EnsureSuccessStatusCode();
        var memoryId = (await createResponse.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetGuid();
        await SetMemoryStatusAsync(memoryId, ReviewStatus.Rejected, "Needs permission from the school");

        var updateResponse = await client.PutAsJsonAsync(
            $"/api/account/memories/{memoryId}",
            new { title = "Trip (edited)", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() });
        updateResponse.EnsureSuccessStatusCode();
        var memory = await updateResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("pending", memory.GetProperty("status").GetString());
        Assert.True(memory.GetProperty("rejectionReason").ValueKind is JsonValueKind.Null);
    }

    [Fact]
    public async Task Update_memory_for_an_unknown_id_returns_404()
    {
        var client = await SignedInClientAsync();
        var response = await client.PutAsJsonAsync(
            $"/api/account/memories/{Guid.NewGuid()}",
            new { title = "Trip", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() });
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_memory_removes_it_and_its_photo()
    {
        var client = await SignedInClientAsync();
        var createResponse = await client.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "Trip", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = new[] { FakeJpegDataUrl() } });
        createResponse.EnsureSuccessStatusCode();
        var created = await createResponse.Content.ReadFromJsonAsync<JsonElement>();
        var memoryId = created.GetProperty("id").GetGuid();
        var photoUrl = created.GetProperty("photos")[0].GetProperty("url").GetString()!;

        (await client.DeleteAsync($"/api/account/memories/{memoryId}")).EnsureSuccessStatusCode();

        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync(photoUrl)).StatusCode);
        var listResponse = await client.GetAsync("/api/account/memories");
        var memories = await listResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(0, memories.GetArrayLength());
    }

    [Fact]
    public async Task A_memory_is_not_visible_or_editable_from_a_different_account()
    {
        var owner = await SignedInClientAsync();
        var createResponse = await owner.PostAsJsonAsync(
            "/api/account/memories",
            new { title = "Trip", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() });
        createResponse.EnsureSuccessStatusCode();
        var memoryId = (await createResponse.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("id").GetGuid();

        var stranger = await SignedInClientAsync();
        var strangerUpdate = await stranger.PutAsJsonAsync(
            $"/api/account/memories/{memoryId}",
            new { title = "Hijacked", text = "...", keepPhotoIds = Array.Empty<Guid>(), newPhotos = Array.Empty<string>() });
        Assert.Equal(HttpStatusCode.NotFound, strangerUpdate.StatusCode);

        var strangerDelete = await stranger.DeleteAsync($"/api/account/memories/{memoryId}");
        Assert.Equal(HttpStatusCode.NotFound, strangerDelete.StatusCode);
    }
}
