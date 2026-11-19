// ps-009 moved registration/sign-in/profile onto the real API (src/Rite.Api).
// ps-017 moved claim-an-alumni-profile and memory/photo submission onto it too
// — see context/AccountContext.jsx and api.js — replacing this module's prior
// browser-local localStorage mock (ported from docs/js/account.js) entirely.
// What's left here is pure, storage-free: draft shaping, validation, and the
// one piece that's still genuinely client-side, photo downscaling.
const PHOTO_MAX_DIMENSION = 1024;
export const MAX_PHOTOS_PER_MEMORY = 3;
export const MAX_MEMORIES_PER_MEMBER = 10;
const MIN_PARTICIPATION_YEAR = 1996;
export const CLAIM_ROLES = ["leader", "host", "teacher"];
const PROFILE_COMPLETENESS_FIELDS = ["name", "role", "country", "city", "languages", "years", "bio"];

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
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

// The API's ParticipationRowRequest wants integers (yearTo null, not a
// repeated yearFrom, for a single-year row) — form state keeps them as
// editable strings, so this is the one coercion point before a PUT.
export function participationPayload(participation) {
  return participation.map((row) => {
    const yearFrom = parseInt(row.yearFrom, 10);
    const yearTo = row.yearTo ? parseInt(row.yearTo, 10) : null;
    return { role: row.role, yearFrom, yearTo: yearTo === yearFrom ? null : yearTo };
  });
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

// Each draft photo is { photoId, src }: photoId set (and src its server URL)
// for a photo the memory already has, or null (and src a fresh data: URL) for
// one just added in this editing session — see photosToSave below.
export function blankMemoryDraft(existingMemory) {
  if (existingMemory) {
    return {
      id: existingMemory.id,
      title: existingMemory.title,
      text: existingMemory.text,
      photos: existingMemory.photos.map((photo) => ({ photoId: photo.id, src: photo.url }))
    };
  }
  return { id: null, title: "", text: "", photos: [] };
}

export function photosToSave(draftPhotos) {
  return {
    keepPhotoIds: draftPhotos.filter((photo) => photo.photoId).map((photo) => photo.photoId),
    newPhotos: draftPhotos.filter((photo) => !photo.photoId).map((photo) => photo.src)
  };
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
