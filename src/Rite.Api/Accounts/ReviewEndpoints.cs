using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Rite.Api.Data;

namespace Rite.Api.Accounts;

// ps-018: the real implementation of constitution Principle III for claims and
// memories — a coordinator reviews pending submissions and approves or
// rejects each; only an Approved claim/memory is ever exposed by the public
// Community.CommunityEndpoints. Reuses ps-010's IsCoordinator authorization
// pattern rather than inventing a separate "editor" role.
public static class ReviewEndpoints
{
    public static void MapReviewEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/review").WithTags("Review");

        group.MapGet("/claims", ListPendingClaimsAsync)
            .WithName("ListPendingClaims")
            .WithSummary("List pending alumni-status claims (coordinator-only)")
            .RequireAuthorization()
            .Produces<List<ClaimReviewResponse>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden);

        group.MapPost("/claims/{id:guid}/approve", ApproveClaimAsync)
            .WithName("ApproveClaim")
            .WithSummary("Approve a claim (coordinator-only)")
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/claims/{id:guid}/reject", RejectClaimAsync)
            .WithName("RejectClaim")
            .WithSummary("Reject a claim with a visible reason (coordinator-only)")
            .WithDescription("400 if Reason is blank.")
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/memories", ListPendingMemoriesAsync)
            .WithName("ListPendingMemories")
            .WithSummary("List pending memories (coordinator-only)")
            .RequireAuthorization()
            .Produces<List<MemoryReviewResponse>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden);

        group.MapPost("/memories/{id:guid}/approve", ApproveMemoryAsync)
            .WithName("ApproveMemory")
            .WithSummary("Approve a memory (coordinator-only)")
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/memories/{id:guid}/reject", RejectMemoryAsync)
            .WithName("RejectMemory")
            .WithSummary("Reject a memory with a visible reason (coordinator-only)")
            .WithDescription("400 if Reason is blank.")
            .RequireAuthorization()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<IResult> ListPendingClaimsAsync(HttpContext http, RiteDbContext db)
    {
        var forbidden = await RequireCoordinatorAsync(http, db);
        if (forbidden is not null)
        {
            return forbidden;
        }

        // Materialize first: the join plus the JSON-deserializing projection
        // below isn't EF-translatable.
        var rows = await db.AlumniClaims
            .Where(c => c.Status == ReviewStatus.Pending)
            .Join(db.Accounts, c => c.AccountId, a => a.Id, (c, a) => new { c, a })
            .ToListAsync();
        return Results.Ok(rows.OrderBy(r => r.c.CreatedAt).Select(r => ToClaimReviewResponse(r.c, r.a)).ToList());
    }

    private static async Task<IResult> ApproveClaimAsync(Guid id, HttpContext http, RiteDbContext db)
    {
        var forbidden = await RequireCoordinatorAsync(http, db);
        if (forbidden is not null)
        {
            return forbidden;
        }

        var claim = await db.AlumniClaims.FindAsync(id);
        if (claim is null)
        {
            return Results.NotFound();
        }

        claim.Status = ReviewStatus.Approved;
        claim.RejectionReason = null;
        await db.SaveChangesAsync();
        return Results.Ok();
    }

    private static async Task<IResult> RejectClaimAsync(
        Guid id, ReviewDecisionRequest request, HttpContext http, RiteDbContext db)
    {
        var forbidden = await RequireCoordinatorAsync(http, db);
        if (forbidden is not null)
        {
            return forbidden;
        }
        if (string.IsNullOrWhiteSpace(request.Reason))
        {
            return Results.BadRequest(new ErrorResponse("reason-required"));
        }

        var claim = await db.AlumniClaims.FindAsync(id);
        if (claim is null)
        {
            return Results.NotFound();
        }

        claim.Status = ReviewStatus.Rejected;
        claim.RejectionReason = request.Reason;
        await db.SaveChangesAsync();
        return Results.Ok();
    }

    private static async Task<IResult> ListPendingMemoriesAsync(HttpContext http, RiteDbContext db)
    {
        var forbidden = await RequireCoordinatorAsync(http, db);
        if (forbidden is not null)
        {
            return forbidden;
        }

        var rows = await db.Memories
            .Where(m => m.Status == ReviewStatus.Pending)
            .Join(db.Accounts, m => m.AccountId, a => a.Id, (m, a) => new { m, a })
            .ToListAsync();
        return Results.Ok(rows.OrderBy(r => r.m.CreatedAt).Select(r => ToMemoryReviewResponse(r.m, r.a)).ToList());
    }

    private static async Task<IResult> ApproveMemoryAsync(Guid id, HttpContext http, RiteDbContext db)
    {
        var forbidden = await RequireCoordinatorAsync(http, db);
        if (forbidden is not null)
        {
            return forbidden;
        }

        var memory = await db.Memories.FindAsync(id);
        if (memory is null)
        {
            return Results.NotFound();
        }

        memory.Status = ReviewStatus.Approved;
        memory.RejectionReason = null;
        await db.SaveChangesAsync();
        return Results.Ok();
    }

    private static async Task<IResult> RejectMemoryAsync(
        Guid id, ReviewDecisionRequest request, HttpContext http, RiteDbContext db)
    {
        var forbidden = await RequireCoordinatorAsync(http, db);
        if (forbidden is not null)
        {
            return forbidden;
        }
        if (string.IsNullOrWhiteSpace(request.Reason))
        {
            return Results.BadRequest(new ErrorResponse("reason-required"));
        }

        var memory = await db.Memories.FindAsync(id);
        if (memory is null)
        {
            return Results.NotFound();
        }

        memory.Status = ReviewStatus.Rejected;
        memory.RejectionReason = request.Reason;
        await db.SaveChangesAsync();
        return Results.Ok();
    }

    private static async Task<IResult?> RequireCoordinatorAsync(HttpContext http, RiteDbContext db)
    {
        var caller = await AccountEndpoints.CurrentAccountAsync(http, db);
        if (caller is null)
        {
            return Results.Unauthorized();
        }
        return caller.IsCoordinator ? null : Results.Forbid();
    }

    private static ClaimReviewResponse ToClaimReviewResponse(AlumniClaim claim, Account account) => new(
        claim.Id, account.Email, account.Name, claim.Country,
        JsonSerializer.Deserialize<List<ParticipationRowRequest>>(claim.ParticipationJson) ?? [],
        claim.SelfDeclaredName, claim.CreatedAt);

    private static MemoryReviewResponse ToMemoryReviewResponse(Memory memory, Account account) => new(
        memory.Id, account.Email, account.Name, memory.Title, memory.Text, memory.CreatedAt);
}

public record ReviewDecisionRequest(string Reason);

// SubmitterEmail/Name are only ever shown to a coordinator here, never through
// Community.CommunityEndpoints' public surface.
public record ClaimReviewResponse(
    Guid Id, string SubmitterEmail, string SubmitterName, string Country,
    List<ParticipationRowRequest> Participation, string? SelfDeclaredName, DateTimeOffset CreatedAt);

public record MemoryReviewResponse(
    Guid Id, string SubmitterEmail, string SubmitterName, string Title, string Text, DateTimeOffset CreatedAt);
