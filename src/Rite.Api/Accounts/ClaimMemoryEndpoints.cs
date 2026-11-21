using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Rite.Api.Data;

namespace Rite.Api.Accounts;

// ps-017: moves claim-an-alumni-profile and memory/photo submission off
// src/Rite.Web's localStorage mock onto the real API — the two pieces ps-009
// deliberately left out. Every endpoint here operates on the signed-in
// caller's own claim/memories only. The coordinator review queue
// (ReviewEndpoints) and the public approved-only surface
// (Community.CommunityEndpoints) are ps-018, in their own files.
public static class ClaimMemoryEndpoints
{
    private const int MaxPhotosPerMemory = 3;
    private const int MaxMemoriesPerMember = 10;
    private const int MinParticipationYear = 1996;
    private const long MaxPhotoBytes = 5 * 1024 * 1024;
    private const string JpegDataUrlPrefix = "data:image/jpeg;base64,";
    private static readonly string[] ClaimRoles = ["leader", "host", "teacher"];

    public static void MapClaimAndMemoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/account").WithTags("Account");

        group.MapGet("/claim", GetClaimAsync)
            .WithName("GetClaim")
            .WithSummary("Get the signed-in account's alumni-status claim")
            .RequireAuthorization()
            .Produces<ClaimResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status401Unauthorized);

        group.MapPut("/claim", SaveClaimAsync)
            .WithName("SaveClaim")
            .WithSummary("Create or update the signed-in account's alumni-status claim")
            .RequireAuthorization()
            .Produces<ClaimResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized);

        group.MapDelete("/claim", WithdrawClaimAsync)
            .WithName("WithdrawClaim")
            .WithSummary("Withdraw the signed-in account's alumni-status claim")
            .WithDescription("Idempotent: a no-op when no claim exists.")
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        group.MapGet("/memories", ListMemoriesAsync)
            .WithName("ListMemories")
            .WithSummary("List the signed-in account's own memories")
            .RequireAuthorization()
            .Produces<List<MemoryResponse>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized);

        group.MapPost("/memories", CreateMemoryAsync)
            .WithName("CreateMemory")
            .WithSummary("Share a new memory, with up to 3 photos")
            .WithDescription(
                $"400 if title/text is blank, more than {MaxPhotosPerMemory} photos are included, a " +
                "photo isn't a valid JPEG data URL, or the account already has " +
                $"{MaxMemoriesPerMember} memories.")
            .RequireAuthorization()
            .Produces<MemoryResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized);

        group.MapPut("/memories/{id:guid}", UpdateMemoryAsync)
            .WithName("UpdateMemory")
            .WithSummary("Edit one of the signed-in account's own memories")
            .WithDescription(
                "KeepPhotoIds names which of the memory's current photos to retain; any not named " +
                "are deleted. NewPhotos are appended after the kept ones.")
            .RequireAuthorization()
            .Produces<MemoryResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/memories/{id:guid}", DeleteMemoryAsync)
            .WithName("DeleteMemory")
            .WithSummary("Delete one of the signed-in account's own memories, photos included")
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/memories/{id:guid}/photos/{photoId:guid}", GetMemoryPhotoAsync)
            .WithName("GetMemoryPhoto")
            .WithSummary("Stream one of the signed-in account's own memory photos")
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK, contentType: "image/jpeg")
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<IResult> GetClaimAsync(HttpContext http, RiteDbContext db)
    {
        var account = await AccountEndpoints.CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }

        var claim = await db.AlumniClaims.FirstOrDefaultAsync(c => c.AccountId == account.Id);
        return claim is null ? Results.NoContent() : Results.Ok(ToClaimResponse(claim));
    }

    private static async Task<IResult> SaveClaimAsync(SaveClaimRequest request, HttpContext http, RiteDbContext db)
    {
        var account = await AccountEndpoints.CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }
        if (string.IsNullOrWhiteSpace(request.Country) || !IsValidParticipation(request.Participation))
        {
            return Results.BadRequest(new ErrorResponse("invalid-claim"));
        }

        var now = DateTimeOffset.UtcNow;
        var claim = await db.AlumniClaims.FirstOrDefaultAsync(c => c.AccountId == account.Id);
        if (claim is null)
        {
            claim = new AlumniClaim { Id = Guid.NewGuid(), AccountId = account.Id, CreatedAt = now };
            db.AlumniClaims.Add(claim);
        }
        claim.Country = request.Country;
        claim.ParticipationJson = JsonSerializer.Serialize(request.Participation);
        claim.MatchedProfileId = string.IsNullOrWhiteSpace(request.MatchedProfileId) ? null : request.MatchedProfileId;
        claim.SelfDeclaredName = string.IsNullOrWhiteSpace(request.SelfDeclaredName) ? null : request.SelfDeclaredName;
        claim.UpdatedAt = now;
        // ps-018: every save (new or re-edit) goes back to Pending — an edit to
        // an already-approved claim must not keep the stale, no-longer-accurate
        // review outcome.
        claim.Status = ReviewStatus.Pending;
        claim.RejectionReason = null;

        await db.SaveChangesAsync();
        return Results.Ok(ToClaimResponse(claim));
    }

    private static async Task<IResult> WithdrawClaimAsync(HttpContext http, RiteDbContext db)
    {
        var account = await AccountEndpoints.CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }

        var claim = await db.AlumniClaims.FirstOrDefaultAsync(c => c.AccountId == account.Id);
        if (claim is not null)
        {
            db.AlumniClaims.Remove(claim);
            await db.SaveChangesAsync();
        }
        return Results.Ok();
    }

    private static async Task<IResult> ListMemoriesAsync(HttpContext http, RiteDbContext db)
    {
        var account = await AccountEndpoints.CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }

        // Order client-side: SQLite can't translate ORDER BY over DateTimeOffset.
        var memories = await db.Memories.Where(m => m.AccountId == account.Id).ToListAsync();
        return Results.Ok(memories.OrderBy(m => m.CreatedAt).Select(ToMemoryResponse).ToList());
    }

    private static async Task<IResult> CreateMemoryAsync(
        SaveMemoryRequest request, HttpContext http, RiteDbContext db, MediaStorage media)
    {
        var account = await AccountEndpoints.CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Text))
        {
            return Results.BadRequest(new ErrorResponse("invalid-memory"));
        }

        var newPhotos = request.NewPhotos ?? [];
        if (newPhotos.Count > MaxPhotosPerMemory)
        {
            return Results.BadRequest(new ErrorResponse("too-many-photos"));
        }
        if (await db.Memories.CountAsync(m => m.AccountId == account.Id) >= MaxMemoriesPerMember)
        {
            return Results.BadRequest(new ErrorResponse("memory-cap-reached"));
        }

        var memory = new Memory
        {
            Id = Guid.NewGuid(),
            AccountId = account.Id,
            Title = request.Title,
            Text = request.Text,
            CreatedAt = DateTimeOffset.UtcNow
        };

        var photoIds = new List<Guid>();
        foreach (var dataUrl in newPhotos)
        {
            var bytes = DecodeJpegDataUrl(dataUrl);
            if (bytes is null)
            {
                return Results.BadRequest(new ErrorResponse("invalid-photo"));
            }
            var photoId = Guid.NewGuid();
            await WritePhotoAsync(media, account.Id, memory.Id, photoId, bytes);
            photoIds.Add(photoId);
        }
        memory.PhotoIdsJson = JsonSerializer.Serialize(photoIds);

        db.Memories.Add(memory);
        await db.SaveChangesAsync();
        return Results.Ok(ToMemoryResponse(memory));
    }

    private static async Task<IResult> UpdateMemoryAsync(
        Guid id, SaveMemoryRequest request, HttpContext http, RiteDbContext db, MediaStorage media)
    {
        var account = await AccountEndpoints.CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }

        var memory = await db.Memories.FirstOrDefaultAsync(m => m.Id == id && m.AccountId == account.Id);
        if (memory is null)
        {
            return Results.NotFound();
        }
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Text))
        {
            return Results.BadRequest(new ErrorResponse("invalid-memory"));
        }

        var existingIds = JsonSerializer.Deserialize<List<Guid>>(memory.PhotoIdsJson) ?? [];
        var keepIds = (request.KeepPhotoIds ?? []).Where(existingIds.Contains).ToList();
        var newPhotos = request.NewPhotos ?? [];
        if (keepIds.Count + newPhotos.Count > MaxPhotosPerMemory)
        {
            return Results.BadRequest(new ErrorResponse("too-many-photos"));
        }

        foreach (var droppedId in existingIds.Except(keepIds))
        {
            DeletePhotoFile(media, account.Id, memory.Id, droppedId);
        }

        var finalIds = new List<Guid>(keepIds);
        foreach (var dataUrl in newPhotos)
        {
            var bytes = DecodeJpegDataUrl(dataUrl);
            if (bytes is null)
            {
                return Results.BadRequest(new ErrorResponse("invalid-photo"));
            }
            var photoId = Guid.NewGuid();
            await WritePhotoAsync(media, account.Id, memory.Id, photoId, bytes);
            finalIds.Add(photoId);
        }

        memory.Title = request.Title;
        memory.Text = request.Text;
        memory.PhotoIdsJson = JsonSerializer.Serialize(finalIds);
        // ps-018: see SaveClaimAsync's matching comment — an edit always resets
        // to Pending.
        memory.Status = ReviewStatus.Pending;
        memory.RejectionReason = null;
        await db.SaveChangesAsync();
        return Results.Ok(ToMemoryResponse(memory));
    }

    private static async Task<IResult> DeleteMemoryAsync(Guid id, HttpContext http, RiteDbContext db, MediaStorage media)
    {
        var account = await AccountEndpoints.CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }

        var memory = await db.Memories.FirstOrDefaultAsync(m => m.Id == id && m.AccountId == account.Id);
        if (memory is null)
        {
            return Results.NotFound();
        }

        var directory = media.MemoryDirectory(account.Id, memory.Id);
        if (Directory.Exists(directory))
        {
            Directory.Delete(directory, recursive: true);
        }
        db.Memories.Remove(memory);
        await db.SaveChangesAsync();
        return Results.Ok();
    }

    private static async Task<IResult> GetMemoryPhotoAsync(
        Guid id, Guid photoId, HttpContext http, RiteDbContext db, MediaStorage media)
    {
        var account = await AccountEndpoints.CurrentAccountAsync(http, db);
        if (account is null)
        {
            return Results.Unauthorized();
        }

        var memory = await db.Memories.FirstOrDefaultAsync(m => m.Id == id && m.AccountId == account.Id);
        if (memory is null)
        {
            return Results.NotFound();
        }

        var path = media.PhotoPath(account.Id, memory.Id, photoId);
        if (!File.Exists(path))
        {
            return Results.NotFound();
        }
        return Results.File(path, "image/jpeg");
    }

    private static bool IsValidParticipation(List<ParticipationRowRequest>? participation)
    {
        if (participation is null || participation.Count == 0)
        {
            return false;
        }
        var currentYear = DateTime.UtcNow.Year;
        foreach (var row in participation)
        {
            if (!ClaimRoles.Contains(row.Role))
            {
                return false;
            }
            if (row.YearFrom < MinParticipationYear || row.YearFrom > currentYear)
            {
                return false;
            }
            var to = row.YearTo ?? row.YearFrom;
            if (to < row.YearFrom || to > currentYear)
            {
                return false;
            }
        }
        return true;
    }

    private static byte[]? DecodeJpegDataUrl(string dataUrl)
    {
        if (string.IsNullOrEmpty(dataUrl) || !dataUrl.StartsWith(JpegDataUrlPrefix, StringComparison.Ordinal))
        {
            return null;
        }
        try
        {
            var bytes = Convert.FromBase64String(dataUrl[JpegDataUrlPrefix.Length..]);
            return bytes.Length > 0 && bytes.Length <= MaxPhotoBytes ? bytes : null;
        }
        catch (FormatException)
        {
            return null;
        }
    }

    private static async Task WritePhotoAsync(MediaStorage media, Guid accountId, Guid memoryId, Guid photoId, byte[] bytes)
    {
        var directory = media.MemoryDirectory(accountId, memoryId);
        Directory.CreateDirectory(directory);
        await File.WriteAllBytesAsync(media.PhotoPath(accountId, memoryId, photoId), bytes);
    }

    private static void DeletePhotoFile(MediaStorage media, Guid accountId, Guid memoryId, Guid photoId)
    {
        var path = media.PhotoPath(accountId, memoryId, photoId);
        if (File.Exists(path))
        {
            File.Delete(path);
        }
    }

    private static ClaimResponse ToClaimResponse(AlumniClaim claim) => new(
        claim.Country,
        JsonSerializer.Deserialize<List<ParticipationRowRequest>>(claim.ParticipationJson) ?? [],
        claim.MatchedProfileId,
        claim.SelfDeclaredName,
        claim.CreatedAt,
        ToStatusString(claim.Status),
        claim.RejectionReason);

    private static MemoryResponse ToMemoryResponse(Memory memory)
    {
        var photoIds = JsonSerializer.Deserialize<List<Guid>>(memory.PhotoIdsJson) ?? [];
        var photos = photoIds
            .Select(photoId => new MemoryPhotoRef(photoId, $"/api/account/memories/{memory.Id}/photos/{photoId}"))
            .ToList();
        return new MemoryResponse(
            memory.Id, memory.Title, memory.Text, photos, memory.CreatedAt,
            ToStatusString(memory.Status), memory.RejectionReason);
    }

    // Lowercase, matching every other string enum-ish value this API already
    // returns (e.g. ErrorResponse's error codes) — not the C# member casing.
    internal static string ToStatusString(ReviewStatus status) => status switch
    {
        ReviewStatus.Approved => "approved",
        ReviewStatus.Rejected => "rejected",
        _ => "pending"
    };
}

public record ParticipationRowRequest(string Role, int YearFrom, int? YearTo);

public record SaveClaimRequest(
    string Country, List<ParticipationRowRequest> Participation, string? MatchedProfileId, string? SelfDeclaredName);

public record ClaimResponse(
    string Country, List<ParticipationRowRequest> Participation, string? MatchedProfileId,
    string? SelfDeclaredName, DateTimeOffset CreatedAt, string Status, string? RejectionReason);

// KeepPhotoIds is ignored on create (nothing to keep yet) and names which of an
// existing memory's photos survive an edit on update; NewPhotos are JPEG data
// URLs appended after the kept ones, for either operation.
public record SaveMemoryRequest(string Title, string Text, List<Guid>? KeepPhotoIds, List<string>? NewPhotos);

public record MemoryPhotoRef(Guid Id, string Url);

public record MemoryResponse(
    Guid Id, string Title, string Text, List<MemoryPhotoRef> Photos, DateTimeOffset CreatedAt,
    string Status, string? RejectionReason);
