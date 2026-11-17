---
id: ps-011
title: Video oral history archive
status: proposed
order: 30
depends_on: [ps-006, ps-007]
blockers: []
delivery: []
---

# ps-011: Video oral history archive

## Outcome

Alumni and visitors can watch short video oral-history interviews from RITE participants,
alongside the existing text story archive (`src/Rite.Web`'s Stories page) — the recorded-video
counterpart to the written stories ps-007 already delivered.

## Current Reality

`docs/content/stories.json` / `src/Rite.Api`'s `/api/stories` carry only text stories (title,
body, audience tags) with no video field or player anywhere in `src/Rite.Web`. No video has been
recorded, hosted, transcribed, or reviewed yet — this PS starts from zero video content and zero
video infrastructure.

## Scope and Independence

**In scope:** a data model for a video entry (title, embed/host URL, optional transcript,
audience tags, bilingual metadata matching the existing story shape); a video archive view in
`src/Rite.Web` reusing the Stories page's audience-filter pattern; hosting the video content
itself via an external video host referenced by URL, not re-built video infrastructure.

**Out of scope:** producing/recording new interviews (a program/content-sourcing activity, not an
engineering one); automatic transcription or captioning tooling; migrating existing text stories
into video.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
RITE has a real, working video archive — even with just one or two videos in it — complete on its
own.

## Future Health

Reuse the existing bilingual, audience-tagged content shape (`stories.json`/`StoriesController`
pattern) rather than inventing a parallel model. Keep video hosting pluggable (a URL field) so a
future PS can change host/provider without a data-model change.

## Dependencies and Decisions

Builds on the delivered ps-006 (API) and ps-007 (React site); both complete. No dependency on
ps-009/ps-010 — public video content doesn't need real accounts. Open question for whoever picks
this up: which video host, and whether any video content already exists to seed it, or this ships
as an empty-but-working archive pending the first video.

## Completion Expectations

At least one video oral-history entry is viewable, bilingual, and audience-filtered the same way
text stories are. Recognized complete once that's live and reviewed.
