# Analyze — 0003-three-audience-experience

Product Owner TL;DR: The spec is internally coherent and every Acceptance Criterion traces to a task, with four gaps worth closing before or during build: audience tagging never reaches `alumni.json` despite being scoped for it, the Active-audience Intent still promises more than Scope/Tasks now deliver, the public alumni directory sits in tension with the system doc that calls it private-member-only, and "public-safe" resource review has no defined actor in a mocked app.

## Findings

### F1 — Coverage gap: alumni.json audience tagging has no task
**Location**: Scope ("Extend the content model so stories and resources carry an `audiences` tag") and Affected Files (`docs/content/alumni.json / alumni.schema.json — audience tags where applicable`).
Tasks T001–T004 add `audiences` tagging to stories and resources only. No task updates `alumni.json` or `alumni.schema.json` to carry the same tag, even though Affected Files lists it and T009's alumni landing view could use it to decide what surfaces there versus in the recruiting view (e.g., a leader profile relevant to both alumni and recruiting audiences).
**Status**: resolved — Scope now explicitly includes alumni profiles in the `audiences` tagging bullet, and T002b adds the tag to `alumni.json`/`alumni.schema.json`.

### F2 — Underspecification: Active-audience Intent no longer matches Scope/Tasks
**Location**: Intent ("Active participants ... 'What do I need right now?' — practical resources, hosting guides, schedules, contacts.") vs. Scope/Acceptance Criteria/T010 ("reviewed public-safe practical resources framed as 'free public resources that can be enhanced by your participation'").
Clarification #3 narrowed the active view to reviewed public-safe resources only — schedules and contacts were not addressed and aren't in Scope, Acceptance Criteria, or Tasks. Intent still lists them as part of what the active audience needs, which reads as a broader commitment than what's actually being built. Either narrow the Intent bullet to match, or note schedules/contacts as explicitly deferred.
**Status**: resolved — Intent's Active-participant bullet now scopes the need to reviewed public-safe resources and explicitly defers hosting-guide/schedule/contact material until a member-only access model exists.

### F3 — System consistency: public alumni directory vs. `privacy-and-governance.md`
**Location**: T009 (alumni landing view curating the public directory) vs. `bold-docs/system/privacy-and-governance.md` § Directory Privacy: "The alumni directory is private member functionality. Contact details and sensitive profile data should be visible only to approved members with appropriate access."
The directory has been publicly deployed since 0002 with a privacy-safe presentation (no contact details), so this tension predates 0003. But 0003 extends the public directory into a dedicated audience-facing landing page without acknowledging the conflict — System Alignment cites `privacy-and-governance.md` only for the Active view, not for the directory's public-vs-private access model. Recommend either updating the system doc to describe the "public-safe subset, full access gated" model actually in production, or having System Alignment explicitly note the divergence and why it's accepted for the preview.
**Status**: resolved — System Alignment now explicitly notes the divergence and flags updating `privacy-and-governance.md` as a tracked documentation gap outside this feature's scope.

### F4 — Ambiguity: "reviewed public-safe resources" has no defined reviewer in a mocked app
**Location**: Scope, Acceptance Criteria, T010 ("reviewed public-safe practical resources").
0002 established "reviewed" language for alumni memories/pictures/suggestions with an explicit note that production maps this to editor/admin review; this spec reuses the term for resources without the same note. Low severity — the pattern is established — but worth one line in Scope or System Alignment saying the static preview treats "reviewed" resource content as pre-vetted by the product owner rather than modeling a review workflow, same as 0002's approach.
**Status**: resolved — Scope's Active bullet now states "reviewed" means product-owner-vetted before publication, matching 0002's approach, and this is now enforced by T002a's explicit sign-off task.

## Disposition

All four findings resolved via spec edits (alumni tagging task added, Intent narrowed to match clarified Scope, System Alignment acknowledges the privacy-doc divergence, "reviewed" defined and now enforced by a sign-off task). Gate clear. No open findings remain against the current spec revision.

## Checks completed

- Duplication: no near-duplicate Acceptance Criteria found.
- Ambiguity (wording): F4; no TODO/TBD/placeholder tokens found.
- Underspecification: F2.
- Coverage gaps: F1; all other Acceptance Criteria trace to at least one task, and all tasks trace to at least one criterion.
- Backbone consistency: no conflict with an `enforced` principle; principle 5's persona list is explicitly reconciled with the new audience dimension in System Alignment.
- System consistency: F3, cross-referenced against `privacy-and-governance.md` and `product.md`.
