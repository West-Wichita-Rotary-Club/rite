# RITE Constitution

> Migrated from Bold's `backbone.md` (its product-identity source of truth) during the 2026-11-15
> switch from Bold to DevSpark. Principle numbering and status tags (`enforced`/`adopting`) carry
> over unchanged from that source; nothing below is a new decision. The prior Bold workflow's
> history is preserved in this repository's own archived work-product history, per Git.

Product Owner TL;DR: RITE is the Rotary Inter-country Teacher Exchange community archive — a
bilingual platform preserving RITE history, connecting alumni, and supporting future participation
across Wichita, Panama, and Argentina. These are the non-negotiable rules for building it.

## Core Principles

### I. Product Identity Is Fixed (NON-NEGOTIABLE)

RITE means Rotary Inter-country Teacher Exchange, a West Wichita Rotary / Rotary District 5680
program preserving the teacher exchange begun in 1996.

### II. The Product Is a Living Archive and Community Platform (NON-NEGOTIABLE — pending ratified amendment)

Core scope includes the history timeline, story archive, alumni directory, school and club
profiles, community registration, resource sharing, and future participant workflows.

**Pending amendment, ratified 2026-11-15, not yet applied here:** the product owner has ratified
shifting this principle's framing from "living archive" toward awareness, communication, and
learning about an active program: *"RITE builds awareness of an active teacher exchange, connects
the people who make it possible, and helps them learn from one another."* That amendment — along
with Principle I's wording, which the same review also implicated — is scoped to a follow-up
implementation feature and should be applied here through `/devspark-evolve-constitution` once
that feature runs, not silently folded into this migration.

### III. Privacy Review Gates Publication (NON-NEGOTIABLE)

Editors or administrators review submissions for historical accuracy, child privacy, school
privacy, and member safety before public release or directory access.

### IV. English and Spanish Are First-Class (NON-NEGOTIABLE)

User-facing content, navigation, core workflows, and stored content model decisions must support
bilingual English/Spanish operation from the start. AI-assisted translations may be used, but
fluent reviewers verify them before publication.

### V. Primary Personas Are Explicit (NON-NEGOTIABLE)

Teachers, host families, Rotary leaders, coordinators, and school administrators are first-class
users; anonymous visitors can read approved public archive content.

### VI. The Prototype Is Product Evidence

The original static-prototype-preview feature's prototype, preserved in this repository's history,
should be used as reference material for product intent, flows, content, and visual direction
until fully replaced by production implementation; it is not final site source.

### VII. Use the West Wichita Rotary Design System (NON-NEGOTIABLE)

UI should follow the discovered Rotary brand foundations: Azure, Royal Blue, Sky Blue, Rotary
Gold, Cool/Warm Gray neutrals, Oswald/Open Sans substitutes unless licensed fonts are supplied,
small radii, and gold/azure accent bands.

### VIII. Use System Primitives and Tokens in Production UI (adopting)

Buttons, cards, badges, callouts, and area-of-focus tags should follow the prototype
design-system contracts; new production code should avoid raw colors, raw spacing, and off-system
fonts. Legacy prototype inline styles are grandfathered.

### IX. Production Architecture Is .NET API Plus Standalone React (NON-NEGOTIABLE)

Build an ASP.NET Core MVC/Web API backend backed by SQLite and a standalone React site that calls
the API. Authentication is OpenID Connect, with Auth0 as an example provider.

### X. Azure Is the Hosting and Media Direction (adopting)

Plan for Azure hosting and Azure Blob Storage for high-resolution photos, videos, transcripts, and
other archive media, with SQLite-managed metadata.

### XI. Testing and CI Are Not Yet Established (adopting)

Future work must make explicit choices for test coverage, build validation, and deployment checks
before treating the app as production-ready.

## Additional Constraints

- **Stack:** ASP.NET Core MVC/Web API, React (standalone, calling the API), SQLite, Azure.
  Starter: brownfield-from-prototype. Flavor: west-wichita-rotary-design-system.
- **Personas and profile fields:** teachers, host families, Rotary leaders, coordinators, school
  administrators; profiles carry country, city, languages, biography, and RITE exchange years.
- **Content workflow:** members submit stories, classroom projects, curriculum resources, and
  media through a contributor workflow; editors and administrators approve before public release.
- **Current shipped surface:** a fully static, mocked public preview lives in `docs/` (served via
  GitHub Pages from `main`) — no backend, database, or Azure service exists yet. Treat `docs/` as
  the production site's content/IA reference, not as the target architecture (see Principle IX).

## Development Workflow

- **Roadmap (Phase 1 — MVP):** bilingual site shell, user registration, contributor profiles,
  foundational history timeline.
- **Roadmap (Phase 2):** video oral history archive, school-specific pages, automated
  notifications for new community stories.
- **Roadmap (Phase 3):** automated host-family matching, participant dashboards, interactive
  impact reporting maps.
- Every ratified decision and its date should be traceable, the same discipline the prior Bold
  workflow applied via feature specs and its creative brief's resolution log.

## Governance

This constitution supersedes Bold's `backbone.md` as RITE's current, authoritative
product-identity document. Amendments follow DevSpark's own governance commands
(`/devspark-evolve-constitution`, `/devspark-discover-constitution`) rather than direct edits.

**Version**: 1.0.0 (migrated) | **Originally ratified**: 2026-07-15 (as Bold backbone) |
**Migrated to DevSpark**: 2026-11-15
