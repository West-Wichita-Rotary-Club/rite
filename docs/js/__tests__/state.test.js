import { test } from "node:test";
import assert from "node:assert/strict";
import { state } from "../state.js";

test("state starts on the home view in English, signed out", () => {
  assert.equal(state.lang, "en");
  assert.equal(state.view, "home");
  assert.equal(state.session, null);
  assert.deepEqual(state.accounts, {});
});

test("state is a single shared mutable object (modules rely on this identity)", async () => {
  const { state: sameState } = await import("../state.js");
  assert.equal(sameState, state);
});
