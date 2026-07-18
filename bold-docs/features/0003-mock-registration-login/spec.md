---
tier: Feature
feature_id: 0003-mock-registration-login
status: Complete
branch: 0003-mock-registration-login
created_at: 2026-07-17
source_request: "Enhance the mock user profile functionality to allow for registration, and then login using browser memory/cache to store the mock credentials. Build out profile so a user can claim alumni status with country and role, and also create memories with photos."
---

# Mock Registration, Login, and Member Profiles

**Status**: Complete
**Tier**: Feature

Product Owner TL;DR: Let preview visitors create a mock account through the existing registration form, sign in on later visits, and then use that signed-in profile to do the two things membership is for: claim their place in the RITE alumni community (country and role — leader, host, or teacher) and create memories with photos. Everything — account, credentials, session, claims, memories, and photos — stays in that visitor's own browser. This simulates the future member experience end to end, including the editor-review story, without any server, real authentication, or data leaving the page.

## Intent

**This feature is 100% mock and exists for visioning.** Its purpose is to let the product owner and community reviewers *feel* the future member experience and give feedback on it — not to build any real functionality. There are no API calls of any kind, no network requests beyond loading the static site's own files, and no data that leaves the visitor's browser. Simplicity of implementation beats realism everywhere the two conflict: the mock only needs to be convincing enough to collect feedback.

The static preview's registration form currently drops submissions into a browser-local "pending review" queue and stops there. The next step in simulating the member experience is closing the loop: after registering, a visitor should be able to log in with the credentials they created, see that the site recognizes them, and log out again.

Because the preview is intentionally static (see `bold-docs/system/prototype.md`), the whole account lifecycle is mocked in browser storage:

- **Registration** creates a mock account record keyed by the visitor's email address, persisted in the browser's `localStorage` alongside the existing mock submission queue, and signs the visitor in immediately — no separate login step follows registration. There is no password — a public visioning preview should never invite visitors to type real passwords (ratified 2026-07-17). Because the account lives in that browser's storage rather than behind a real credential, anyone else using the same shared or public browser could sign back in with the same email and see the same mock data; the sign-in screen says so plainly.
- **Login** (for a return visit, in this or another browser where the account doesn't yet exist locally) asks only for the email used at registration, checks it against the stored mock accounts, and on success establishes a browser-local session.
- **Logged-in state** is visible in the UI (the visitor's name in the header, a logout action, and an editable account/profile view showing what they registered with, their claim, and their memories — plus a "clear my preview data" action that removes everything for that email in one step).
- **Logout** clears the session but keeps the stored account so the visitor can log in again.
- If `localStorage` itself is unavailable in the visitor's browser (private-browsing restrictions, for example), the mock account/login/claim/memory simulation is simply unavailable and says so — the rest of the static preview keeps working.

Once signed in, the mock profile becomes useful rather than decorative:

- **Claiming alumni status.** A signed-in member can declare their place in the RITE community: their country (United States, Panama, Argentina) and their participation history as one or more year-role records, mirroring the function model from feature 0002. Roles can differ across years — someone may be a teacher one year, a host in later years, and a leader after that (host to leader, teacher to host, teacher to leader are all real paths) — so the claim pairs each participation year (or year range) with the role held then, rather than keeping one flat role list. Feature 0002 decided that site membership and alumni/community profiles are distinct concepts with linking deferred; this feature is that link, in mock form. A claim can reference an existing profile in `docs/content/alumni.json` ("that's me") or self-declare a new alumni identity not yet in the directory. Claims are browser-local and marked pending review — they never modify the published directory content.
- **Creating memories with photos.** A signed-in member can compose memory entries (title and story text, optionally with one or more photos) attached to their profile. Photos are read from the visitor's device and stored browser-locally (no upload exists in a static preview), so practical size and count limits apply and are communicated in the UI. Created memories appear on the member's own account/profile view labeled as pending review — consistent with feature 0002's decision that the public memory/picture sections show only reviewed content.

This is a preview simulation of Phase 1 MVP "user registration" and contributor profiles from the roadmap, not a substitute for them. Production will use OpenID Connect against the .NET API, with photos in Azure Blob Storage; nothing in this feature should be mistaken for, or grow into, real authentication or real media handling. The UI must keep saying so, in English and Spanish.

## Scope

- Extend the existing registration flow in `docs/app.js` so submitting the form creates a mock account keyed by email and immediately establishes a signed-in session (ratified 2026-07-17) — no separate login step is required right after registering, though the login view remains available for return visits.
- Add a login view with a single email field, mock validation against stored accounts, and a clear bilingual error message when no account exists for that email in this browser.
- Add a browser-local session persisted in `localStorage` (ratified 2026-07-17): logging in (or registering) keeps the visitor "signed in" across page reloads, tab closes, and return visits until they explicitly log out — the session does not expire on its own.
- Reflect session state in the header/navigation: signed-out visitors see Join / Sign in; signed-in visitors see their name, a link to their mock account view, and Sign out.
- Add a signed-in account/profile view showing the registered details, the member's alumni claim, their created memories, and the existing mock-review status message. Registered details, the claim, and memories are all editable/removable from this view (ratified 2026-07-17), not read-only after creation.
- Add an alumni-claim flow on the account view: pick country (United States, Panama, Argentina) and build a participation history of one or more year-role records — each record pairs a year (or year range) with the role held then (leader, host, teacher) — so role changes over time (teacher to host, host to leader, teacher to leader) are first-class; optionally match the claim to an existing entry in `docs/content/alumni.json` by picking the matching name from a list (ratified 2026-07-17 — no additional matching detail is required; this is a feedback tool, not an identity-verification demo), or self-declare a new alumni identity. A year or range must fall between 1996 (the program's founding, per `bold-docs/system/product.md`) and the current year, and a range's end must not precede its start; the country/role combination chosen determines the candidate list for matching, and an empty candidate list (no existing profile matches) simply routes the member to self-declare instead of showing an empty picker.
- Add a memory-composer on the account view: title, a single free-text story field in whichever language the member writes (ratified 2026-07-17 — the surrounding chrome stays bilingual, but member-authored text is not split into separate EN/ES fields), and optional photo attachments read from the visitor's device and persisted browser-locally; created memories list on the member's own account view with a pending-review label and can be edited or deleted there. Only image files (the browser file picker restricted to image MIME types) are accepted as photo attachments; a non-image file is rejected with a bilingual message rather than silently accepted or crashing the composer.
- Add a "clear my preview data" action on the account view (ratified 2026-07-17) that deletes the account, session, claim, memories, and photos for that email from `localStorage` in one step and returns to the signed-out state.
- Overlay the signed-in member's pending memories and photos onto their claimed alumni profile page — rendered in the existing memories/pictures sections with a clear "pending review" badge, visible only in the author's own browser (ratified 2026-07-17) — so a member can see their profile as it would look after approval.
- Persist photos in `localStorage` after client-side downscaling: each photo is resized in the browser (canvas, longest edge ~1024px, JPEG) and stored as a data URL, capped at 3 photos per memory and 10 memories per member (ratified 2026-07-17), with bilingual messaging when a cap is reached or storage is full.
- Cap this feature's own total `localStorage` footprint (accounts, sessions, claims, memories, and photos combined) at roughly 3MB (ratified 2026-07-17), enforced independently of the browser's overall origin quota, so this feature cannot crowd out the pre-existing mock submission queue's writes even under heavy photo use — the two caps are unrelated by design, not because one guards the other.
- Converge the seed directory onto the same participation model: migrate `docs/content/alumni.json` and `docs/content/alumni.schema.json` from flat `functions` + `years` fields to a `participation` array of role/years records (a record may carry a single year, a year list, or a range, so unknown transition years are never fabricated), and update the directory/profile renderers to derive function grouping and year display from those records.
- Keep published content untouched at runtime: claims and member-created memories never modify `docs/content/alumni.json` or the public alumni profile pages for other visitors; at most, the signed-in member sees their own pending items clearly distinguished from reviewed content. (The one-time seed migration above is an authored content change on this branch, not runtime behavior.)
- Keep the existing "pending review" simulation intact: registering still produces the mock submission entry, and the account view explains that an editor would review the profile, claims, and memories before directory access or publication in production.
- Everything member-created stays permanently "pending review" — the mock never simulates an approval transition (ratified 2026-07-17), so the editor-review story remains unambiguous.
- No password or passcode exists anywhere in the mock: the email address is the sole identifier, and the sign-in screen explains this is a preview convenience, not real security.
- All new visible strings exist in both English and Spanish, following the existing `i18n` string tables in `docs/app.js`.
- Follow the West Wichita Rotary design system for the login form, header state, and account view (existing `docs/styles.css` patterns).
- No backend, API call, external service, analytics, cookie, or third-party call is introduced — not even a mocked-out fetch layer "for later." Everything stays same-origin static under `docs/`, and the only network activity is the browser loading the static site's own files.
- Optimize for feedback, not fidelity: mock states (pending review, claim matched, photo saved) exist to prompt reviewer reactions, and the UI may say plainly "in production this would..." wherever that helps the visioning conversation.

Out of scope: publishing claims or memories into `docs/content/alumni.json` or any shared/public surface (mock review never "approves" into published content), an editor/moderation UI, password reset, email verification, permissions beyond the signed-in member seeing their own data, and any production authentication or media-storage work.

## Acceptance Criteria

- Submitting the registration form creates the mock account and signs the visitor in immediately, with no separate login step required; on a later visit the same visitor can also sign in by entering the email they registered with. No password field exists anywhere in the preview.
- Closing the browser and returning preserves both the stored mock account and, if they didn't log out, the signed-in session — the session persists until explicit logout, not just for the browser session.
- Signing in with an email that has no account in this browser shows a clear bilingual error and does not establish a session.
- The header visibly changes between signed-out and signed-in states, and Sign out returns the site to the signed-out state without deleting the stored account.
- Registering with an email that already has a mock account is handled explicitly (bilingual message; no silent overwrite of the existing account).
- The registration and login screens carry a bilingual notice that this is a preview simulation, sign-in is a mock convenience rather than real security, data stays in this browser only, and anyone else using the same browser can see the same mock data.
- A signed-in member can claim alumni status with a country and a participation history of year-role records, see the claim reflected on their account view marked pending review, and edit or withdraw it.
- A claim with different roles in different years (e.g., teacher in one year, host in later years, leader after that) is entered naturally and renders clearly as a role-over-time history, not a flattened role list.
- A participation year or range is rejected with a bilingual message if it falls outside 1996–present or if a range's end precedes its start.
- A claim can be matched to an existing `alumni.json` profile by picking it from a list (no additional matching detail required) or self-declared; either way the public directory and other visitors' views are unchanged. When no existing profile matches the chosen country/role, the member is routed straight to self-declare rather than shown an empty list.
- A member can edit their registered details or any memory, and edit or withdraw their claim, from the account view after creating them — "withdraw" is the one consistent term for claim removal across this spec and, eventually, the UI copy.
- A member can trigger "clear my preview data" to remove their account, session, claim, memories, and photos in one action and return to the signed-out state.
- `docs/content/alumni.json` and its schema use the `participation` role/years record shape; no seed profile carries the old flat `functions`/`years` fields, and no seed record asserts a role-transition year that isn't actually known (ranges/lists cover uncertainty).
- Directory grouping by function, country filtering, and year display all still work as they did in feature 0002, now derived from participation records — including people whose records span multiple roles.
- A signed-in member can create a memory with title, text, and at least one photo; the memory (with photo) persists across browser restarts and renders on their own account view labeled pending review.
- Attempting to attach a non-image file to the memory composer is rejected with a clear bilingual message rather than silently accepted or crashing the composer.
- When the member has claimed an alumni profile, their pending memories and photos also render on that profile page in the existing memories/pictures sections with a "pending review" badge — in their browser only; signed-out visitors and other browsers see the page unchanged.
- Photos are downscaled in the browser before persistence (longest edge ~1024px JPEG data URL); the caps — 3 photos per memory, 10 memories per member, and a ~3MB total footprint for this feature's own data — are enforced and communicated, and hitting any cap or a full `localStorage` produces a clear bilingual message rather than a silent failure or a broken page.
- This feature's own storage ceiling is reached (and communicated) well before the browser's origin-wide quota is at risk, so the pre-existing mock submission queue keeps writing successfully regardless of how much this feature's data has accumulated.
- Member-created memories and photos are visible only in the browser that created them and are never presented as reviewed/published content.
- The existing mock submission queue and its 12-entry cap keep working unchanged.
- All new labels, buttons, notices, and errors render correctly in both English and Spanish, on desktop and mobile widths.
- The static preview still works when served from GitHub Pages with no new build step, dependency, or network call.
- Behavior degrades gracefully when `localStorage` is unavailable (e.g., private browsing restrictions): the preview stays usable and explains that the mock login simulation is unavailable.

## System Alignment

- Backbone principle 2: community registration is core platform scope; this simulates it for reviewers.
- Backbone principle 3: privacy review gates directory access and publication — mock login, claims, and member-created memories must not bypass the "editor reviews before public release" story; pending items stay browser-local and clearly labeled, and photo guidance reminds members not to include children or private details in preview uploads.
- Backbone principle 4: every new string ships in English and Spanish.
- Backbone principle 5: registration personas (teacher, host family, Rotary leader, coordinator, school administrator) remain first-class in the form.
- Backbone principle 6/`system/prototype.md`: the preview mocks behavior locally; this feature stays inside that boundary and does not become production auth direction.
- Backbone principle 7/8: new UI follows the West Wichita Rotary design system and existing preview styling patterns.
- Backbone principle 9: production auth is OpenID Connect on the .NET API; the mock account, claim, and memory shapes should note, briefly, how they map to future member, membership-link, and submission entities, and nothing more.
- Backbone principle 10: production photos live in Azure Blob Storage; browser-local photo storage here is a stand-in only and must not shape the production media model.
- Feature 0002's content model decision governs the account ↔ alumni-profile relationship: membership and alumni/community profiles stay distinct concepts, with a claim as the optional link between them.
- Feature 0002 left open whether participation should become separate dated role records; this feature answers it — both member claims and the seed `alumni.json` converge on a `participation` array of role/years records (ratified 2026-07-17), one canonical shape for the future production model to follow.
- `bold-docs/system/privacy-and-governance.md` governs what the account view may display.

## Affected Files

- `docs/app.js` — registration extension, login view, session state, header state, account/profile view, alumni-claim flow, memory composer, photo persistence, participation-record rendering, new EN/ES strings.
- `docs/content/alumni.json` — seed migration from flat `functions`/`years` to `participation` role/years records.
- `docs/content/alumni.schema.json` — schema updated to the participation-record shape.
- `docs/styles.css` — login form, header account state, account view, claim and memory-composer styling.
- `docs/README.md` — document the mock account/login simulation.
- `bold-docs/system/prototype.md` — extend the Public Static Preview notes to mention mock login.
- Bold feature artifacts for this work.

## Open Questions

None outstanding — all resolved during clarification (2026-07-17) and folded into Scope/Acceptance Criteria above.

## Tasks

- [X] T001 [P] Migrate `docs/content/alumni.json` from flat `functions`/`years` fields to a `participation` array of role/years records (single year, list, or range per record; no fabricated transition years)
- [X] T002 [P] Update `docs/content/alumni.schema.json` to document the `participation` record shape and remove the old flat fields
- [X] T003 Update the alumni directory/profile renderers in `docs/app.js` to derive function grouping, country filtering, and role-over-time year display from `participation` records
- [X] T004 Add a `localStorage`-backed mock account store in `docs/app.js` (create/find account by email; duplicate-email registration is handled explicitly, no silent overwrite)
- [X] T005 Add a `localStorage`-backed session store in `docs/app.js` (current signed-in email persists across reloads and browser restarts until explicit logout)
- [X] T006 Extend the registration submit handler in `docs/app.js` to create the mock account and establish the session immediately on submit
- [X] T007 Add a login view in `docs/app.js` with a single email field and a bilingual error when no account exists for that email in this browser
- [X] T008 Add signed-out/signed-in header states and a Sign out action in `docs/app.js` (Sign out clears the session but keeps the stored account)
- [X] T009 Add bilingual "preview simulation, mock convenience not real security, data stays in this browser" notices to the registration and login screens in `docs/app.js`
- [X] T010 Add a signed-in account/profile view in `docs/app.js` showing registered details (editable), the claim, memories, and the existing mock-review status message
- [X] T011 Add the alumni-claim flow in `docs/app.js`: country picker plus a participation-history builder of year/range-and-role records, with edit/withdraw from the account view
- [X] T012 Add "match to an existing alumni.json profile" (pick from list) and "self-declare a new identity" paths to the claim flow in `docs/app.js`, without ever writing back to `alumni.json`
- [X] T013 [P] Add a photo downscale utility in `docs/app.js` (canvas resize to ~1024px longest edge, JPEG data URL output)
- [X] T014 Add the memory-composer in `docs/app.js` (title, single free-text story field, optional photo attachments via T013), persisted to `localStorage`, editable/deletable from the account view, labeled pending review
- [X] T015 Enforce and communicate the 3-photos-per-memory and 10-memories-per-member caps, and a full-`localStorage` case, with bilingual messaging in `docs/app.js`
- [X] T016 Overlay the signed-in member's pending memories/photos onto their claimed alumni profile page in `docs/app.js`, with a "pending review" badge, visible only in the author's own browser
- [X] T017 Add a "clear my preview data" action in `docs/app.js` that removes the account, session, claim, memories, and photos for the signed-in email in one step
- [X] T018 Add a `localStorage`-availability check in `docs/app.js` with a graceful fallback message when unavailable, keeping the rest of the preview usable
- [X] T019 Add all new English and Spanish strings for T004–T018 to the existing `i18n` tables in `docs/app.js`
- [X] T020 Style the login form, header account state, account view, claim flow, and memory-composer in `docs/styles.css` following existing West Wichita Rotary design-system patterns, verified responsive on desktop and mobile
- [X] T021 Update `docs/README.md` to document the mock account, login, claim, and memory simulation
- [X] T022 Update `bold-docs/system/prototype.md`'s Public Static Preview notes to mention the mock login/claim/memory simulation
- [X] T023 Verify locally via a static server: register→auto-login, logout, login by email, duplicate email, claim with multi-year role history, memory with photo, caps and full-storage messaging, clear-my-data, English/Spanish, mobile width, the `localStorage`-unavailable fallback, the unchanged 12-entry mock submission queue, and no new build step/dependency/network call. Verified live in-browser: registration auto-signs in and persists across reload, logout/login-by-email, unknown-email error, duplicate-email handling (no overwrite, no silent sign-in), a two-role claim (teacher 2019, host 2024–2026) rendering as role-over-time history, claim-to-profile matching (found and fixed a bug where matching used the old `profile.functions` field instead of `participation`), a memory with text persisting and overlaying the claimed public profile page as "pending review" only in the signed-in browser (confirmed absent when signed out), full English/Spanish parity across all new screens, and a mobile-width layout check. Photo attachment, the 3MB storage-budget message, and the `localStorage`-unavailable fallback were verified by code review only — the browser tool available for this session has no file-upload capability and no way to simulate storage exhaustion/denial.
- [X] T024 Run formatting/syntax checks. `node --check docs/app.js` passes; `docs/content/alumni.json` and `docs/content/alumni.schema.json` parse as valid JSON.
