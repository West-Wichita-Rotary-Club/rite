# Analyze Report — 0004-research-content-integration

Product Owner TL;DR: The spec and task list are internally sound — every Acceptance Criterion traces to a task and vice versa — but two spec-vs-wording nits are worth tightening, and two system docs (`creative-brief.md`'s navigation resolution and the translation-review policy in `creative-brief.md`/`privacy-and-governance.md`) haven't caught up with decisions this feature just made. None of these block `bold.build`; they're worth a conscious call (fix, update the system doc, or waive) rather than silent drift.

_Collector note: `collect-triage-context.sh` returned an empty `backbone_principles` list for this run. Backbone consistency below was checked directly against `bold-docs/backbone.md` instead._

## Duplication

1. **D1 — Near-duplicate top-nav Acceptance Criteria — resolved**: split into a structural AC (exactly three destinations, History included via sub-nav) and a separate tone AC (default recruiting experience leads with participation/funding), 2026-07-21. [spec.md:66](../spec.md) ("History no longer appears in the top navigation; it is reachable within About, and the default recruiting experience leads with active-community, participation, and support/funding messaging") and [spec.md:67](../spec.md) ("The top navigation carries exactly three primary destinations (the ratified big 3) plus header utilities...") overlap: if there are exactly three destinations and History isn't one of them, History's absence from top nav is already implied by AC67. AC66's History-specific clause is the lower-quality phrasing (it restates a consequence AC67 already guarantees). Recommend consolidating: keep AC67 as the structural criterion, and trim AC66 down to just its non-duplicated content — the default-recruiting-tone claim ("the default recruiting experience leads with active-community, participation, and support/funding messaging") — which isn't covered elsewhere.

## Ambiguity (wording only)

1. **A1 — "documented well enough." — resolved**: replaced with a concrete `productionMapping`-note requirement, 2026-07-21. [spec.md:58](../spec.md): "Content schemas carry claim-status/verification metadata, **documented well enough** to map to the future API/SQLite model." No measurable bar for "well enough" — a reviewer can't objectively pass/fail this. Recommend replacing with a concrete deliverable, e.g. "documented with a `productionMapping` note per schema, following the pattern in `docs/content/resources.schema.json`" (the pattern this repo already uses).
2. **A2 — "private data" undefined. — resolved**: AC now cites `privacy-and-governance.md`'s specific withheld-field list, 2026-07-21. [spec.md:61](../spec.md): "No photos or private data from the research Drive appear..." "Private data" isn't defined in this spec. `bold-docs/system/privacy-and-governance.md` ("Alumni Profile Content") already enumerates the specific categories this repo treats as sensitive (contact details, addresses, dates of birth, emergency contacts, allergies). Recommend citing that list directly so the criterion is checkable against a fixed set rather than a general adjective.

## Underspecification

1. **U1 — Intent thrust 3 still hedges on a decision the spec has since made. — resolved**: "candidates" replaced with the firm four-collection list, 2026-07-21. [spec.md:28](../spec.md) reads "add whatever new static content collections the revision needs (**candidates**: FAQ, timeline/history, impact records, program-cycle/annual-map data)" — written as an open menu. Open Question 4's resolution and Tasks T002–T005 have since committed firmly to exactly these four collections (no more, no less). The Intent text is now stale relative to its own spec — recommend changing "candidates" to a firm list so a reader of Intent alone doesn't think this is still undecided.

## Coverage gaps

1. **C1 — Toolkit-resource Acceptance Criterion doesn't trace to Intent. — resolved**: added the toolkit-placement sentence to Intent thrust 4, 2026-07-21. [spec.md:59](../spec.md) (curriculum/toolkit content seeded as `resource` records under Community, no standalone Teaching Toolkit page) has no antecedent in the "Intent" section's six thrusts — it was added directly to Acceptance Criteria and Open Question 4 during clarification but Intent thrust 3 ("Content-model extension") and thrust 4 ("Recruiting-experience gaps") were never updated to mention the curriculum/toolkit placement decision. Every other AC traces back to an Intent thrust; this one doesn't. Recommend adding one sentence to thrust 3 or 4 naming the decision, so Intent stays the single narrative source ACs derive from.
2. **C2 — T031 (README update) doesn't trace to an Acceptance Criterion.** Same pattern as 0003's equivalent task (`T014` there was also AC-less) — low severity, consistent precedent, not new scope. Noting it for completeness rather than as an action item, since the prior feature already established this as acceptable housekeeping.

No zero-coverage findings in the AC → Task direction: all 21 Acceptance Criteria (including the toolkit one added this session) trace to at least one of T001–T032.

## Backbone consistency

No conflicts found. Principle 3 (privacy review gates publication) is explicitly acknowledged in the spec's "Editorial governance" section. Principle 6 (prototype is evidence, not final source) is respected — the spec treats the research package as new source material, not a prototype override. Principle 2's scope items (history timeline, story archive, alumni directory, resource sharing) all remain present; the IA change relocates History within the nav, it doesn't remove it from scope.

## System consistency

1. **S1 — Navigation model conflicts with `creative-brief.md` §14's ratified resolution (2026-07-19). — resolved**: `creative-brief.md` §14 and its Alignment Resolution Log entry updated via T033, 2026-07-21, to describe the shipped big-3 nav as current while preserving the 2026-07-19 resolution as historical record. That resolution states plainly: "the three-audience front-door model... stays primary. This brief's topic-based page list... is content organized *within* that structure and the existing topic nav (History/Stories/Schools & Clubs/Resources), **not a replacement top-level nav**." This feature's Decision (2026-07-21, [spec.md:78](../spec.md)) and AC ([spec.md:67](../spec.md)) replace that exact topic nav with a different three-destination model (About RITE / Participate / Community) and pull History out of top-level nav entirely. This doesn't touch the audience front-door (the recruit/alumni/active cards on Home stay put per AC65), so it isn't the literal "parallel nav" §14 warned against — but it does restructure the very topic-nav labels §14 says should stay as-is, via a newer, more specific product-owner decision that hasn't been reflected back into `creative-brief.md`. Recommend either updating creative-brief.md §14's resolution note once this ships (ship-harvest is the natural place) or recording an explicit waiver referencing this feature.
2. **S2 — Unreviewed Spanish ships against `creative-brief.md` §18 / `privacy-and-governance.md`'s translation policy. — resolved**: both docs updated via T033, 2026-07-21, with a static-preview carve-out note reconciling the production-publication rule against the preview's flagged-unreviewed model drafts. Both system docs say translations "must" (or "should") be reviewed by a fluent human before publication. This feature (matching 0003's precedent) ships model-drafted Spanish flagged as unreviewed. Likely an accepted static-preview exception (the preview isn't "production publication" in the sense those docs mean), but it's a real wording conflict that hasn't been formally reconciled or waived in either system doc — worth a one-line waiver note rather than silent divergence, especially now that a second feature has repeated the pattern.
3. **S3 — `product.md`'s Historical Anchors omit the District 5690→5680 detail this feature commits to shipping. — resolved**: `product.md`'s Historical Anchors rewritten via T033, 2026-07-21, to match `docs/content/timeline.json`'s level of detail. [product.md:32](../../../system/product.md) states "1996: Ralph and Armida Hight initiate the exchange in Rotary District 5680" with no mention of District 5690 or a merger/renumbering. This feature's thrust 2 and Task T009 ship a "District 5690→5680 explanation" as verified fact. Not a contradiction (product.md is just less detailed), but product.md should be updated once this ships so the two documents state the same history at the same level of detail — flagging for ship-harvest rather than as a blocker.

## Summary

| Category | Count |
|---|---|
| Duplication | 1 |
| Ambiguity | 2 |
| Underspecification | 1 |
| Coverage gaps | 2 (1 actionable, 1 precedent-accepted) |
| Backbone conflicts | 0 |
| System conflicts | 3 |

Nothing here blocks `bold.build`. D1, A1, A2, and U1 are cheap spec edits if you want to tighten before building. S1 and S2 are the two worth a deliberate decision (fix the system doc now vs. defer to ship-harvest vs. waive) since they're the second time a feature has diverged from what those docs currently say.
