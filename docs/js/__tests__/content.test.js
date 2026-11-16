import { test } from "node:test";
import assert from "node:assert/strict";
import { state } from "../state.js";
import {
  schools,
  getAudiences,
  filterByAudience,
  getStories,
  getResources,
  getFaqs,
  getMilestones,
  getImpactMetrics,
  getProgramPhases
} from "../content.js";

test("the four known schools/clubs are present with required fields", () => {
  assert.equal(schools.length, 4);
  for (const entity of schools) {
    assert.ok(entity.name, "entity must have a name");
    assert.ok(entity.place, "entity must have a place");
    assert.ok(["school", "club"].includes(entity.type));
  }
});

test("getAudiences() defaults to recruiting when none are set", () => {
  assert.deepEqual(getAudiences({}), ["recruiting"]);
  assert.deepEqual(getAudiences({ audiences: [] }), ["recruiting"]);
  assert.deepEqual(getAudiences({ audiences: ["alumni"] }), ["alumni"]);
});

test("filterByAudience() keeps only items matching the requested audience", () => {
  const items = [
    { id: 1, audiences: ["alumni"] },
    { id: 2, audiences: ["recruiting"] },
    { id: 3 } // no audiences -> defaults to recruiting
  ];
  assert.deepEqual(filterByAudience(items, "recruiting").map((i) => i.id), [2, 3]);
  assert.deepEqual(filterByAudience(items, "alumni").map((i) => i.id), [1]);
});

test("content getters return an empty array before content loads", () => {
  state.storiesContent = null;
  state.resourcesContent = null;
  state.faqContent = null;
  state.timelineContent = null;
  state.impactContent = null;
  state.programCycleContent = null;

  assert.deepEqual(getStories(), []);
  assert.deepEqual(getResources(), []);
  assert.deepEqual(getFaqs(), []);
  assert.deepEqual(getMilestones(), []);
  assert.deepEqual(getImpactMetrics(), []);
  assert.deepEqual(getProgramPhases(), []);
});

test("content getters surface the loaded collection once content is set", () => {
  state.storiesContent = { stories: [{ id: "s1" }] };
  state.resourcesContent = { resources: [{ id: "r1" }] };
  state.faqContent = { faqs: [{ id: "f1" }] };
  state.timelineContent = { milestones: [{ id: "m1" }] };
  state.impactContent = { metrics: [{ id: "i1" }] };
  state.programCycleContent = { phases: [{ id: "p1" }] };

  assert.deepEqual(getStories(), [{ id: "s1" }]);
  assert.deepEqual(getResources(), [{ id: "r1" }]);
  assert.deepEqual(getFaqs(), [{ id: "f1" }]);
  assert.deepEqual(getMilestones(), [{ id: "m1" }]);
  assert.deepEqual(getImpactMetrics(), [{ id: "i1" }]);
  assert.deepEqual(getProgramPhases(), [{ id: "p1" }]);

  // reset so later test files see the pre-load default again
  state.storiesContent = null;
  state.resourcesContent = null;
  state.faqContent = null;
  state.timelineContent = null;
  state.impactContent = null;
  state.programCycleContent = null;
});
