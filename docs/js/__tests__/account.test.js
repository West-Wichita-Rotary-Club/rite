import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { installWindowStorageStub } from "./test-helpers.js";
import { state } from "../state.js";
import {
  normalizeEmail,
  validateParticipationRow,
  participationYearsFromRow,
  blankParticipationRow,
  blankClaimDraft,
  blankMemoryDraft,
  createAccount,
  updateAccount,
  deleteAccount,
  signIn,
  signOut,
  currentAccount,
  profileCompleteness,
  CLAIM_ROLES
} from "../account.js";

beforeEach(() => {
  installWindowStorageStub();
  state.storageAvailable = true;
  state.accounts = {};
  state.session = null;
});

test("normalizeEmail() trims and lowercases", () => {
  assert.equal(normalizeEmail("  Teacher@Example.com  "), "teacher@example.com");
  assert.equal(normalizeEmail(undefined), "");
});

test("validateParticipationRow() rejects an unknown role", () => {
  assert.equal(
    validateParticipationRow({ role: "astronaut", yearFrom: "2000", yearTo: "2001" }),
    "role"
  );
});

test("validateParticipationRow() rejects years outside the program's range", () => {
  assert.equal(CLAIM_ROLES.includes("teacher"), true);
  assert.equal(
    validateParticipationRow({ role: "teacher", yearFrom: "1980", yearTo: "1981" }),
    "range"
  );
  assert.equal(
    validateParticipationRow({ role: "teacher", yearFrom: "2010", yearTo: "2005" }),
    "range"
  );
});

test("validateParticipationRow() accepts a well-formed row", () => {
  assert.equal(
    validateParticipationRow({ role: "teacher", yearFrom: "2010", yearTo: "2011" }),
    null
  );
});

test("participationYearsFromRow() collapses a single-year row", () => {
  assert.deepEqual(participationYearsFromRow({ yearFrom: "2010", yearTo: "" }), [2010]);
  assert.deepEqual(participationYearsFromRow({ yearFrom: "2010", yearTo: "2012" }), [2010, 2012]);
});

test("blankParticipationRow() returns an empty editable row", () => {
  assert.deepEqual(blankParticipationRow(), { role: "", yearFrom: "", yearTo: "" });
});

test("blankClaimDraft() seeds a fresh draft, or copies an existing claim", () => {
  const fresh = blankClaimDraft(null);
  assert.equal(fresh.country, "");
  assert.equal(fresh.participation.length, 1);

  const existing = {
    country: "Panama",
    participation: [{ role: "teacher", yearFrom: "2010", yearTo: "2010" }],
    matchedProfileId: "p1"
  };
  const copy = blankClaimDraft(existing);
  assert.equal(copy.country, "Panama");
  assert.deepEqual(copy.participation, existing.participation);
  // must be a copy, not the same array/objects
  assert.notEqual(copy.participation, existing.participation);
});

test("blankMemoryDraft() seeds a fresh draft, or copies an existing memory", () => {
  const fresh = blankMemoryDraft(null);
  assert.deepEqual(fresh, { id: null, title: "", text: "", photos: [] });

  const existing = { id: "m1", title: "Trip", text: "...", photos: ["a.jpg"] };
  const copy = blankMemoryDraft(existing);
  assert.deepEqual(copy, existing);
  assert.notEqual(copy.photos, existing.photos);
});

test("profileCompleteness() handles no account, no fields, and every field filled", () => {
  assert.equal(profileCompleteness(null), 0);
  assert.equal(profileCompleteness({}), 0);
  assert.equal(
    profileCompleteness({
      name: "Pat",
      role: "teacher",
      country: "Panama",
      city: "Panama City",
      languages: "es, en",
      years: "2010",
      bio: "A short bio."
    }),
    100
  );
});

test("profileCompleteness() rounds a partially filled profile and ignores blank/whitespace fields", () => {
  assert.equal(profileCompleteness({ name: "Pat", role: "  " }), 14);
});

test("createAccount() persists the account and currentAccount() reads it back once signed in", () => {
  const account = createAccount("teacher@example.com", { name: "Pat", role: "teacher" });
  assert.equal(account.email, "teacher@example.com");
  assert.equal(state.accounts["teacher@example.com"].name, "Pat");

  assert.equal(currentAccount(), null, "no session yet");
  signIn("teacher@example.com");
  assert.equal(currentAccount().name, "Pat");

  signOut();
  assert.equal(currentAccount(), null);
});

test("updateAccount() merges changes into an existing account only", () => {
  createAccount("teacher@example.com", { name: "Pat" });
  updateAccount("teacher@example.com", (existing) => ({ ...existing, bio: "Updated" }));
  assert.equal(state.accounts["teacher@example.com"].bio, "Updated");

  // no-op for an account that doesn't exist
  updateAccount("nobody@example.com", (existing) => ({ ...existing, bio: "nope" }));
  assert.equal(state.accounts["nobody@example.com"], undefined);
});

test("deleteAccount() removes the account", () => {
  createAccount("teacher@example.com", { name: "Pat" });
  deleteAccount("teacher@example.com");
  assert.equal(state.accounts["teacher@example.com"], undefined);
});
