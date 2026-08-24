---
name: shd-project-db-audit
description: Use when the user asks to inspect ProjectBase tables, validate project data, find duplicate or broken links, or audit ProjectBase quality without changing records.
---

# ProjectBase audit

See `references/audit-contract.md` for the bounded read and evidence format.

## Workflow

1. Resolve the canonical Base identity. A supplied `project_code` is accepted
   as the legacy alias only when the server accepts it; prefer the returned
   Base identity for subsequent calls.
2. If no table is named, call `shd_project_db_tables` first and select only the
   relevant tables. Do not load every table by default.
3. Call `shd_project_db_schema` for each selected table before reading its
   records. Pass the table explicitly when a single-table audit is requested.
4. Call `shd_project_db_records` with bounded reads and the selected table.
5. Compare records with the returned schema and report only evidence visible in
   the response.

## Findings

Check for duplicate business numbers, missing required values, invalid select
values, unresolved linked records, orphaned references, conflicting DALI or
electrical identifiers, formula/derived-field risks and incomplete source data
when the selected tables expose those fields.

Report `table → record → field → observed value → reason → priority`. Distinguish
confirmed defects from data that could not be checked because the schema or
records were unavailable.

## Safety

This workflow is read-only. Do not call create, update, delete, import, bulk
upsert or generic action tools while auditing. If the user asks to repair
findings, first present the proposed records and then use the dedicated
validation/dry-run contract before any explicit write.
