import { initAccountState } from "./js/account.js";
import { applyHashRoute } from "./js/router.js";
import { render } from "./js/render.js";
import {
  loadAlumniContent,
  loadStoriesContent,
  loadResourcesContent,
  loadFaqContent,
  loadTimelineContent,
  loadImpactContent,
  loadProgramCycleContent,
  loadBuildInfo
} from "./js/content.js";

initAccountState();

window.addEventListener("hashchange", applyHashRoute);
applyHashRoute();
render();
loadAlumniContent();
loadStoriesContent();
loadResourcesContent();
loadFaqContent();
loadTimelineContent();
loadImpactContent();
loadProgramCycleContent();
loadBuildInfo();
