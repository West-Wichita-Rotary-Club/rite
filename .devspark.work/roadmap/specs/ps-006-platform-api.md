---
id: ps-006
title: Stand up the ASP.NET Core Web API and SQLite database
status: proposed
order: 10
depends_on: []
blockers: []
delivery: []
---

# ps-006: Stand up the ASP.NET Core Web API and SQLite database

## Outcome

A real ASP.NET Core Web API backed by SQLite exists, deployed to Azure and reachable, serving
every non-account content surface — history timeline, story archive, alumni directory, resources,
FAQ, school/club profiles, and impact metrics — as real bilingual (English/Spanish) endpoints,
with data seeded from the existing `docs/content/*.json` files. Nothing in production consumes it
yet: the static `docs/` preview remains the deployed site, untouched. This gives every later
platform PS (the React UI, accounts, dashboards, matching) a real backend and data model to build
on, per constitution Principle IX.

## Current Reality

No backend, database, or `.csproj`/`.sln` exists anywhere in the repository today
(`.knowledge/governance/constitution.md`, "Additional Constraints"). The entire shipped surface is
the static `docs/` site, its content model sourced from bilingual `docs/content/*.json`, with
matched `en`/`es` key counts confirmed clean across every content file in the 2026-11-15 site
audit. No Azure resource exists yet either (constitution Principle X, `adopting`).

## Scope and Independence

**In scope:** an ASP.NET Core Web API project; a SQLite database and migrations; a seed/import
step populating it from the existing `docs/content/*.json`; read endpoints for all seven content
surfaces above, matching their current bilingual shape; deployment to Azure (Principle X).

**Out of scope:** any consuming UI (React or otherwise) — that is ps-007, a separate,
independently shippable outcome. Accounts, login, claims, and any write endpoint beyond the
one-time seed are also out of scope, deferred to their own future PS, matching the account-system
exclusion already recorded for this theme.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
a real, deployed, reachable API and database exist as a complete technical foundation — shipped
intentionally inactive (nothing yet consumes it), stable and releasable on its own, per the
roadmap's own allowance for a complete capability to ship inactive.

## Future Health

Establishes the schema and endpoint shape every later platform PS (React UI, accounts,
dashboards, school pages, matching) builds on, so design here should anticipate those without
building them prematurely. Leaves the static `docs/` preview in place and untouched as reference
evidence (Principle VI) until ps-007 explicitly addresses its fate.

## Dependencies and Decisions

No delivered prerequisites. Depends on constitution Principles IX (architecture) and X (Azure
hosting, `adopting`) as already-ratified direction, not open decisions. Decomposed from the
original, oversized ps-002 on 2026-11-16 (see roadmap Decisions); ps-007 depends on this PS.

## Completion Expectations

The API is deployed to Azure and reachable; every endpoint for the seven content surfaces above
returns real data matching the current bilingual shape of `docs/content/*.json`. Recognized
complete once that deployment is live and reviewed, with at least one delivery reference recorded.
