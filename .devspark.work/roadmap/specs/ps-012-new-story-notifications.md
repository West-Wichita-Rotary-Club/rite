---
id: ps-012
title: Automated new-story notifications
status: proposed
order: 30
depends_on: [ps-006]
blockers: []
delivery: []
---

# ps-012: Automated new-story notifications

## Outcome

When a new community story is published, a configured RITE coordinator distribution list gets
notified automatically — instead of coordinators needing to remember to check the site for new
content.

## Current Reality

`src/Rite.Api`'s story content is seeded from `docs/content/stories.json` at startup; there's no
publish event, no outbound email/notification capability, and no recipient list anywhere in the
real stack today. No mocked version of this exists in `docs/` either.

## Scope and Independence

**In scope:** detecting when a new story is added to the real content model and sending a
notification (email is the simplest fit) to a small, configured list of RITE coordinators.

**Out of scope:** per-visitor subscriptions or preference management (would need real accounts —
see ps-009/ps-010, a separate, larger outcome); notifications for any other content type
(resources, FAQ, timeline).

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
coordinators get notified on new stories — a complete, working notification, not a fragment of a
larger subscription system.

## Future Health

Keep the recipient list and notification channel simple and swappable (e.g., a config value, not
hardcoded), so a later PS can extend this to per-visitor subscriptions once real accounts (ps-009)
exist, without redoing the "a story was published" detection.

## Dependencies and Decisions

Builds on the delivered ps-006 (API); complete. Deliberately independent of ps-009 — scoped to a
fixed coordinator list rather than per-user subscriptions, so it doesn't wait on real accounts.
Open question for whoever picks this up: which outbound email service/credentials are available,
and the actual coordinator recipient list.

## Completion Expectations

Adding a new story through the real content/admin path triggers a notification that reaches the
configured recipient list. Recognized complete once verified end to end.
