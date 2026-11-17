import { describe, expect, it } from "vitest";
import { initials, participationYears } from "./alumni.js";

describe("initials", () => {
  it("takes the first letter of up to two name parts", () => {
    expect(initials("Armida Hight")).toBe("AH");
  });

  it("handles a single-word name", () => {
    expect(initials("Armida")).toBe("A");
  });

  it("handles a missing name", () => {
    expect(initials(undefined)).toBe("");
  });
});

describe("participationYears", () => {
  it("joins an explicit years array", () => {
    const profile = { participation: [{ role: "leader", years: [1996, 1997] }] };
    expect(participationYears(profile)).toBe("1996, 1997");
  });

  it("formats a bounded range", () => {
    const profile = { participation: [{ role: "coordinator", range: { start: 2001, end: 2005 } }] };
    expect(participationYears(profile)).toBe("2001-2005");
  });

  it("formats an open-ended range", () => {
    const profile = { participation: [{ role: "leader", range: { start: 2010 } }] };
    expect(participationYears(profile)).toBe("2010+");
  });

  it("falls back to an em dash with no participation", () => {
    expect(participationYears({ participation: [] })).toBe("—");
  });
});
