// ps-009 moved registration/sign-in/profile onto the real API (src/Rite.Api) —
// see context/AccountContext.jsx and api.js. Claim-an-alumni-profile and
// memories/photo submissions are a separate, later increment and still live
// here as the same mocked, browser-local model ported from docs/js/account.js,
// now keyed by the signed-in account's real email rather than being the
// account record itself.
const CLAIMS_MEMORIES_KEY = "rite-web-claims-memories";
const FEATURE_STORAGE_BUDGET = 3 * 1000 * 1000;
const PHOTO_MAX_DIMENSION = 1024;
export const MAX_PHOTOS_PER_MEMORY = 3;
export const MAX_MEMORIES_PER_MEMBER = 10;
const MIN_PARTICIPATION_YEAR = 1996;
export const CLAIM_ROLES = ["leader", "host", "teacher"];
const PROFILE_COMPLETENESS_FIELDS = ["name", "role", "country", "city", "languages", "years", "bio"];
const BLANK_CLAIM_MEMORY = { claim: null, memories: [] };

export class StorageBudgetError extends Error {}

export function detectStorageAvailable() {
  try {
    const testKey = "__rite_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (_error) {
    return false;
  }
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function readAllClaimsMemories() {
  try {
    return JSON.parse(window.localStorage.getItem(CLAIMS_MEMORIES_KEY) || "{}");
  } catch (_error) {
    return {};
  }
}

export function readClaimsMemories(storageAvailable, email) {
  if (!storageAvailable || !email) {
    return BLANK_CLAIM_MEMORY;
  }
  return readAllClaimsMemories()[email] || BLANK_CLAIM_MEMORY;
}

export function writeClaimsMemories(storageAvailable, email, updater) {
  if (!storageAvailable || !email) {
    return BLANK_CLAIM_MEMORY;
  }
  const all = readAllClaimsMemories();
  const updated = updater(all[email] || BLANK_CLAIM_MEMORY);
  const next = { ...all, [email]: updated };

  const size = JSON.stringify(next).length;
  if (size > FEATURE_STORAGE_BUDGET) {
    throw new StorageBudgetError();
  }
  window.localStorage.setItem(CLAIMS_MEMORIES_KEY, JSON.stringify(next));
  return updated;
}

export function clearClaimsMemories(storageAvailable, email) {
  if (!storageAvailable || !email) {
    return;
  }
  const all = readAllClaimsMemories();
  delete all[email];
  window.localStorage.setItem(CLAIMS_MEMORIES_KEY, JSON.stringify(all));
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

export function getProfileRoles(profile) {
  const roles = (profile.participation || []).map((record) => record.role);
  return Array.from(new Set(roles));
}

export function getCountryLabel(countryKey, content, localize) {
  const country = content?.countries?.[countryKey];
  return country ? localize(country.label) : countryKey;
}

export function candidateProfilesForClaim(country, role, content) {
  if (!content) {
    return [];
  }
  return (content.profiles || []).filter(
    (profile) => profile.country === country && getProfileRoles(profile).includes(role)
  );
}

export function findAlumniProfile(profileId, content) {
  return (content?.profiles || []).find((profile) => profile.id === profileId);
}
