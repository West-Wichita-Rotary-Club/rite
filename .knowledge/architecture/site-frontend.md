# RITE Static Preview — Frontend Structure

Product Owner TL;DR: The public static preview (`docs/`, served via GitHub Pages) is a
vanilla-JavaScript, no-build single-page app. Its logic lives in six ES modules under
`docs/js/`, each with one responsibility, loaded by a small `docs/app.js` entry point.
`docs/index.html` loads `app.js` as `<script type="module">` — the browser resolves the
`import`/`export` graph natively; there is no bundler or build step.

## Module map

| Module | Responsibility | Exports other modules use |
|---|---|---|
| `docs/js/state.js` | The single shared, mutable `state` object (current view, loaded content, account/session fields, in-progress form drafts). No logic. | `state` |
| `docs/js/i18n.js` | The bilingual (`en`/`es`) copy dictionary and the `t(path)` / `localize(value)` lookup helpers. | `copy`, `t`, `localize` |
| `docs/js/content.js` | Static reference data (`schools`, `palette`) and the seven `load*Content()` functions that fetch `docs/content/*.json` and the getters (`getStories`, `getResources`, etc.) that read them back out of `state`. | `loadAlumniContent`, `loadStoriesContent`, `loadResourcesContent`, `loadFaqContent`, `loadTimelineContent`, `loadImpactContent`, `loadProgramCycleContent`, `getStories`, `getResources`, `getFaqs`, `getMilestones`, `getImpactMetrics`, `getProgramPhases`, `getAudiences`, `filterByAudience`, `schools`, `palette` |
| `docs/js/account.js` | The mocked backend: `localStorage`-backed accounts/session/submissions, `mockApi` (submit profile/resource/support-interest), claim and memory draft shapes and validation, photo downscaling. Nothing here touches the DOM. | `initAccountState`, `currentAccount`, `mockApi`, account CRUD, claim/memory draft helpers, `StorageBudgetError`, `CLAIM_ROLES`, `MAX_PHOTOS_PER_MEMORY`, `MAX_MEMORIES_PER_MEMBER` |
| `docs/js/router.js` | View state transitions and the `#alumni/<id>` hash-routing for alumni profile deep links. | `setView`, `setAlumniProfile`, `applyHashRoute`, `isNavActive` |
| `docs/js/render.js` | Every `render*` function, DOM event binding (`bindEvents`/`bindAccountEvents`), and the alumni-profile helpers (role/year/band lookups, claim-candidate matching). The largest module — this is where "content rendering" genuinely lives, not an arbitrary split. Only `render()` is exported; everything else here is private to this module. | `render` |
| `docs/app.js` | Entry point `index.html` loads. Initializes account state, wires the `hashchange` listener, runs the first `render()`, then kicks off the seven content loads. ~25 lines. | — (not imported by anything) |

## Why this shape

- `state.js` has no dependencies so every other module can import the shared state object
  without creating an import cycle through it.
- `content.js` and `router.js` both call `render()` from inside async callbacks / event
  handlers (never at module-evaluation time), and `render.js` imports from both — this is a
  deliberate, safe circular import: ES modules resolve it because the call only happens after
  all modules have finished evaluating.
- `account.js` exposes `initAccountState()` instead of reading `localStorage` inline while the
  `state` object literal is being constructed (the original single-file version did this,
  relying on `state` not existing yet during its own literal's evaluation). `docs/app.js` calls
  it once, synchronously, before the first `render()` — same effective order, explicit instead
  of implicit.
- `render.js` stays one module instead of being split further (e.g. by page/view) because the
  audit that prompted this split named four real seams — nav, content rendering, audience
  routing, mock auth — not finer-grained ones; further slicing would have been a
  line-count-driven split, not a genuine one.

## Known gaps (inherited from the prior single-file version, not introduced here)

- No test suite exists for this code (constitution Principle XI — already declared, not new).
- No build step, type checking, or linter config exists for `docs/js/`.

## Source of truth

`docs/js/*.js` and `docs/app.js` are the source of truth. This document describes their current
structure; if the module boundaries change, update this file in the same change.
