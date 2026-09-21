---
name: shd-short-links
description: Use when the user asks to inspect or change SHD short links, public aliases, link targets, rotation, revocation or aggregate link statistics.
metadata: modules=short-links
---

# SHD short links

## Inspect and resolve

- Resolve the exact link ID, owner, project, alias and current status from
  `shd_list_short_links` or `shd_get_short_link` before changing it.
- Keep active, revoked, expired, disabled and retired links distinct. Treat
  target URLs, access flags and public aliases as sensitive data.

## Mutations

- Create or update only the explicitly requested link fields. Preserve
  `expected_updated_at` and the server's idempotency/readback contract.
- Revoke or rotate only on an explicit request with `confirm=true`, current
  concurrency data and a fresh idempotency key.
- Never expose bearer tokens, private redirect data or inferred access rights.
  Report the link ID, alias, status, affected fields and server result.
