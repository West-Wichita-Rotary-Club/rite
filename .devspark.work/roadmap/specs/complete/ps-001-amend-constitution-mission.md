---
id: ps-001
title: Apply ratified mission statement to the constitution
status: complete
order: 10
depends_on: []
blockers: []
delivery:
  - https://github.com/West-Wichita-Rotary-Club/rite/pull/8
---

# ps-001: Apply ratified mission statement to the constitution

## Outcome

`.knowledge/governance/constitution.md` reads consistently with the product owner's ratified
2026-11-15 mission direction — "RITE builds awareness of an active teacher exchange, connects the
people who make it possible, and helps them learn from one another" — instead of carrying a
pending-amendment note. Principle II's framing moves from "living archive" toward
awareness/communication/learning, and Principle I's wording is reconciled with that same review,
through `/devspark-evolve-constitution` rather than a direct edit.

## Current Reality

Principle II is explicitly flagged `NON-NEGOTIABLE — pending ratified amendment` and carries an
inline note describing the ratified wording and deferring its application to this follow-up
(`.knowledge/governance/constitution.md` lines 19–31). Principle I was also implicated by the same
review but not yet revisited. No other constitution principle, and no other durable document,
currently depends on the old "living archive" framing remaining unchanged.

## Scope and Independence

**In scope:** running `/devspark-evolve-constitution` to amend Principles I and II to the ratified
direction, removing the pending-amendment note, and bumping the constitution's version/governance
footer per that command's own convention.

**Out of scope:** the Spanish translation of any newly ratified copy, and the stakeholder
one-pager that the original mission review deferred — both are separate, independently shippable
follow-ups under the same Theme (Mission & Identity Alignment) and are not blocked by this PS.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
the constitution is internally consistent and authoritative on its own — no dangling
pending-amendment note, no other file left referencing the old framing as current.

## Future Health

Leaves the constitution as the single authoritative identity document DevSpark's governance
commands expect, with no open amendment debt. Does not touch `docs/` content, translations, or any
other `.knowledge/` document — those remain explicitly separate follow-ups.

## Dependencies and Decisions

No delivered prerequisites. Depends only on the mission statement ratified 2026-11-15 (already
final) and on running `/devspark-evolve-constitution` rather than hand-editing the constitution,
per that command's governance role.

## Completion Expectations

Principle II no longer carries a `pending ratified amendment` tag or deferral note; Principle I and
II's wording reflects the ratified mission direction; the constitution's version/governance footer
reflects the amendment. Recognized complete once `/devspark-evolve-constitution` has run and the
resulting diff is reviewed and merged.
