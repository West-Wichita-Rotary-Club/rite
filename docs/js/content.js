import { state } from "./state.js";
import { render } from "./render.js";

const ALUMNI_CONTENT_URL = "content/alumni.json";
const STORIES_CONTENT_URL = "content/stories.json";
const RESOURCES_CONTENT_URL = "content/resources.json";
const FAQ_CONTENT_URL = "content/faq.json";
const TIMELINE_CONTENT_URL = "content/timeline.json";
const IMPACT_CONTENT_URL = "content/impact.json";
const PROGRAM_CYCLE_CONTENT_URL = "content/program-cycle.json";

export const palette = {
  azure: "azure",
  royal: "royal",
  gold: "gold",
  turquoise: "turquoise",
  cranberry: "cranberry"
};

export const schools = [
  { type: "school", band: palette.azure, name: "Pleasant Valley Middle School", place: "Wichita, Kansas", since: "2004", hosted: "11", desc: { en: "Host school for ESL co-teaching, cultural assemblies, and pen-pal projects.", es: "Escuela anfitriona para ESL, asambleas culturales y correspondencia." } },
  { type: "school", band: palette.turquoise, name: "Instituto Panamericano", place: "Panama City, Panama", since: "2006", hosted: "9", desc: { en: "Long-standing partner sending bilingual educators to Wichita.", es: "Socio de larga data que envia docentes bilingues a Wichita." } },
  { type: "school", band: palette.cranberry, name: "Escuela Normal Superior de Mendoza", place: "Mendoza, Argentina", since: "2009", hosted: "8", desc: { en: "Teacher-training institution represented in Argentina's RITE cohorts.", es: "Institucion de formacion docente representada en cohortes argentinas." } },
  { type: "club", band: palette.gold, name: "Rotary Club of West Wichita", place: "Wichita, Kansas", since: "1996", hosted: "30+", desc: { en: "Founding club stewarding host families, travel support, and this archive.", es: "Club fundador que custodia familias anfitrionas, viajes y este archivo." } }
];

export async function loadAlumniContent() {
  try {
    const response = await window.fetch(ALUMNI_CONTENT_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Alumni content returned ${response.status}`);
    }
    state.alumniContent = await response.json();
    state.alumniLoadStatus = "ready";
  } catch (_error) {
    state.alumniLoadStatus = "error";
  }
  render();
}

export async function loadStoriesContent() {
  try {
    const response = await window.fetch(STORIES_CONTENT_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Story content returned ${response.status}`);
    }
    state.storiesContent = await response.json();
    state.storiesLoadStatus = "ready";
  } catch (_error) {
    state.storiesLoadStatus = "error";
  }
  render();
}

export async function loadResourcesContent() {
  try {
    const response = await window.fetch(RESOURCES_CONTENT_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Resource content returned ${response.status}`);
    }
    state.resourcesContent = await response.json();
    state.resourcesLoadStatus = "ready";
  } catch (_error) {
    state.resourcesLoadStatus = "error";
  }
  render();
}

export async function loadFaqContent() {
  try {
    const response = await window.fetch(FAQ_CONTENT_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`FAQ content returned ${response.status}`);
    }
    state.faqContent = await response.json();
    state.faqLoadStatus = "ready";
  } catch (_error) {
    state.faqLoadStatus = "error";
  }
  render();
}

export async function loadTimelineContent() {
  try {
    const response = await window.fetch(TIMELINE_CONTENT_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Timeline content returned ${response.status}`);
    }
    state.timelineContent = await response.json();
    state.timelineLoadStatus = "ready";
  } catch (_error) {
    state.timelineLoadStatus = "error";
  }
  render();
}

export async function loadImpactContent() {
  try {
    const response = await window.fetch(IMPACT_CONTENT_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Impact content returned ${response.status}`);
    }
    state.impactContent = await response.json();
    state.impactLoadStatus = "ready";
  } catch (_error) {
    state.impactLoadStatus = "error";
  }
  render();
}

export async function loadProgramCycleContent() {
  try {
    const response = await window.fetch(PROGRAM_CYCLE_CONTENT_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Program-cycle content returned ${response.status}`);
    }
    state.programCycleContent = await response.json();
    state.programCycleLoadStatus = "ready";
  } catch (_error) {
    state.programCycleLoadStatus = "error";
  }
  render();
}

export function getAudiences(item) {
  return item.audiences && item.audiences.length ? item.audiences : ["recruiting"];
}

export function filterByAudience(items, audience) {
  return items.filter((item) => getAudiences(item).includes(audience));
}

export function getStories() {
  return (state.storiesContent && state.storiesContent.stories) || [];
}

export function getResources() {
  return (state.resourcesContent && state.resourcesContent.resources) || [];
}

export function getFaqs() {
  return (state.faqContent && state.faqContent.faqs) || [];
}

export function getMilestones() {
  return (state.timelineContent && state.timelineContent.milestones) || [];
}

export function getImpactMetrics() {
  return (state.impactContent && state.impactContent.metrics) || [];
}

export function getProgramPhases() {
  return (state.programCycleContent && state.programCycleContent.phases) || [];
}
