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

export const api = {
  getTimeline: () => getJson("/api/timeline"),
  getStories: () => getJson("/api/stories"),
  getAlumni: () => getJson("/api/alumni"),
  getResources: () => getJson("/api/resources"),
  getFaq: () => getJson("/api/faq"),
  getImpact: () => getJson("/api/impact"),
  getProgramCycle: () => getJson("/api/program-cycle"),
  getSchools: () => getJson("/api/schools")
};
