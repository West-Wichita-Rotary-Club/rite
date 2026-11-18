---
id: ps-016
title: Retire or redirect docs/ once the production stack is live
status: proposed
order: 40
depends_on: [ps-008]
blockers: []
delivery: []
---

# ps-016: Retire or redirect docs/ once the production stack is live

## Outcome

`docs/`'s static preview no longer needs to exist as a separate, independently-maintained
surface — once `rite.makeboldspark.com` is live and verified (ps-008) and now carries its own
account/login/registration/claim/memory UI (ps-015), `docs/` has no unique content left. This PS
either retires it (stop publishing it, archive the content) or turns it into a redirect to the
live site — developer's call, recorded as a Decision when this PS starts.

## Current Reality

`docs/` is the only thing actually live and publicly reachable today (GitHub Pages, from `main`).
`src/Rite.Web` (even with ps-015's account UI now ported in) only exists as source and local dev
builds — ps-008 hasn't deployed it anywhere yet. Raised by the developer 2026-11-18, right after
ps-015 shipped; recommended then (see Decisions) to wait until ps-008 ships and is verified
working before touching `docs/`, since retiring it earlier would leave the public with nothing to
visit at all.

## Scope and Independence

**In scope:** once `rite.makeboldspark.com` is confirmed live and working (ps-008 done), either
(a) stop publishing `docs/` via `.github/workflows/pages.yml` and archive its content, or (b)
replace `docs/`'s content with a simple redirect to `https://rite.makeboldspark.com`. Update
`README.md`'s "Static preview" section to match whichever is chosen.

**Out of scope:** deciding *when* ps-008 ships (not this PS's call); any content migration beyond
what ps-006/ps-007/ps-015 already carried over (everything `docs/` had is already live elsewhere
by the time this starts).

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
the repo has exactly one live public surface (the production stack) instead of two overlapping
ones — a complete, self-contained cleanup, not a fragment of a larger migration.

## Future Health

Whichever option is chosen, leave no dangling GitHub Pages deployment pointed at content nobody
maintains — that's the actual risk this PS closes off, not a specific implementation preference.

## Dependencies and Decisions

Depends on ps-008 (VM deployment) being delivered and the live site verified working; not
startable before then (`roadmap-check` will show it blocked until ps-008 completes). Retire-vs-
redirect is an open choice for whoever picks this up — both were on the table in the 2026-11-18
discussion that raised it; recorded as a Decision once chosen, not pre-decided here.

## Completion Expectations

`docs/` either no longer publishes (GitHub Pages workflow retired, content archived) or serves
only a redirect to `rite.makeboldspark.com`; `README.md` reflects the chosen outcome. Recognized
complete once verified — a visit to the old `docs/` URL no longer shows stale, duplicated content.
