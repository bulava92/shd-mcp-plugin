---
name: shd-routing
description: Use for any request that asks SHD for data, a project operation, a module workflow, or a change to SHD records. Route the request to the narrowest existing SHD MCP tool and preserve server-side permissions.
---

# SHD routing and safety

SHD MCP is the source of truth for live data, tool schemas, permissions,
organization/project scope, conflicts, idempotency, audit and persisted
readback. Do not invent fields, statuses, identifiers, routes or capabilities.

## Route the request

- Project list, project status, deadlines or project context: use the Projects
  Core tools and the `shd-active-projects` or `shd-project-status` workflow.
- ProjectBase schema, records, links or data quality: use Project DB tools and
  the `shd-project-db-audit` workflow.
- Tasks, task projects, task status or task dates: use Tasks tools and the
  `shd-task-workflow` workflow.
- Project files and paths: use Files tools and the `shd-project-files` workflow.
- Discussions, channels, topics, messages or attachments: use Discussions tools and the `shd-discussions` workflow.
- Documents, templates, revisions, PDFs or publication links: use Documents tools and the `shd-documents` workflow.
- Organizations, members, invitations, roles or two-factor policy: use Organizations tools and the `shd-organizations-acl` workflow.
- Notifications, preferences or read state: use Notifications tools and the `shd-notifications` workflow.
- Inventory, stock, assets, procurement or stocktakes: use Inventory tools and the `shd-inventory` workflow.
- Agents, controllers, diagnostics, tunnels or network access: use Agents tools and the `shd-agents-operations` workflow.
- Status-page monitors, history, groups or incidents: use Status Page tools and the `shd-status-page` workflow.
- Realtime sessions, event cursors or historical activity: use Realtime tools and the `shd-realtime-activity` workflow.
- Terms documents, revisions, completeness or contract discussions: use Terms tools and the `shd-terms-contracts` workflow.
- Linked Gitea issues, labels, comments or attachments: use Gitea tools and the `shd-gitea` workflow.
- Finance or CRM records: use the specific module tools and the
  `shd-finance-crm` workflow; use project context for a high-level overview.
- Finance reconciliation, balances, settlements or audit history:
  `shd-financial-account-audit`.
- Proposals, estimates, quotes or estimate-document contracts:
  `shd-estimate-management`.
- Scheduling, event types, slots or bookings: `shd-event-positions`.
- Wiki, notes, pages, revisions or note databases: `shd-wiki-management`.
- Entity matching or possible duplicates: `shd-entity-resolution`.
- Analytics, comparisons, trends or reports: `shd-analytics`.
- A multi-record change: use `shd-safe-bulk-change` before any mutation.

Use `shd_capabilities` only when the available module or permission boundary is
unclear. If a tool or module is unavailable, report that fact instead of
falling back to an undocumented endpoint.

## Read-first rule

For every write, first read the target and its relevant schema or metadata.
Only perform a mutation when the user explicitly requested that mutation. A
request to inspect, summarize, compare, audit or suggest is not permission to
write.

Preserve the exact server result. Separate confirmed values from inference,
and include affected identifiers, conflicts, validation errors and final
readback when the server returns them.

## Scope and secrets

Never ask for or expose access tokens, passwords, cookies, private keys, raw
public-link bearer tokens or integration secrets. Never use a user-provided
project name as an identifier when SHD has not resolved it to a returned
project code or ID.

See `references/module-map.md` for the current high-level routing map.
