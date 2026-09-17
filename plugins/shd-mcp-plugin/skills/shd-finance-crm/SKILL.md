---
name: shd-finance-crm
description: Use when the user asks for finance or CRM information, document/payment checks, customer records, deals, relationships, or a project business overview in SHD.
---

# SHD Finance and CRM

For a high-level project overview, prefer `shd_get_project_context` and request
only the `finance` or `summary` sections needed. For a detailed request use
the module tools below.

## Finance

- Find documents with `shd_list_finance_documents`.
- Read one with `shd_get_finance_document`.
- Read payments with `shd_list_finance_payments` or
  `shd_get_finance_payment`.
- Resolve allowed references with `shd_list_finance_refs`.
- In a UI-capable MCP host, pass normalized finance records to
  `shd_render_finance_widget`; keep the structured list as the fallback.

When auditing, compare document type, project/counterparty links, line items,
currency, totals, due dates, payment state and returned validation. Never infer
approval, payment or publication from a document's title or amount.

## CRM

- Find entities with `shd_list_crm` and read one with `shd_get_crm_entity`.
- In a UI-capable MCP host, pass normalized CRM records to
  `shd_render_crm_widget`; keep the structured list as the fallback.
- Resolve relationships with `shd_list_crm_entity_links` and inspect available
  pipelines/stages before a deal change.
- Use `shd_save_crm_entity` only for an explicitly requested create/update after
  duplicate and relationship checks.

Do not approve, publish, delete, merge, move a deal stage, create a payment or
change ownership unless the user explicitly requests that exact operation.
Report IDs, resolved links, changed fields and server validation separately from
recommendations.

See `references/finance-crm-audit.md` for the finance/CRM audit boundary.
