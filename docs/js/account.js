import { state } from "./state.js";

const STORE_KEY = "rite-preview-submissions";
const ACCOUNTS_KEY = "rite-preview-accounts";
const SESSION_KEY = "rite-preview-session";
const FEATURE_STORAGE_BUDGET = 3 * 1000 * 1000;
const PHOTO_MAX_DIMENSION = 1024;
export const MAX_PHOTOS_PER_MEMORY = 3;
export const MAX_MEMORIES_PER_MEMBER = 10;
const MIN_PARTICIPATION_YEAR = 1996;
export const CLAIM_ROLES = ["leader", "host", "teacher"];
const PROFILE_COMPLETENESS_FIELDS = ["name", "role", "country", "city", "languages", "years", "bio"];

export class StorageBudgetError extends Error {}

export const mockApi = {
  submitProfile(payload) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        state.submissions.unshift({
          type: "profile",
          name: payload.name || "Preview member",
          role: payload.role,
          createdAt: new Date().toISOString()
        });
        writeSubmissions(state.submissions);
        resolve({ ok: true });
      }, 250);
    });
  },
  submitResource(title) {
    return new Promise((resolve) => {
      window.setTimeout(() => resolve({ ok: true, title }), 180);
    });
  },
  submitSupportInterest(payload) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        state.submissions.unshift({
          type: "support-interest",
          name: payload.name || "Preview supporter",
          way: payload.way,
          createdAt: new Date().toISOString()
        });
        writeSubmissions(state.submissions);
        resolve({ ok: true });
      }, 220);
    });
  }
};

function readSubmissions() {
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || "[]");
  } catch (_error) {
    return [];
  }
}

function writeSubmissions(items) {
  window.localStorage.setItem(STORE_KEY, JSON.stringify(items.slice(0, 12)));
}

function detectStorageAvailable() {
  try {
    const testKey = "__rite_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (_error) {
    return false;
  }
}

function readAccounts() {
  if (!state.storageAvailable) {
    return {};
  }
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || "{}");
  } catch (_error) {
    return {};
  }
}

function writeAccounts(accounts) {
  const size = JSON.stringify(accounts).length;
  if (size > FEATURE_STORAGE_BUDGET) {
    throw new StorageBudgetError();
  }
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function readSession() {
  if (!state.storageAvailable) {
    return null;
  }
  try {
    return window.localStorage.getItem(SESSION_KEY) || null;
  } catch (_error) {
    return null;
  }
}

function writeSession(email) {
  if (email) {
    window.localStorage.setItem(SESSION_KEY, email);
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

// Replicates the original inline state-initialization order: submissions and
// storageAvailable first (neither depends on state), then accounts/session
// (both read state.storageAvailable). Called once by the app.js bootstrap,
// before the first render.
export function initAccountState() {
  state.submissions = readSubmissions();
  state.storageAvailable = detectStorageAvailable();
  state.accounts = readAccounts();
  state.session = readSession();
}

export function currentAccount() {
  return state.session ? state.accounts[state.session] || null : null;
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function createAccount(email, fields) {
  const account = {
    email,
    name: fields.name || "",
    role: fields.role || "",
    country: fields.country || "",
    city: fields.city || "",
    languages: fields.languages || "",
    years: fields.years || "",
    bio: fields.bio || "",
    createdAt: new Date().toISOString(),
    claim: null,
    memories: []
  };
  const accounts = { ...state.accounts, [email]: account };
  writeAccounts(accounts);
  state.accounts = accounts;
  return account;
}

export function updateAccount(email, updater) {
  const existing = state.accounts[email];
  if (!existing) {
    return;
  }
  const updated = updater({ ...existing });
  const accounts = { ...state.accounts, [email]: updated };
  writeAccounts(accounts);
  state.accounts = accounts;
}

export function deleteAccount(email) {
  const accounts = { ...state.accounts };
  delete accounts[email];
  writeAccounts(accounts);
  state.accounts = accounts;
}

export function signIn(email) {
  state.session = email;
  writeSession(email);
}

export function signOut() {
  state.session = null;
  writeSession(null);
}

export function downscalePhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file.type || file.type.indexOf("image/") !== 0) {
      reject(new Error("not-an-image"));
      return;
    }
    const reader = new window.FileReader();
    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("decode-failed"));
      img.onload = () => {
        const scale = Math.min(1, PHOTO_MAX_DIMENSION / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function currentYear() {
  return new Date().getFullYear();
}

export function validateParticipationRow(row) {
  const from = parseInt(row.yearFrom, 10);
  const to = row.yearTo ? parseInt(row.yearTo, 10) : from;
  if (!row.role || !CLAIM_ROLES.includes(row.role)) {
    return "role";
  }
  if (!Number.isInteger(from) || from < MIN_PARTICIPATION_YEAR || from > currentYear()) {
    return "range";
  }
  if (!Number.isInteger(to) || to < from || to > currentYear()) {
    return "range";
  }
  return null;
}

export function participationYearsFromRow(row) {
  const from = parseInt(row.yearFrom, 10);
  const to = row.yearTo ? parseInt(row.yearTo, 10) : from;
  return from === to ? [from] : [from, to];
}

export function blankParticipationRow() {
  return { role: "", yearFrom: "", yearTo: "" };
}

export function blankClaimDraft(existingClaim) {
  if (existingClaim) {
    return {
      country: existingClaim.country,
      participation: existingClaim.participation.map((row) => ({ ...row })),
      matchedProfileId: existingClaim.matchedProfileId || "",
      selfDeclaredName: existingClaim.selfDeclaredName || ""
    };
  }
  return {
    country: "",
    participation: [blankParticipationRow()],
    matchedProfileId: "",
    selfDeclaredName: ""
  };
}

export function profileCompleteness(account) {
  if (!account) {
    return 0;
  }
  const filled = PROFILE_COMPLETENESS_FIELDS.filter(
    (field) => String(account[field] || "").trim().length > 0
  ).length;
  return Math.round((filled / PROFILE_COMPLETENESS_FIELDS.length) * 100);
}

export function blankMemoryDraft(existingMemory) {
  if (existingMemory) {
    return {
      id: existingMemory.id,
      title: existingMemory.title,
      text: existingMemory.text,
      photos: existingMemory.photos.slice()
    };
  }
  return { id: null, title: "", text: "", photos: [] };
}
