---
name: shd-organizations-acl
description: Use when the user asks to inspect or change SHD organizations, members, invitations, roles, access audits or two-factor policies.
---

# SHD organizations and ACL

See `references/organization-acl.md` for identity resolution and mutation
boundaries.

## Inspect

- Resolve the canonical organization ID; never use a guessed name as a write
  target.
- Read members, invitations, audit entries and the current two-factor policy
  before explaining access.
- Report organization, user, role, invitation state and policy as separate
  facts. A denied or incomplete list is not proof that a member is absent.

## Change access

Inviting, adding, updating or removing a member, changing a two-factor policy,
or creating, archiving or restoring an organization requires explicit intent.
Show the exact organization and user scope before the mutation. Preserve server
authorization, conflict checks and audit readback; never broaden access to
make a failed request succeed.
