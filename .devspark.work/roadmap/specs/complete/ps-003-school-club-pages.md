---
id: ps-003
title: School and club profile pages
status: complete
order: 20
depends_on: []
blockers: []
delivery: ["https://github.com/West-Wichita-Rotary-Club/rite/pull/13"]
---

# ps-003: School and club profile pages

## Outcome

Each school or club entity in the RITE network gets its own dedicated, linkable profile page —
name, place, years hosting, participants hosted, and description — reachable from the community
and directory navigation, instead of appearing only as compact cards embedded in other views.

## Current Reality

The four known entities (Pleasant Valley Middle School, Instituto Panamericano, Escuela Normal
Superior de Mendoza, Rotary Club of West Wichita) exist as bilingual structured data in two
places: the original `schools` array exported from `docs/js/content.js` (static preview), and,
since ps-006/ps-007, `src/Rite.Api`'s `GET /api/schools` endpoint and `src/Rite.Web`'s `Schools`
list page (`src/Rite.Web/src/pages/Schools.jsx`) — rendered today only as cards in a list, on
both surfaces. No entity has its own route or standalone profile page on either one.

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

Should reuse `src/Rite.Web`'s existing per-entity profile pattern (`AlumniProfile.jsx`, from
ps-007) rather than inventing a new one, and read from `src/Rite.Api`'s `GET /api/schools`
rather than `docs/content/*.json` — the production platform (ps-006 + ps-007) is the real target
now, per constitution Principle IX; ps-002, which this used to wait on optionally, was dropped
and decomposed into ps-006/ps-007 on 2026-11-16 (see roadmap Decisions), and both have since
delivered. Leaves room for future per-entity content (e.g., linked stories or alumni) without
requiring it now.

## Dependencies and Decisions

No delivered prerequisites blocking this PS, but it should build on ps-006 (API) and ps-007
(React site) now that both are delivered, rather than the static `docs/` preview they're
superseding — ps-002, the PS this spec used to name as the "if it lands" alternative, was
dropped 2026-11-16 and replaced by ps-006/ps-007.

## Completion Expectations

Every entity in the current `schools` content has a reachable profile page showing its existing
fields; directory and community navigation link to it. Recognized complete once that is live and
reviewed.
