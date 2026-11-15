import { state } from "./state.js";
import { render } from "./render.js";

const OLD_VIEW_ALIASES = {
  recruit: "participate",
  alumniLanding: "community",
  activeLanding: "community"
};

export function setView(view) {
  state.view = OLD_VIEW_ALIASES[view] || view;
  if (state.view !== "alumniProfile" && window.location.hash.startsWith("#alumni/")) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}

export function setAlumniProfile(profileId) {
  state.selectedAlumniId = profileId;
  state.view = "alumniProfile";
  window.location.hash = `alumni/${encodeURIComponent(profileId)}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}

export function applyHashRoute() {
  const match = window.location.hash.match(/^#alumni\/(.+)$/);
  if (!match) {
    return;
  }
  state.selectedAlumniId = decodeURIComponent(match[1]);
  state.view = "alumniProfile";
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}

export function isNavActive(item) {
  if (item === "about") {
    return ["about", "history", "faq"].includes(state.view);
  }
  if (item === "participate") {
    return ["participate", "schools"].includes(state.view);
  }
  if (item === "community") {
    return ["community", "directory", "resources", "alumniProfile", "stories"].includes(state.view);
  }
  return state.view === item;
}
