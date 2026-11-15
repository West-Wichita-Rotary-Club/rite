---
tier: Feature
feature_id: 0002-alumni-community-grouping
status: Complete
branch: 0002-alumni-community-grouping
created_at: 2026-07-16
source_request: "Group alumni by function in addition to country, split leaders, hosts, and teachers, and break alumni content into a JSON document that starts to drive site content."
---

# Alumni Community Grouping

**Status**: Complete
**Tier**: Feature

Product Owner TL;DR: Turn the alumni directory from hard-coded preview cards into a content-driven community view where people can be explored by country and by role in the RITE community: leaders, host families, and teachers, each with one or many participation years.

## Intent

The alumni directory should show the different communities that make RITE work. Country grouping remains important because Wichita, Panama, and Argentina are core to the exchange, but the platform should also make role-based communities visible: program leaders, host families, and teachers.

The static preview should begin using a JSON content source for alumni profiles instead of embedding all alumni data in JavaScript. This JSON is still static preview content, but its shape should anticipate the future SQLite/API model so later production work can preserve the same concepts.

## Scope

- Add a static alumni content document under the preview, expected at `docs/content/alumni.json`.
- Add a lightweight JSON model/schema document under the preview, expected at `docs/content/alumni.schema.json`.
- Model each alumni/profile entry with country and function metadata.
- Support role/function groupings for:
  - Leaders.
  - Hosts.
  - Teachers.
- Preserve country filtering/grouping for:
  - United States.
  - Panama.
  - Argentina.
- Represent participation years as a list so one-year teacher participation and multi-decade leader/host participation both fit.
- Give each alumni/community profile a static profile page in the preview.
- Reserve profile-page sections for reviewed memories, pictures, and suggestions.
- Use `bold-docs/samples/` only as source evidence for participant/alumni information: names, roles/functions, countries, participation years, bios, and profile-safe media references.
- Update the preview directory to read alumni content from the JSON document.
- Publish the JSON with the static site by keeping it under `docs/`.
- Keep all behavior static and browser-local for the public preview.
- Keep visible labels and new UI copy bilingual in English and Spanish.

## Acceptance Criteria

- The static preview includes a committed JSON alumni content file and no longer depends on hard-coded alumni arrays inside `docs/app.js` for directory profile content.
- Each alumni record supports name, country, function or functions, participation years, location, and bilingual summary text.
- The directory can be filtered or grouped by country and by function without losing the existing privacy-safe presentation.
- Leaders, hosts, and teachers are visually distinguished enough that reviewers can understand the different community perspectives.
- Participation years render clearly for both single-year participants and people with many years of involvement.
- Each profile can be opened from the directory into a profile page driven by the same JSON record.
- Profile pages include placeholder-ready sections for memories, pictures, and suggestions without exposing unreviewed private content.
- Sample documents and pictures are inventoried before extraction, and any public preview use is limited to reviewed, privacy-safe participant/alumni profile details or media references.
- Seed content includes representative entries for named leaders and hosts from the product owner request where confirmed enough for preview use.
- The UI remains responsive across desktop and mobile, including when Spanish labels are active.
- No external API, backend, database, analytics, or third-party content call is introduced.
- The JSON shape is documented briefly enough that future .NET API/SQLite work can map it to production entities.

## Content Model Decision

The static preview will publish alumni content as same-origin JSON under `docs/content/`. The browser loads that file from GitHub Pages with `fetch`, which remains static hosting rather than an API call.

Each profile has a stable id, display name, primary country, one or more community functions, a list of participation years, bilingual place text, and bilingual summary text. People with more than one community function appear in each matching function group so the preview can show the overlap between leadership, hosting, and teaching communities.

Alumni/community profiles are not the same concept as authenticated site-member accounts. Some alumni may never become site members, while most site members are expected to be alumni, future alumni, or potential alumni. Future production work should model site membership separately and optionally link a member account to one or more community profile/participation records.

Each alumni/community profile can also carry optional profile-page collections for memories, pictures, and suggestions. In the static preview these are same-origin JSON fields and placeholders; in production they should map to reviewed submissions and approved media records before public display.

## Sample Source Materials

The feature can use `bold-docs/samples/` as local private project evidence for populating and validating participant/alumni profile records. Because the GitHub repository is public, raw sample files stay ignored and are not committed. The near-term extraction target is limited to alumni-facing facts: who participated, their role/function, country, participation year or years, public-safe bio text, and profile-safe media references. Event logistics, host instructions, school schedules, dinner details, and operational material stay out of scope unless they directly verify participant/alumni profile data.

Current sample inventory:

- `2. Lourdes RITEOut  Application (1).pdf` - candidate outbound teacher participant/profile evidence.
- `2025 RITE SCHOOL SCHEDULE FINAL Copy Jan 28.doc` - candidate participant-name/year evidence only.
- `2026 RITE SCHOOL SCHEDULE  DRAFT #2  1-27-26.doc` - candidate participant-name/year evidence only.
- `Host Family Grid 2024.pdf` - candidate host participant/year evidence only.
- `Host Family Grid 2026.pdf` - candidate host participant/year evidence only.
- `Host Form Blank.doc` - profile field reference only.
- `Host Form Hazleton 01.08.24 (1).pdf` - candidate host participant/profile evidence.
- `Marianne RITE TEACHER PROFILE BLNK DOC 5680 9 10 2025 (2).pdf` - teacher profile field reference only.
- `RITE 2025 Teacher BIOS #2.docx` - candidate teacher bios and participant/year evidence.
- `RITE Blank Host Form 12-23.docx` - host profile field reference only.
- `RITE Dinner Invitation 2025.pdf` - out of scope for now unless it verifies participant names.
- `RITE Hosting Information 1.07.25.pdf` - out of scope for now unless it verifies host/alumni profile facts.
- `RITE-Teachers-2025.jpeg` - candidate profile-safe media reference for 2025 teacher participants.
- `RITE-Teachers-Welcome-2025.jpeg` - candidate profile-safe media reference for 2025 teacher participants.

Extraction from these samples should be staged: first inventory, then extract candidate participant names, roles/functions, countries, participation years, bios, and media captions into a reviewable working format, then publish only approved participant/alumni content into `docs/content/alumni.json` or copied static assets.

All candidate profiles and named participants were approved by the product owner for public-safe profile publication via WhatsApp on 2026-07-16. Public promotion still excludes contact details, addresses, dates of birth, emergency contacts, allergies, and private family details. The sample photos were also approved by all visible adults for public preview use; full names/profiles for every visible person are pending and should be added later when gathered.

## System Alignment

- Backbone principle 1 applies: profile and directory language must preserve the RITE identity as the Rotary Inter-country Teacher Exchange.
- Backbone principle 2 applies: the alumni directory is a core part of the living archive and community platform.
- Backbone principle 3 applies: directory presentation must stay privacy-safe and avoid exposing private contact details.
- Backbone principle 4 applies: all new visible directory labels and profile summaries must support English and Spanish.
- Backbone principle 5 applies: teachers, host families, Rotary leaders, coordinators, and school administrators are first-class personas.
- Backbone principle 6 applies: the original prototype remains reference evidence while this static preview evolves as deployable preview source.
- Backbone principle 7 applies: directory cards, profile pages, filters, badges, and media placeholders should follow the West Wichita Rotary visual treatment.
- Backbone principle 9 applies: the static JSON is preview content only, but should be shaped with the future .NET API, React app, and SQLite persistence in mind.
- `bold-docs/system/privacy-and-governance.md` governs directory privacy and profile fields.
- `bold-docs/system/prototype.md` allows static preview content to guide future content and data model decisions without treating preview implementation as final production architecture.

## Affected Files

Expected new or changed areas:

- `docs/content/alumni.json`
- `docs/app.js`
- `docs/styles.css`
- `docs/README.md`
- `bold-docs/features/0002-alumni-community-grouping/alumni-candidates.json`
- `bold-docs/samples/` local private evidence, ignored by git because the repository is public
- Bold feature artifacts for this work

## Open Questions

- Confirm spelling for leader names before final seed content: current system docs use `Armida Hight` and `Shelli Kadel`; the request mentioned `Armidia` and `Shelly`.
- Confirm whether named hosts should be public preview entries or placeholder/private entries until permission is verified.
- Confirm whether coordinators should be grouped under Leaders for the preview or modeled as a separate function from the start.
- Confirm whether a future production model should split participation into separate dated role records, or whether the preview-level list of years remains enough for MVP.
- Confirm whether future site-member onboarding should create a private draft profile, link to an existing public alumni/community profile, or support both flows.
- Confirm whether suggestions are public editorial prompts, private editor notes, member-submitted suggestions, or a mix with visibility rules.
- Confirm full names/profiles for every visible person in the approved sample photos.
- Confirm whether arrival/welcome photos should be attached to individual participant profile pages now, or deferred until broader event pages are planned.

## Tasks

- [X] Create the Bold feature plan.
- [X] Add static alumni JSON content under `docs/content/`.
- [X] Add a lightweight JSON schema/model document.
- [X] Load alumni directory content from the static JSON file.
- [X] Add country and community-function filtering/grouping.
- [X] Render participation years as a list that can support one-year and multi-year participants.
- [X] Add static profile pages for alumni/community profiles.
- [X] Reserve profile-page sections for memories, pictures, and suggestions.
- [X] Add `bold-docs/samples/` inventory to the plan as source evidence.
- [X] Extract candidate participant/alumni names, bios, countries, functions, participation years, and media captions from reviewed samples into a private feature review artifact.
- [X] Promote approved public-safe participant/alumni profile content to static JSON after WhatsApp approval.
- [X] Publish approved sample photos as static assets and attach them to 2025 teacher profile pages.
- [X] Verify locally through a static server.
- [X] Run formatting/syntax checks.
