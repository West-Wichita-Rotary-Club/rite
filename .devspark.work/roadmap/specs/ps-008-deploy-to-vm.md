---
id: ps-008
title: Deploy the production platform to the existing VM
status: proposed
order: 30
depends_on: [ps-006, ps-007]
blockers: []
delivery: []
---

# ps-008: Deploy the production platform to the existing VM

## Outcome

`src/Rite.Api` and `src/Rite.Web` are live and reachable at `rite.makeboldspark.com` and
`rite-app.makeboldspark.com` on the existing Windows VM — the production surface constitution
Principle IX and Principle X call for, replacing `docs/`'s static preview for every content
surface it already covers.

## Current Reality

ps-006 delivered a tested, mergeable ASP.NET Core + SQLite API; ps-007 delivered a tested React
site consuming it. Neither has ever been deployed (roadmap Decisions, 2026-11-16/2026-11-17). The
only existing deploy automation, `.github/workflows/deploy-api.yml`, targets an Azure Web App via
manual `workflow_dispatch` and is explicitly stale against the 2026-11-16 VM-hosting decision
(CAP-2026-002, constitution Principle X) — its own header comment says so. The VM is a Windows
host; the API's SQLite database path is decided (`C:\websites\rite\`) but nothing has been
provisioned there yet. `docs/` remains the sole live production surface today, rescoped (ps-007)
to the mocked account/login/claim flow with a banner pointing to the production site once it
exists.

## Scope and Independence

**In scope:** provision and deploy `src/Rite.Api` to the VM, reachable at
`rite.makeboldspark.com`, with its SQLite database at `C:\websites\rite\`; provision and deploy
`src/Rite.Web` to the VM, reachable at `rite-app.makeboldspark.com`; replace or retire the stale
Azure-specific `deploy-api.yml` with a deploy mechanism that actually targets the VM; confirm
`docs/`'s banner correctly links to the now-live production hostnames.

**Out of scope:** a real registration/login/claims backend (separate outcome, see ps-009) —
`docs/` keeps serving that mocked flow until that PS lands; any VM provisioning work that isn't
specific to this application (OS patching, general server hardening).

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
the production platform (API + React site) is live, real, and reachable at its chosen hostnames —
a complete, self-contained deployment, not a fragment of a larger migration.

## Future Health

Should leave a repeatable deploy path (a workflow or documented runbook) rather than a one-off
manual deployment, so ps-009 or any future PS can redeploy without rediscovering VM access and
paths. Does not foreclose a future move off this VM (e.g., to a managed host) if that's ever
decided — this PS only realizes the hosting direction constitution Principle X already settled.

## Dependencies and Decisions

Depends on the delivered ps-006 (API) and ps-007 (React site); both are complete. The VM hosting
direction, hostnames, and Windows SQLite path are already decided (roadmap Decisions,
2026-11-16/2026-11-17) — this PS executes that decision rather than re-deciding it. Open question
for whoever picks this up: VM access/credentials, and whether the existing `deploy-api.yml` is
adapted in place or replaced.

## Completion Expectations

`rite.makeboldspark.com` serves the live API and `rite-app.makeboldspark.com` serves the live
React site, both reachable over the public internet; the API's SQLite database is at
`C:\websites\rite\` on the VM; `docs/`'s banner points at the live production site. Recognized
complete once verified reachable from outside the VM.
