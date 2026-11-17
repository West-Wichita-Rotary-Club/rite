// No launchSettings.json exists for src/Rite.Api, so its dev URL depends on
// how it's started; .env.development pins VITE_API_BASE_URL to match the
// --urls flag used in this project's README. Production overrides this via
// .env.production (ps-006's API at rite.makeboldspark.com).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5159";

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
