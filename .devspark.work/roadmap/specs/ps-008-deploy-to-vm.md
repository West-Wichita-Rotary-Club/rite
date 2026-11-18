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

`src/Rite.Api` is live and reachable at `rite.makeboldspark.com` on the existing Windows VM,
serving both the API and `src/Rite.Web`'s production build from the same origin — the production
surface constitution Principle IX and Principle X call for, replacing `docs/`'s static preview for
every content surface it already covers.

## Current Reality

ps-006 delivered a tested, mergeable ASP.NET Core + SQLite API; ps-007 delivered a tested React
site consuming it. Neither has ever been deployed (roadmap Decisions, 2026-11-16/2026-11-17).
2026-11-17 (same day): combined single-domain hosting was chosen over two separate hostnames or
GitHub Pages for the React site (see Decisions) — `src/Rite.Api` now serves `src/Rite.Web`'s
built static files directly (`UseDefaultFiles`/`UseStaticFiles`/`MapFallbackToFile`, with an
explicit `/api/{**catchall}` 404 so an unmatched API path never falls through to the SPA), and
both sides already call/link to `rite.makeboldspark.com` only — `rite-app.makeboldspark.com` is no
longer part of this application. The CORS policy that existed for the two-hostname design has been
removed; it's no longer needed since the SPA and API are same-origin. Verified locally: a fresh
build copied into `src/Rite.Api/wwwroot/` serves the API, the SPA, and a client-side deep link
(`/schools/:slug`) correctly, with no CORS header sent. The only existing deploy automation,
`.github/workflows/deploy-api.yml`, targets an Azure Web App via manual `workflow_dispatch` and is
stale against the 2026-11-16 VM-hosting decision — its own header comment says so, and it predates
today's combined-hosting decision too (it only ever published the API). The VM is a Windows host;
the API's SQLite database path is decided (`C:\websites\rite\`) but nothing has been provisioned
there yet. `docs/` remains the sole live production surface today, rescoped (ps-007) to the mocked
account/login/claim flow with a banner pointing to `rite.makeboldspark.com` once it exists.
A committed `src/Rite.Api/Properties/launchSettings.json` now pins local `dotnet run`/Visual
Studio F5 to `http://localhost:5159`, matching `src/Rite.Web`'s dev proxy (previously only an
uncommitted, differently-ported local file existed, which F5 would have used instead — silently
breaking the dev proxy). `scripts/publish-rite-api.ps1` produces the actual deployable package:
`dotnet publish` (which the project's `BuildRiteWebForPublish` MSBuild target already extends to
build `src/Rite.Web` and copy its `dist/` into `wwwroot/`) followed by zipping the output —
verified end to end to include `web.config`, `Rite.Api.exe`, and the SPA. Zipping could not be
done as an MSBuild `AfterTargets="Publish"` hook: `web.config` is written by a separate internal
publish sub-pipeline (`_TransformWebConfig`) whose completion isn't reliably observable from a
project-level target, so an in-process hook silently produced a zip missing it — the script
zips only after the `dotnet publish` process has fully exited, side-stepping that. A
`RuntimeIdentifier` (`win-x64`) is now required project-wide for the SDK to generate `web.config`
at all (IIS/ANCM needs it to launch the app); without one, publish silently omits it.

## Scope and Independence

**In scope:** provision and deploy `src/Rite.Api` (which now also serves `src/Rite.Web`'s build)
to the VM, reachable at `rite.makeboldspark.com`, with its SQLite database at
`C:\websites\rite\`; a deploy step that builds `src/Rite.Web` and copies its `dist/` into
`src/Rite.Api/wwwroot/` before publish; a deploy mechanism that actually targets the VM, replacing
or retiring the stale Azure-specific `deploy-api.yml`; confirm `docs/`'s banner correctly links to
the now-live `rite.makeboldspark.com`.

**Out of scope:** a real registration/login/claims backend (separate outcome, see ps-009) —
`docs/` keeps serving that mocked flow until that PS lands; any VM provisioning work that isn't
specific to this application (OS patching, general server hardening).

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
the production platform (API + React site, one deployable unit) is live, real, and reachable at
`rite.makeboldspark.com` — a complete, self-contained deployment, not a fragment of a larger
migration.

## Future Health

Should leave a repeatable deploy path (a workflow or documented runbook) rather than a one-off
manual deployment, so ps-009 or any future PS can redeploy without rediscovering VM access and
paths. The combined-hosting choice trades independent scaling/restart of the API and the frontend
for one deployable unit and no CORS — acceptable at this program's scale; revisit explicitly if
that trade-off ever stops holding, rather than silently re-splitting the hostnames. Does not
foreclose a future move off this VM (e.g., to a managed host) if that's ever decided — this PS only
realizes the hosting direction constitution Principle X already settled.

## Dependencies and Decisions

Depends on the delivered ps-006 (API) and ps-007 (React site); both are complete. The VM hosting
direction, single hostname, combined-origin architecture, and Windows SQLite path are already
decided (roadmap Decisions, 2026-11-16/2026-11-17) — this PS executes that decision rather than
re-deciding it. Open question for whoever picks this up: VM access/credentials, and whether the
existing `deploy-api.yml` is adapted in place or replaced.

## Completion Expectations

`rite.makeboldspark.com` serves the live API under `/api/*` and the live React site at every other
path (with working deep-link refresh), reachable over the public internet; the API's SQLite
database is at `C:\websites\rite\` on the VM; `docs/`'s banner points at the live production site.
Recognized complete once verified reachable from outside the VM.
