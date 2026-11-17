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
  surfaces plus schools as bilingual JSON. Run it with
  `dotnet run --project src/Rite.Api --urls http://localhost:5159` (no `launchSettings.json`
  exists yet, so `--urls` picks the port explicitly).
- `src/Rite.Web` is the real standalone React site (ps-007) that calls that API. Run it with
  `npm install && npm run dev` inside `src/Rite.Web` — it calls the API via relative `/api/*`
  paths, proxied to `http://localhost:5159` in development by `vite.config.js`.
- Planned production hosting (ps-008): an existing VM, single domain `rite.makeboldspark.com` —
  `src/Rite.Api` serves both the API and `src/Rite.Web`'s production build (copied into
  `wwwroot/` at deploy time) from the same origin, so no CORS policy is needed (constitution
  Principle X; not yet deployed).
