---
id: ps-007
title: Stand up the standalone React site on the new API
status: proposed
order: 20
depends_on: [ps-006]
blockers: []
delivery: []
---

# ps-007: Stand up the standalone React site on the new API

## Outcome

A standalone React site exists, deployed to Azure, consuming ps-006's API for every non-account
content surface (history timeline, story archive, alumni directory, resources, FAQ, school/club
profiles, impact metrics), becoming the real production target per constitution Principle IX.
The static `docs/` preview's fate — retired, redirected, or kept as a fallback — is decided and
implemented explicitly as part of this PS, rather than left implicit.

## Current Reality

Once ps-006 ships, a live, reachable API and database exist, but nothing in production consumes
them: the static `docs/` site remains the only deployed UI, built from six ES modules under
`docs/js/` with its own content model and design-system tokens
(`.knowledge/architecture/site-frontend.md`).

## Scope and Independence

**In scope:** a React project scaffold; routing and pages for the seven content surfaces above,
calling ps-006's API; bilingual (English/Spanish) UI reusing or adapting `docs/`'s existing
content model and West Wichita Rotary design-system tokens (constitution Principle VII);
deployment to Azure; an explicit decision and implementation for `docs/`'s status once this ships.

**Out of scope:** accounts, login, claims, and memory/profile submission UI — still mocked and
static for now, matching the account-system exclusion already recorded for this theme; that
migration is its own later, independently shippable PS.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
the production site is real — backend and frontend — for every non-account surface, with `docs/`'s
fate resolved. That is a complete, coherent, releasable state, not a fragment.

## Future Health

Should reuse ps-006's API and data shape without modification; leaves account/auth migration
(OpenID Connect, per Principle IX) for a dedicated future PS rather than building it prematurely.

## Dependencies and Decisions

Depends on ps-006 (the API and database must be delivered first). Decomposed from the original,
oversized ps-002 on 2026-11-16 (see roadmap Decisions).

## Completion Expectations

The React site is deployed to Azure and reachable, serving every non-account content surface from
ps-006's real API instead of static JSON fetches; `docs/`'s fate is decided and implemented.
Recognized complete once that deployment is live and reviewed, with at least one delivery
reference recorded.
