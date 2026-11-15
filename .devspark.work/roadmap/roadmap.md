# Roadmap: RITE Community Archive and Storytelling Platform

## Direction

RITE builds awareness of an active teacher exchange, connects the people who make it possible,
and helps them learn from one another. It serves teachers, host families, Rotary leaders,
coordinators, and school administrators (`.knowledge/governance/constitution.md` Principle V),
with anonymous visitors able to read approved public content. The mission statement above is
the product owner's ratified 2026-11-15 direction (awareness-first, replacing the prior "living
archive" framing) — see Themes, Mission & Identity Alignment.

## Current Baseline

- **Shipped**: a fully static, mocked public preview lives in `docs/`, served via GitHub Pages
  from `main`. No backend, database, or Azure service exists yet
  (`.knowledge/governance/constitution.md`, "Additional Constraints"; `docs/README.md`).
- **Frontend structure**: the static preview's client code was split from a single
  2,582-line `docs/app.js` into six responsibility-scoped ES modules under `docs/js/`
  (commit `2a8fab1`), documented in `.knowledge/architecture/site-frontend.md`.
- **Content model**: bilingual `docs/content/*.json` (English/Spanish), with matched `en`/`es`
  key counts confirmed clean across every content file in the 2026-11-15 site audit
  (`.devspark.work/audit/2026-11-15_results.md`).
- **Planned, not started**: the production architecture is ASP.NET Core MVC/Web API + SQLite +
  a standalone React site (constitution Principle IX), with Azure hosting and Blob Storage for
  media (Principle X, `adopting`). No package manager or dependency manifest exists in the
  repository yet.
- **Known gaps**: zero test files repository-wide and no CI gate (Principle XI, `adopting`;
  confirmed in the 2026-11-15 site audit). A single contributor accounts for 100% of commit
  history — bus factor 1 (`.devspark.work/audit/commit-audit-2026-11-15.md`).
- **In motion**: the mission statement above was ratified 2026-11-15, but the constitution
  itself still carries the prior "living archive" framing — Principle II is explicitly flagged
  `pending ratified amendment`, deferred to `/devspark-evolve-constitution`
  (`.knowledge/governance/constitution.md`).

## Themes

1. **Mission & Identity Alignment** — apply the ratified mission statement to the constitution
   itself (Principles I and II), and close the remaining open items from that review: Spanish
   translations of any newly ratified copy, and the stakeholder one-pager that review deferred
   to a follow-up implementation feature.
2. **Production Platform Foundation** — stand up the real ASP.NET Core + SQLite + React stack
   (constitution Principle IX); migrate the `docs/` content model and the mocked
   localStorage-backed registration/login/profiles into it for real.
3. **Content & Community Depth** — video oral history archive, school-specific pages, automated
   notifications for new community stories.
4. **Engagement & Insight** — automated host-family matching, participant dashboards,
   interactive impact reporting maps.
5. **Quality & Sustainability** — establish real test coverage and a CI gate (currently zero);
   address the bus-factor-of-1 risk named in the 2026-11-15 commit audit.

No Prospective Specs exist yet under any theme. Add one with
`/devspark-roadmap add a Prospective Spec for <outcome>`.

## Decisions

- **2026-11-15** — Roadmap established with the Direction and five Themes above, as proposed
  and approved by the product owner in this session. Basis: the ratified 2026-11-15 mission
  statement, the constitution's existing Phase 1–3 roadmap sketch, and the gaps surfaced by the
  same day's site audit and commit audit.

## Delivered

None yet.
