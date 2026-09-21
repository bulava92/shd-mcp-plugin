---
name: shd-auth-profile
description: Use when the user asks to inspect or update the authenticated SHD profile or unlink the authenticated OIDC profile.
metadata: modules=auth-profile
---

# SHD authenticated profile

- Read `shd://me` or call `shd_get_current_user` before changing profile data.
- Update only safe fields explicitly requested by the user. Email, password,
  sessions, recovery data, access flags and tokens are outside this workflow.
- Unlink OIDC only on an explicit request and only after the server confirms
  that another sign-in method remains available. Preserve concurrency values,
  idempotency and the server readback.
- Never expose OIDC subjects, credentials, tokens or recovery information.
