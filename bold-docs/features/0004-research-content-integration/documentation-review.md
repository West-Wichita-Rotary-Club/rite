# T033 — Documentation Currency Review

Product Owner TL;DR: Reviewed all seven `bold-docs/system/` docs plus `docs/README.md` against this feature's shipped state. Three docs were genuinely stale and are now updated in place (resolving analyze findings S1, S2, S3); the rest were already current or only flagged by a false-positive path check. Nothing here was wholly obsolete, so nothing is flagged for `bold.ship harvest` to archive.

## Classification

| Doc | Classification | Action |
|---|---|---|
| `bold-docs/system/README.md` | Current | None — plain index of the other docs, nothing in it goes stale. |
| `bold-docs/system/architecture.md` | Current | None — describes the future production stack, which this static-preview-only feature doesn't touch. Its "Timeline milestones" and "Curriculum resources" data-area anticipations already match the shape `docs/content/timeline.json` and `docs/content/resources.json` now ship. |
| `bold-docs/system/design-system.md` | Current | None. The collector's `stale_references` flagged `tokens/colors.css`, `tokens/spacing.css`, `tokens/typography.css` as dangling — verified these files exist at `bold-docs/features/0001-static-prototype-preview/prototype/_ds/west-wichita-rotary-design-system-.../tokens/`; the flag is a false positive (the collector likely can't resolve the doc's own earlier-stated path prefix). No update needed. |
| `bold-docs/system/privacy-and-governance.md` | Needed update | **Updated.** Added a static-preview carve-out note to "Translation Governance" reconciling analyze finding S2 — the section's "must be reviewed before publication" rule governs production publication; the static preview's unreviewed model-drafted Spanish (flagged in each content file's `modelNotes`) doesn't violate it. |
| `bold-docs/system/product.md` | Needed update | **Updated.** "Historical Anchors" rewritten to resolve analyze finding S3: added the founding-club names (West Wichita + West Sedgwick County-Sunrise), corrected the anachronistic implication that District 5680 existed in 1996, added the 2019 district-merger anchor, dated the 39/45/61 figures to their January 2023 source, and softened the "30-year legacy" framing to match its `inferred` claim status. Now points to `docs/content/timeline.json` as the current sourced timeline. |
| `bold-docs/system/prototype.md` | Needed update | **Updated.** Added a note that the prototype's original timeline milestones and seed narrative are superseded by the research package (`bold-docs/samples/rite_program_website_content.json`) as the source of truth for factual content, while the prototype remains the reference for structure/flow/visual treatment not yet reconciled against real content. |
| `bold-docs/system/creative-brief.md` | Needed update | **Updated.** Resolves analyze finding S1: §14 (Information Architecture) and its Alignment Resolution Log entry now describe the shipped "big 3" nav (About RITE / Participate / Community) as current, with the 2026-07-19 three-audience-primary resolution preserved in a collapsed `<details>` block as historical record rather than deleted. Also resolves S2: added the same static-preview translation carve-out note to §18's Translation Principle as was added to `privacy-and-governance.md`. |
| `docs/README.md` | Needed update | **Updated as part of T031** (not re-touched here) — already describes the big-3 navigation, the four new content collections, the view-name aliasing, and the claim-status content model. |

## Archival candidates

None. No doc reviewed here is wholly superseded — every one still describes real, current parts of the system once the updates above land. Nothing is flagged for `bold.ship harvest`.

## Note on scope

This review covers currency as of this feature's shipped state (2026-07-21). It does not re-litigate `creative-brief.md`'s broader content (pages, personas, roadmap) beyond the IA and translation sections this feature's decisions directly touched — a full brief reconciliation pass, if wanted, is separate future work.
