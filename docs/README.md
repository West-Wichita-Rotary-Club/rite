# RITE Static Preview

Product Owner TL;DR: This folder is the GitHub Pages preview for the RITE prototype. It is static, self-contained, and mocks future API behavior locally. Navigation follows a "big 3" model — About RITE, Participate, Community — with content sourced from a researched content package and every claim tagged with a verification status. The default anonymous-visitor experience leads with active-community and participation messaging rather than history.

## Run Locally

Serve this folder with a static file server, then open the local URL.

Example:

```powershell
cd docs
python -m http.server 8080
```

The preview loads static JSON content from `content/*.json`, so direct `file://` opening may not show JSON-driven content in some browsers.

## Big-3 Navigation

- The top navigation carries exactly three primary destinations plus header utilities (language toggle, sign-in/account): **About RITE** (`about`) — mission, how the exchange works, impact stat tiles, with History (`history`) and FAQ (`faq`) reached via its sub-navigation; **Participate** (`participate`) — teacher and host-family paths, a volunteer/schools link, stories woven in as recruiting evidence, and the "Support RITE" soft interest form; **Community** (`community`) — the inbound cohort's collective-team story, the alumni directory (`directory`), curriculum/toolkit resources (`resources`), and the current-participant view.
- The home view still leads with three audience entry cards (recruiting-focused, alumni, active) from the 0003 three-audience model, now routing into the big-3 views above rather than into dedicated per-audience landing views — the `audiences` tagging system underneath is unchanged.
- `state.view` values `recruit`, `alumniLanding`, and `activeLanding` from the pre-0004 preview are aliased to `participate`/`community`/`community` respectively in `docs/app.js`, so any code or bookmark still referencing the old names resolves to the new view.

## Static Content Model

- `content/alumni.json` / `.schema.json` — alumni and community profiles used by the directory.
- `content/stories.json` / `.schema.json` — the story archive.
- `content/resources.json` / `.schema.json` — curriculum, toolkit, and replication resources. Every entry requires recorded product-owner sign-off before publication — see `bold-docs/features/0003-three-audience-experience/resource-candidates.md` and `bold-docs/features/0004-research-content-integration/content-candidates.md`.
- `content/faq.json` / `.schema.json` — general and host-family FAQ entries (`faq-*` and `host-faq-*` ids), sourced from the RITE research package's `faq_draft`.
- `content/timeline.json` / `.schema.json` — the verified program history/timeline, replacing the milestones previously hard-coded in `docs/app.js`.
- `content/impact.json` / `.schema.json` — impact stat-tile figures, each carrying an `asOf` date and a `dimension` (`exchange-teachers`, `benefiting-teachers`, or `program`) so no figure reads as a current live total.
- `content/program-cycle.json` / `.schema.json` — the annual inbound/outbound exchange cycle behind the "How the Exchange Works" section.
- Stories, resources, alumni profiles, and FAQ entries carry an `audiences` tag (`alumni`, `active`, `recruiting`) so the same content record can surface in more than one part of the site. An untagged item defaults to `recruiting`-visible.
- Every content type also carries claim-status/verification metadata (`claimStatus`, optional `sourceNote`, `lastVerified`) documented per schema with a `productionMapping` note describing its future API/SQLite entity. `claimStatus` values come from the research package's `claim_status_legend`, extended with `verified_official_but_dated` and `partly_verified_official` for figures and profiles the package itself flags with those nuances. `needs_confirmation` material is never published.
- Country and function labels are bilingual inside the JSON so the static preview can render English and Spanish without an API. Spanish translations across all content added or revised in feature 0004 are model-drafted and unreviewed (flagged in each file's `modelNotes`).
- Alumni/community profiles are content records, not site-member accounts. Future authenticated membership should be modeled separately and can link to these profiles when appropriate.
- Each profile carries a `participation` array of role/years records instead of a single flat role and year list, so a person's role can differ across years (e.g. teacher one year, host in later years, leader after that) without asserting a transition year nobody actually confirmed.
- Each profile can include optional `memories`, `pictures`, and `suggestions` collections. In the preview these are static placeholders for future reviewed archive content.
- Profile pages use static hash links such as `#alumni/dalia-hale` so each profile is addressable without server routing.

## Mock Account, Login, Claim, and Memory Simulation

This preview also simulates the future member experience end to end, entirely in the browser, for visioning and feedback — not as a preview of real functionality:

- Registering creates a mock account (keyed only by email, no password anywhere) and signs the visitor in immediately; returning visitors sign back in with the same email from the header.
- A signed-in member's account view is editable and lets them claim alumni status — a country plus a participation history of year/role records — either by matching an existing directory profile or self-declaring a new one.
- A signed-in member can also compose memories with photos (downscaled and stored as browser-local data URLs); these render, labeled "pending review," on the member's own account view and on their claimed public profile page (visible only in their own browser).
- Everything member-created stays permanently pending review and never modifies the published `content/alumni.json` directory for other visitors.
- All of this data lives in this browser's `localStorage` only, under a roughly 3MB budget kept separate from the pre-existing mock submission queue, and a "clear my preview data" action removes it in one step.
- If browser storage isn't available, this simulation is simply unavailable and says so; the rest of the static preview keeps working.

## Constraints

- No backend calls, ever — not even for the mock account/login/claim/memory simulation above.
- No external runtime dependencies.
- Mock registration, login, claims, memories, and resource submission all stay in the browser.
- Assets are local to this folder.

## Deploy

The repository workflow `.github/workflows/pages.yml` uploads this folder to GitHub Pages when `main` is pushed or the workflow is run manually.
