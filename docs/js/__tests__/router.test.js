import { test } from "node:test";
import assert from "node:assert/strict";
import { state } from "../state.js";
import { isNavActive } from "../router.js";

// setView/setAlumniProfile/applyHashRoute touch window.location/history and
// call the full DOM render(), so they are left for a future DOM-backed test
// setup. isNavActive() is pure state -> boolean and is covered here.

test("isNavActive() groups related views under the 'about' nav item", () => {
  for (const view of ["about", "history", "faq"]) {
    state.view = view;
    assert.equal(isNavActive("about"), true, `expected 'about' active for view ${view}`);
  }
  state.view = "home";
  assert.equal(isNavActive("about"), false);
});

test("isNavActive() groups related views under the 'community' nav item", () => {
  for (const view of ["community", "directory", "resources", "alumniProfile", "stories"]) {
    state.view = view;
    assert.equal(isNavActive("community"), true, `expected 'community' active for view ${view}`);
  }
});

test("isNavActive() falls back to an exact view match for unlisted nav items", () => {
  state.view = "home";
  assert.equal(isNavActive("home"), true);
  assert.equal(isNavActive("schools"), false);
});
