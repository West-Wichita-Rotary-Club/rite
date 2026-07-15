---
tier: Feature
feature_id: 0001-static-prototype-preview
status: ratified
branch: 0001-static-prototype-preview
created_at: 2026-07-15
source_request: "create static web app deployed to github pages for this repo for a public preview of the prototype. this is fully STATIC with mocked api interactions no exteernal links"
---

# Static Prototype Preview

Product Owner TL;DR: Create a fully static GitHub Pages preview for the RITE prototype so stakeholders can review the bilingual archive experience publicly without requiring the future .NET API, SQLite database, Azure services, authentication provider, or any external links.

## Intent

Build a static public preview site from the accepted `bold-docs/features/0001-static-prototype-preview/prototype/` evidence. The preview should make the RITE product direction easy to inspect in a browser and should preserve the major prototype flows: home, history timeline, story archive/detail, alumni directory, schools/clubs, and registration/profile submission.

This preview is not the production architecture. It is a reviewable static artifact that mocks future API interactions locally and avoids external service dependencies.

## Scope

- Create a static web app suitable for GitHub Pages.
- Reuse local prototype assets and West Wichita Rotary visual direction.
- Include mocked API interactions in local JavaScript only.
- Support English and Spanish toggling for visible UI content.
- Preserve privacy-safe behavior: mock registration and submissions must not transmit data anywhere.
- Add GitHub Pages deployment configuration for the static preview.
- Avoid external links and external runtime dependencies in the delivered preview.

## Acceptance Criteria

- The repo contains a static preview app that runs by opening the generated HTML locally or serving the static folder.
- The preview can be deployed by GitHub Pages using files from the repo.
- The app has no external navigation links; any CTAs or simulated actions stay inside the preview.
- Mocked interactions are visibly local-only, including registration/profile submission and story/resource submission behavior.
- The preview includes bilingual English/Spanish UI switching.
- The preview includes the main product areas documented in `bold-docs/system/product.md`.
- The preview uses local assets from `bold-docs/features/0001-static-prototype-preview/prototype/assets/` or newly committed local static assets only.
- No backend, database, Azure service, Auth0/OIDC call, analytics script, CDN, or external API is required for the preview.
- Documentation explains how to run the preview locally and where GitHub Pages serves it from.

## System Alignment

- Backbone principle 6 applies: `bold-docs/features/0001-static-prototype-preview/prototype/` is product evidence and should guide scope, flows, copy, and visual direction while remaining feature-local reference material.
- Backbone principles 3 and 4 apply: privacy review and bilingual support remain visible even in mocked behavior.
- Backbone principle 7 applies: the preview should follow the West Wichita Rotary design system.
- `bold-docs/system/prototype.md` governs what to reuse from the prototype and what not to treat as production direction.
- `bold-docs/system/architecture.md` remains the production target; this feature is a static preview and does not replace the planned .NET API plus React app.

## Affected Files

Expected new or changed areas:

- Static preview source and assets.
- GitHub Pages workflow or Pages-compatible static output configuration.
- README or preview documentation.
- Bold feature artifacts for this work.

## Open Questions

None blocking. Assumptions for implementation:

- GitHub Pages should publish the static preview from a committed static folder or generated static artifact, not from a live backend.
- The preview may be implemented as plain HTML/CSS/JavaScript if that best satisfies the no-external-dependency constraint.
- Mock data may be derived from the existing prototype content.

## Prototype Disposition

The full original prototype folder lives under this feature at `bold-docs/features/0001-static-prototype-preview/prototype/`. It is retained as feature evidence and is not part of the final public site source; the deployable static preview is `docs/`.
