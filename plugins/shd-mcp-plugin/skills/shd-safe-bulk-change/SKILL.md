---
name: shd-safe-bulk-change
description: Use before any SHD bulk create, update, import, archive, delete, or other multi-record mutation, and whenever the user asks to plan a mass change.
---

# Safe SHD bulk changes

## Plan first

1. Confirm the target module, organization/project scope, exact match rule and
   intended side effect.
2. Read current schemas and records. Estimate affected, skipped, invalid and
   ambiguous rows.
3. Prefer a server validation or dry-run operation. For ProjectBase use
   `shd_project_db_validate_records`, then
   `shd_project_db_bulk_create_records` or
   `shd_project_db_bulk_upsert_records` with `dry_run: true` when applicable.
4. Present the plan and stop unless the user explicitly authorized execution.

## Execute safely

Use stable idempotency keys, expected versions and exact match fields accepted
by the selected tool. Do not silently widen a project, organization, table or
record filter. Do not convert a failed or conflicting row into a new record.

After execution, report created, updated, skipped, rejected and conflicted
rows, then use the server's persisted readback when available. Destructive
operations require explicit confirmation and remain subject to server ACL.

See `references/write-preflight.md` for the required preflight record.
