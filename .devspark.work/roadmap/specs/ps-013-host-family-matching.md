---
id: ps-013
title: Automated host-family matching
status: proposed
order: 40
depends_on: [ps-009]
blockers: []
delivery: []
---

# ps-013: Automated host-family matching

## Outcome

A visiting teacher and a host family can be automatically suggested as a match based on structured
criteria (e.g., language, location, hosting history) — instead of coordinators manually pairing
them by memory and spreadsheets today.

## Current Reality

No structured host-family or placement data model exists anywhere in the real stack.
`docs/js/account.js`'s mocked model has a `role` field (which can be `"host"`) but no host-specific
attributes (capacity, location, language, prior hosting history) and no teacher-side placement data
at all — there is nothing to match against yet.

## Scope and Independence

**In scope:** a minimal structured data model for host-family attributes and teacher placement
needs; a matching/suggestion view a coordinator can act on (propose matches, not auto-finalize
them — a human still confirms).

**Out of scope:** automatic, no-human-review finalization of a match; any outcome tracking after a
match is confirmed (a later PS).

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
coordinators have a working matching tool — complete on its own.

## Future Health

Keep the matching criteria simple and explainable (not an opaque scoring model) so coordinators
can trust and override suggestions. Avoid building a general-purpose rules engine before a second
real matching need justifies one.

## Dependencies and Decisions

Depends on ps-009 (real registration/login) — host families and teachers need to be real,
identifiable records, not anonymous mocked `localStorage` entries scoped to one browser, for a
match to mean anything across people. Not yet startable; becomes right-sized/ready once ps-009
delivers.

## Completion Expectations

A coordinator can view suggested host-family/teacher matches based on real structured data and
confirm one. Recognized complete once that flow works end to end and is reviewed.
