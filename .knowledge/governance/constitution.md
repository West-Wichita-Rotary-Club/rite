<!--
SYNC IMPACT REPORT
Version change: 1.3.0 (was 1.2.0)
Applied Amendments:
  - CAP-2026-003 (APPROVED 2026-11-18, applied this version) — Principle IX's authentication
    mandate relaxed: OpenID Connect/Auth0 is no longer required; a simple credential or
    magic-link scheme is sufficient for this program's scale, with OpenID Connect adopted only if
    a concrete future need justifies it. Proposal archived at
    .archive/2026-11-18/governance/CAP-2026-003.md.
  - CAP-2026-004 (APPROVED 2026-11-18, applied this version) — Principle XI corrected: its title
    and body described a testing/CI gap that ps-005 had already closed on 2026-11-16; retitled
    "XI. Test Coverage and CI Are Established" and reworded to describe the actual, now-enforced
    practice; status changed from `adopting` to `enforced`. Proposal archived at
    .archive/2026-11-18/governance/CAP-2026-004.md.
Modified principles:
  - IX. Production Architecture Is .NET API Plus Standalone React — authentication clause
    reworded per CAP-2026-003; title and architecture mandate unchanged.
  - XI. Testing and CI Are Not Yet Established → XI. Test Coverage and CI Are Established —
    retitled and reworded per CAP-2026-004; status `adopting` → `enforced`.
Modified sections: none
Added sections: none
Removed sections: none
Templates requiring updates:
  - .knowledge/architecture/site-frontend.md — ✅ updated: removed its "pending a dedicated
    future PS (OpenID Connect per Principle IX)" framing (no longer accurate under CAP-2026-003)
    and its now-superseded claim that docs/ is the only place to see the mocked account UI (ps-015
    delivered that into src/Rite.Web too, 2026-11-18); now also notes ps-016 (retire/redirect
    docs/, waiting on ps-008).
Follow-up TODOs: none
-->

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
program that builds awareness of an active teacher exchange begun in 1996, connects the people who
make it possible, and helps them learn from one another.

### II. The Product Builds Awareness, Connection, and Shared Learning (NON-NEGOTIABLE)

RITE builds awareness of an active teacher exchange, connects the people who make it possible, and
helps them learn from one another. Core scope includes the history timeline, story archive, alumni
directory, school and club profiles, community registration, resource sharing, and future
participant workflows — understood as serving that awareness-and-connection purpose, not as an
archive for its own sake.

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
the API. Authentication is a developer's choice sized to the program — a simple credential or
magic-link scheme is sufficient for this small, volunteer-run exchange; adopt OpenID Connect
(e.g. Auth0) only if a real future need (SSO, a second consuming application, a compliance
requirement) justifies the added complexity.

### X. Hosting Direction (adopting)

Plan for hosting on an existing VM, with services reachable under `makeboldspark.com`
subdomains — the API at `rite.makeboldspark.com`. Media (high-resolution photos, videos,
transcripts, and other archive assets) is stored on that VM's filesystem, with SQLite-managed
metadata, unless and until a dedicated object-storage need is identified.

### XI. Test Coverage and CI Are Established (enforced)

`docs/js` carries a test suite (state, i18n, content, account, router) run via Node's built-in
test runner, plus a lint script; both run in CI (`.github/workflows/ci.yml`) on every pull
request, and the `test` job is a required status check on `main`. `src/Rite.Api` and
`src/Rite.Web` each carry their own test suites (`dotnet test`, `npm test`), run in CI the same
way. New production code must extend this coverage, not bypass it; a surface shipped without
matching tests is incomplete, not merely untested.

## Additional Constraints

- **Stack:** ASP.NET Core MVC/Web API, React (standalone, calling the API), SQLite, existing VM
  hosting (`makeboldspark.com` subdomains). Starter: brownfield-from-prototype. Flavor:
  west-wichita-rotary-design-system.
- **Personas and profile fields:** teachers, host families, Rotary leaders, coordinators, school
  administrators; profiles carry country, city, languages, biography, and RITE exchange years.
- **Content workflow:** members submit stories, classroom projects, curriculum resources, and
  media through a contributor workflow; editors and administrators approve before public release.
- **Current shipped surface:** a fully static, mocked public preview lives in `docs/` (served via
  GitHub Pages from `main`) — no backend, database, or hosting is live yet. Treat `docs/` as
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

**Version**: 1.3.0 | **Originally ratified**: 2026-07-15 (as Bold backbone) |
**Migrated to DevSpark**: 2026-11-15 | **Last Amended**: 2026-11-18
