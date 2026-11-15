---
id: ps-003
title: School and club profile pages
status: proposed
order: 20
depends_on: []
blockers: []
delivery: []
---

# ps-003: School and club profile pages

## Outcome

Each school or club entity in the RITE network gets its own dedicated, linkable profile page —
name, place, years hosting, participants hosted, and description — reachable from the community
and directory navigation, instead of appearing only as compact cards embedded in other views.

## Current Reality

The four known entities (Pleasant Valley Middle School, Instituto Panamericano, Escuela Normal
Superior de Mendoza, Rotary Club of West Wichita) already exist as bilingual structured data in the
`schools` array exported from `docs/js/content.js`, rendered today only as inline cards within
other pages — no entity has its own route or standalone page.

## Scope and Independence

**In scope:** a profile page per school/club entity, a route to reach it, and navigation/linking
from the directory and community views to that page.

**Out of scope:** the video oral history archive and automated new-story notifications named
elsewhere under this theme — both are separate, independently shippable outcomes with their own
future specs.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
every school/club has a real, linkable profile page — a complete, self-contained feature, not a
fragment of a larger one.

## Future Health

Should reuse whatever data model and rendering pattern ps-002's platform migration establishes, if
that PS has landed first; if not, it can ship against the current static content model without
blocking on it, since the content already exists and needs no account system. Leaves room for
future per-entity content (e.g., linked stories or alumni) without requiring it now.

## Dependencies and Decisions

No delivered prerequisites — the underlying data already exists. No formal dependency on ps-002;
can deliver against either the static preview or the production platform, whichever is current at
delivery time.

## Completion Expectations

Every entity in the current `schools` content has a reachable profile page showing its existing
fields; directory and community navigation link to it. Recognized complete once that is live and
reviewed.
