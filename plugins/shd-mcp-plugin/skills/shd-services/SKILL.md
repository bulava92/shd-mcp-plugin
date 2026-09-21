---
name: shd-services
description: Use when the user asks to inspect or change the SHD service catalog, service versions, approvals, lifecycle or site publications.
metadata: modules=services
---

# SHD services catalog

## Inspect and resolve

- Resolve the organization service and exact version from server results; do
  not use a guessed name or slug as a mutation target.
- Read the service, versions, usage, categories and existing publication state
  relevant to the request before changing anything.
- Keep draft, pending approval, published, failed, revoked, archived and
  restored states separate. Do not infer a publication result from a version
  status alone.

## Draft and lifecycle changes

- Creating or editing a service, category or draft version requires explicit
  intent. Preserve the returned revision and server validation.
- Publish, approve, archive, restore or discard only the exact requested
  lifecycle transition. Do not publish a draft as a side effect of editing it.
- Before archiving, inspect usage and publications and preserve any required
  confirmation for public publications.

## Site publication

- Resolve the exact site, version and publication before publishing, revoking or
  retrying. Use a fresh idempotency key for publication and retry operations.
- Report service, version and publication IDs, server validation, resulting
  state and persisted readback. Never expose private publication credentials or
  invent a public URL.
