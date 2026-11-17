import { describe, expect, it } from "vitest";
import { schoolSlug, slugify } from "./schools.js";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Pleasant Valley Middle School")).toBe("pleasant-valley-middle-school");
  });

  it("strips accents", () => {
    expect(slugify("Instituto Panamericano")).toBe("instituto-panamericano");
  });

  it("trims leading and trailing hyphens from punctuation", () => {
    expect(slugify(" Rotary Club of West Wichita! ")).toBe("rotary-club-of-west-wichita");
  });
});

describe("schoolSlug", () => {
  it("combines type and name into a stable, unique slug", () => {
    expect(schoolSlug({ type: "school", name: "Pleasant Valley Middle School" })).toBe(
      "school-pleasant-valley-middle-school"
    );
    expect(schoolSlug({ type: "club", name: "Rotary Club of West Wichita" })).toBe(
      "club-rotary-club-of-west-wichita"
    );
  });

  it("keeps a school and a club with the same name apart", () => {
    const school = schoolSlug({ type: "school", name: "West Wichita" });
    const club = schoolSlug({ type: "club", name: "West Wichita" });
    expect(school).not.toBe(club);
  });
});
