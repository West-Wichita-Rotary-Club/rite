---
tier: Feature
feature_id: 0003-three-audience-experience
status: Complete
branch: 0003-three-audience-experience
created_at: 2026-07-18
source_request: "Make the site serve multiple audiences: alumni, active, and recruiting. Primary of the three for anonymous visitors is recruiting and education."
---

# Three-Audience Experience

**Status**: Complete
**Tier**: Feature

Product Owner TL;DR: Restructure the static preview so one site serves three audiences through three front doors — alumni, active participants, and recruiting prospects — with the anonymous default experience oriented toward recruiting and education. Existing content (history, stories, directory, schools, resources) is curated per audience rather than duplicated, and stories/resources gain an audience tag in the content model.

## Intent

Today the preview presents everything from a single archival point of view. The three audiences arrive with different questions:

- **Alumni**: "Where are my people, and how do I stay connected?" — directory, memories, ways to contribute their own story.
- **Active participants** (current teachers, host families, coordinators): "What do I need right now?" — practical resources. This feature scopes that need to reviewed public-safe resources (§Scope); hosting-guide, schedule, and contact material stays out of scope until a member-only access model exists to gate it appropriately.
- **Recruiting prospects** (future teachers, host families, partner clubs and schools): "Is this for me, and what's the next step?" — impact stories, how the exchange works, a clear interest/apply path.

The ratified decision (2026-07-18): **the primary anonymous-visitor experience is recruiting and education**. Education here means explaining what RITE is — that explanation is the first step in recruiting new participants, so the public hero and default home view teach the program before asking for anything. Alumni and active participants reach their tailored views in one click. The thirty-year history and story archive remain the strongest recruiting evidence and are surfaced from the recruiting path, not hidden behind it.

This remains one site with shared navigation and shared content. Audience landing views curate and link; they do not fork the content into silos.

## Scope

- Reframe the home hero and default view around "what is RITE" program education as the entry point of the recruiting funnel, keeping the archive one click away.
- Add three audience entry cards to the home view: alumni, active participants, and prospective participants/partners.
- Add three audience landing views in the preview app, each curating existing sections:
  - **Recruiting/education**: how the exchange works, impact stories, timeline highlights, replication/education resources, partner school and club profiles (linking the existing Schools & Clubs section, since Intent names partner clubs and schools as recruiting prospects), interest call to action.
  - **Alumni**: directory, profile pages, memories, story contribution path.
  - **Active**: reviewed public-safe practical resources framed as "free public resources that can be enhanced by your participation" — the free tier is real and useful, and participation unlocks more. As in 0002, "reviewed" means product-owner-vetted before it's committed to the JSON content file, not a modeled in-app review workflow — the static preview has no reviewer role or submission queue.
- Move stories and resources out of hard-coded arrays in `docs/app.js` into JSON content documents under `docs/content/`, following the 0002 alumni pattern (content file plus lightweight schema).
- Extend the content model so stories, resources, and alumni profiles carry an `audiences` tag drawn from the closed set `alumni`, `active`, `recruiting` (e.g. `["alumni", "recruiting"]`), letting one item surface in multiple audience views without duplication. An item with no `audiences` tag is treated as `recruiting`-visible by default (the primary anonymous path) and does not appear in the alumni or active views unless explicitly tagged for them.
- Frame the register flow recruit-first: a single "express interest / join" intent leads, with persona mapping (teacher, host, leader, etc.) happening later in the flow rather than as the entry question. Submission stays fully mocked.
- Keep all new views, labels, and copy bilingual in English and Spanish.
- Keep everything static, mocked, and browser-local; no auth, backend, or external calls.
- Shape the audience tagging so future .NET API / SQLite / React work can carry the same concept into production, including an eventual public (recruiting) vs. authenticated (alumni/active) split.

## Acceptance Criteria

- An anonymous visitor landing on the preview sees a "what is RITE" education-first hero and home view that leads into the recruiting path, with the history timeline and stories reachable from it.
- Three audience entry points are visible on the home view and route to three distinct audience landing views.
- Each audience landing view curates and links to existing sections; no section content is copy-duplicated into audience silos.
- Stories and resources load from committed JSON content documents under `docs/content/` (with lightweight schema docs), and `docs/app.js` no longer depends on hard-coded story/resource arrays.
- Stories and resources are tagged with one or more audiences in the static JSON content, and audience views filter by those tags.
- The active-participant view presents reviewed public-safe resources with "free public resources, enhanced by your participation" framing; nothing private or unreviewed appears.
- Every resource entry committed to `docs/content/resources.json` has explicit product-owner sign-off recorded before publication (mirroring 0002's approval step), satisfying backbone principle 3's review gate.
- The register view leads with a recruit-first interest intent, defers persona mapping to a later step in the flow, and keeps submission fully mocked.
- Recruiting copy is evergreen — no cohort dates or exchange-year deadlines that could go stale.
- All new visible copy exists in both English and Spanish and renders correctly when the Spanish toggle is active.
- The directory's privacy-safe presentation is unchanged; no contact details or private data become visible through the new views.
- The UI follows the West Wichita Rotary design system tokens and primitives and remains responsive on desktop and mobile.
- No external API, backend, database, analytics, or third-party content call is introduced.
- The audience tagging shape is documented briefly enough that future production work can map it to the API/SQLite model.

## System Alignment

- Backbone principle 2: audience landing views extend the living archive and community platform scope (registration, resources, stories, directory).
- Backbone principle 3: the active-participant view must not expose private operational details; privacy review still gates anything published.
- Backbone principle 4: all new copy ships bilingual English/Spanish.
- Backbone principle 5: the audience dimension (alumni / active / recruiting) overlays the existing personas — teachers, host families, leaders, coordinators, school administrators each appear in one or more audiences depending on their current relationship to the program.
- Backbone principle 6: the archived prototype remains reference evidence for flows and content.
- Backbone principles 7–8: new views use the Rotary design-system tokens and primitives.
- Backbone principle 9: audience tags and view structure are shaped for the future .NET API + React implementation.
- `bold-docs/system/privacy-and-governance.md` governs what active-participant material can appear publicly in a static preview. That doc describes the alumni directory as "private member functionality," but the static preview has published a privacy-safe subset (no contact details) publicly since 0002; this feature's alumni landing view (T009) extends that same already-public, privacy-safe subset rather than introducing new exposure. The doc should eventually be updated to describe the "public-safe subset now, full member access later" model — tracked as a documentation gap, not a blocker for this feature.
- `bold-docs/system/product.md` and `prototype.md` frame the preview as evolving deployable preview source.

## Accepted Notes (critic gate)

Two non-blocking critic findings are accepted as-is, no task added:

- **C3 (deployment/rollback)**: this feature changes the public site's default anonymous landing view with no feature flag or staged rollout. Accepted — the existing PR-review-before-merge step is the de facto safety gate, and `docs/` has a straightforward revert path. See `gates/critic.md`.
- **C5 (observability)**: the mocked recruiting funnel (audience card clicks, register interest) has no event logging. Accepted as an intentional scope boundary for a static, mocked preview — `bold-docs/system/product.md` already defers dashboards/impact reporting to Phase 3. See `gates/critic.md`.

## Affected Files

Expected new or changed areas:

- `docs/app.js` — hero reframe, audience entry cards, three landing views, register framing, bilingual copy.
- `docs/styles.css` — audience card and landing-view styles on system tokens.
- `docs/content/stories.json` / `docs/content/stories.schema.json` — new story content documents with audience tags (naming may consolidate with resources).
- `docs/content/resources.json` / `docs/content/resources.schema.json` — new resource content documents with audience tags.
- `docs/content/alumni.json` / `docs/content/alumni.schema.json` — audience tags where applicable.
- `docs/README.md` — preview description update.
- `bold-docs/features/0003-three-audience-experience/resource-candidates.md` — T002a's candidate resource list and recorded product-owner sign-off, kept in the repo per FORMAT.md's ratification contract.
- Bold feature artifacts for this work.

## Clarifications (resolved 2026-07-18)

All open questions were answered by the product owner:

1. **"Education" means program education** — explaining what RITE is. It is the first step of the recruiting funnel, not a separate curriculum-resources audience. The hero and default view teach the program first.
2. **Stories and resources move to JSON** content documents under `docs/content/`, following the 0002 alumni pattern.
3. **The active view shows reviewed public-safe resources now**, framed as "free public resources that can be enhanced by your participation."
4. **Register is recruit-first**: lead with interest/join, map to teacher/host/leader personas later in the flow.
5. **The recruiting call to action stays fully mocked** in the preview.
6. **Recruiting copy is evergreen** — no cohort dates or deadlines; dated cadence may be added in a later build-out.

## Open Questions

None remaining — the clarify pass is complete.

## Tasks

- [X] T001 [P] Extract story content from `docs/app.js` into `docs/content/stories.json` with stable ids, bilingual text, and `audiences` tags
- [X] T002a Draft the candidate resource list in `bold-docs/features/0003-three-audience-experience/resource-candidates.md` (title, body, `audiences` tags per entry) and record explicit product-owner sign-off directly in that file (name, date, approval channel — same format as 0002's "approved... via WhatsApp on 2026-07-16" record) before any entry is committed to `docs/content/resources.json`; satisfies backbone principle 3's review gate (resolves: critic C1) — approved via AskUserQuestion, 2026-07-18
- [X] T002 Extract the approved resource content from T002a into `docs/content/resources.json` with stable ids, bilingual text, and `audiences` tags — only entries with recorded sign-off may be included (depends on T002a, not parallelizable)
- [X] T002b [P] Add `audiences` tags to existing records in `docs/content/alumni.json` and document the tag values in `docs/content/alumni.schema.json` (resolves: analyze F1)
- [X] T003 [P] Add `docs/content/stories.schema.json` documenting the story shape, the `audiences` tag values, and the intended production entity mapping
- [X] T004 [P] Add `docs/content/resources.schema.json` documenting the resource shape, the `audiences` tag values, and the intended production entity mapping
- [X] T005 Load stories and resources from the JSON content documents in `docs/app.js`, remove the hard-coded story/resource arrays, and add loading/error states for both fetches matching the existing bilingual `alumniLoadStatus`/`alumniLoadError` pattern (resolves: critic C4)
- [X] T006 Reframe the hero and default home view in `docs/app.js` as "what is RITE" education-first recruiting entry with evergreen English/Spanish copy and timeline/stories linked from it
- [X] T007 Add three audience entry cards (alumni, active, prospective) to the home view in `docs/app.js`, routing to the audience landing views
- [X] T008 Add the recruiting/education landing view in `docs/app.js` curating how-it-works copy, audience-tagged stories, timeline highlights, replication resources, a link into the existing Schools & Clubs section, and a mocked interest call to action
- [X] T009 Add the alumni landing view in `docs/app.js` curating the directory, profile pages, and a story-contribution path without altering the privacy-safe directory presentation
- [X] T010 Add the active-participant landing view in `docs/app.js` showing reviewed public-safe resources with "free public resources that can be enhanced by your participation" framing
- [X] T011 Rework the register view in `docs/app.js` to lead with a recruit-first interest intent, defer teacher/host/leader persona mapping to a later step, and keep submission mocked
- [X] T012 [P] Style the audience entry cards and landing views in `docs/styles.css` using West Wichita Rotary design-system tokens, responsive on desktop and mobile
- [X] T013 Verify every new label and view renders correctly with the Spanish language toggle active, adding any missing `es` copy in `docs/app.js`
- [X] T014 [P] Update `docs/README.md` to describe the three-audience structure and the new JSON content documents
- [X] T015 Verify locally through a static server: education-first landing, three audience routes, tag-driven filtering, mocked register, unchanged directory privacy, no external network calls, **and every pre-existing section (History, Stories, Directory, Schools, Resources, Register) plus its filters and deep links (`state.view`, `state.storyFilter`, `state.selectedStoryId`, `state.selectedAlumniId`) still works after the JSON/routing refactor** (resolves: critic C2) — verified via local static server (Browser pane): all fetches 200 OK, zero console errors, zero "undefined" leaks across EN+ES, all 3 audience views tag-filter correctly, all 5 pre-existing sections + directory + alumni deep-link intact, mock register submission works with reordered fields, mobile viewport (375px) single-column with no overflow.
