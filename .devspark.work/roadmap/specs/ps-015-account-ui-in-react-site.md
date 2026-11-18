---
id: ps-015
title: Port the mocked account UI into the React site
status: proposed
order: 20
depends_on: [ps-006, ps-007]
blockers: []
delivery: []
---

# ps-015: Port the mocked account UI into the React site

## Outcome

`src/Rite.Web` has its own register/login/account (claim + memories + profile) UI, reusing the
same mocked, browser-local `localStorage` model `docs/js/account.js` already proved out — so a
visitor no longer needs to leave the real production site to see any of it. `MockBanner` (the
"Account, login, and registration still live on the legacy static preview" notice) is removed
entirely.

## Current Reality

Before this PS, `src/Rite.Web` had no account capability of its own at all — `MockBanner`
explicitly told every visitor that account/login/registration/claim/memories only existed on
`docs/`'s static preview. `docs/js/account.js`'s mocked model (register, sign-in, profile, a
multi-year participation claim matched against real alumni data, memories with downscaled
photos) was fully built and tested there, but nowhere else.

## Scope and Independence

**In scope:** a React port of that same mocked model — `src/Rite.Web/src/lib/account.js` (pure
logic) and `src/Rite.Web/src/context/AccountContext.jsx` (React state/localStorage), plus
`Register`, `Login`, and `Account` pages reusing the existing design-system CSS classes
(`form-card`, `profile-panel`, `stat-card`, etc., added to `src/Rite.Web/src/styles.css` where
missing). Claim matching reuses the real `/api/alumni` data (same shape `docs/` content has,
since both come from `docs/content/alumni.json`). `MockBanner` removed from `Layout`.

**Out of scope:** a real account backend (ps-009, not yet started) — this is still the mocked
`localStorage` model, now living in two places (`docs/` and `src/Rite.Web`) with two separate,
origin-isolated mock stores; migrating or retiring `docs/`'s own copy of this UI (a separate
decision — `docs/` currently still carries it too, kept live for other reasons per ps-007).

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
`src/Rite.Web` has a complete, working mocked account experience on its own — not dependent on
`docs/` for any of it.

## Future Health

`lib/account.js`'s functions are pure and already unit-tested, matching `docs/js/account.js`'s
own test coverage — when ps-009 delivers a real backend, swapping this mocked data source for
real API calls should only touch `AccountContext.jsx`, not the pages or the pure helpers.

## Dependencies and Decisions

Builds on the delivered ps-006 (API, for real alumni claim-matching data) and ps-007 (React
site); both complete. Developer-stated direction: port the mocked UI rather than build the real
backend now (ps-009 stays separately scoped, not started). `docs/`'s own copy of this UI is left
as-is — whether to retire or migrate it is a separate, not-yet-made decision (see roadmap
Decisions).

## Completion Expectations

A visitor can register, sign in, edit their profile, claim alumni status (matched against real
alumni data), and share memories with photos, entirely within `src/Rite.Web` — verified live in
the browser against the real API, in English and Spanish. 54/54 `src/Rite.Web` tests pass.
Recognized complete once that's merged and reviewed.
