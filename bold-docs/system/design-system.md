# Design System

Product Owner TL;DR: Production UI should follow the West Wichita Rotary visual system discovered in the prototype: Rotary blues, Rotary Gold accents, small-radius utility UI, bilingual content, and reusable primitives for buttons, cards, badges, callouts, and areas-of-focus tags.

## Sources

Full source-of-truth copy, synced from the claude.ai Design project "West Wichita Rotary Design System" (`51609796-e93d-4753-840e-30196038f3b2`) into `bold-docs/features/0001-static-prototype-preview/prototype/_ds/west-wichita-rotary-design-system-51609796-e93d-4753-840e-30196038f3b2/`:

- `readme.md` — full narrative brand spec (voice, visual foundations, iconography, caveats)
- `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` — design tokens
- `components/core/` — `Button`, `Card`, `Badge`, `Callout`, `AreaOfFocusTag` (JSX + `.d.ts` + usage docs + live demo)
- `ui_kits/club-website/` — click-through Home/Events/Membership reference composition
- `guidelines/` — foundation specimen pages (colors, type, spacing, brand/iconography)
- `assets/` — club logo, Areas of Focus icon set, watercolor illustration, Paul Harris portrait, World Polio Day imagery (a few campaign/social images exceeded the design-sync single-file transfer cap and were not pulled — the Rotary Youth Exchange logo, the cranberry membership webbanner, and the two "proud member" social photos; re-run design-sync to fetch those individually if needed)
- `_adherence.oxlintrc.json` — lint rules enforcing token usage and component prop contracts

The live static preview (`docs/styles.css`) loads the real Oswald/Open Sans fonts from Google Fonts (previously fell back to system fonts only) but does not yet consume the token files directly — it hand-maintains a matching color subset. Full token/component adoption in `docs/` is tracked as future production-discipline work.

## Brand Foundations

- Leadership colors: Azure `#0067c8`, Sky Blue `#00a2e0`, Royal Blue `#17458f`, Rotary Gold `#f7a81b`.
- Neutrals: Charcoal, Pewter, Smoke, Silver, and related warm/cool grays.
- Secondary colors are for emphasis or differentiating series, not primary UI ownership.
- Rotary Gold is an accent or band, not a dominant page fill.
- Official Rotary assets, especially Areas of Focus imagery, should be used as supplied.

## Typography

- Display: Oswald as the free substitute for Frutiger Condensed/Black.
- Body: Open Sans as the free substitute for Frutiger Regular.
- Serif: Georgia only for sparing editorial or quote treatments.
- If licensed Rotary fonts are supplied later, replace the substitutes with the real font files.

## UI Conventions

- Cards use a thin border, 8px radius, and a top accent band.
- Buttons use 4px radius and variants aligned with the design system.
- Badges and filters use pill radii.
- Layouts use centered content columns, responsive grids, and generous section spacing.
- Visual treatment is flat, saturated, and service-oriented; avoid decorative gradients, blur, and glass effects.

## Component Contracts

Prototype component set:
- `Button`: variants `primary`, `gold`, `outline`, `ghost`; sizes `sm`, `md`.
- `Card`: accents `gold`, `azure`, `none`.
- `Badge`: tones `azure`, `gold`, `grass`, `cranberry`, `neutral`.
- `Callout`: tones `royalBlue`, `cranberry`.
- `AreaOfFocusTag`: areas `peace`, `disease`, `water`, `economic`, `environment`, `education`, `maternal`.

## Production Discipline

New production UI should use tokens and component abstractions rather than raw hex colors, raw spacing literals, or off-system fonts. The current prototype uses generated inline styles and is grandfathered as reference evidence.
