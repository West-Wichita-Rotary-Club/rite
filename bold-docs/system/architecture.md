# Architecture System

Product Owner TL;DR: The intended production architecture is an ASP.NET Core MVC/Web API backend with SQLite, a standalone React frontend, OpenID Connect login, Azure hosting, and Azure Blob Storage for archive media.

## Application Shape

- Backend: ASP.NET Core MVC/Web API.
- Frontend: standalone React site that calls the API.
- Database: SQLite for portable, performant metadata and application records.
- Media storage: Azure Blob Storage for high-resolution photos, videos, transcripts, and archive media.
- Hosting: Azure.
- Authentication: OpenID Connect, with Auth0 as the example provider.

## API Responsibilities

The API owns durable data, authorization, moderation workflow, profile records, story/resource metadata, and media references. It should expose endpoints for the React frontend rather than coupling UI rendering to server-side MVC pages.

## Frontend Responsibilities

The React app owns the public and member-facing experience:
- Bilingual navigation and content toggles.
- Timeline, story archive, directory, school/club profile, and registration flows.
- Contributor submission workflows.
- API-driven state and forms.

## Data Areas

Expected data areas include:
- Users and external identity links.
- Profiles and personas.
- Roles and permissions.
- Stories and translations.
- Media assets and transcripts.
- Timeline milestones.
- Schools and Rotary clubs.
- Curriculum resources.
- Submission reviews and publication status.
- Notifications, when Phase 2 work begins.

## Current Gaps

No production app, dependency manifests, migrations, tests, or production deployment infrastructure exist yet. `docs/` and `.github/workflows/pages.yml` provide only a static GitHub Pages preview with mocked browser-local behavior. Future implementation work should establish production choices explicitly instead of inferring them from the generated prototype or preview.
