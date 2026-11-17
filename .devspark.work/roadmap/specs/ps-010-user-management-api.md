---
id: ps-010
title: User management on the API
status: proposed
order: 40
depends_on: [ps-009]
blockers: []
delivery: []
---

# ps-010: User management on the API

## Outcome

Rotary leaders/coordinators can see, review, and manage the accounts ps-009 creates — list users,
view their roles/profiles, and deactivate an account — from an authenticated surface in
`src/Rite.Api`/`src/Rite.Web`, instead of needing direct database access to do it.

## Current Reality

No account data model exists yet anywhere in the real stack; ps-009 (proposed) is what will
create it. Today the only "account management" is the mocked, single-browser `localStorage`
model in `docs/js/account.js`, which has no admin surface at all — its `deleteAccount` is a
self-service "clear my data" button, not an administrative action.

## Scope and Independence

**In scope:** list/view users and their roles created by ps-009; a coordinator-only deactivate
action; the minimal authorization check that restricts this surface to a coordinator/leader role.

**Out of scope:** self-service registration/login itself (ps-009); any claim/memory moderation
workflow (separate future outcome); fine-grained permission systems beyond a single "coordinator"
capability.

**Standalone shipping boundary:** if this PS completes and every later roadmap item is canceled,
coordinators have a working way to see and manage the real accounts that exist — complete on its
own, once ps-009 exists.

## Future Health

Should reuse whatever role/claims model ps-009 establishes rather than inventing a second one.
Avoid building a general permissions framework before a second real need for one appears.

## Dependencies and Decisions

Depends on ps-009 (real registration/login) — there is nothing to manage until real accounts
exist. Not yet startable; becomes right-sized/ready once ps-009 delivers, or its account shape is
decided enough to build against.

## Completion Expectations

A coordinator can sign in, see the list of real registered accounts with their roles, and
deactivate one. Recognized complete once that flow works end to end and is reviewed.
