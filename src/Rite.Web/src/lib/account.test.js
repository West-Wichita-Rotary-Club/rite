import { describe, expect, it } from "vitest";
import {
  CLAIM_ROLES,
  blankClaimDraft,
  blankMemoryDraft,
  blankParticipationRow,
  candidateProfilesForClaim,
  findAlumniProfile,
  getCountryLabel,
  getProfileRoles,
  normalizeEmail,
  participationPayload,
  participationYearsFromRow,
  photosToSave,
  profileCompleteness,
  validateParticipationRow
} from "./account.js";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Teacher@Example.com  ")).toBe("teacher@example.com");
    expect(normalizeEmail(undefined)).toBe("");
  });
});

describe("validateParticipationRow", () => {
  it("rejects an unknown role", () => {
    expect(validateParticipationRow({ role: "astronaut", yearFrom: "2000", yearTo: "2001" })).toBe("role");
  });

  it("rejects years outside the program's range", () => {
    expect(CLAIM_ROLES.includes("teacher")).toBe(true);
    expect(validateParticipationRow({ role: "teacher", yearFrom: "1980", yearTo: "1981" })).toBe("range");
    expect(validateParticipationRow({ role: "teacher", yearFrom: "2010", yearTo: "2005" })).toBe("range");
  });

  it("accepts a well-formed row", () => {
    expect(validateParticipationRow({ role: "teacher", yearFrom: "2010", yearTo: "2011" })).toBeNull();
  });
});

describe("participationYearsFromRow", () => {
  it("collapses a single-year row", () => {
    expect(participationYearsFromRow({ yearFrom: "2010", yearTo: "" })).toEqual([2010]);
  });

  it("keeps a range as two years", () => {
    expect(participationYearsFromRow({ yearFrom: "2010", yearTo: "2012" })).toEqual([2010, 2012]);
  });
});

describe("blankParticipationRow", () => {
  it("returns an empty editable row", () => {
    expect(blankParticipationRow()).toEqual({ role: "", yearFrom: "", yearTo: "" });
  });
});

describe("blankClaimDraft", () => {
  it("seeds a fresh draft, or copies an existing claim", () => {
    const fresh = blankClaimDraft(null);
    expect(fresh.country).toBe("");
    expect(fresh.participation).toHaveLength(1);

    const existing = {
      country: "Panama",
      participation: [{ role: "teacher", yearFrom: "2010", yearTo: "2010" }],
      matchedProfileId: "p1"
    };
    const copy = blankClaimDraft(existing);
    expect(copy.country).toBe("Panama");
    expect(copy.participation).toEqual(existing.participation);
    expect(copy.participation).not.toBe(existing.participation);
  });
});

describe("blankMemoryDraft", () => {
  it("seeds a fresh draft, or copies an existing memory", () => {
    expect(blankMemoryDraft(null)).toEqual({ id: null, title: "", text: "", photos: [] });

    const existing = {
      id: "m1",
      title: "Trip",
      text: "...",
      photos: [{ id: "ph1", url: "/api/account/memories/m1/photos/ph1" }]
    };
    const copy = blankMemoryDraft(existing);
    expect(copy).toEqual({
      id: "m1",
      title: "Trip",
      text: "...",
      photos: [{ photoId: "ph1", src: "/api/account/memories/m1/photos/ph1" }]
    });
  });
});

describe("photosToSave", () => {
  it("splits kept (existing) photos from newly added (data URL) ones", () => {
    const photos = [
      { photoId: "ph1", src: "/api/account/memories/m1/photos/ph1" },
      { photoId: null, src: "data:image/jpeg;base64,abc" }
    ];
    expect(photosToSave(photos)).toEqual({ keepPhotoIds: ["ph1"], newPhotos: ["data:image/jpeg;base64,abc"] });
  });

  it("returns empty arrays for no photos", () => {
    expect(photosToSave([])).toEqual({ keepPhotoIds: [], newPhotos: [] });
  });
});

describe("participationPayload", () => {
  it("coerces form-state rows to integer years, dropping a yearTo equal to yearFrom", () => {
    expect(participationPayload([{ role: "teacher", yearFrom: "2010", yearTo: "2010" }])).toEqual([
      { role: "teacher", yearFrom: 2010, yearTo: null }
    ]);
  });

  it("keeps a real range", () => {
    expect(participationPayload([{ role: "teacher", yearFrom: "2010", yearTo: "2012" }])).toEqual([
      { role: "teacher", yearFrom: 2010, yearTo: 2012 }
    ]);
  });

  it("treats a blank yearTo as a single year", () => {
    expect(participationPayload([{ role: "teacher", yearFrom: "2010", yearTo: "" }])).toEqual([
      { role: "teacher", yearFrom: 2010, yearTo: null }
    ]);
  });
});

describe("profileCompleteness", () => {
  it("handles no account, no fields, and every field filled", () => {
    expect(profileCompleteness(null)).toBe(0);
    expect(profileCompleteness({})).toBe(0);
    expect(
      profileCompleteness({
        name: "Pat",
        role: "teacher",
        country: "Panama",
        city: "Panama City",
        languages: "es, en",
        years: "2010",
        bio: "A short bio."
      })
    ).toBe(100);
  });

  it("rounds a partially filled profile and ignores blank/whitespace fields", () => {
    expect(profileCompleteness({ name: "Pat", role: "  " })).toBe(14);
  });
});

const sampleAlumniContent = {
  countries: { panama: { label: { en: "Panama", es: "Panama" } } },
  functions: { teacher: { label: { en: "Teacher", es: "Docente" } } },
  profiles: [
    { id: "p1", name: "Esteban Almengor", country: "panama", participation: [{ role: "teacher", years: [2015] }] },
    { id: "p2", name: "Dayra Gonzalez", country: "panama", participation: [{ role: "host", years: [2012] }] }
  ]
};

describe("getProfileRoles", () => {
  it("dedupes roles across participation records", () => {
    const profile = { participation: [{ role: "teacher" }, { role: "teacher" }, { role: "host" }] };
    expect(getProfileRoles(profile)).toEqual(["teacher", "host"]);
  });
});

describe("candidateProfilesForClaim", () => {
  it("filters by country and role", () => {
    const candidates = candidateProfilesForClaim("panama", "teacher", sampleAlumniContent);
    expect(candidates).toHaveLength(1);
    expect(candidates[0].name).toBe("Esteban Almengor");
  });

  it("returns an empty list when content is missing", () => {
    expect(candidateProfilesForClaim("panama", "teacher", null)).toEqual([]);
  });
});

describe("findAlumniProfile", () => {
  it("finds a profile by id", () => {
    expect(findAlumniProfile("p2", sampleAlumniContent).name).toBe("Dayra Gonzalez");
  });

  it("returns undefined for an unknown id", () => {
    expect(findAlumniProfile("missing", sampleAlumniContent)).toBeUndefined();
  });
});

describe("getCountryLabel", () => {
  it("localizes a known country", () => {
    expect(getCountryLabel("panama", sampleAlumniContent, (v) => v.en)).toBe("Panama");
  });

  it("falls back to the raw key when the country is unknown", () => {
    expect(getCountryLabel("atlantis", sampleAlumniContent, (v) => v.en)).toBe("atlantis");
  });
});
