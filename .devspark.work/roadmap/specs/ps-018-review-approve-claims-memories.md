---
id: ps-018
title: Editor/administrator review-and-approve workflow for claims and memories
status: proposed
order: 40
depends_on: [ps-017, ps-010]
blockers: []
delivery: []
---

# ps-018: Editor/administrator review-and-approve workflow for claims and memories

## Outcome

An editor or administrator can review a submitted claim or memory (historical accuracy, child
privacy, school privacy, member safety) and approve or reject it before it affects the public
alumni directory or story archive — the real workflow constitution Principle III requires
("Editors or administrators review submissions... before public release or directory access"),
for the real claims/memories `ps-017` delivers.

## Current Reality

Principle III is NON-NEGOTIABLE but has no implementation anywhere yet. Today, every claim and
memory — whether mocked (`docs/js/account.js`, `ps-015`'s port) or real (once `ps-017` ships) —
either stays invisible to the public (the mocked versions never touch the real directory at all)
or, once `ps-017` lands, would be real API data with a "pending review" status that nothing ever
actually reviews or acts on. `ps-010` already establishes a coordinator/leader-only authorization
pattern for the account-management surface, but no page or endpoint exists for reviewing
*content* (as opposed to accounts).

## Scope and Independence

**In scope:** a review queue (pending claims and memories) visible only to the
coordinator/leader role `ps-010` establishes; an approve/reject action per item, with rejection
requiring a visible reason; approved claims/memories become visible in the public alumni
directory/story archive (whatever that visibility mechanism is by the time this ships — a flag on
the existing record is the simplest fit).

**Out of scope:** defining what "historical accuracy" or "member safety" review actually means in
Rotary program-operational terms (a policy decision for the people doing the reviewing, not this
PS); notifying submitters of the outcome (a smaller follow-up, not blocking this PS's core
workflow).

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
RITE has a real, working content-review gate — the first time Principle III is actually
implemented, not just stated — complete on its own.

## Future Health

Reuse `ps-010`'s coordinator/leader authorization pattern rather than inventing a parallel
"editor" role — Principle III names "editors or administrators" but nothing elsewhere in the
constitution or delivered specs distinguishes an editor role from a coordinator one; collapsing
them avoids an unjustified new permission tier until a real need for the distinction appears.

## Dependencies and Decisions

Depends on `ps-017` (real claims/memories must exist before anything can review them) and
`ps-010` (the coordinator/leader authorization surface this reuses). Not yet startable; becomes
right-sized/ready once both deliver.

## Completion Expectations

A coordinator/leader can see a queue of pending claims and memories, approve or reject each with
a visible outcome, and an approved item becomes visible in the public directory/archive.
Recognized complete once that flow works end to end on the real stack and is reviewed.
