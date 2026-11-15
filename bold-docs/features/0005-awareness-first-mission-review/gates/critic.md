---
gate: critic
feature_id: 0005-awareness-first-mission-review
run_at: 2026-11-15
---

# Critic — 0005-awareness-first-mission-review

**Product Owner TL;DR:** This feature's deliverable is a document, not running software, so most of the usual risk taxonomy (concurrency, secrets, input validation, scale) is genuinely inapplicable. The real risk already materialized: the spec defined a 2-week feedback window and a ratification step, with no fallback if nobody closes the loop — and three months later, nobody has. That's a blocker, not a hypothetical. There's also a real gap in how a ratified mission change would actually amend `backbone.md`, which `enforced` principles require and this spec doesn't define.

## Applicability note

Most standard risk categories don't apply to a planning/review document with no code, no data store, and no runtime: trust boundaries/auth, secrets handling, data loss/continuity, input validation, concurrency, scale bottlenecks, dependency supply chain, and regulatory/privacy are all marked inapplicable below rather than silently skipped.

**Resolved 2026-11-15** — see outcomes noted under each finding below.

## Findings

### 1. [Blocker] Backward compatibility — no defined mechanism to amend `backbone.md` itself
**Spec section:** Proposed Change 1 and the TL;DR's framing of backbone principles 1–2.
**Risk:** Proposed Change 1 directly targets language in `bold-docs/backbone.md` principle 2 (`status: enforced`). Per this gate's severity rule, any backbone-principle collision is automatically a blocker. The spec correctly flags *that* a conflict exists, but never specifies *how* a ratified decision would actually amend `backbone.md` — no mention of who edits it, what review it gets, whether principle 1's identity statement also needs rewording (it's at least as implicated as principle 2), or whether the amendment happens before or after the follow-up implementation feature starts building. Without that, a "yes, ship the new mission framing" ratification has nowhere defined to land.
**Recommendation:** Add a line to the spec (or the follow-up implementation feature's scope) stating that amending `backbone.md` principles 1–2 is an explicit, reviewed step gated on this feature's ratification — not an incidental edit buried in a later content PR.
**Outcome: resolved** — "Backbone Principles At Stake" and the "Ratification" section both state the amendment is scoped to the follow-up implementation feature, now unblocked since ratification has happened (spec.md T006, T012).

### 2. [Blocker] Observability — no fallback when the feedback window closes without a response
**Spec section:** "Decisions" — *"Stakeholder feedback closes 2026-08-21, after which the product owner ratifies a decision."*
**Risk:** This is exactly the kind of "can a failure actually be detected" gap this category exists to catch, and it already happened: the window closed 2026-08-21, nobody recorded a ratification decision, nothing flagged that silence, and the feature sat in Draft for roughly three months before this gate caught it. The spec has no defined behavior for "deadline passed, no quorum of responses, what now" — escalate, extend, or default to the pre-review framing.
**Recommendation:** Before closing this feature out, the product owner needs to actually make a ratify/extend/abandon call now (see `gates/analyze.md` finding 4) — and any future feature with a stakeholder-feedback window should pair it with an explicit re-check task or reminder, not rely on someone remembering to look.
**Outcome: resolved** — product owner chose "ratify now" via `bold.plan clarify` on 2026-11-15 rather than extend or abandon (spec.md T012). The process gap for *future* features (no reminder mechanism) remains a standing lesson, not something this feature's scope fixes.

### 3. [Note] Deployment/rollback — deferred follow-up artifact (one-pager) has no tracking mechanism
**Spec section:** Open Question 4's resolution — *"produce a short non-technical one-pager/shareable rendered page separate from this spec — a follow-up task, not an edit to this document."*
**Risk:** Confirmed via repo search: no one-pager file, issue, or commit exists anywhere in history. A "follow-up task" that isn't tracked as an actual task (an issue, a line item, a checklist entry) is exactly the kind of deferred work that silently drops — which is what happened here. Not a blocker on its own (it doesn't gate this spec's own Acceptance Criteria), but it compounds Finding 2: the broader-outreach email was supposed to surface the numbered proposed changes via that one-pager before ratification, so its absence may be *why* the feedback window produced no response.
**Recommendation:** If the product owner still wants broader outreach before ratifying, track the one-pager as a real task (even a GitHub issue) rather than a line in a spec nobody but this repo's maintainer reads.
**Outcome: not resolved, carried forward** — ratification proceeded without it (see finding 2). Tracked as deferred task T013 in spec.md, scoped to the follow-up implementation feature rather than dropped silently.

### 4. [Note] Backward compatibility — bilingual principle (4, `enforced`) not addressed by the proposed copy changes
**Cross-reference:** Already raised in `gates/analyze.md` finding 3 as a backbone-consistency gap; noted here only because it's also a real compatibility risk for the eventual implementation feature — shipping English-only copy for a mission statement, benefits list, or featured-story placement would itself violate an `enforced` principle. Not duplicated in full; see analyze report.
**Outcome: resolved** — see `gates/analyze.md` finding 3 outcome (spec.md T010).

## Inapplicable categories (evaluated, no finding)

- **Trust boundaries / auth** — no privileged operations; this is a planning document.
- **Secrets handling** — no secrets involved.
- **Data loss / continuity** — no data store or destructive operation.
- **Input validation** — no user input processed by this feature.
- **Error handling / resilience** — no runtime behavior.
- **Concurrency** — no concurrent execution.
- **Scale bottlenecks** — not applicable to a static review document.
- **Dependency supply chain** — no new dependencies introduced.
- **Regulatory / privacy** — no PII collected or processed by this review.
