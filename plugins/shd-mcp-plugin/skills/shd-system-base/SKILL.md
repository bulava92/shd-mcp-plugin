---
name: shd-system-base
description: Use when the user explicitly asks to inspect or change an allowlisted global SHD System Base table or record.
metadata: modules=system-base
---

# SHD System Base

## Scope

- System Base is global and is not project-scoped or interchangeable with
  AirBase. Resolve the allowlisted table, record ID and field ID from server
  results before any write.
- Read the table schema and current record or cell first. Preserve the returned
  `record_version`, expected value and mutation readback.

## Mutations

- Update one explicitly requested cell with a fresh idempotency key and the
  current expected value when available.
- Delete only on an explicit request with `confirm=true`, current
  `expected_version` and a fresh idempotency key.
- Do not invent table names, field IDs or values, broaden filters, use System
  Base for AirBase data, or reveal global records outside the server result.
