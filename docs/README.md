# RITE Static Preview

Product Owner TL;DR: This folder is the GitHub Pages preview for the RITE prototype. It is static, self-contained, and mocks future API behavior locally.

## Run Locally

Open `index.html` in a browser, or serve this folder with a static file server.

## Constraints

- No backend calls.
- No external runtime dependencies.
- No external navigation links.
- Mock registration and resource submission stay in the browser.
- Assets are local to this folder.

## Deploy

The repository workflow `.github/workflows/pages.yml` uploads this folder to GitHub Pages when `main` is pushed or the workflow is run manually.
