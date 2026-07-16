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
- Each profile can include optional `memories`, `pictures`, and `suggestions` collections. In the preview these are static placeholders for future reviewed archive content.
- Profile pages use static hash links such as `#alumni/dalia-hale` so each profile is addressable without server routing.

## Constraints

- No backend calls.
- No external runtime dependencies.
- Mock registration and resource submission stay in the browser.
- Assets are local to this folder.

## Deploy

The repository workflow `.github/workflows/pages.yml` uploads this folder to GitHub Pages when `main` is pushed or the workflow is run manually.
