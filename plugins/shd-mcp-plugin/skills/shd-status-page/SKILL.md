---
name: shd-status-page
description: Use when the user asks to inspect SHD status-page monitors, history, groups or incidents, or to change public status monitoring.
---

# SHD status page

See `references/status-page-safety.md` for monitor and incident boundaries.

## Read

- Resolve the status-page scope and monitor IDs before reporting health.
- Read current monitors and history; distinguish current state from historical
  observations and from an incident declaration.
- Report unavailable, stale or unauthorized monitors explicitly.

## Mutations

Publishing an incident, creating/updating/deleting a group or monitor changes
an externally visible monitoring surface. Require an explicit request, exact
scope and current readback. Do not publish an incident to test the integration
and do not infer an outage from one missing response.
