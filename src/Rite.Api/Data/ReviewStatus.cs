namespace Rite.Api.Data;

// ps-018: the review-decision status shared by AlumniClaim and Memory. New or
// edited content always starts or returns to Pending; only a coordinator
// (Accounts.ReviewEndpoints) can move it to Approved or Rejected, and only
// Approved content is ever exposed by the public Community.CommunityEndpoints.
public enum ReviewStatus
{
    Pending,
    Approved,
    Rejected
}
