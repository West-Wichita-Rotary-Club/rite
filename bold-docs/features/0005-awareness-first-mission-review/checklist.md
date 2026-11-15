---
checklist: plan.checklist
feature_id: 0005-awareness-first-mission-review
run_at: 2026-11-15
---

# Requirement Quality Checklist — 0005-awareness-first-mission-review

**Product Owner TL;DR:** This checks whether the now-ratified spec's requirements are precise enough to hand to a follow-up implementation feature without someone having to guess — not whether the mission reframe itself is a good idea (that's already decided). Three real gaps: no named owner or scope boundary for the deferred follow-up feature, no concrete backbone-amendment procedure beyond "it's a step," and the still-missing one-pager is acknowledged but not resolved either way.

## Completeness

- **CHK001** — Does the spec name who owns or schedules the follow-up implementation feature (backbone.md amendment, Spanish copy, one-pager)? **[Gap]** — "Ratification" and "Bilingual note" both defer this work to "a follow-up implementation feature" with no owner, number, or target date.
- **CHK002** — Is the backbone.md amendment procedure (who edits it, what review it gets) specified, or only flagged as a required step? **[Partial]** — "Backbone Principles At Stake" says the amendment is "an explicit step of that follow-up feature's scope," not a procedure with named steps.
- **CHK003** — Does the spec say whether the one-pager (ratified as required, Open Question 4 / Decisions) is still needed now that ratification happened without it, or has been dropped? **[Gap]** — "Ratification" states it "was never produced" but doesn't say whether it's now moot or still owed.

## Clarity

- **CHK004** — Is the ratified mission wording's claim to "awareness, communication, and learning" grounded in anything beyond the sentence itself (e.g., a worked example of how a page would differ)? **[Partial]** — Proposed Change 1 gives the sentence; no illustrative before/after exists in this spec (may belong in the one-pager, see CHK003).
- **CHK005** — Is "very soft sell" (funding) quantified anywhere this spec controls, rather than only by reference to 0004's prior art? **[Clear]** — Decisions bullet 5 explicitly cross-references 0004's shipped "contact/interest form only, no donate button, no tax language" definition.

## Consistency

- **CHK006** — Does "Ratification" explicitly acknowledge that it supersedes the sequencing in "Stakeholder Review Process" (outreach/one-pager before ratification), rather than silently contradicting it? **[Clear]** — "Ratification" states this directly ("superseding the 'broader outreach must happen first' sequencing").
- **CHK007** — Does the spec keep "this review is ratified" clearly separate from "implementation has happened," so a reader doesn't assume `docs/` already changed? **[Clear]** — "Ratification"'s last bullet and the unchanged Acceptance Criteria both state no `docs/` or `backbone.md` file changes as part of 0005.

## Measurability

- **CHK008** — Can AC2 ("every proposed change is written so a non-technical stakeholder... can react to it") be objectively verified, or is it an unavoidable subjective judgment call? **[Partial, inherent]** — No rubric is possible for this kind of requirement; flagged for awareness, not as a defect to fix.
- **CHK009** — Does the follow-up implementation feature referenced repeatedly have any stated scope boundary yet (what's in/out), or only a name? **[Gap]** — Same root cause as CHK001; no feature has been opened or scoped.

## Coverage

- **CHK010** — Does the spec address the edge case where the ratified English wording doesn't translate cleanly to Spanish (backbone principle 4)? **[Gap]** — "Bilingual note" requires a Spanish equivalent but doesn't anticipate a wording conflict surfacing only during translation review.
- **CHK011** — Does the spec address reading-level/plain-language expectations for the new copy, consistent with AC2's "non-technical stakeholder" audience? **[Gap]** — Not addressed; likely reasonable to leave to the follow-up feature's own content-quality pass.

## Summary

9 of 11 items are Clear or an inherent/acceptable Partial. The two real Gaps that matter (CHK001/CHK009 — no named, scoped follow-up feature) and CHK003 (one-pager status) all point to the same next step: open the follow-up implementation feature and decide there whether the one-pager is still owed. None of these gate this feature's own Acceptance Criteria, which are about the review document itself.
