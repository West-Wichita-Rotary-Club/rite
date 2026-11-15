# AGENTS.md

This repo is built with [DevSpark](https://dev.makeboldspark.com), a Make Bold Solutions
project (the successor to this repo's prior Bold tooling — migrated 2026-11-15). Before doing
any work:

- Read `.knowledge/governance/constitution.md` — non-negotiable rules for this repo.
- `.archive/` (repo root) is committed, human-only history — never read it, with no exception,
  even if a human references it directly. This includes `.archive/bold-docs/`, the full prior
  Bold workflow (backbone, project genome, feature specs and gates, the creative brief) preserved
  for reference during the migration.
- `.devspark.work/` holds in-flight DevSpark work products (specs, quickfixes, PR reviews,
  audits); `.knowledge/` is current authoritative truth for both agents and users.
- `.devspark/` is the installed framework payload — the only directory DevSpark installs,
  upgrades, or removes. Never hand-edit it; personal or team overrides go under
  `.devspark.work/` instead (see below).

Every command below resolves via DevSpark's three-tier override chain (personal > team > stock)
before running — see `.claude/commands/devspark-*.md` for the exact resolution steps:

1. `.devspark.work/{git-user}/commands/devspark.{name}.md` (personalized override)
2. `.devspark.work/commands/devspark.{name}.md` (team customization)
3. `.devspark/defaults/commands/devspark.{name}.md` (stock default)

Commands only run when typed as slash commands with the leading `/` (e.g. `/devspark-specify`);
the bare name without `/` is plain text, not an instruction to run it.

## Lifecycle

| Command | What it does |
|---|---|
| `/devspark-specify` | Understand new work and start the universal implementation path without choosing a workflow size. |
| `/devspark-plan` | Optional — record design decisions when a material uncertainty justifies it; produces the full planning package for an existing specification bundle. |
| `/devspark-tasks` | Coordinate dependency-ordered work when useful; generates `tasks.md` for existing specification bundles. |
| `/devspark-implement` | Start or resume work, implement a useful increment, and verify the affected delta. |
| `/devspark-verify` | Produce empirical proof-of-change evidence for the declared verification proof mode(s) and decide whether the work is finished. |
| `/devspark-quickfix` | Optional lightweight WHAT/WHY/HOW record for a defect already diagnosed, with targeted constitution checks. |
| `/devspark-closeout` | Re-decide whether the active route is finished by classifying every open finding against the convergence rule. |
| `/devspark-next` | Detect where you are in the delivery lifecycle and run the single next DevSpark command after one confirmation. |

## Planning Quality Gates (on demand, never a default)

| Command | What it does |
|---|---|
| `/devspark-analyze` | Non-destructive check that recorded intent, plan decisions, contracts and tests agree. |
| `/devspark-checklist` | Generate a requirements-quality checklist for an existing specification. |
| `/devspark-clarify` | Ask up to 5 targeted clarification questions and encode the answers into the spec. |
| `/devspark-critic` | Challenge whether the work is wrong about the real system it will run in. |
| `/devspark-planning-review` | Run Analyze, Critic (when applicable), and Judge as one bounded planning decision before implementation. |

## PR & Review

| Command | What it does |
|---|---|
| `/devspark-create-pr` | Draft or update a pull request from the verified code, knowledge, tests, and Git delta. |
| `/devspark-update-pr` | Update an existing pull request description with current branch delta. |
| `/devspark-pr-review` | Constitution-aware pull request review with actionable feedback. |
| `/devspark-address-pr-review` | Address open PR review findings with enforced commit isolation between code fixes and review-file updates. |
| `/devspark-merge-from-main` | Merge the latest remote main into the current branch; the agent only resolves conflicts. |

## Governance

| Command | What it does |
|---|---|
| `/devspark-constitution` | Create or update the project constitution from interactive or provided principle inputs. |
| `/devspark-discover-constitution` | Analyze the codebase to discover implicit conventions, then guide crafting a constitution. |
| `/devspark-evolve-constitution` | Analyze PR review findings and codebase patterns to propose constitution amendments. |

## Knowledge

| Command | What it does |
|---|---|
| `/devspark-discover-knowledge` | Evidence-based `.knowledge/` maintenance discovery — gaps, weak mappings, contradictions. |
| `/devspark-explain` | Trace "how is X done?" against current code and `.knowledge/`, updating or drafting knowledge as needed. |
| `/devspark-context-projection` | Deterministic traversal of `.knowledge` relationships from one or more seed ids, for direct inspection. |
| `/devspark-migrate-knowledge-entities` | Move flat `.knowledge/` docs into the opt-in entity-ontology layout under `.knowledge/entities/<id>/`. |

## Multi-App (optional)

| Command | What it does |
|---|---|
| `/devspark-add-application` | Register a new application in the multi-app registry. |
| `/devspark-list-applications` | Display all registered applications with metadata and dependencies. |
| `/devspark-validate-registry` | Validate the multi-app registry schema, references, cycles, and path existence. |
| `/devspark-migrate-registry` | Move the multi-app registry into the dedicated `devspark.registry.json` file. |

## Other

| Command | What it does |
|---|---|
| `/devspark-roadmap` | Optional roadmap planning — product direction, Prospective Specs, drift review. |
| `/devspark-release` | Seal a release from the verified repository delta and sweep `.devspark.work` retention. |
| `/devspark-site-audit` | Comprehensive codebase audit against the project constitution/standards. |
| `/devspark-commit-audit` | Analyze git commit history for contributor velocity, commit hygiene, and DORA metrics. |
| `/devspark-repo-story` | Analyze full repository commit history and produce a narrative for business and technical audiences. |
| `/devspark-upgrade` | Check the installed DevSpark version and guide a safe upgrade to the latest release. |
| `/devspark-personalize` | Create a personalized copy of any DevSpark command prompt for the current git user. |
| `/devspark-taskstoissues` | Explain why temporary DevSpark tasks cannot be exported as durable issue-tracker records. |
| `/devspark-workitem-create` | Draft one Azure DevOps work item from a DevSpark spec and create it after confirmation. |
| `/devspark-workitem-review` | Review an Azure DevOps work item against the five-dimension standard. |

<!-- Installed via the DevSpark Claude Code quickstart (dev.makeboldspark.com) — re-run the
     quickstart to update; do not hand-edit .devspark/. -->
