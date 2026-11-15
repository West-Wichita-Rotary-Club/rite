# Prototype Reference

Product Owner TL;DR: `bold-docs/features/0001-static-prototype-preview/prototype/` is not final site source; it is feature-local evidence for the accepted site prototype and should guide product scope, flows, copy, and visual treatment until production code replaces it.

## Status

The prototype is feature-local reference material for this repo. It is not the production architecture, not part of the final site source, and should not force generated HTML or bundled support code into the final stack.

## What To Reuse

- Product intent and information architecture.
- Bilingual English/Spanish content model.
- Main flows: home, history timeline, story archive/detail, alumni directory, schools/clubs, registration.
- Personas and registration fields.
- West Wichita Rotary visual treatment and design tokens.
- Component behavior and visual patterns.

**Superseded (2026-07-21):** the prototype's original timeline milestones and seed narrative are no longer the source of truth for factual content. Feature `0004-research-content-integration` replaced them with `docs/content/timeline.json`, sourced from the verified research package at `bold-docs/samples/rite_program_website_content.json` — treat that package, not the 0001 prototype's invented seed narrative, as the current source for history, statistics, and program copy. The prototype remains the reference for structure, flows, and visual treatment not yet reconciled against real content.

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
- `docs/content/alumni.json` drives the public preview alumni directory and static profile pages, modeling each person's participation as one or more role/years records rather than a single flat role and year list.
- Alumni profile pages use static hash routes and reserve sections for reviewed memories, pictures, and suggestions.
- The preview also mocks the future member account lifecycle end to end for visioning and feedback: registration creates a browser-local mock account (email-only, no password) and signs the visitor in; a signed-in member can claim alumni status (country plus a year/role participation history, matched to an existing profile or self-declared) and compose memories with photos, all pending review and stored only in that browser's `localStorage`. None of this writes back to `docs/content/alumni.json` or is visible to any other visitor.
- The preview does not replace the planned production .NET API, SQLite persistence, Azure media storage, or standalone React app.
