# Prototype Reference

Product Owner TL;DR: `bold-docs/features/0001-static-prototype-preview/prototype/` is not final site source; it is feature-local evidence for the accepted site prototype and should guide product scope, flows, copy, and visual treatment until production code replaces it.

## Status

The prototype is feature-local reference material for this repo. It is not the production architecture, not part of the final site source, and should not force generated HTML or bundled support code into the final stack.

## What To Reuse

- Product intent and information architecture.
- Bilingual English/Spanish content model.
- Main flows: home, history timeline, story archive/detail, alumni directory, schools/clubs, registration.
- Personas and registration fields.
- Timeline milestones and seed narrative.
- West Wichita Rotary visual treatment and design tokens.
- Component behavior and visual patterns.

## What Not To Treat As Production Direction

- Generated inline HTML structure.
- `support.js` runtime mechanics.
- The single-file prototype packaging.
- Hard-coded mock data as a final persistence model.
- Absence of tests, build tooling, or production folders.

## Current Prototype Files

- `bold-docs/features/0001-static-prototype-preview/prototype/RITE Platform.dc.html` - main interactive prototype.
- `bold-docs/features/0001-static-prototype-preview/prototype/assets/` - logo and Areas of Focus imagery used by the prototype.
- `bold-docs/features/0001-static-prototype-preview/prototype/_ds/` - design-system bundle, tokens, manifest, and adherence guidance.
- `bold-docs/features/0001-static-prototype-preview/prototype/RITE Community Archive Platform.zip` - packaged prototype source.

## Public Static Preview

- `docs/` contains the GitHub Pages public preview derived from the accepted prototype.
- The preview is intentionally static: mocked API, registration, resource, and submission behavior runs locally in browser JavaScript.
- The preview does not replace the planned production .NET API, SQLite persistence, Azure media storage, or standalone React app.
