---
id: ps-004
title: Participant dashboards
status: proposed
order: 20
depends_on: []
blockers: []
delivery: []
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
submitted memories, and profile completeness, built against whichever account data source is
current at delivery time (the existing mocked `localStorage` model, or ps-002's real backend if it
has landed by then).

**Out of scope:** automated host-family matching and interactive impact reporting maps, named
elsewhere under this theme — both are separate, independently shippable outcomes.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
participants have a real, working personal dashboard — complete on its own, not dependent on
matching or impact-map work ever shipping.

## Future Health

Should be built so that swapping the mocked account data source for ps-002's real backend (once
that PS delivers accounts) requires changing only the data layer, not the dashboard's structure.
Does not block on real accounts existing first — ships against the current mock if it delivers
before the platform migration does.

## Dependencies and Decisions

No delivered prerequisites. Not formally blocked on ps-002; may ship against the mocked account
model first and migrate its data source later, or ship directly against real accounts if ps-002
lands first — an open delivery-order decision, not a hard dependency.

## Completion Expectations

A signed-in participant can view their own claim status, submitted memories, and profile from one
consolidated dashboard. Recognized complete once that view is live and reviewed.
