# Critic — 0003-three-audience-experience

Product Owner TL;DR: The biggest real risk is that nothing in the task list actually gates resource content behind editorial review before it's published — the spec's language says "reviewed," but no task enacts that review, which is a backbone-principle violation and the one blocker here. Everything else is a note: regression risk to the five existing sections during the JSON/routing refactor, no rollback plan for a change that resets the public site's first impression, missing loading/error states for the two new JSON fetches, and no observability on the mocked recruiting funnel.

## Findings

### C1 — [BLOCKER] No task gates resource content behind privacy/editorial review before publication
**Category**: Regulatory / privacy (backbone principle 3, `enforced`)
**Traces to**: Scope ("reviewed public-safe practical resources"), Acceptance Criteria ("nothing private or unreviewed appears"), T002.
Backbone principle 3 requires editor/administrator review before publication — `status: enforced`, which makes any violation automatically a blocker per this gate's severity rule. The spec asserts resource content will be "reviewed," but no task operationalizes that review. Compare to 0002, which had an explicit task ("Promote approved public-safe... content to static JSON after WhatsApp approval") gating publication on a real product-owner sign-off. 0003's T002 just says "extract resource content... with `audiences` tags" — nothing stops unreviewed content from landing in `resources.json`. As written, "reviewed" is a label in prose, not an enforced step.
**Fix**: Add a task before/alongside T002 that names the actual review step (e.g., product-owner or editor sign-off on the resource list) before it's committed to `docs/content/resources.json`, mirroring 0002's approval pattern.
**Status**: resolved — T002a now requires explicit product-owner sign-off on a candidate resource list before T002 may extract anything into `resources.json`; a matching Acceptance Criterion was added; the sign-off artifact is tracked in Affected Files per `FORMAT.md`'s ratification contract.

### C2 — [NOTE] Refactor risks regressing the five existing sections and their view routing
**Category**: Backward compatibility
**Traces to**: T005 (JSON migration), T006–T007 (hero/home restructure), existing `state.view`/`state.storyFilter`/`state.selectedStoryId`/`state.selectedAlumniId` routing in `docs/app.js`.
Moving stories/resources to JSON and changing the default home view touches the same view-state machinery that drives History, Stories, Directory, Schools, and Resources today. T015 verifies the *new* audience routes and directory privacy but doesn't explicitly call for confirming every pre-existing section and deep-link/filter state still works after the refactor. Nothing here threatens data loss or an actual outage — this is a public static preview with a straightforward revert path — so it stays a note, not a blocker, but it's worth closing before calling T015 done.
**Fix**: Fold an explicit "verify all pre-existing nav sections, filters, and story/profile deep links still work" check into T015.
**Status**: resolved — T015 now explicitly lists every pre-existing section and its view-state fields to re-verify post-refactor.

### C3 — [NOTE] No rollback/staging step for a change to the public site's default landing experience
**Category**: Deployment / rollback
**Traces to**: `docs/README.md` (GitHub Pages deploys `docs/` on merge to `main`), backbone principle 11 ("Testing and CI are not yet established" — `status: adopting`, not enforced).
This feature changes what an anonymous visitor sees first on a site that's already live and has been reviewed by stakeholders (0001, 0002). There's no CI/test gate (principle 11 is `adopting`, so this isn't itself a blocker) and no feature flag or staged rollout — the only safety net is manual local verification (T015) plus normal PR review before merge.
**Fix**: No spec change required; recommend treating the PR review before merge as the de facto rollback gate, and confirming T015's local verification happens on the actual `docs/` static-server setup, not just a code read-through.
**Status**: acknowledged, no fix required — recorded under spec.md's "Accepted Notes (critic gate)".

### C4 — [NOTE] New JSON fetches need the same loading/error handling as the existing alumni fetch
**Category**: Error handling / resilience
**Traces to**: T005 ("Load stories and resources from the JSON content documents"), existing `alumniLoadStatus`/`alumniLoadError` pattern from 0002.
The alumni directory already has a defined loading/error state and bilingual error copy for its JSON fetch. T005 doesn't call out adding the equivalent for `stories.json`/`resources.json`. Without it, a fetch failure (e.g., serving `docs/` incorrectly, or a future CDN hiccup) leaves the new audience-curated views silently blank with no explanation, which undercuts the recruiting-first home experience specifically.
**Fix**: Fold explicit loading/error states (matching the alumni pattern, bilingual) into T005.
**Status**: resolved — T005 now explicitly requires loading/error states for both new fetches, matching the existing bilingual `alumniLoadStatus`/`alumniLoadError` pattern.

### C5 — [NOTE] Mocked recruiting funnel has no observability
**Category**: Observability
**Traces to**: T007 (audience entry cards), T008 (recruiting landing), T011 (recruit-first register), existing localStorage-only submission model.
If this preview is used with stakeholders to validate the "education-first" hypothesis, there's currently no way to see which audience card gets clicked, how far into the recruiting flow visitors get, or where they drop off — submissions vanish into `localStorage` with no export or event hook. This is appropriate scope for a static, mocked preview (`system/product.md` roadmap already defers dashboards/impact reporting to Phase 3), so no task should be added now — flagging only so this isn't mistaken for tracked/instrumented in stakeholder reviews.
**Fix**: None required for this feature; documented deferral only.
**Status**: acknowledged, no fix required — recorded under spec.md's "Accepted Notes (critic gate)".

## Categories evaluated and marked inapplicable

- **Trust boundaries / auth** — no authentication or privileged operation exists anywhere in the static, mocked preview; nothing in this feature introduces one.
- **Secrets handling** — no secrets, credentials, or config values are introduced or handled.
- **Input validation** — verified directly: `docs/app.js` never renders submitted field values back into the DOM (only a static, `escapeHtml`-wrapped confirmation label at line 926); the recruit-first register flow (T011) reuses this same safe, already-mocked pattern, so no new injection vector is introduced.
- **Concurrency** — single-threaded static client with isolated `localStorage` writes; no concurrent execution path exists.
- **Scale bottlenecks** — small, hand-authored static JSON content sets; no server-side access pattern.
- **Dependency supply chain** — Scope explicitly forbids new external dependencies, APIs, or third-party calls; nothing here changes that.

## Disposition

All findings resolved or acknowledged as of the spec revision below:

- **C1 (blocker)**: resolved via new task T002a (review-gate) and a matching Acceptance Criterion.
- **C2, C4 (notes)**: resolved by folding the missing checks directly into T015 and T005.
- **C3, C5 (notes)**: acknowledged, no fix required; recorded in `spec.md` under "Accepted Notes (critic gate)".

Gate clear. No blockers remain against the current spec revision.
