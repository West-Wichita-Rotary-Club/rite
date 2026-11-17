---
id: ps-004
title: Participant dashboards
status: complete
order: 20
depends_on: []
blockers: []
delivery: ["https://github.com/West-Wichita-Rotary-Club/rite/pull/14"]
---

# ps-004: Participant dashboards

## Outcome

A signed-in participant has a personal dashboard showing the status of their own claim, submitted
memories/photos, and profile — instead of having to navigate the general account-management views
to piece that together.

## Current Reality

`docs/js/account.js` already implements a mocked, `localStorage`-backed account system: claim
roles, claim/memory drafts, photo limits (`MAX_PHOTOS_PER_MEMORY`, `MAX_MEMORIES_PER_MEMBER`), and
CRUD helpers, rendered through generic account views in `docs/js/render.js`. No consolidated,
participant-facing dashboard view exists yet.

## Scope and Independence

**In scope:** a dashboard view summarizing one signed-in participant's own claim status,
submitted memories, and profile completeness, built against the existing mocked `localStorage`
model — the real backend ps-002 would have delivered this against was dropped 2026-11-16, and its
replacements (ps-006, ps-007, both now delivered) explicitly excluded accounts/login/claims from
their scope, so no real account backend exists yet and none is currently planned as its own PS.

**Out of scope:** automated host-family matching and interactive impact reporting maps, named
elsewhere under this theme — both are separate, independently shippable outcomes.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
participants have a real, working personal dashboard — complete on its own, not dependent on
matching or impact-map work ever shipping.

## Future Health

Should be built so that swapping the mocked account data source for a real backend — once some
future PS actually delivers one — requires changing only the data layer, not the dashboard's
structure. Does not block on real accounts existing first: ps-002 (which would have included
them) was dropped 2026-11-16, and neither of its replacements (ps-006, ps-007) took on accounts,
so this still ships against the current mock.

## Dependencies and Decisions

No delivered prerequisites. ps-002, the PS this spec used to name as the real-backend
alternative, was dropped 2026-11-16 and decomposed into ps-006 (API) and ps-007 (React site, both
now delivered) — neither covers accounts/login/claims, which both explicitly excluded from
scope. No PS for migrating accounts to a real backend exists yet, so this PS ships against the
mocked account model; migrating its data source later, once such a PS exists, is a later
decision, not a hard dependency now.

## Completion Expectations

A signed-in participant can view their own claim status, submitted memories, and profile from one
consolidated dashboard. Recognized complete once that view is live and reviewed.
