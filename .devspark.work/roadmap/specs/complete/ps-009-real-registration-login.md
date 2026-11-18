---
id: ps-009
title: Real registration and login for a small user base
status: complete
order: 30
depends_on: [ps-006, ps-007]
blockers: []
delivery: ["https://github.com/West-Wichita-Rotary-Club/rite/pull/19"]
---

# ps-009: Real registration and login for a small user base

## Outcome

Teachers, host families, and Rotary leaders can register and sign in against the real production
stack (`src/Rite.Api` + `src/Rite.Web`), replacing the mocked, browser-local `localStorage`
account system in `docs/js/account.js` — kept deliberately simple for RITE's small, known user
base rather than building toward internet-scale auth.

## Current Reality

Every account capability today is mocked and browser-local: `docs/js/account.js` implements
registration, sign-in, profile, claim, and memories entirely against `window.localStorage`,
documented as explicitly out of scope for both ps-006 (API) and ps-007 (React site) — neither
"covers accounts/login/claims, which both explicitly excluded from scope" (ps-004's Dependencies
and Decisions). `src/Rite.Api` currently serves only read-only, bilingual content endpoints
(timeline, stories, alumni, resources, FAQ, impact, program-cycle, schools) seeded from
`docs/content/*.json`; it has no user/account data model, no auth, and no write endpoints at all.

## Scope and Independence

**In scope:** a minimal real account model in `src/Rite.Api` (register, sign in, sign out,
view/edit own profile) and the matching `src/Rite.Web` UI, sized for a small, known community —
simple credential-based or magic-link auth is enough; no SSO, no third-party identity provider, no
admin console beyond what's needed to ship this safely.

**Out of scope:** the claim-an-alumni-profile workflow and memories/photo submissions currently
mocked in `docs/js/account.js` (separate, larger outcomes that can follow once real accounts
exist); migrating `docs/`'s existing mocked data into the real system; deploying this to the VM
(see ps-008, independent of this PS).

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
RITE has a real, working registration/login system on the real stack — complete on its own, even
if claims and memories stay mocked a while longer.

## Future Health

Should leave the door open for claims and memories to move onto real accounts later without a
rework of the auth/account model itself. Avoid speculative scale (rate limiting, multi-tenant
auth, SSO) the program's actual size doesn't justify — right-sized for "a small number of users,"
per the developer's own framing, not a general-purpose identity platform.

## Dependencies and Decisions

Builds on the delivered ps-006 (API) and ps-007 (React site); both are complete. Independent of
ps-008 (VM deployment) — this is an application capability, not a hosting concern, and can be
built and merged before or after the VM deployment lands. Open question for whoever picks this up:
credential storage/hashing approach and session mechanism, sized to the "keep it very simple"
instruction.

## Completion Expectations

A person can register, sign in, sign out, and view/edit their own profile against the real API,
with real persisted accounts (not mocked `localStorage`). Recognized complete once that flow works
end to end on the real stack and is reviewed.
