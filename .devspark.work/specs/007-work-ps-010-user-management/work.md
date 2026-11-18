# Work: ps-010 user management on the API

**Status**: In Progress

## Intended Outcome

Rotary leaders/coordinators can see, review, and manage the accounts ps-009 creates — list users,
view their roles/profiles, and deactivate an account — from an authenticated surface in
`src/Rite.Api`/`src/Rite.Web`, instead of needing direct database access to do it.

## Acceptance Evidence

A coordinator can sign in, see the list of real registered accounts with their roles, and
deactivate one. Recognized complete once that flow works end to end and is reviewed.

## Material Exclusions

- Self-service registration/login itself stays ps-009's (done).
- Claim/memory moderation is a separate future outcome (ps-018).
- No general permissions framework — a single `IsCoordinator` boolean, not a role/claims system.
- No UI/flow for *promoting* someone to coordinator — the first coordinator(s) are set directly
  in the database; a promote workflow is a later decision if ever needed.

## Explicit Operating Assumptions

- Target environment: `src/Rite.Api` + `src/Rite.Web`, same stack ps-009 shipped on.
- Supported users: coordinators/Rotary leaders (the only persona this surface serves); every
  other authenticated user must get 403, not see the list.
- Decision owner for implementation details (e.g. deactivation mechanics): developer, resolved
  during implementation unless a material trade-off surfaces first.

## Material Decision (made before implementation)

**Authorization is a new `Account.IsCoordinator` boolean, decoupled from the existing self-declared
`Role` text field** — not a reuse of `Role` as ps-010's own spec originally suggested. Investigation
found `Account.Role` (added by ps-009) is free-text and self-editable via `RegisterRequest` and
`UpdateProfileRequest` with no server-side restriction: any registered user could set their own
`Role` to `"coordinator"` and reach an admin surface authorized against that field. Developer chose
(AskUserQuestion) a new boolean never exposed in any public request DTO, set only by direct database
edit until/unless a promote workflow is ever built. Basis: `src/Rite.Api/Accounts/AccountEndpoints.cs`
lines ~92-103, 170-176 (register/update both accept `Role` from the client).

## Domain Invariant

`IsCoordinator` must never be reachable through any request body a non-coordinator can submit —
the exact gap this decision exists to close. Any new account-related endpoint must be checked
against this before shipping.

## Next Useful Action

Implement the `IsCoordinator` field (migration-free via `EnsureCreatedAsync`, same pattern as the
rest of `Account`), the coordinator-only list endpoint, a deactivation mechanism, and the matching
`src/Rite.Web` coordinator UI.
