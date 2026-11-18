# rite

Rotary Inter-country Teacher Exchange

## Static preview

This repo includes a fully static public preview in `docs/`.

- Open `docs/index.html` directly for a local file preview, or serve `docs/` with any static file server.
- All registration, resource, and API behavior is mocked in local JavaScript.
- The preview uses local assets only and does not require a backend, database, Azure service, authentication provider, CDN, analytics script, or external API.
- GitHub Pages deploys the committed `docs/` folder through `.github/workflows/pages.yml` after changes are merged to `main`.
- As of ps-015, every surface this preview had — including the mocked account/login/registration/claim/memory UI — is also live on the production React site (`src/Rite.Web`), so this preview is no longer the only place to see any of it; it's kept as a fallback, not a required stop. See `.knowledge/architecture/site-frontend.md`.

## Production API and React site

- `src/Rite.Web` also has its own mocked account/login/registration/claim/memory UI now (ps-015),
  ported from `docs/`'s and living at `/register`, `/login`, and `/account` — still a
  browser-local `localStorage` mock (no real backend; that's ps-009, not yet started), but no
  longer requiring a trip to the legacy static preview to see it. See
  `src/Rite.Web/src/context/AccountContext.jsx` and `src/Rite.Web/src/lib/account.js`.
- `src/Rite.Api` is the real ASP.NET Core + SQLite API (ps-006), serving the seven content
  surfaces plus schools as bilingual JSON. Run it with F5 in Visual Studio, or
  `dotnet run --project src/Rite.Api` from the command line — `Properties/launchSettings.json`
  pins it to `http://localhost:5159`, matching `src/Rite.Web`'s dev proxy below. Building the
  project (F5, `dotnet build`, `dotnet test`'s implicit build, or publish) also builds
  `src/Rite.Web` and copies it into `wwwroot/` (Node is a build-time dependency of `Rite.Api`
  because of this — see `Rite.Api.csproj`'s `BuildRiteWeb` target), so the API's own root URL
  (`http://localhost:5159/`) serves the real site directly, same as production. This step is
  incremental — unchanged `src/Rite.Web` source skips it, so a plain F5 stays fast.
- For active frontend development, run `npm install && npm run dev` inside `src/Rite.Web`
  instead and use its URL (`http://localhost:5173` by default) — that gets you Vite's hot
  module reload, which rebuilding `Rite.Api` on every change does not. It calls the API via
  relative `/api/*` paths, proxied to `http://localhost:5159` in development by
  `vite.config.js` (set `VITE_DEV_PROXY_TARGET` in a local `.env.local` to point it at a
  different API instead, e.g. the live one once deployed).
- Planned production hosting (ps-008): an existing VM, single domain `rite.makeboldspark.com` —
  `src/Rite.Api` serves both the API and `src/Rite.Web`'s production build (copied into
  `wwwroot/` at deploy time) from the same origin, so no CORS policy is needed (constitution
  Principle X; not yet deployed).
- To produce a deployment package: `./scripts/publish-rite-api.ps1` (or `dotnet publish
  src/Rite.Api -c Release` plus zipping the `bin/Release/net10.0/win-x64/publish/` folder
  yourself) builds `src/Rite.Web`, copies it into `wwwroot/`, and publishes a framework-dependent,
  IIS-ready package — `rite-api-publish.zip`, next to the publish folder — to copy to the VM
  (which needs the ASP.NET Core Hosting Bundle installed).
