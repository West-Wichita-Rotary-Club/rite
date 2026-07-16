Product Owner TL;DR: This critique checks what could fail when building participant/alumni grouping, static profile pages, and sample-derived profile candidate extraction.

# Critic Gate

## Findings

- Resolved note - Regulatory / privacy: `bold-docs/samples/` may contain personal information, host details, schedules, and photos. The build extracted only public-safe participant profile fields, recorded product-owner WhatsApp approval in `alumni-candidates.json`, promoted approved profile fields to `docs/content/alumni.json`, and published only photos confirmed approved by all visible adults. Sensitive fields remain excluded. Full names/profiles for every visible person remain a follow-up. Traces to spec Sample Source Materials and current approval note.

## Categories Evaluated

- Trust boundaries / auth: applicable; no privileged operation is added because the preview remains static and unauthenticated.
- Secrets handling: inapplicable; no secrets or service credentials are introduced.
- Data loss / continuity: inapplicable; no destructive persistence or migration is introduced.
- Input validation: applicable; JSON is same-origin static content and remains parse-checked during validation.
- Error handling / resilience: applicable; the preview includes a load-error state for missing JSON content.
- Concurrency: inapplicable; no concurrent writes or shared mutable backend state are introduced.
- Scale bottlenecks: applicable but acceptable for a static preview dataset; future API pagination/search remains production work.
- Observability: inapplicable for static preview runtime; GitHub Pages deployment status remains the existing operational signal.
- Deployment / rollback: applicable; static changes deploy through the existing GitHub Pages workflow and can be reverted by git.
- Dependency supply chain: applicable; no runtime dependency is introduced.
- Backward compatibility: applicable; JSON-driven directory replaces hard-coded preview data but preserves the public preview route.
- Regulatory / privacy: applicable; noted above.
