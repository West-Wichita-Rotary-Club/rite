# rite

Rotary Inter-country Teacher Exchange

## Static preview

This repo includes a fully static public preview in `docs/`.

- Open `docs/index.html` directly for a local file preview, or serve `docs/` with any static file server.
- All registration, resource, and API behavior is mocked in local JavaScript.
- The preview uses local assets only and does not require a backend, database, Azure service, authentication provider, CDN, analytics script, or external API.
- GitHub Pages deploys the committed `docs/` folder through `.github/workflows/pages.yml` after changes are merged to `main`.
- As of ps-007, this preview is a fallback scoped to the mocked account/login/registration/claim/memory UI only — every other surface now redirects visitors to the production site. See `.knowledge/architecture/site-frontend.md`.

## Production API and React site

- `src/Rite.Api` is the real ASP.NET Core + SQLite API (ps-006), serving the seven content
  surfaces plus schools as bilingual JSON. Run it with F5 in Visual Studio, or
  `dotnet run --project src/Rite.Api` from the command line — `Properties/launchSettings.json`
  pins it to `http://localhost:5159`, matching `src/Rite.Web`'s dev proxy below.
- `src/Rite.Web` is the real standalone React site (ps-007) that calls that API. Run it with
  `npm install && npm run dev` inside `src/Rite.Web` — it calls the API via relative `/api/*`
  paths, proxied to `http://localhost:5159` in development by `vite.config.js` (set
  `VITE_DEV_PROXY_TARGET` in a local `.env.local` to point it at a different API instead, e.g.
  the live one once deployed).
- Planned production hosting (ps-008): an existing VM, single domain `rite.makeboldspark.com` —
  `src/Rite.Api` serves both the API and `src/Rite.Web`'s production build (copied into
  `wwwroot/` at deploy time) from the same origin, so no CORS policy is needed (constitution
  Principle X; not yet deployed).
- To produce a deployment package: `./scripts/publish-rite-api.ps1` (or `dotnet publish
  src/Rite.Api -c Release` plus zipping the `bin/Release/net10.0/win-x64/publish/` folder
  yourself) builds `src/Rite.Web`, copies it into `wwwroot/`, and publishes a framework-dependent,
  IIS-ready package — `rite-api-publish.zip`, next to the publish folder — to copy to the VM
  (which needs the ASP.NET Core Hosting Bundle installed).
