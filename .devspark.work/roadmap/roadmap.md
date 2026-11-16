# Roadmap: RITE Community Archive and Storytelling Platform

## Direction

RITE builds awareness of an active teacher exchange, connects the people who make it possible,
and helps them learn from one another. It serves teachers, host families, Rotary leaders,
coordinators, and school administrators (`.knowledge/governance/constitution.md` Principle V),
with anonymous visitors able to read approved public content. The mission statement above is
the product owner's ratified 2026-11-15 direction (awareness-first, replacing the prior "living
archive" framing) — see Themes, Mission & Identity Alignment.

## Current Baseline

- **Shipped**: a fully static, mocked public preview lives in `docs/`, served via GitHub Pages
  from `main`. No backend, database, or Azure service exists yet
  (`.knowledge/governance/constitution.md`, "Additional Constraints"; `docs/README.md`).
- **Frontend structure**: the static preview's client code was split from a single
  2,582-line `docs/app.js` into six responsibility-scoped ES modules under `docs/js/`
  (commit `2a8fab1`), documented in `.knowledge/architecture/site-frontend.md`.
- **Content model**: bilingual `docs/content/*.json` (English/Spanish), with matched `en`/`es`
  key counts confirmed clean across every content file in the 2026-11-15 site audit
  (`.devspark.work/audit/2026-11-15_results.md`).
- **Planned, not started**: the production architecture is ASP.NET Core MVC/Web API + SQLite +
  a standalone React site (constitution Principle IX), with Azure hosting and Blob Storage for
  media (Principle X, `adopting`). No package manager or dependency manifest exists in the
  repository yet.
- **Known gaps**: a single contributor accounts for 100% of commit history — bus factor 1
  (`.devspark.work/audit/commit-audit-2026-11-15.md`), tracked as an accepted risk (see
  Decisions). Test coverage and a CI gate were the other known gap (Principle XI, `adopting`)
  until ps-005 delivered them 2026-11-16.

## Themes

1. **Mission & Identity Alignment** — apply the ratified mission statement to the constitution
   itself (Principles I and II), and close the remaining open items from that review: Spanish
   translations of any newly ratified copy, and the stakeholder one-pager that review deferred
   to a follow-up implementation feature.
   - [ps-001: Apply ratified mission statement to the constitution](specs/complete/ps-001-amend-constitution-mission.md)
2. **Production Platform Foundation** — stand up the real ASP.NET Core + SQLite + React stack
   (constitution Principle IX); migrate the `docs/` content model and the mocked
   localStorage-backed registration/login/profiles into it for real.
   - ~~[ps-002: Stand up the production platform foundation](specs/complete/ps-002-platform-foundation.md)~~
     — dropped 2026-11-16, oversized; decomposed into ps-006 and ps-007 below.
   - [ps-006: Stand up the ASP.NET Core Web API and SQLite database](specs/ps-006-platform-api.md)
   - [ps-007: Stand up the standalone React site on the new API](specs/ps-007-platform-react-site.md)
     (depends on ps-006)
3. **Content & Community Depth** — video oral history archive, school-specific pages, automated
   notifications for new community stories.
   - [ps-003: School and club profile pages](specs/ps-003-school-club-pages.md)
4. **Engagement & Insight** — automated host-family matching, participant dashboards,
   interactive impact reporting maps.
   - [ps-004: Participant dashboards](specs/ps-004-participant-dashboards.md)
5. **Quality & Sustainability** — establish real test coverage and a CI gate (delivered by
   ps-005); address the bus-factor-of-1 risk named in the 2026-11-15 commit audit (still open).
   - [ps-005: Establish test coverage and a CI gate](specs/complete/ps-005-test-coverage-ci.md)

`ps-001` through `ps-007` are the Prospective Specs recorded so far (ps-002 dropped and replaced by
ps-006/ps-007; see Decisions) — each a right-sized increment under its theme; the remaining
bundled outcomes named in Themes 3 and 4 above are intentionally deferred to later specs under
those same themes. Add another with `/devspark-roadmap add a Prospective Spec for <outcome>`.

## Decisions

- **2026-11-15** — Roadmap established with the Direction and five Themes above, as proposed
  and approved by the product owner in this session. Basis: the ratified 2026-11-15 mission
  statement, the constitution's existing Phase 1–3 roadmap sketch, and the gaps surfaced by the
  same day's site audit and commit audit.
- **2026-11-15** — The bus-factor-of-1 risk named in the 2026-11-15 commit audit is tracked here
  as an accepted, known risk for this volunteer-run program, not as a Prospective Spec: it is not
  an application capability to deliver. Revisit explicitly (a documented handoff path, or a second
  active contributor) rather than leaving it implicit indefinitely.
- **2026-11-16** — ps-002 failed the right-sizing test: it bundled the API+database, the React
  UI, and deciding `docs/`'s fate into one PS. Developer-approved decomposition: ps-002 marked
  `dropped`; ps-006 (API + database) and ps-007 (React site, depends on ps-006) carry the outcome
  forward as separately shippable increments.

## Delivered

- **2026-11-16** — [ps-001: Apply ratified mission statement to the constitution](specs/complete/ps-001-amend-constitution-mission.md).
  Constitution bumped 1.0.0 → 1.1.0; Principles I and II now match the ratified mission
  statement, pending-amendment note removed. Delivered via
  [West-Wichita-Rotary-Club/rite#8](https://github.com/West-Wichita-Rotary-Club/rite/pull/8).
- **2026-11-16** — [ps-005: Establish test coverage and a CI gate](specs/complete/ps-005-test-coverage-ci.md).
  A 25-test suite now covers `docs/js` (state, i18n, content, account, router) via Node's
  built-in test runner, plus a lint script; a new GitHub Actions workflow runs both on every
  pull request and is a required status check on `main`. `render.js` and the DOM-touching
  router functions are left for a future increment. Delivered via
  [West-Wichita-Rotary-Club/rite#9](https://github.com/West-Wichita-Rotary-Club/rite/pull/9).
- **2026-11-16** — [ps-002: Stand up the production platform foundation](specs/complete/ps-002-platform-foundation.md)
  — dropped, oversized; never delivered. Replaced by
  [ps-006](specs/ps-006-platform-api.md) and [ps-007](specs/ps-007-platform-react-site.md).
