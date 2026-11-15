---
id: ps-002
title: Stand up the production platform foundation
status: proposed
order: 10
depends_on: []
blockers: []
delivery: []
---

# ps-002: Stand up the production platform foundation

## Outcome

A real, deployable application exists: an ASP.NET Core Web API backed by SQLite, and a standalone
React site that calls it, per constitution Principle IX. It serves the site's non-account content
surfaces — history timeline, story archive, alumni directory, resources, FAQ, school/club
profiles, and impact metrics — for real, replacing the fully static, mocked `docs/` preview as the
production target (constitution Principle VI treats that preview as reference evidence, not final
source).

## Current Reality

No backend, database, or frontend project exists anywhere in the repository today — no `.csproj`,
`.sln`, or `package.json` is present. The entire shipped surface is the static `docs/` site: a
single-page app with no build step, its content model sourced from `docs/content/*.json`, and its
client code split across six ES modules under `docs/js/` (`.knowledge/architecture/site-frontend.md`).
No Azure resource exists yet either (constitution Principle X, `adopting`).

## Scope and Independence

**In scope:** ASP.NET Core Web API project with a SQLite database seeded from the existing
`docs/content/*.json` bilingual content; a standalone React site consuming that API for the
content surfaces named above; a deployment target (Azure, per Principle X).

**Out of scope:** migrating the mocked `localStorage`-backed registration/login/profile/claim
system to real accounts and OpenID Connect auth — that is a distinct, independently shippable
outcome and belongs to its own later PS, not this one.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
a real production application exists and is releasable on its own — read-only bilingual content,
served by a real API and database, with no account system yet. That is a complete, coherent state,
not a fragment.

## Future Health

Establishes the API and data-model shape that every later platform PS (accounts, dashboards,
school pages, matching) builds on, so schema and endpoint design here should anticipate those
without building them prematurely. Leaves the static `docs/` preview in place and untouched as
reference evidence (Principle VI) until a later PS explicitly retires it.

## Dependencies and Decisions

No delivered prerequisites. Depends on constitution Principles IX (architecture) and X (Azure
hosting, adopting) as already-ratified direction, not open decisions.

## Completion Expectations

The API and React site are deployed and reachable; every non-account content surface currently in
`docs/` (history, stories, directory, resources, FAQ, schools, impact) is served from the real
backend instead of static JSON fetches. Recognized complete once that deployment is live and
reviewed, with at least one delivery reference recorded.
