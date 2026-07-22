# T007 — Content Audit: Existing Preview vs. Research Package

Product Owner TL;DR: This audits everything already live in the static preview against `bold-docs/samples/rite_program_website_content.json`. Findings sort into three buckets: **replace** (content that contradicts or is superseded by verified facts), **retire** (content with no basis in any source, invented for demo purposes), and **keep** (content the package neither confirms nor contradicts, left alone). Nothing in the "replace" or "retire" buckets stays live after this feature ships.

## Replace — factually superseded by verified research

| Item | Current state | Issue | Resolution |
|---|---|---|---|
| Hero copy (`docs/app.js` `heroTitle`/`heroBody`) | Generic "Teachers cross borders" copy | Placeholder, not the package's copy library | Replaced verbatim with the package's "Teach. Learn. Connect." hero (T022) |
| Timeline milestone "1996" (`milestones[0]`) | Claims the founding happened "in Rotary District 5680" | Anachronistic — District 5680 did not exist until the 2019 merger of Districts 5670 and 5690; the package never states a 1996 district number | Rewritten to name the founding clubs (West Wichita, West Sedgwick County–Sunrise) without an anachronistic district claim (T009) |
| Timeline milestone "2001-present" (`milestones[2]`) | States "39 Panamanian and 45 Argentinian inbound teachers" with no date | Figures are correct but undated, violating the editorial-governance rule that 2023-sourced statistics always carry their as-of date | Rewritten with an explicit "as reported January 2023" qualifier (T009) |
| Timeline milestone "2020-2023" (`milestones[4]`) | Flatly states the inbound program "resumes in 2023" | Package's own 2023 entry is more conservative ("described plans to resume outbound travel"); overstated certainty | Rewritten to match the package's actual claim status (T009) |
| Timeline milestone "2026" (`milestones[5]`) | Generic "digital archive preview" framing, no real 2026 event | Package has a real, verified 2026 event (four inbound teachers, two from Panama and two from Argentina, through mid-February) | Replaced with the verified event; "30th year" framing kept but flagged `inferred` per the package's own caveat (T009) |
| `armida-hight` profile summary | Omits the founding-club and Ralph Hight detail | Incomplete relative to verified facts | Summary revised, `claimStatus: verified_official` added (content-candidates.md item 4) |

## Retire — unsourced invented content

| Item | Why it's being retired |
|---|---|
| Story `s1` ("From Panama City to Pleasant Valley," Maria Camarena) | Fully invented; no such person or event in the package. |
| Story `s2` ("Twelve years, nine teachers, one guest room," Kadel family) | Shelli Kadel is real, but this specific narrative and figures are invented, not sourced. |
| Story `s3` ("A weather journal across hemispheres," Lucia Ferrero) | Fully invented; no such person or event in the package. |
| Resource `r1` ("Weather journal lesson plan") | Already labeled "Mock curriculum item" in its own 0003 sign-off record (`resource-candidates.md`); has no basis in the real curriculum, which is English-language teaching methodology. |

Replacements for the retired stories/resources are sourced from `public_participant_examples.outbound_2025` (Katie Brinkman, Gaby Amparan) and `seminar_and_curriculum` (see `content-candidates.md` items 2–3 and 11–15).

## Keep — not addressed by the package either way

| Item | Reasoning |
|---|---|
| Story `s4` ("The kitchen-table idea," 1996 founding) | Concept is broadly consistent with the real founding story; rewritten in place with verified founder/club facts rather than retired (T015), since the underlying event (the 1996 founding) is real even though the original narrative flourish wasn't sourced. |
| Eight alumni profiles tagged 2024 (`ivan-guerra`, `ingrid-villamonte`, `gimena-rios`, `florencia-zappia`) and 2025 (`ayelen-usandizaga`, `belen-moran-galvarici`, `esteban-almengor`, `dayra-gonzalez`) | The research package only names inbound teachers for 2026 (`public_participant_examples.inbound_2026`, four people) and only describes 2025 inbound as unattributed "themes," not named individuals. It says nothing about 2024 at all. These eight are a different program year than the package's verified "4 inbound in 2026" figure, so there is no contradiction — an earlier pass of this audit incorrectly flagged them; corrected here. They already carry prior product-owner sign-off (2026-07-16) and approved photos from a prior feature. Left untouched. |
| Resource `r2` ("Host family orientation") | Concept matches real content in `host_families.likely_host_experience`; body text revised to real, synthesized content rather than retired (T015). |
| Resource `r3` ("Replication toolkit") | Matches `product.md`'s roadmap ("Replication toolkit for other Rotary clubs") and the package's own `implementation_recommendations`; not contradicted by anything in the package, so left in place with de-mocked copy. |
| Schools/clubs list in `docs/app.js` (`schools` array: Pleasant Valley Middle School, Instituto Panamericano, Escuela Normal Superior de Mendoza) | The package's own `research_gaps_and_required_decisions` explicitly lists "identify Wichita-area and Panamanian school partners" as an unresolved decision — the package neither confirms nor contradicts these names. Left untouched; out of scope for this feature. |
| Host-family alumni profiles (`mark-hazleton`, `lesley-hazleton`, `ed-frey`, `robyn-sullivan`, `greg-sullivan`, `mark-hansen`) | The package's privacy notice explicitly excludes host-family household details from research scope, so it neither confirms nor contradicts named hosts. Pre-existing, previously signed off (0002/0003) content; left untouched. |
| Existing mock account/registration/claim system (`docs/app.js` accounts, claim, memories) | Entirely out of scope for a content-integration feature; the package has no bearing on it. |

## Outcome

Post-audit, every fact visible in the preview either traces to a `claimStatus`-tagged source in the research package or is pre-existing content the package doesn't address (and therefore doesn't contradict). No visible content asserts something the package's verified material disagrees with.
