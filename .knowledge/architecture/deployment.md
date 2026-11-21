# RITE Production Deployment — VM Install Runbook

Product Owner TL;DR: `src/Rite.Api` (serving both the API and `src/Rite.Web`'s built SPA from one
origin) ships as a framework-dependent IIS package, built by a GitHub Actions workflow on demand.
There is no automated push to the VM — a person downloads the package and installs it by hand via
RDP, per the steps below. The runbook exists so any future redeploy doesn't need to rediscover VM
paths or IIS settings from scratch.

## Where this fits

- Target host: the existing Windows VM, reachable at `rite.makeboldspark.com` (constitution
  Principle X; roadmap Decisions, 2026-11-16/2026-11-17).
- Application files live at `C:\websites\rite\` on that VM; the SQLite database
  (`rite.db`) and the `media\` folder (memory photos, `MediaStorage`) live inside that same
  directory and must survive every redeploy.
- `src/Rite.Api` serves the SPA itself (`UseDefaultFiles`/`UseStaticFiles`/`MapFallbackToFile`) —
  there is no separate web server or reverse proxy for the frontend.

## Getting the package

Run the **"Build Rite.Api deployment package"** GitHub Actions workflow
(`.github/workflows/publish-rite-api-package.yml`) via `workflow_dispatch`, then download the
`rite-api-deployment-package` artifact from that run — a zip containing the published API plus the
built SPA under `wwwroot\`.

Locally instead: `./scripts/publish-rite-api.ps1` from the repo root produces the same zip at
`src/Rite.Api/bin/Release/net10.0/win-x64/rite-api-publish.zip`.

## One-time VM prerequisites

- **IIS** with the Web Server role, and the **ASP.NET Core Hosting Bundle** (matching the app's
  target framework, `net10.0`) installed — `Rite.Api.csproj` publishes framework-dependent
  (`SelfContained=false`) specifically so the VM's already-installed Hosting Bundle is reused
  rather than bundling the whole .NET runtime into every package.
- **DNS**: `rite.makeboldspark.com` resolving to this VM. **TLS certificate** for that hostname
  bound in IIS. Both are VM/network-operator setup, out of scope for this runbook and this PS —
  assumed already in place or handled separately.
- **Firewall**: inbound 80/443 open to this VM.
- `C:\websites\rite\` exists, and the IIS Application Pool identity that will run this site has
  **Modify** permission on it (the app writes `rite.db` and `media\` there at runtime).

## First-time install

1. Create the IIS site: physical path `C:\websites\rite\`, binding(s) for `rite.makeboldspark.com`
   on 443 (with the TLS cert) and a redirect binding on 80.
2. Create its Application Pool: **.NET CLR version: No Managed Code** (ASP.NET Core Module handles
   the runtime, not IIS's own CLR hosting), **Start Mode: AlwaysRunning** recommended.
3. Extract the deployment zip's contents directly into `C:\websites\rite\` (so `Rite.Api.exe`,
   `web.config`, and `wwwroot\` land at that folder's top level).
4. Start the site (or `iisreset` if IIS itself needed the Hosting Bundle install to register).
5. Verify locally on the VM: `https://localhost/health` (or the bound hostname) returns
   `{"status":"ok"}`. The database and `media\` folder are created automatically on first run —
   nothing to pre-seed.
6. Verify from outside the VM: `https://rite.makeboldspark.com/health`, and that `/` serves the
   React site (not a 404 or IIS's default page).

## Redeploying an update

The SQLite database and `media\` have no schema migration mechanism yet (`EnsureCreatedAsync` only
creates a database that doesn't exist — see `src/Rite.Api/Data/ContentSeeder.cs`); a schema change
needs its own decision when it first happens, not assumed here.

1. Stop the Application Pool in IIS (stopping the pool, not deleting the site, keeps the
   bindings/config intact).
2. Extract the new zip's contents into `C:\websites\rite\`, **overwriting only the application
   files** (`Rite.Api.exe`, `web.config`, `wwwroot\`, and the other published `.dll`/`.json`
   files) — never delete or overwrite `rite.db` or `media\`.
3. Start the Application Pool again.
4. Verify `https://rite.makeboldspark.com/health` from outside the VM.

If the new version fails health-check after starting, stop the pool, restore the previous zip's
application files (keep the same `rite.db`/`media\`), and start the pool again — keep the last
known-good zip around for exactly this.

## Known gaps (explicitly out of scope here)

- TLS certificate issuance/renewal process for `rite.makeboldspark.com` — VM/operator-specific,
  not an application concern.
- No automated schema migration for a future `AlumniClaim`/`Memory`/`Account` shape change; the
  first PS that needs one must decide the approach (EF Core migrations vs. a manual script) before
  redeploying across that change.
- No automated rollback or blue/green deployment — see "Redeploying an update" above for the
  manual process this program's scale currently uses.
