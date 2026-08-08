---
tier: Feature
feature_id: 0005-awareness-first-mission-review
status: Draft
branch: 0005-awareness-first-mission-review
created_at: 2026-07-22
source_request: "Write up the formal review with ideas for how to influence/change the RITE site" — following a conversation where the product owner said RITE's mission has changed to lead with awareness, communication, and learning rather than looking back at history, and asked for a benchmark review of rotaryyouthexchangekansas.org (a sister Rotary exchange program, not RITE) for inspiration.
---

# Awareness-First Mission Review

**Status**: Draft
**Tier**: Feature

Product Owner TL;DR: The product owner now wants RITE to lead with awareness, communication, and learning about an active program — not with "living archive" / history-first framing. That's bigger than a copy tweak: `bold-docs/backbone.md` principles 1 and 2 currently define RITE's product identity itself around preservation and archive. This feature is the formal review that documents the case for that shift, benchmarks a comparable sister program (Rotary Youth Exchange Kansas) for concrete patterns worth borrowing, and lays out specific, individually-reviewable proposed changes — packaged so former teachers, host families, and program leaders can react to it and the product owner can ratify a decision. It does not touch `docs/` production content; implementation is a follow-up feature once stakeholder buy-in is recorded, the same sequencing 0004 followed after its own tone/IA decisions were ratified 2026-07-21. The product owner has already ratified two points during this review (2026-07-22): History stays exactly where 0004 put it (nested under About, no further demotion), and the RYE Kansas benchmark must be read through the gap between the two programs — RITE is less publicly known, is a ~4-week adult-teacher commitment rather than a year-long teen exchange, and sells on professional multiplier impact rather than personal transformation. See Decisions below.

## Intent

Three things converged to trigger this review:

1. **A mission shift the product owner named directly.** After 0004 already moved tone from "history-first" to "upbeat, participation-led" (`[[rite-messaging-priorities]]`, captured 2026-07-21), the product owner went further: the site's actual mission should now foreground awareness, communication, and learning about an ongoing program, not archival preservation. That is a statement about what RITE *is*, not just how a page reads — and it directly overlaps backbone principles 1 ("Product identity is fixed... preserving the teacher exchange begun in 1996") and 2 ("The product is a living archive and community platform").
2. **Informal validation already in hand.** Several former teachers, host families, and program leaders have seen an early preview and responded encouragingly — not a formal committee vote, but real signal that the direction resonates with people close to the program.
3. **A useful external benchmark.** `rotaryyouthexchangekansas.org` (Rotary Youth Exchange, Districts 5710/5680 — a different program, not RITE) demonstrates several concrete patterns for leading with mission and action while treating history as a credibility badge rather than a destination. Full findings below.

The purpose of this feature is to turn all three into a single, formal, stakeholder-reviewable document — not to edit `docs/app.js` or any shipped content yet.

## Benchmark Findings: Rotary Youth Exchange Kansas

Reviewed 2026-07-22 (Home, About, Students, Host Families pages). Patterns worth borrowing:

- **Hero is mission + action, zero history.** "Building global citizens one exchange at a time" plus two immediate buttons (*Become a Student* / *Host a Student*). No timeline, no founding story above the fold.
- **History is a badge, not a section.** "🎉 Celebrating 50 Years" is one small celebratory banner, not a nav item or dedicated page.
- **About still leads with purpose.** "What is Rotary Youth Exchange?" and program goals come first; the districts' own history is a single sentence.
- **Concrete, low-jargon "Benefits" and "How It Works" lists** answer "what's in it for me" and "what do I actually do," in short bullets and numbered steps.
- **One real story in context, not an archive.** A single Alumni Spotlight Q&A sits exactly where a prospective student is deciding whether to apply — not a browsable story library.
- **A literal application calendar** (Aug info sessions → Oct applications → Dec interviews → Spring orientation → Aug departure) makes the program read as happening *now*.
- **Request-info forms live directly on the Students/Host pages**, not behind a separate contact page.

These are cited as existing proof that a sister Rotary exchange program already runs successfully on an awareness/action-first model with history demoted — useful if anyone pushes back on de-emphasizing RITE's history. **This benchmark only partly transfers to RITE — see Decisions below.**

## Decisions (product owner, 2026-07-22)

- **History stays exactly where 0004 already put it — nested under About.** No further demotion to a badge-only treatment. Resolves open question 2 below; proposed change 2 (further demotion) is rejected.
- **The RYE Kansas benchmark only partly applies, and the gap matters.** Rotary Youth Exchange already has a very public, widely recognized story — RYE Kansas can afford to compress its explanation down to a hero line and two buttons. RITE does not have that public recognition yet. RITE's site still has real educating and informing work to do before it can lead as thin as RYE's pattern does — the "lead with mission/action, not history" instinct is right, but the amount of explanatory content RITE needs stays higher than RYE's model would suggest.
- **The commitment shape is fundamentally different and must shape the messaging.** RYE is a full academic year (10–12 months) for a teenager. RITE is a roughly four-week exchange for an adult, credentialed teacher. Patterns borrowed from RYE (benefits lists, how-it-works, a calendar view) need to be reframed around a short, professional-development-style commitment — not a year-long immersive life-change narrative aimed at a teenager and their family.
- **RITE's core value proposition is the professional multiplier, not personal transformation.** Participants are adult teachers, not students. The site's story should center on how a teacher's own growth carries forward into their classroom and reaches many children — collectively, one exchange teacher can affect far more children than an RYE-style personal-growth-for-one-student narrative implies. This reaffirms 0004's existing multiplier framing (`[[rite-messaging-priorities]]`); it does not replace it.
- **Funding stays a very soft sell.** Reaffirms 0004's existing "Support RITE" constraint (contact/interest form only, no donate button, no tax language) — explicitly reiterated here as *very* soft, not just soft.
- **The broader-outreach email must specifically surface these numbered proposed changes, not just the general preview, before the product owner ratifies.** The informal signal already in hand (a handful of former teachers, host families, and leaders reacting to the general preview) is encouraging but is not treated as sufficient buy-in for a change that redefines backbone principles 1–2 (RITE's product identity itself). Resolves open question 3 below.
- **This review must also be produced as a short, non-technical one-pager (or shareable rendered page) separate from this spec.** Former teachers, host families, and program leaders are the audience, and asking them to read a repo-hosted spec.md is a real barrier to real feedback. Producing that one-pager is deferred as a follow-up task (not part of this spec's Acceptance Criteria, which cover the internal spec document itself). Resolves open question 4 below.
- **Stakeholder feedback closes 2026-08-21 (two weeks from this review's 2026-08-07 clarification pass), after which the product owner ratifies a decision.** Resolves open question 5 below.

## Proposed Changes

Each item below is written to stand alone, so a stakeholder can agree, disagree, or ask a question about it individually rather than approving or rejecting the whole review at once. Items marked **(rejected)** or **(reframed)** already reflect the product owner's 2026-07-22 decisions above.

1. **Revise the mission statement itself.** Replace "RITE is a living archive and community platform" framing (backbone principle 2, `project.json` `product.summary`) with language centered on awareness, communication, and learning about an active, ongoing exchange — while still doing more explaining/educating than RYE Kansas's compressed model, since RITE isn't yet publicly recognized the way Youth Exchange is. Candidate direction: *"RITE builds awareness of an active teacher exchange, connects the people who make it possible, and helps them learn from one another"* — exact wording open for stakeholder input (see Open Questions).
2. ~~Demote history further than 0004 already did.~~ **(rejected, 2026-07-22)** — History stays nested under About exactly as 0004 shipped it. No badge-only treatment.
3. **(reframed)** Adopt a "Program Benefits" / "How the Exchange Works" list pattern, mirroring RYE Kansas's short, concrete bullets — but written around a ~4-week professional exchange for an adult teacher, not a year-long immersive experience for a teenager. Benefit language should speak to professional development and classroom impact, not personal-growth-abroad framing.
4. **(reframed)** Feature one real story in context, not a story archive as a primary destination. Keep the full Community story archive, but pull a single current, real story (e.g., a 2026 inbound teacher or 2025 outbound teacher already sourced in 0004's content) directly into the Home/About/Participate flow at the decision point — framed around the teacher's professional impact and the many children it reaches, not a personal cultural-immersion narrative.
5. **(reframed)** Add a literal program calendar/cycle view, extending 0004's `program-cycle.json` (already modeled from `operating_model`), scaled to RITE's actual annual cycle and ~4-week/2-week seminar structure — not a year-long timeline like RYE's application calendar.
6. **Bring interest/request forms closer to the point of decision.** RYE Kansas embeds request-info forms directly on the Students/Host pages. Evaluate whether RITE's "Support RITE" soft interest form (shipped in 0004) and any future teacher/host interest paths should move from a single consolidated location to being embedded at the relevant decision points — keeping the ask *very* soft per the funding decision above.

## Stakeholder Review Process

- This review is meant to be circulated to a broader group than the informal early readers (former teachers, host families, program leaders) already consulted — consistent with the wider feedback-request email currently being drafted in parallel with this feature.
- Feedback is collected informally (email replies, conversation) rather than through a formal voting mechanism, matching how RITE has operated so far.
- No proposed change in this document is ratified until the product owner records a decision, following the same resolution-log pattern already used twice in `bold-docs/system/creative-brief.md` (2026-07-19, 2026-07-21). A third entry should be added there once decisions are made here.
- Mixed or conflicting feedback is resolved by the product owner, not by consensus vote — RITE has no formal editorial board yet (`creative-brief.md` §29 describes one as a future governance target, not current state).

## Acceptance Criteria

- This document exists at `bold-docs/features/0005-awareness-first-mission-review/spec.md`, covering: current-state summary (backbone principles 1–2, existing creative-brief resolution log), the benchmark findings, and a numbered list of individually stated proposed changes.
- Every proposed change is written so a non-technical stakeholder (a former teacher, host family member, or program leader) can react to it without needing to read code, prior specs, or Bold tooling concepts.
- Proposed changes are explicitly separated from ratified decisions — nothing in this document is treated as final until the product owner records a decision, and this document says so plainly.
- The document states who has already given informal input (former teachers, host families, program leaders) versus who the upcoming broader outreach targets, so it's clear what's already been informally validated versus what's still open.
- No file under `docs/` (the shipped static preview) changes as part of this feature. Implementation of any ratified change is explicitly deferred to a follow-up feature.
- Backbone principles 1 and 2 are quoted verbatim in this document and flagged as the specific principles a ratified mission reframe would need to amend — the review does not silently redefine them.
- The RYE Kansas benchmark citation includes the source URL and the date it was reviewed, and does not reproduce more than short paraphrased observations (no verbatim copying of their copy beyond brief attributed quotes already used in this conversation).
- The document explicitly states where the RYE Kansas benchmark does *not* transfer directly to RITE — RYE's public recognition, year-long commitment, and teenage-participant framing all differ from RITE's lower public awareness, ~4-week commitment, and adult-teacher-multiplier value proposition — so no proposed change borrows an RYE pattern without accounting for that gap.
- History's placement (nested under About, per 0004) is explicitly confirmed as unchanged by this review, not silently left ambiguous.

## Open Questions

1. **Exact mission-statement wording.** A candidate direction is offered above; final wording is open pending stakeholder and product-owner input.
2. ~~How far History gets demoted.~~ Resolved (product owner, 2026-07-22): **stays exactly where 0004 put it — nested under About, no badge-only treatment.**
3. ~~Which stakeholder group ratifies.~~ Resolved (product owner, 2026-08-07): **the broader-outreach email must specifically surface these numbered proposed changes before ratification; informal signal on the general preview alone is not sufficient.**
4. ~~Format for circulation.~~ Resolved (product owner, 2026-08-07): **yes, produce a short non-technical one-pager/shareable rendered page separate from this spec — a follow-up task, not an edit to this document.**
5. ~~Deadline for feedback.~~ Resolved (product owner, 2026-08-07): **feedback closes 2026-08-21.**
