// Empty in both .env.development and .env.production (ps-008): the SPA and the
// API are served from the same origin everywhere — in production because
// src/Rite.Api serves this build's static files directly, and in development via
// vite.config.js's /api proxy to the dotnet API on :5159 — so every call here is
// a same-origin relative path, and no origin needs CORS-approving.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response.json();
}

// Account calls (ps-009) never throw on a non-2xx response — 400/401/409 are
// expected, meaningful outcomes (bad input, wrong credentials, duplicate email),
// not failures the caller should have to catch. AccountContext branches on `ok`
// and the server's `error` code instead.
async function accountRequest(path, { method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  let data = null;
  try {
    data = await response.json();
  } catch (_error) {
    data = null;
  }
  return { ok: response.ok, status: response.status, data };
}

export const api = {
  getTimeline: () => getJson("/api/timeline"),
  getStories: () => getJson("/api/stories"),
  getAlumni: () => getJson("/api/alumni"),
  getResources: () => getJson("/api/resources"),
  getFaq: () => getJson("/api/faq"),
  getImpact: () => getJson("/api/impact"),
  getProgramCycle: () => getJson("/api/program-cycle"),
  getSchools: () => getJson("/api/schools"),
  registerAccount: (payload) => accountRequest("/api/account/register", { method: "POST", body: payload }),
  loginAccount: (payload) => accountRequest("/api/account/login", { method: "POST", body: payload }),
  logoutAccount: () => accountRequest("/api/account/logout", { method: "POST" }),
  getCurrentAccount: () => accountRequest("/api/account/me"),
  updateAccountProfile: (payload) => accountRequest("/api/account/me", { method: "PUT", body: payload }),
  listAccounts: () => accountRequest("/api/account/users"),
  deactivateAccount: (id) => accountRequest(`/api/account/users/${id}/deactivate`, { method: "POST" }),
  reactivateAccount: (id) => accountRequest(`/api/account/users/${id}/reactivate`, { method: "POST" })
};
