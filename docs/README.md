# RITE Static Preview

Product Owner TL;DR: This folder is the GitHub Pages preview for the RITE prototype. It is static, self-contained, and mocks future API behavior locally. The preview serves three audiences — alumni, current participants, and recruiting prospects — with recruiting/education as the default anonymous-visitor experience.

## Run Locally

Serve this folder with a static file server, then open the local URL.

Example:

```powershell
cd docs
python -m http.server 8080
```

The preview loads static JSON content from `content/alumni.json`, `content/stories.json`, and `content/resources.json`, so direct `file://` opening may not show JSON-driven content in some browsers.

## Three-Audience Structure

- The home view leads with a "what is RITE" education-first hero, then three audience entry cards: About RITE (recruiting/education), Alumni, and Current participants.
- Each audience has its own landing view (`recruit`, `alumniLanding`, `activeLanding`) that curates and links existing sections rather than duplicating content.
- Stories, resources, and alumni profiles all carry an `audiences` tag (`alumni`, `active`, `recruiting`) so the same content record can surface in more than one audience view. An untagged item defaults to `recruiting`-visible.
- The active-participant view shows reviewed public-safe resources only, framed as free resources that participation enhances further.
- The register form leads with a recruit-first interest intent; role/persona selection is one field among several rather than the opening question.

## Static Content Model

- `content/alumni.json` contains the published static alumni profile content used by the directory.
- `content/alumni.schema.json` documents the preview JSON shape for future SQLite/API mapping.
- `content/stories.json` / `content/stories.schema.json` contain the story archive content, including `audiences` tags.
- `content/resources.json` / `content/resources.schema.json` contain the resource content, including `audiences` tags. Every resource entry requires recorded product-owner sign-off before publication — see `bold-docs/features/0003-three-audience-experience/resource-candidates.md`.
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
