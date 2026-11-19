# Work: ps-010 user management on the API

**Status**: Complete

## Intended Outcome

Rotary leaders/coordinators can see, review, and manage the accounts ps-009 creates — list users,
view their roles/profiles, and deactivate an account — from an authenticated surface in
`src/Rite.Api`/`src/Rite.Web`, instead of needing direct database access to do it.

## Acceptance Evidence

A coordinator can sign in, see the list of real registered accounts with their roles, and
deactivate one. Recognized complete once that flow works end to end and is reviewed.

Verified: 44/44 backend tests pass (9 new — unauthenticated/non-coordinator/coordinator access for
list, deactivate, reactivate; 404 for an unknown id; deactivation blocks future login and revokes
an already-live session immediately via isolated `HttpClient`/`CookieContainer` pairs; reactivation
restores login; a client-supplied `isCoordinator: true` on register is silently ignored). 68/68
`src/Rite.Web` tests pass (6 new `Coordinator.test.jsx` cases). EN/ES i18n parity holds at
151/151. Verified live in the browser: registered two accounts; confirmed setting one's own
`Role` dropdown to "Coordinator" does **not** grant `/coordinator` access (the exact gap the
material decision below closes); promoted one account via a direct SQLite edit (no other path
exists); confirmed the coordinator sees both accounts, deactivate blocks that account's login,
and reactivate restores it. (One two-tab manual attempt to show mid-session revocation was
inconclusive — both tabs shared one browser cookie jar, so a login in one tab silently overwrote
the other's session; this is a test-methodology artifact, not a product behavior, and the
property itself is proven by the isolated-client backend test instead.)

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

## Additional Implementation Notes

- Deactivation also runs the same timing-safe dummy-hash check ps-009's `H-01` fix introduced:
  an unknown email, a wrong password, and a deactivated account's correct password all take
  comparable time and return the same 401 — deactivation status isn't leakable via timing either.
- `Account.IsActive` defaults to `true`; `CurrentAccountAsync` (used by `GetMeAsync`,
  `UpdateMeAsync`, and the coordinator endpoints) filters it, so deactivation takes effect
  immediately rather than only on next sign-in.
- `AccountProfile` (the `/me`, register, login response shape) now also returns `isCoordinator`
  (read-only) so `src/Rite.Web` can decide whether to show the "Manage accounts" nav link and
  `/coordinator` route at all.

## Next Useful Action

None — this increment is complete. `ps-013` (host-family matching) and `ps-018` (review/approve
workflow, which reuses this PS's coordinator pattern rather than inventing a separate "editor"
role) can each build on this.
