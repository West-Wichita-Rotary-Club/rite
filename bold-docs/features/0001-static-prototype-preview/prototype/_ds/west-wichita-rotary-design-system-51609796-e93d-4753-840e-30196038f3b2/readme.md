# West Wichita Rotary Design System

A design system for **Rotary Club of West Wichita** — a local chapter of Rotary International ("Service Above Self"). The club's communications span weekly meeting promotion, membership recruitment, community service project updates, and Rotary International campaign tie-ins (Areas of Focus, End Polio Now, Rotary Youth Exchange).

## Sources

This system was built entirely from a `brand/` folder of official downloads the club provided, mounted read-only for this project:

- `brand/design-system.md` — a prior starter write-up describing the club's Brand Center downloads
- `brand/tokens.json` — machine-readable color/type/spacing tokens (the primary source of truth for this system)
- `brand/index.html` — an earlier HTML starter using the same tokens
- `brand/WestWichitaRotary.png` / `.jpg` — the club's official customized logo (Masterbrand Signature + "West Wichita")
- `brand/AOF_group_circle_color_EN.png`, `..._white_text_CMYK_EN.png` — Rotary's official 7-icon Areas of Focus set
- `brand/AOF_water_color_bottom_title_rev_EN.png` — watercolor-style Areas of Focus illustration
- `brand/RYE-text-color-EN22...` — Rotary Youth Exchange logo (png/jpg/eps)
- `brand/PaulHarris.jpg` — portrait of Paul Harris, Rotary's founder
- Campaign/social templates: `PM2627-BC-WEBBANNER-CRANBERRY-1600x400-EN-US.png` (membership), `Proud-rotary-1080x1080/1920-EN24...` (proud member social posts), `WPD23-ThankYou-1080x1080-6...` (World Polio Day)
- Reference PDFs (not mined for design tokens, kept as source material): `3257ActionPlanVideosDiscussionGuide-Impact-EN25...pdf`, `419-ProspectiveMemberCard-24-EN-EN...pdf`, `LogosataGlance-EN-US25...pdf` (the brand sheet the colors/type above were transcribed from)

No Figma file, GitHub repo, or app codebase was attached — this is a **brand-guidelines-only** build. There is no existing component library or app UI to recreate, so the component set below is a standard, from-scratch set sized to a small nonprofit club site's needs (see "Intentional additions" below).

## Content fundamentals

- **Voice:** first-person plural for the club ("we", "join us"), first-person singular for member-facing campaign copy ("I'm a proud member!", "I'm helping eradicate polio"). Direct, active, unpretentious — a local volunteer club, not a corporation.
- **Case:** headlines and eyebrows are set in bold uppercase condensed type ("CREATE LASTING IMPACT", "ROTARY'S AREAS OF FOCUS"). Body copy is standard sentence case.
- **Tone:** warm, service-minded, and matter-of-fact about impact — copy states what the club *does* ("Track hours and sign up for upcoming volunteer projects around Wichita") rather than aspirational brand language.
- **Tagline:** "Service Above Self" is Rotary's motto and appears as an eyebrow/kicker line ahead of headlines.
- **Naming rule:** always pair "Rotary" with the club name in project/event titles (e.g. "Rotary Club of West Wichita Bingo Night") — the bare word "Rotary" can't be used for something the club doesn't fully control.
- **Emoji:** not used anywhere in official materials reviewed.
- **Numbers/CTAs:** campaign materials favor short, punchy exclamatory lines ("I'M A PROUD MEMBER!") over paragraphs; the site/newsletter copy is more conversational and explanatory.

## Visual foundations

- **Color:** Four "leadership" colors carry nearly all visual weight — Azure `#0067c8` (used most), Sky Blue `#00a2e0`, Royal Blue `#17458f`, and Rotary Gold `#f7a81b` (sparing "jewel" accent, used as a rule/band, never a large fill). A twelve-color secondary palette (Cranberry, Cardinal, Turquoise, Violet, Orange, Grass, etc.) exists only for emphasis or differentiating items in a series — never as a primary UI color. Neutrals are Cool/Warm Gray tones (Charcoal for body text, Pewter/Smoke/Silver for muted UI).
- **Type:** Two-family system. Display/headline type is bold, condensed, uppercase, tight-leading (Frutiger Condensed/Black officially; Oswald as the free substitute here). Body type is a humanist sans (Frutiger Regular officially; Open Sans here). A secondary serif (Sentinel, substituted with Georgia) exists in the official kit for editorial/quote treatments but wasn't seen in use in any sampled material — used sparingly if at all.
- **Backgrounds:** Mostly flat solid color blocks (single leadership or secondary color, edge-to-edge) for campaign/social graphics. One social template uses a **halftone dot pattern** (graduated dot size, same hue as the base color) as a subtle texture overlay — no photographic backgrounds, no gradients, no grain were observed.
- **Imagery:** Minimal use of photography in the sampled materials (one founder portrait). The dominant "imagery" is the Areas of Focus icon set, available in two styles: flat-line color icons with labels, and a looser watercolor-textured illustration variant. No full-bleed photographic hero images were found in the source set.
- **Animation:** No motion was observed in any source material (all static PDFs/PNGs/JPGs). No easing, transition, or hover-animation conventions to inherit — this system defines simple, conservative defaults (120ms ease color transitions) rather than importing brand precedent.
- **Hover/press states:** Not defined in source materials (all static assets). This system's components use conservative, typical web defaults: hover darkens/shifts to the next-darker leadership color (e.g. Azure → Royal Blue), press has no special treatment defined — flag if the club wants specific states.
- **Borders & shadows:** Cards use a thin 1px light gray border (`#e2e6ec`, not from the official palette — a neutral UI convenience), no drop shadow in the original starter kit; this system adds a very subtle shadow token (`--shadow-card`) for elevation where needed, kept minimal.
- **Corner radii:** Small and utilitarian — 4px (`--r-sm`) for buttons/inputs, 8px (`--r-md`) for cards, full pill (`--r-pill`) for badges/tags. No large "soft UI" radii anywhere in source.
- **Layout:** Simple, centered content columns (max-width ~1100px) with generous section padding. No fixed/sticky chrome was observed in the source starter.
- **Transparency/blur:** Not used in any source material — no glassmorphism, no backdrop blur.
- **Color vibe of imagery:** Cool-leaning (blues dominate), flat and saturated rather than muted — bright gold as the singular warm accent. No grain, no desaturation, no black-and-white treatment observed.
- **Cards:** Signature treatment (carried over from the original starter kit) is a thin light border, 8px radius, and a 6px solid color band across the top (gold by default) — not a left-border accent.

## Iconography

- The **only** icon system found in the source materials is Rotary International's official **Areas of Focus** icon set — 7 line-style icons (peace/dove, health/stethoscope+heart, water/droplet+hand, economic/coin stack, environment/tree+sun, education/book+pencil, maternal/parent+child), each keyed to a specific color, provided as full pre-composed PNGs (with and without titles baked in) plus a watercolor-illustration variant. These are raster compositions, not an SVG icon font or sprite — copied as-is into `assets/icons/` and `assets/illustrations/`.
- No general-purpose UI icon font, SVG sprite, or icon library (Lucide/Heroicons/etc.) was found in the source. No emoji or Unicode-glyph icon usage was observed anywhere.
- **Intentional addition:** since club site UI needs basic interface icons this source doesn't define (chevrons, menu, calendar, etc.), reach for **Lucide** (https://lucide.dev) via CDN if/when a UI kit needs a generic interface icon — its clean-line, medium-weight stroke style is the closest match to the Areas of Focus line icons. Flagged here as a substitution, not a source asset.
- The `AreaOfFocusTag` component (below) is a code-drawn colored dot + label, not a redrawing of the official icon artwork — for the actual icon artwork, always use the PNGs in `assets/icons/`, never redraw them.

## Typography substitution (flagged)

The club's licensed fonts — **Frutiger LT Std** (primary) and **Sentinel** (secondary) — were not available as files. This system uses free Google Fonts substitutes: **Oswald** (condensed display, stands in for Frutiger Condensed/Black) and **Open Sans** (body, stands in for Frutiger Regular), loaded via `tokens/typography.css`. **If the club has licensed access to Frutiger LT Std / Sentinel, please supply the font files (.woff2/.ttf) so this system can be upgraded to the real brand fonts.**

## Components

Standard-set primitives (no existing component library was provided, so this is a from-scratch set sized to the club site's needs — see "Intentional additions"):

- **Button** — `components/core/Button.jsx` — primary/gold/outline/ghost CTA button
- **Card** — `components/core/Card.jsx` — gold-banded content container (meetings, projects, membership blurbs)
- **Badge** — `components/core/Badge.jsx` — small status/category pill
- **Callout** — `components/core/Callout.jsx` — full-width announcement banner with gold rule
- **AreaOfFocusTag** — `components/core/AreaOfFocusTag.jsx` — official Areas-of-Focus category tag (*intentional addition* — see Iconography)

## Index

- `styles.css` — root stylesheet, imports all tokens
- `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` — design tokens
- `assets/logos/` — club logo, Rotary Youth Exchange logo
- `assets/icons/` — Areas of Focus icon set (color + white-text variants)
- `assets/illustrations/` — Areas of Focus watercolor illustration
- `assets/imagery/` — campaign/social materials (membership banner, proud-member posts, World Polio Day, Paul Harris portrait)
- `components/core/` — Button, Card, Badge, Callout, AreaOfFocusTag (+ `.d.ts`, `.prompt.md`, and a `@dsCard` demo per directory)
- `ui_kits/club-website/` — click-through recreation of a club website (Home, Events, Membership)
- `guidelines/` — foundation specimen cards (colors, type, spacing, brand/iconography)
- `thumbnail.html` — homepage tile for this design system
- `SKILL.md` — Claude Code-compatible skill wrapper for this system

## Caveats

- No Figma file, codebase, or existing app/website was attached, so there is no real product UI to recreate — the "Club Website" UI kit is an original, brand-accurate composition, not a recreation.
- Frutiger LT Std / Sentinel (licensed fonts) are substituted with Oswald / Open Sans / Georgia — see "Typography substitution" above.
- Hover/press/animation states are not defined by any source material and use conservative, non-brand-sourced defaults — flag if the club has preferences.
