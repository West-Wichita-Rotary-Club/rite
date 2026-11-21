using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Rite.Api.Accounts;
using Rite.Api.Data;

namespace Rite.Api.Community;

// ps-018: the new, standalone public surface for approved claims/memories —
// developer-chosen over merging into the existing /api/alumni and /api/stories
// (Program.cs), which stay static content seeded from docs/content/*.json and
// are entirely unrelated to AlumniClaim/Memory. Anonymous and read-only.
// Every query here filters to ReviewStatus.Approved server-side (never a
// client-supplied filter), and no response type includes AccountId, email, or
// any other account field — only what the member wrote into the claim/memory.
public static class CommunityEndpoints
{
    public static void MapCommunityEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/community").WithTags("Community");

        group.MapGet("/claims", ListApprovedClaimsAsync)
            .WithName("ListApprovedClaims")
            .WithSummary("List publicly approved alumni-status claims")
            .Produces<List<CommunityClaimResponse>>(StatusCodes.Status200OK);

        group.MapGet("/memories", ListApprovedMemoriesAsync)
            .WithName("ListApprovedMemories")
            .WithSummary("List publicly approved memories")
            .Produces<List<CommunityMemoryResponse>>(StatusCodes.Status200OK);

        group.MapGet("/memories/{id:guid}/photos/{photoId:guid}", GetApprovedMemoryPhotoAsync)
            .WithName("GetApprovedMemoryPhoto")
            .WithSummary("Stream a photo from a publicly approved memory")
            .Produces(StatusCodes.Status200OK, contentType: "image/jpeg")
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<IResult> ListApprovedClaimsAsync(RiteDbContext db)
    {
        var claims = await db.AlumniClaims.Where(c => c.Status == ReviewStatus.Approved).ToListAsync();
        return Results.Ok(claims.OrderBy(c => c.CreatedAt).Select(ToClaimResponse).ToList());
    }

    private static async Task<IResult> ListApprovedMemoriesAsync(RiteDbContext db)
    {
        var memories = await db.Memories.Where(m => m.Status == ReviewStatus.Approved).ToListAsync();
        return Results.Ok(memories.OrderBy(m => m.CreatedAt).Select(ToMemoryResponse).ToList());
    }

    private static async Task<IResult> GetApprovedMemoryPhotoAsync(Guid id, Guid photoId, RiteDbContext db, MediaStorage media)
    {
        // The id/status filter together are what keeps a pending or rejected
        // memory's photos unreachable here even if the (guessable-format) ids
        // are known — this endpoint takes no auth at all, so the status check
        // is the only gate.
        var memory = await db.Memories.FirstOrDefaultAsync(m => m.Id == id && m.Status == ReviewStatus.Approved);
        if (memory is null)
        {
            return Results.NotFound();
        }

        var path = media.PhotoPath(memory.AccountId, memory.Id, photoId);
        if (!File.Exists(path))
        {
            return Results.NotFound();
        }
        return Results.File(path, "image/jpeg");
    }

    private static CommunityClaimResponse ToClaimResponse(AlumniClaim claim) => new(
        claim.Id, claim.Country,
        JsonSerializer.Deserialize<List<ParticipationRowRequest>>(claim.ParticipationJson) ?? [],
        claim.SelfDeclaredName, claim.CreatedAt);

    private static CommunityMemoryResponse ToMemoryResponse(Memory memory)
    {
        var photoIds = JsonSerializer.Deserialize<List<Guid>>(memory.PhotoIdsJson) ?? [];
        var photos = photoIds
            .Select(photoId => new MemoryPhotoRef(photoId, $"/api/community/memories/{memory.Id}/photos/{photoId}"))
            .ToList();
        return new CommunityMemoryResponse(memory.Id, memory.Title, memory.Text, photos, memory.CreatedAt);
    }
}

public record CommunityClaimResponse(
    Guid Id, string Country, List<ParticipationRowRequest> Participation, string? SelfDeclaredName,
    DateTimeOffset CreatedAt);

public record CommunityMemoryResponse(
    Guid Id, string Title, string Text, List<MemoryPhotoRef> Photos, DateTimeOffset CreatedAt);
