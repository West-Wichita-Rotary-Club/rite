# T006 — Content Candidate List and Sign-off

Product Owner TL;DR: This logs every new or materially-updated named-individual record this feature seeds from `bold-docs/samples/rite_program_website_content.json`, plus the curriculum/toolkit resources seeded as `resource` records. Resolves open question 1 (all named individuals in the package are approved) by recording the required per-record line for each name individually, matching the format `bold-docs/features/0003-three-audience-experience/resource-candidates.md` used.

## New participant/leader profiles (`docs/content/alumni.json`)

1. **Ralph Hight** — usa, leader, 1996 — Co-founder with Armida Hight. `claimStatus: verified_official` (`program_history.founders_and_legacy`).
2. **Katie Brinkman** — usa, teacher (outbound), 2025 — "A Wichita Spanish teacher and returning RITE participant whose continued work in David helped preserve seminar continuity, strengthen Spanish proficiency, and support teachers after the formal program." `claimStatus: verified_official` (`public_participant_examples.outbound_2025`).
3. **Gaby Amparan** — usa, teacher (outbound), 2025 — "A Wichita English teacher and fluent Spanish speaker who led seminar work with teachers in David and the Comarca... expanding her teaching toolbox and inspiring students and educators beyond her home school." `claimStatus: verified_official` (`public_participant_examples.outbound_2025`).

## Existing profiles updated with claim-status metadata and verified facts

4. **Armida Hight** (`armida-hight`) — summary revised to include the founding-club detail (Rotary Club of West Wichita and Rotary Club of West Sedgwick County–Sunrise). `claimStatus: verified_official`.
5. **Marianne Lopez** (`marianne-lopez`) — 2026 inbound, Panama. `claimStatus: verified_official` (`public_participant_examples.inbound_2026`).
6. **Lourdes Rodriguez** (`lourdes-rodriguez`) — 2026 inbound, Panama. `claimStatus: verified_official` (`public_participant_examples.inbound_2026`).
7. **Leticia Torielli** (`leticia-torielli`) — 2026 inbound, Argentina. `claimStatus: partly_verified_official` — package flags this profile's details as needing a check against the complete official profile before publication; the preview surfaces this status visibly in content metadata rather than hiding it.
8. **Mauro Coletti** (`mauro-coletti`) — 2026 inbound, Argentina. `claimStatus: partly_verified_official` — same caveat as Leticia Torielli.
9. **Dalia Hale** (`dalia-hale`) — `claimStatus: verified_official` (`governance_and_support.publicly_identified_organizers`).
10. **Shelli Kadel** (`shelli-kadel`) — `claimStatus: verified_official` (`governance_and_support.publicly_identified_organizers`).

## Curriculum / teaching-toolkit resources (`docs/content/resources.json`)

Sourced from `seminar_and_curriculum`, seeded as `resource` records surfaced in the Community destination's resources section (resolved open question 4 — no standalone Teaching Toolkit page). Representative subset of the ten seminar modules, not a 1:1 reproduction:

11. **Sound Anchors & Pronunciation Basics** — modules 1, 4, 5 (why English pronunciation is inconsistent, schwa/stress, minimal pairs). `claimStatus: synthesized`.
12. **Sight Words & Reading Fluency** — modules 2, 3, 9 (decodable/high-frequency words, short/long vowels, close reading). `claimStatus: synthesized`.
13. **Vocabulary, Cognates & Comprehensible Input** — modules 6, 7, 8 (TPR, storytelling, cognates, PWIM, sentence building). `claimStatus: synthesized`.
14. **Speaking, Feedback & the Strategy Showcase** — module 10 (information gaps, role-play, the final Strategy Showcase demonstration). `claimStatus: synthesized`.
15. **CHAMPS Classroom Management Framework** — `seminar_and_curriculum.classroom_management_content`. `claimStatus: verified_drive`.

## Content this feature retires (see `content-audit.md` for full audit)

- Stories `s1` (Maria Camarena), `s2` (Kadel family "twelve years, nine teachers"), `s3` (Lucia Ferrero) in `docs/content/stories.json` are fully invented placeholder narratives with no basis in the research package. Retired and replaced with sourced stories.
- Resource `r1` ("Weather journal lesson plan") in `docs/content/resources.json` is explicitly labeled mock/invented in its own 0003 sign-off record and has no basis in the real curriculum (which is English-language teaching methodology, not a bilingual science exchange). Retired.

Note: an earlier pass of this audit incorrectly flagged eight existing 2024/2025-tagged alumni profiles (`ayelen-usandizaga`, `belen-moran-galvarici`, `esteban-almengor`, `dayra-gonzalez`, `ivan-guerra`, `ingrid-villamonte`, `gimena-rios`, `florencia-zappia`) as contradicting the verified "4 inbound in 2026" statistic. On closer reading they are tagged 2024 and 2025, not 2026 — a different program year the research package's `2026_inbound_count: 4` figure says nothing about. No contradiction exists; these profiles are kept (see `content-audit.md`'s "Keep" table).

## Sign-off

- **Status**: approved-for-public-preview
- **Confirmed by**: product owner
- **Confirmation channel**: Claude Code chat (AskUserQuestion / clarify), 2026-07-21 session
- **Confirmed at**: 2026-07-21
- **Scope**: All items 1–15 above approved for the preview, per the clarify-resolved open question 1 ("all named individuals in the package are approved for the preview — founders, the full 2026 inbound cohort including the two partly-verified Argentina profiles, and the 2025 outbound teachers") and open question 4 (curriculum/toolkit as `resource` records, no standalone page). Partly-verified profiles (items 7–8) carry `claimStatus: partly_verified_official` visibly in their content metadata rather than being presented as fully confirmed. The retirements listed above are executed under open question 7's resolution ("replace/retire... anything invented without a source basis is retired").
