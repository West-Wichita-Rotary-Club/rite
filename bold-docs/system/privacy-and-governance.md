# Privacy And Governance System

Product Owner TL;DR: RITE must encourage participation without exposing children, schools, or private member contact details. Publication and directory access are governed by role-based permissions and editor/admin review.

## Personas

Registration supports:
- Teachers.
- Host families.
- Rotary leaders.
- Coordinators.
- School administrators.

Profiles include:
- Country.
- City.
- Languages.
- Biography.
- RITE exchange year or years.

## Review Workflow

Members can submit stories, classroom projects, curriculum resources, and media. Reviewers, translators, historians/archivists, and publishers review submissions before publication for:
- Historical accuracy.
- Student and child privacy.
- School privacy.
- Appropriate media use.
- Bilingual quality.
- Fit with RITE archive scope.

## Roles

Ratified 2026-07-19 (`creative-brief.md` §20), replacing the prior four-role model:

- **Contributor** - a registered member who creates and edits their own drafts (stories, media, corrections).
- **Reviewer** - checks a submission for completeness, relevance, and safety (child privacy, school privacy, appropriate media use) before it proceeds.
- **Translator** - creates or reviews Spanish/English translations; AI-assisted drafts require this role's sign-off before publication.
- **Historian or Archivist** - verifies dates, people, places, and historical accuracy against source material.
- **Publisher** - gives final approval for public release.
- **Administrator** - manages users, roles, access, publication state, and system configuration.

One person may hold multiple roles; a given submission need not pass through every role (English-only content skips Translator, for example).

## Access Model

- Public visitors can read approved public archive content.
- Registered members (Contributors) can submit stories, media, and profile claims for review; they can access approved member areas after review.
- Reviewer, Translator, Historian/Archivist, and Publisher roles review and approve submissions before they become public.
- Administrators manage users, roles, publication state, and system configuration.

## Translation Governance

English and Spanish are first-class. AI-assisted translation may be used for draft content, but fluent reviewers must verify translations before publication.

**Static-preview note (added 2026-07-21):** this governs *production* publication. The static preview (`docs/`) ships model-drafted Spanish flagged as unreviewed in content metadata (see features `0003-three-audience-experience` and `0004-research-content-integration`) — the preview is visioning/evidence material per `prototype.md`, not the production publication this rule targets. The human-review step still applies before any of this content ships in production.

## Directory Privacy

The alumni directory is private member functionality. Contact details and sensitive profile data should be visible only to approved members with appropriate access.

## Alumni Profile Content

Alumni/community profile content is separate from authenticated site-member accounts. Some alumni may never become site members, while many site members may be alumni, future alumni, or potential alumni.

Sample-derived participant information, bios, pictures, memories, and suggestions require review before public release. Candidate extraction should omit contact details, addresses, dates of birth, emergency contacts, allergies, and other sensitive personal data unless a future approved member-only workflow explicitly requires them.

