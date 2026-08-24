---
name: shd-inventory
description: Use when the user asks to inspect or change SHD inventory items, assets, stock, procurement, reservations, receipts or stocktakes.
---

# SHD inventory

See `references/inventory-safety.md` before any stock, asset or procurement
mutation.

## Inspect

- Resolve the project, location, item, asset or procurement identity from
  server results.
- Read current stock, lots, reservations, movements, receipts, maintenance,
  assignments and audit data relevant to the question.
- Keep available, reserved, received, written-off and counted quantities
  distinct. Do not calculate an authoritative balance from partial pages.

## Mutations

Reserve, release, receive, write off or close a stocktake only on an explicit
request. Creating/updating resources and generic inventory actions require the
same read-before-write and conflict/idempotency handling. Report quantities,
location, source document, server validation and readback; never silently
repair a discrepancy by changing stock.
