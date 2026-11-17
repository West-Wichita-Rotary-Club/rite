// Schools/clubs have no stable id/slug field in the API payload (see
// src/Rite.Api/Data/SchoolsSeed.cs), so the profile route address is derived
// from `${type}-${name}` — the same composite key Schools.jsx already used
// to key its cards — slugified for use in a URL.
export function slugify(text) {
  return (text ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function schoolSlug(school) {
  return slugify(`${school.type}-${school.name}`);
}
