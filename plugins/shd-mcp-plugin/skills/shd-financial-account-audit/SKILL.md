---
name: shd-financial-account-audit
description: Use when the user asks to audit SHD finance accounts, balances, payments, documents, allocations, settlements or finance history.
---

# SHD financial audit

## Read path

1. Resolve project, legal entity, counterparty and period before reading.
2. Use `shd_list_finance_refs` for allowed categories, accounts and reference
   values when the request depends on them.
3. Read documents and payments with `shd_list_finance_documents`,
   `shd_get_finance_document`, `shd_list_finance_payments` and
   `shd_get_finance_payment`.
4. Use `shd_get_finance_account_balance` and
   `shd_list_finance_audit_log` when balances or history are requested.
5. Reconcile only records returned for the same scope and period. Mark missing
   links, currency differences and permission gaps explicitly.

## Settlement safety

- Allocation, removal of allocation, payment creation, approval, deletion and
  document replacement are writes; do not perform them during an audit.
- A document total is not proof of payment, and a payment is not proof of
  allocation.
- For an explicitly requested write, read the latest payment/document and use
  the server's idempotency and concurrency contract, then read back the result.

See `references/finance-audit.md` for the reconciliation format.
