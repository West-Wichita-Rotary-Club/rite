import { test } from "node:test";
import assert from "node:assert/strict";
import { state } from "../state.js";
import { t, localize } from "../i18n.js";

test("t() resolves a nested path in the current language", () => {
  state.lang = "en";
  assert.equal(t("motto"), "Service Above Self");
  state.lang = "es";
  assert.ok(typeof t("motto") === "string" && t("motto").length > 0);
  state.lang = "en";
});

test("t() resolves a dotted path into nested copy", () => {
  state.lang = "en";
  assert.equal(t("nav.about"), "About RITE");
});

test("localize() picks the current language and falls back to English", () => {
  state.lang = "es";
  const bilingual = { en: "Hello", es: "Hola" };
  assert.equal(localize(bilingual), "Hola");

  const englishOnly = { en: "English only" };
  assert.equal(localize(englishOnly), "English only");

  state.lang = "en";
  assert.equal(localize(bilingual), "Hello");
});

test("localize() returns non-object values unchanged", () => {
  assert.equal(localize("plain string"), "plain string");
  assert.equal(localize(null), null);
});
