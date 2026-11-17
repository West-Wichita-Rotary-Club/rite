export function initials(name) {
  return (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// Each participation record models years as either an explicit `years[]`
// array or a `range: { start, end }` (role can differ year to year) — see
// src/Rite.Api's ContentDocument comment and ps-006's PR description.
export function participationYears(profile) {
  const parts = (profile.participation ?? []).map((entry) => {
    if (Array.isArray(entry.years) && entry.years.length) {
      return entry.years.join(", ");
    }
    if (entry.range) {
      return entry.range.end ? `${entry.range.start}-${entry.range.end}` : `${entry.range.start}+`;
    }
    return null;
  });
  return parts.filter(Boolean).join("; ") || "—";
}
