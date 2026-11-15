---
id: ps-005
title: Establish test coverage and a CI gate
status: proposed
order: 10
depends_on: []
blockers: []
delivery: []
---

# ps-005: Establish test coverage and a CI gate

## Outcome

The repository has real automated test coverage and a CI gate that runs on every change, so every
subsequent roadmap item lands against a safety net instead of into a codebase with zero tests and
no build validation.

## Current Reality

Zero test files exist anywhere in the repository's history (confirmed in both the 2026-11-15 site
audit and commit audit — no commit has ever touched a test path), and no CI workflow validates
changes before merge; the only GitHub Actions workflow (`.github/workflows/pages.yml`) deploys to
GitHub Pages without running any checks. Constitution Principle XI explicitly flags testing and CI
as not yet established (`adopting`).

## Scope and Independence

**In scope:** a test suite covering the current application (the static `docs/` preview today, or
the production platform if ps-002 has landed by delivery time) and a CI workflow that runs it, plus
basic build/lint validation, on every pull request.

**Out of scope:** retroactively auditing or fixing defects the new tests happen to surface in
unrelated areas — those become their own findings or PSs, not scope creep on this one. Not a
general cleanup initiative.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
the application has real test coverage and a working CI gate — a complete, self-contained quality
outcome, independent of whether any other theme ever delivers.

## Future Health

Establishes the safety net every later PS (platform foundation, dashboards, matching, etc.)
should extend rather than re-invent. Does not create a coverage-percentage quota or a debt-approval
gate — just a real, running baseline where there is currently none.

## Dependencies and Decisions

No delivered prerequisites. Independent of ps-002: can test the current static preview now and
extend to the production platform once ps-002 delivers, or start directly against the platform if
ps-002 lands first.

## Completion Expectations

A test suite exists and passes; a CI workflow runs it (plus basic build/lint checks) on every pull
request and blocks merge on failure. Recognized complete once that gate is live and has run
successfully against at least one real pull request.
