Product Owner TL;DR: This checklist tests whether the spec's own requirements are complete, unambiguous, consistent, and measurable enough to build and verify against — it does not test the future implementation.

## Completeness
- CHK001 — Is the total `localStorage` budget this feature is allowed to consume (across accounts, sessions, claims, memories, and photos) stated as a number anywhere? [Resolved 2026-07-17 — Scope now states a ~3MB feature-wide ceiling independent of the per-photo/per-memory/per-member caps]
- CHK002 — Is a valid year range for a participation record specified (minimum/maximum year, range-ordering rule)? [Resolved 2026-07-17 — 1996–present, range end not before start]
- CHK003 — Is the behavior specified for what happens to a member's claim and memories if they later use "clear my preview data" while signed in vs. what happens to data left behind under an email no one signs into again? — Acceptance Criteria: "clear my preview data" [Complete — spec states it removes account, session, claim, memories, and photos for the signed-in email in one step]
- CHK004 — Does the spec state what supported image file types are accepted for photo attachments? [Resolved 2026-07-17 — image-only file picker; non-image attachments rejected with a bilingual message]
- CHK005 — Is the field set for "registered details" shown on the account view specified anywhere (which registration-form fields carry through), or only referenced generically? — Scope: "showing the registered details" [Partial — the existing registration form's fields are the implied source but never enumerated in this spec; acceptable, since the form itself is unchanged by this feature]

## Clarity
- CHK006 — Is "clear bilingual error message" for an unknown-email login quantified with actual wording or left to implementer judgment? — Acceptance Criteria [Partial — content intent is clear (no account found) but no example copy is given, consistent with how other bilingual notices in this spec are also left to implementation]
- CHK007 — Is "sensible" storage handling anywhere replaced with a measurable number for the photo/memory caps? [Complete — 3 photos/memory and 10 memories/member are explicit numbers, ratified 2026-07-17]
- CHK008 — Is "practical size and count limits" in Intent reconciled with the explicit numeric caps stated later in Scope? [Partial — Scope's numbers stand as the authority; Intent's softer phrasing remains but no longer conflicts since Intent's other bullets were brought current in this pass]

## Consistency
- CHK009 — Does the spec use one consistent verb for removing a claim ("withdraw" vs. "delete") across Scope and Acceptance Criteria? [Resolved 2026-07-17 — "withdraw" used exclusively for claims, "delete" reserved for memories]
- CHK010 — Does Intent's narrative of the registration→login flow match Scope's specified auto-sign-in-on-registration behavior? [Resolved 2026-07-17 — Intent's Registration bullet now states the immediate sign-in]
- CHK011 — Is the "pending review" label used consistently for claims, memories, and the pre-existing submission queue, or does terminology drift between sections? [Complete — "pending review" is used uniformly across Intent, Scope, and Acceptance Criteria for all three]

## Measurability
- CHK012 — Can "the header visibly changes between signed-out and signed-in states" be verified without a subjective judgment call? [Complete — Acceptance Criteria additionally specifies the exact signed-out (Join/Sign in) and signed-in (name, account link, Sign out) states, which is what makes this measurable]
- CHK013 — Can "renders correctly... on desktop and mobile widths" be verified against a specific breakpoint, or only against "looks fine"? [Partial — the spec defers to "existing `docs/styles.css` patterns" rather than stating explicit breakpoints; acceptable only because those patterns already exist and are established, not newly invented here]
- CHK014 — Is "no new build step, dependency, or network call" independently verifiable (e.g., by diffing `package.json`/build config and inspecting network activity), or only asserted? [Complete — verifiable by inspection; Tasks §T023 explicitly includes this check]

## Coverage
- CHK015 — Does the spec address what a signed-in member sees if they claim a country/role that has zero existing profiles to match against (empty match list)? [Resolved 2026-07-17 — routes straight to self-declare instead of an empty picker]
- CHK016 — Does the spec address accessibility (keyboard/screen-reader use) for the new login, claim, and memory-composer forms, consistent with the rest of the static preview? [Gap — not mentioned; the existing preview's accessibility posture, if any, isn't referenced as a baseline to match; left open as genuinely out of this pass's scope]
- CHK017 — Does the spec cover what happens if a member attempts to attach a non-image file to the memory composer? [Resolved 2026-07-17 — rejected with a bilingual message]
- CHK018 — Is the shared-device privacy risk of email-only login (per `gates/critic.md` trust-boundaries note) covered by an explicit Acceptance Criterion, or only implied by the general "not real security" notice? [Resolved 2026-07-17 — the bilingual-notice Acceptance Criterion now states it explicitly]
