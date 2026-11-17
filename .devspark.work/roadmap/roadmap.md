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
  from `main`. As of ps-007, it's rescoped to the still-mocked account/login/claim flow only,
  with a banner pointing everything else to the production stack once that's deployed
  (`.knowledge/governance/constitution.md`, "Additional Constraints"; `docs/README.md`).
- **Frontend structure**: the static preview's client code was split from a single
  2,582-line `docs/app.js` into six responsibility-scoped ES modules under `docs/js/`
  (commit `2a8fab1`), documented in `.knowledge/architecture/site-frontend.md`.
- **Content model**: bilingual `docs/content/*.json` (English/Spanish), with matched `en`/`es`
  key counts confirmed clean across every content file in the 2026-11-15 site audit
  (`.devspark.work/audit/2026-11-15_results.md`).
- **Built, not deployed**: the production architecture — ASP.NET Core MVC/Web API + SQLite
  (`src/Rite.Api`, ps-006) and a standalone React site (`src/Rite.Web`, ps-007), per constitution
  Principle IX — is real and tested, but live nowhere yet. Hosting is an existing VM per
  Principle X (amended 2026-11-16, v1.2.0; see Decisions): the API at `rite.makeboldspark.com`,
  the React site at `rite-app.makeboldspark.com`, media stored VM-local unless a dedicated
  object-storage need is identified later.
- **Known gaps**: a single contributor accounts for 100% of commit history — bus factor 1
  (`.devspark.work/audit/commit-audit-2026-11-15.md`), tracked as an accepted risk (see
  Decisions). Test coverage and a CI gate were the other known gap (Principle XI, `adopting`)
  until ps-005 delivered them 2026-11-16. ps-006 and ps-007 delivered a deployable API and React
  site, but neither is deployed anywhere — the target is an existing Windows VM, with the API
  reachable at `rite.makeboldspark.com`, its SQLite database at `C:\websites\rite\`, and the
  React site at `rite-app.makeboldspark.com` (see Decisions), not the Azure Web App/Linux path
  ps-006 was originally written against.

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
   - [ps-006: Stand up the ASP.NET Core Web API and SQLite database](specs/complete/ps-006-platform-api.md)
     (delivered 2026-11-16; deployment to the existing VM at `rite.makeboldspark.com` is a
     tracked follow-up, see Decisions)
   - [ps-007: Stand up the standalone React site on the new API](specs/complete/ps-007-platform-react-site.md)
     (delivered 2026-11-17; deployment to the existing VM at `rite-app.makeboldspark.com` is a
     tracked follow-up, see Decisions)
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
- **2026-11-16** — ps-006 closed out as `complete` even though its own Completion Expectations
  named live Azure deployment as the bar: the API, database, and tests are real and merged, but no
  Azure Web App has been provisioned and the deploy workflow has never been run. Developer-approved
  at closeout: track actual deployment as an open follow-up here rather than reopening ps-006 or
  blocking ps-007 on it.
- **2026-11-16** — Deployment target changed from Azure (constitution Principle X) to an existing
  VM: the API ships to that VM, reachable at `rite.makeboldspark.com`. Developer-stated direction.
  ps-006's and ps-007's Azure-specific text (deploy workflow, Completion Expectations) is now
  superseded by this decision; ps-007 updated to match. The React site's own hostname on that VM
  is still undecided — part of ps-007's own scope. Constitution Principle X amended to match the
  same day (CAP-2026-002, v1.1.0 → v1.2.0, `.archive/2026-11-16/governance/CAP-2026-002.md`):
  retitled "X. Hosting Direction," no longer names Azure.
- **2026-11-16** — The VM is a Windows host: the SQLite database will live at `C:\websites\rite\`
  on it. Developer-stated direction. This supersedes ps-006's own assumption (its PR #10
  description reasoned about the Linux/Azure App Service default content-root-relative path,
  `{ContentRootPath}/rite.db`) — whichever PS first actually deploys the API must point it at
  `C:\websites\rite\` instead, not the path ps-006 shipped with.
- **2026-11-17** — ps-007 closed out as `complete` on the same basis as ps-006: its Completion
  Expectations named live VM deployment as the bar, but the React site, tests, and the `docs/`
  fate decision are real and merged while actual deployment did not happen in that PR (no VM
  access from that session). Developer-approved at closeout, consistent with the ps-006
  precedent: track deployment as an open follow-up here rather than reopening ps-007.
- **2026-11-17** — ps-007 chose `rite-app.makeboldspark.com` as the React site's hostname
  (alongside the API's `rite.makeboldspark.com`), and decided `docs/`'s fate: kept live rather
  than retired or redirected, but rescoped to the one piece of functionality this PS doesn't
  replace — the still-mocked account/login/claim flow — with a banner linking everything else to
  the production site. Both recorded in PR #11 and reflected in the Current Baseline above.

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
- **2026-11-16** — [ps-006: Stand up the ASP.NET Core Web API and SQLite database](specs/complete/ps-006-platform-api.md).
  A real ASP.NET Core + EF Core/SQLite API now serves all eight content surfaces (timeline,
  stories, alumni, resources, FAQ, impact, program-cycle, schools, plus `/health`) as bilingual
  JSON, seeded from `docs/content/*.json` on every startup; 21/21 tests pass and a new `api-test`
  CI job builds and tests it on every PR. `docs/` remains the untouched, deployed site. Actual
  deployment did not happen in this PR and is an open follow-up, not a blocker on ps-007 — the
  target has since moved to an existing VM at `rite.makeboldspark.com` (see Decisions). Delivered
  via
  [West-Wichita-Rotary-Club/rite#10](https://github.com/West-Wichita-Rotary-Club/rite/pull/10).
- **2026-11-17** — [ps-007: Stand up the standalone React site on the new API](specs/complete/ps-007-platform-react-site.md).
  A real React site (`src/Rite.Web`, Vite + React Router) now serves all seven non-account
  content surfaces (history timeline, story archive, alumni directory, resources, FAQ,
  school/club profiles, impact metrics) from `src/Rite.Api` instead of static JSON fetches,
  bilingual EN/ES, reusing the West Wichita Rotary design-system tokens; 15/15 tests pass plus a
  production build. `docs/` stays live, rescoped to the still-mocked account UI with a banner to
  production. Hostname chosen: `rite-app.makeboldspark.com`. Actual VM deployment is an open
  follow-up (see Decisions), not a blocker. Delivered via
  [West-Wichita-Rotary-Club/rite#11](https://github.com/West-Wichita-Rotary-Club/rite/pull/11).
- **2026-11-16** — [ps-002: Stand up the production platform foundation](specs/complete/ps-002-platform-foundation.md)
  — dropped, oversized; never delivered. Replaced by
  [ps-006](specs/complete/ps-006-platform-api.md) and
  [ps-007](specs/complete/ps-007-platform-react-site.md).
