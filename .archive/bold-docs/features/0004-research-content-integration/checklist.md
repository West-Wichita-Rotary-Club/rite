# Requirements Checklist — 0004-research-content-integration

Product Owner TL;DR: This checklist tests whether `spec.md`'s requirements are complete, clear, consistent, measurable, and cover the right edge cases — it does not test whether the build works. Run with `--verify` once the spec is stable to see what's actually addressed.

## Completeness

- **CHK001** — Does an Acceptance Criterion require loading/error states for the four new content fetches (FAQ, timeline, impact, program-cycle), matching the pattern already established for stories/resources? `[Gap]` — only the Tasks section's final verification item (T032) mentions this; no Acceptance Criterion requires it.
- **CHK002** — Does the spec state what happens to the existing `localStorage` mock-account/claim/memories data after the navigation/routing rewrite (same keys and shape preserved, or an explicit migration note)? `[Gap]` — Acceptance Criteria line 65 only says the mock member simulation must be "preserved and still function," without naming the persistence contract that makes that testable.
- **CHK003** — Does the spec require the same input-escaping discipline (`escapeHtml`) for the new Support RITE / host / volunteer interest forms that the rest of `docs/app.js` already follows? `[Gap]` — not mentioned anywhere in Acceptance Criteria or the Editorial governance section.
- **CHK004** — Does the spec define what happens after a visitor submits the "Support RITE" interest form (confirmation state, mocked storage, error state), comparable to the existing register/claim mock patterns? `[Gap]` — Acceptance Criteria line 68 specifies the form's constraints (no donate mechanism, no tax language) but not its post-submit behavior.
- **CHK005** — Does the spec define accessibility requirements (ARIA, keyboard operation, focus states, touch-target sizing) for the three genuinely new UI patterns this feature introduces — the mobile nav, the FAQ accordion, and the impact stat-tile dashboard? `[Gap]` — Acceptance Criteria line 73 requires following the design system generally, but none of the three new patterns exist in that system yet, so "follow the design system" doesn't resolve this for them specifically.

## Clarity

- **CHK006** — Is "documented well enough to map to the future API/SQLite model" (Acceptance Criteria line 58) quantified with a specific deliverable (e.g. a `productionMapping` note per schema, per existing convention), or does it rely on a subjective reviewer judgment of "well enough"? Cites spec.md:58.
- **CHK007** — Is "private data" (Acceptance Criteria line 61) defined against a specific field list, or left as an undefined general term a builder has to interpret? Cites spec.md:61. (`bold-docs/system/privacy-and-governance.md`'s "Alumni Profile Content" section already enumerates a candidate list.)
- **CHK008** — Does Open Question 1's resolution ("carry their claim status visibly in the content metadata," spec.md:82) specify whether "visibly" means present-in-data or rendered-in-UI for the two partly-verified Argentina profiles? Cites spec.md:82. As written, it supports either reading.
- **CHK009** — Is "genuinely mobile-first" (Intent, spec.md:22) given a measurable definition beyond the qualitative goal? Cites spec.md:22, spec.md:72 — Acceptance Criteria line 72 ("no overflow, no unusable menus" at phone widths) does operationalize this reasonably well; flagged here only to confirm the two sections are meant to be read together.

## Consistency

- **CHK010** — Do Acceptance Criteria lines 66 and 67 (both describing the top-navigation restructure — History's removal, and "exactly three primary destinations") state one requirement or two overlapping ones? Cites spec.md:66-67. If History is guaranteed absent from top nav by the exactly-three-destinations rule, line 66's nav-specific clause is redundant with line 67 and only its tone-related clause ("default recruiting experience leads with...") is non-duplicated.
- **CHK011** — Does Intent thrust 3 (spec.md:28, "candidates: FAQ, timeline/history, impact records, program-cycle/annual-map data") agree with the Open Questions/Tasks sections, which commit firmly to exactly those four collections? Cites spec.md:28 vs. spec.md:85, T002-T005. Thrust 3's "candidates" wording still reads as an open menu after the decision was made.
- **CHK012** — Does the Editorial governance section's per-name sign-off requirement (spec.md:45) read consistently with Open Question 1's blanket-approval framing (spec.md:82), or could a reader take the blanket approval as skipping per-record sign-off? Cites spec.md:45, spec.md:82 — line 82 does explicitly restate that each name still gets its own sign-off line, so this resolves cleanly; included to confirm the cross-reference holds.

## Measurability

- **CHK013** — Can "no contradictions between old and new content remain visible" (Acceptance Criteria line 63) be objectively checked, or does it depend on an unstructured reviewer judgment call? Cites spec.md:63, T007/T015 — the audit log artifact these tasks produce gives it a concrete checkable output; included to confirm the AC and the task-level mechanism are meant to satisfy each other.
- **CHK014** — Is the "current-year figure" claim for the 2026 cohort (Acceptance Criteria line 56, Open Question 6) bounded to a review/update trigger, or does the requirement go stale the moment a future year's data exists? `[Gap]` — the spec doesn't state an annual-rollover expectation, even though the source package's own `implementation_recommendations.content_model` recommends one.
- **CHK015** — Is "exactly three primary destinations" (Acceptance Criteria line 67) objectively countable against the shipped nav? Cites spec.md:67 — yes, a fixed count is directly checkable; included as a positive control confirming at least one nav AC is fully measurable as written.

## Coverage

- **CHK016** — Does the spec address old top-level deep links/bookmarks (e.g. a hash route to the pre-restructure `history`/`schools`/`resources` nav state) — redirect, alias, or accepted breakage? `[Gap]` — not addressed anywhere in Acceptance Criteria or Tasks.
- **CHK017** — Does the spec cover what a partial fetch failure looks like when the "About RITE" view's four content sources (FAQ, timeline, impact, program-cycle) load independently — does one failing block the other three, or degrade gracefully? `[Gap]` — related to CHK001 but distinct: CHK001 is about whether error-state UI exists at all, this is about partial-failure behavior across four concurrent fetches specifically.
- **CHK018** — Does the spec cover the interaction pattern for the mobile nav (hamburger/off-canvas toggle, ARIA state, touch-target size), or leave "no overflow, no unusable menus" (Acceptance Criteria line 72) to be satisfied by whatever pattern the implementer happens to choose? `[Gap]` — no specific pattern named.
- **CHK019** — Does the spec cover translation-review status display consistently — is there a single stated rule for how "unreviewed" Spanish content is flagged in metadata across all new content types (FAQ, timeline, impact, program-cycle, stories, resources), or only stated generally (Acceptance Criteria line 64)? Cites spec.md:64 — stated once at the general level; worth confirming it's meant to apply uniformly to all five new/updated content types rather than needing a per-type restatement.

## Summary

| Category | Items | Gaps found |
|---|---|---|
| Completeness | 5 | 5 |
| Clarity | 4 | 3 (CHK009 mostly resolved by cross-reference) |
| Consistency | 3 | 2 (CHK012 resolves cleanly) |
| Measurability | 3 | 1 (CHK013, CHK015 resolve via existing mechanisms) |
| Coverage | 4 | 3 |

19 items total. Six of these gaps (CHK001, CHK002, CHK003, CHK006, CHK007, CHK010, CHK011) restate findings already surfaced in `gates/analyze.md` and `gates/critic.md` under different lenses — expected overlap, since all three gates are reading the same spec. The genuinely new items this pass surfaced: CHK004 (post-submit form behavior), CHK005/CHK018 (accessibility for new UI patterns), CHK014 (annual data staleness), CHK016 (old deep links), CHK017 (partial-fetch-failure behavior), CHK019 (uniform translation-status rule).
