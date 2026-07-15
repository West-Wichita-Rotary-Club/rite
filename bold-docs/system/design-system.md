# Design System

Product Owner TL;DR: Production UI should follow the West Wichita Rotary visual system discovered in the prototype: Rotary blues, Rotary Gold accents, small-radius utility UI, bilingual content, and reusable primitives for buttons, cards, badges, callouts, and areas-of-focus tags.

## Sources

- `bold-docs/features/0001-static-prototype-preview/prototype/_ds/west-wichita-rotary-design-system-51609796-e93d-4753-840e-30196038f3b2/readme.md`
- `bold-docs/features/0001-static-prototype-preview/prototype/_ds/west-wichita-rotary-design-system-51609796-e93d-4753-840e-30196038f3b2/tokens/colors.css`
- `bold-docs/features/0001-static-prototype-preview/prototype/_ds/west-wichita-rotary-design-system-51609796-e93d-4753-840e-30196038f3b2/tokens/typography.css`
- `bold-docs/features/0001-static-prototype-preview/prototype/_ds/west-wichita-rotary-design-system-51609796-e93d-4753-840e-30196038f3b2/tokens/spacing.css`
- `bold-docs/features/0001-static-prototype-preview/prototype/_ds/west-wichita-rotary-design-system-51609796-e93d-4753-840e-30196038f3b2/_adherence.oxlintrc.json`

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
