# RITE Static Preview

Product Owner TL;DR: This folder is the GitHub Pages preview for the RITE prototype. It is static, self-contained, and mocks future API behavior locally.

## Run Locally

Serve this folder with a static file server, then open the local URL.

Example:

```powershell
cd docs
python -m http.server 8080
```

The preview loads static JSON content from `content/alumni.json`, so direct `file://` opening may not show JSON-driven directory content in some browsers.

## Static Content Model

- `content/alumni.json` contains the published static alumni profile content used by the directory.
- `content/alumni.schema.json` documents the preview JSON shape for future SQLite/API mapping.
- Country and function labels are bilingual inside the JSON so the static preview can render English and Spanish without an API.
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
