---
id: ps-017
title: Move claim and memories onto real accounts
status: complete
order: 30
depends_on: [ps-009]
blockers: []
delivery: ["https://github.com/West-Wichita-Rotary-Club/rite/pull/21"]
---

# ps-017: Move claim and memories onto real accounts

## Outcome

Once `ps-009` delivers real registration/login/profile, a signed-in participant can claim alumni
status and submit memories/photos against the real production stack too — the two pieces of
`docs/js/account.js`'s mocked model `ps-009` deliberately left out. `localStorage` stops being
the storage for claim and memory data for any account `ps-009` migrated to real.

## Current Reality

Today, claim and memories are mocked and browser-local everywhere: `docs/js/account.js` (and its
`ps-015` port into `src/Rite.Web/src/lib/account.js`/`AccountContext.jsx`) implement the claim
form (country, multi-year participation rows, matching against real alumni data from
`/api/alumni`) and the memory composer (title, text, up to 3 downscaled photos, up to 10 per
account) entirely against `window.localStorage`. `src/Rite.Api` has no claim or memory data model
or endpoints at all — `ps-009`'s own scope explicitly excludes them, calling them "separate,
larger outcomes that can follow once real accounts exist."

## Scope and Independence

**In scope:** a real claim data model and endpoint(s) in `src/Rite.Api` (country, participation
rows, matched alumni profile or self-declared name, pending-review status) and a real memory data
model and endpoint(s) (title, text, photos — storage approach, e.g. VM-local filesystem per
constitution Principle X, is an open question for whoever picks this up); the matching
`src/Rite.Web` UI changes to call the real API instead of `lib/account.js`'s mocked claim/memory
functions.

**Out of scope:** the editor/administrator review-and-approve workflow for submitted
claims/memories implied by constitution Principle III (see `ps-018`, which depends on this PS);
`docs/`'s own mocked copy, which is unaffected unless/until `ps-016` retires it.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
a signed-in participant has real, working claim and memory submission on the real stack —
complete on its own.

## Future Health

Reuse whatever account/auth model `ps-009` establishes rather than inventing a parallel one.
Keep photo storage pluggable (constitution Principle X already anticipates a future
object-storage need) so a later PS can change where photos live without a data-model rework.

## Dependencies and Decisions

Depends on `ps-009` (real registration/login) — there are no real accounts to attach a claim or
memory to until then. Not yet startable; becomes right-sized/ready once `ps-009` delivers.

## Completion Expectations

A signed-in participant can submit a claim (matched against real alumni data) and a memory with
photos, both persisted on the real API, not `localStorage`. Recognized complete once that flow
works end to end on the real stack and is reviewed.
