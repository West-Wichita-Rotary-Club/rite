# Work: ps-009 real registration and login

**Status**: In Progress

## Intended Outcome

Teachers, host families, and Rotary leaders can register and sign in against the real production
stack (`src/Rite.Api` + `src/Rite.Web`), replacing the mocked, browser-local `localStorage`
account system for registration/sign-in/sign-out/profile — kept deliberately simple for RITE's
small, known user base (simple credential-based or magic-link auth; no SSO, no third-party
identity provider), per constitution Principle IX as relaxed by CAP-2026-003.

## Acceptance Evidence

A person can register, sign in, sign out, and view/edit their own profile against the real API,
with real persisted accounts (not mocked `localStorage`). Verified end to end on the real stack.

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

## Open Decision (to resolve during implementation)

Credential storage/hashing approach and session mechanism — sized to "keep it very simple," not a
general-purpose identity platform. Record the choice and its basis here once made.

## Next Useful Action

Implement the minimal account model (register/sign-in/sign-out/profile) in `src/Rite.Api` and the
matching `src/Rite.Web` UI, reusing `docs/js/account.js`'s validation shapes where sensible.
