# Work: ps-009 real registration and login

**Status**: Complete

## Intended Outcome

Teachers, host families, and Rotary leaders can register and sign in against the real production
stack (`src/Rite.Api` + `src/Rite.Web`), replacing the mocked, browser-local `localStorage`
account system for registration/sign-in/sign-out/profile — kept deliberately simple for RITE's
small, known user base (simple credential-based or magic-link auth; no SSO, no third-party
identity provider), per constitution Principle IX as relaxed by CAP-2026-003.

## Acceptance Evidence

A person can register, sign in, sign out, and view/edit their own profile against the real API,
with real persisted accounts (not mocked `localStorage`). Verified end to end on the real stack:
34 new/total xUnit tests in `tests/Rite.Api.Tests/AccountEndpointsTests.cs` (invalid email, weak
password, duplicate email, wrong password, unknown email, session restore, logout, profile
update, all 401/400/409 as expected); 61/61 `src/Rite.Web` tests pass (Vitest, `api.js` mocked);
EN/ES i18n key parity holds at 135/135. Also exercised live in the browser against both dev
servers (`dotnet run` + `npm run dev`): register → lands on `/account` with real persisted
profile; duplicate email rejected (409); wrong password rejected (401, generic message, no
account-enumeration leak); correct login succeeds; profile edit persists across a full page
reload (cookie session restore via `GET /api/account/me` on mount); sign-out redirects
`/account` to `/login`; the untouched local claim/memory feature (`ps-017`'s future scope) still
works unchanged.

## Material Exclusions

- Claim-an-alumni-profile and memories/photo submissions stay mocked (`ps-017`, separate PS).
- Migrating `docs/`'s existing mocked account data into the real system is out of scope.
- VM deployment (`ps-008`) is independent and not part of this PS.

## Explicit Operating Assumptions

- Target environment: `src/Rite.Api` + `src/Rite.Web`, same combined-origin hosting model ps-008
  will eventually deploy — no new hosting assumption introduced here.
- Supported users: a small, known community (teachers, host families, Rotary leaders, coordinators,
  school administrators) — not internet-scale auth.
- Decision owner for the open technical choice below: developer (Mark Hazleton), resolved during
  implementation unless it surfaces a material trade-off worth flagging first.

## Domain Invariant

A registered account's identity (whatever key `src/Rite.Api` uses to address it) stays stable
across future PRs — `ps-017` (claim/memories) and `ps-010` (user management) attach to it later.

## Material Decisions

- **Credential storage/hashing and session mechanism** — `Microsoft.AspNetCore.Identity.PasswordHasher<Account>`
  for hashing (ships in the ASP.NET Core shared framework already referenced by `Rite.Api.csproj`'s
  `Microsoft.NET.Sdk.Web`; no new package needed) plus `Microsoft.AspNetCore.Authentication.Cookies`
  for the session (`rite.auth` cookie, 30-day sliding expiration, `SameSite=Lax`). Both are part of
  the framework a Web SDK project already references. No SSO, no third-party identity provider, no
  email verification or password-reset flow — sized to "keep it very simple" per ps-009's own scope.
  Basis: `src/Rite.Api/Accounts/AccountEndpoints.cs`, `src/Rite.Api/Program.cs`.
- **Login never distinguishes "unknown email" from "wrong password"** — both return a bare 401, so
  the API can't be used to enumerate registered emails. A deliberate security choice beyond what
  the mocked model needed (it had no real security to begin with). Basis:
  `AccountEndpoints.LoginAsync`, `tests/Rite.Api.Tests/AccountEndpointsTests.cs`.
- **Claim/memories stay local, now keyed by the real account's email** — `src/Rite.Web/src/lib/account.js`'s
  former account-identity storage (`createAccountRecord`/`readAccounts`/`writeAccounts`/session)
  is replaced by a claims/memories-only local store (`readClaimsMemories`/`writeClaimsMemories`/
  `clearClaimsMemories`), keyed by the signed-in account's email. `Account.jsx`'s claim/memory UI
  is otherwise untouched — this keeps `ps-017`'s eventual migration scoped to just that store.
- **Registration now navigates straight to `/account` on success**, matching `Login.jsx`'s existing
  pattern, instead of the old mocked flow's "Details saved in this browser" notice that stayed on
  the registration page. A deliberate simplification: real registration also signs the caller in
  server-side, so staying on the form no longer matches what actually happened.

## Next Useful Action

None — this increment is complete. `ps-010` (user management), `ps-017` (claim/memories on real
accounts), and `ps-008` (VM deployment, now gated on the full account-functionality chain) can
each build on this.
