---
id: ps-014
title: Interactive impact reporting maps
status: proposed
order: 30
depends_on: [ps-006, ps-007]
blockers: []
delivery: []
---

# ps-014: Interactive impact reporting maps

## Outcome

Visitors can explore RITE's impact on an interactive map (teachers hosted/sent, by country/region)
instead of only reading the existing flat stat tiles on the Impact page.

## Current Reality

`src/Rite.Api`'s `/api/impact` (seeded from `docs/content/impact.json`) serves flat metric tiles
(value, label, as-of date) with no structured geographic field — country is only implied by each
label's text (e.g., "Teachers received from Panama"), not a mappable attribute. `src/Rite.Web`'s
Impact page renders these as the existing `.stats-grid`/`.stat-card` tiles only; there is no map
component anywhere in the codebase.

## Scope and Independence

**In scope:** adding a structured location field (country, at minimum) to the impact metric model;
an interactive map view in `src/Rite.Web` plotting existing metrics by that location, alongside
(not replacing) the current stat tiles.

**Out of scope:** real-time/live-updating map data; per-school/per-city granularity beyond what
the current metrics already report at a country level.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
the Impact page has a real, working map — complete on its own.

## Future Health

Keep the location field generic enough that a later PS could add per-school markers (reusing
ps-003's school/club data) without a rework. Choose a mapping approach that doesn't require a paid
API key the program can't sustain, given its small, volunteer-run budget.

## Dependencies and Decisions

Builds on the delivered ps-006 (API) and ps-007 (React site); both complete. No dependency on
ps-009 — this is public content, not account-gated. Open question for whoever picks this up: which
mapping library/tile provider, chosen with the program's budget and privacy posture in mind.

## Completion Expectations

The Impact page shows a real, interactive map reflecting the existing impact metrics by country.
Recognized complete once that's live and reviewed.
