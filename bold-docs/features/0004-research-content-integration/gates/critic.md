# Critic Report — 0004-research-content-integration

Product Owner TL;DR: One real production-risk gap — the task list expects the four new content fetches (FAQ, timeline, impact, program-cycle) to have loading/error handling by the time verification runs, but no task actually builds it, so verification (T032) would fail against its own task list as written. Everything else is lower-stakes: a couple of edge cases around old bookmarked links, the existing mock-account localStorage data, and one open question about whether "partly-verified" status needs to be visible to site visitors or just present in the data. No backbone-principle violations found.

## Risk categories evaluated

| Category | Applicable? | Finding |
|---|---|---|
| Trust boundaries / auth | No | Static preview, no auth changes in this feature |
| Secrets handling | No | No secrets involved — static JSON/JS content only |
| Data loss / continuity | Yes | R1 (note) |
| Input validation | Yes | R2 (note) |
| Error handling / resilience | Yes | **R3 (blocker)** |
| Concurrency | Yes (narrow) | Folded into R3 — four fetches can land/fail independently |
| Scale bottlenecks | No | Small static content set, no scale concern |
| Observability | No | No monitoring infra exists yet (backbone principle 11: not yet established); out of this feature's scope |
| Deployment / rollback | Yes | R4 (note) |
| Dependency supply chain | No | No new dependencies introduced |
| Backward compatibility | Yes | R5 (note) |
| Regulatory / privacy | Yes | R6 (note) |

## Findings

### R3 — Blocker: no task builds loading/error states for the four new content fetches — **resolved**: added T017a, wired as a dependency of T018 and T032, 2026-07-21.

Task T032 (final verification) requires: *"FAQ/impact/timeline/program-cycle JSON fetch with loading/error states."* But T018 ("About RITE" view, fed by all four new JSON files) only says the sections are "fed by" those files — no task in T001–T031 actually builds the loading/error-state UI for them. The existing site already has this pattern (`alumniLoadStatus`/`alumniLoadError` from 0003), so it's a known, replicable pattern — it just isn't assigned to a task. As written, T032 would fail against a task list that never built what it's checking for, and an unhandled fetch failure on the live GitHub Pages preview would leave one of only three top-level destinations (About RITE) blank or broken for real visitors.

**Recommendation:** amend T018 (and T008–T011, which populate the underlying JSON) to explicitly require loading/error states matching the `alumniLoadStatus`/`alumniLoadError` pattern for all four new fetches, or add one dedicated task before T018 that builds a shared fetch-with-status helper the four sections reuse.

### R1 — Note: mock-account localStorage compatibility across the nav/routing rewrite — **resolved**: added as an explicit T032 verification line, 2026-07-21.

0003 shipped a mock account/claim/memories system keyed to browser `localStorage`, tied to specific `state.view` names (`register`, `login`, `account`) and claim/memory data shapes. T021's routing rewrite (`state.view`, `render()`) touches the same state machine that the account system reads. Nothing in T016–T021 explicitly requires preserving the existing `localStorage` keys/shape or verifying that a returning demo user with an existing mock account still resolves correctly after the nav restructure — T032's verification list checks "existing three-audience/mock-registration/static-only behavior... still functions" but doesn't call out localStorage compatibility specifically as its own check.

**Recommendation:** add localStorage/mock-account compatibility (existing keys, existing claim/memory shape, no silent data loss for a returning demo user) as an explicit line in T032's verification pass — cheap to add, and it's the one piece of "user data" this static preview actually persists.

### R2 — Note: new user-input surfaces need the existing escaping discipline — **resolved**: added an explicit `escapeHtml()` requirement to T019, 2026-07-21.

The "Support RITE" contact/interest form (T019) and any host/volunteer interest forms are new places where a visitor's typed input could be echoed back (e.g. a mock confirmation message). The existing code already runs visible content through an `escapeHtml()` helper — nothing in T019 explicitly says the new forms must follow the same discipline, and it would be easy to miss on a fresh render function. Low severity (client-only static demo, no server, no stored/shared data beyond one browser's `localStorage`) but the fix is a one-line reminder, not a design change.

**Recommendation:** note in T019 (or T028/T029) that any echoed form input must use the existing `escapeHtml()` pattern, consistent with the rest of `docs/app.js`.

### R4 — Note: no staged rollout for the largest nav change since 0001

This feature replaces the top-level nav wholesale (`history`/`stories`/`schools`/`resources` → About RITE/Participate/Community) and deploys straight to the live GitHub Pages preview via `.github/workflows/pages.yml` — there's no staging slot or feature flag. If something breaks post-merge, the fix is a git revert + redeploy, not a flip of a switch. Acceptable for a low-traffic club POC, but worth naming given this is the largest structural change to ship since the original prototype.

**Recommendation:** none required to build — just make sure T032's local verification is thorough before merge, since it's the only safety net.

### R5 — Note: old top-level deep links may 404/dead-end silently

`docs/` uses hash-based routing (confirmed for alumni profile pages per `bold-docs/system/prototype.md`). If any visitor has bookmarked or shared a link resolving to the old top-level `history`/`schools`/`resources` nav state, the restructure could leave that link pointing at a view that no longer exists at the top level, with no redirect to its new nested location under About RITE or Community. Low stakes (small, low-traffic preview audience) but silent dead links are an easy miss.

**Recommendation:** optional — if cheap, have the router treat old top-level view names as aliases that resolve to their new nested location rather than a blank/broken state. Not required to build; a note for T021's implementer to consider.

### R6 — Note: "visibly" in Open Question 1's resolution is ambiguous between data and UI

Open Question 1's resolution says the two partly-verified Argentina profiles "carry their claim status visibly in the content metadata." That phrase could mean (a) the `claimStatus` field is simply present and non-empty in the JSON (an internal data-completeness bar, satisfied by T001/T012), or (b) site visitors should see a visible "partially verified" indicator on those two profiles in the rendered UI (a product decision no current task builds). This is a genuine ambiguity in what was ratified, not a wording nit — the two readings produce different amounts of work and different visitor-facing behavior.

**Recommendation:** product owner should confirm which reading was intended before T012/T018 render partly-verified profiles; if (b), it needs its own small UI task (badge/label + copy, EN/ES).

## Backbone principle compliance

No `enforced` principle is violated. Principle 3 (privacy review gates publication) is explicitly honored via T006's sign-off gate blocking T012–T014. Principle 4 (bilingual first-class) is satisfied at the level backbone.md actually states it (content exists in both languages) — the stricter "human-reviewed before publication" language lives in `creative-brief.md`/`privacy-and-governance.md`, not `backbone.md`, and that tension is already tracked as analyze finding S2 rather than duplicated here.

## Cross-reference to analyze

Findings S1–S3 in `gates/analyze.md` (system-doc currency) are analyze's lane, not repeated here. R6 above is a distinct ambiguity in this feature's own ratified answer, not a system-doc conflict.

## Summary

| Severity | Count |
|---|---|
| Blocker | 1 (R3) |
| Note | 5 (R1, R2, R4, R5, R6) |

R3 needs a decision (fix the task list, or waive with justification) before `bold.build` executes — everything else can proceed with acknowledgement.
