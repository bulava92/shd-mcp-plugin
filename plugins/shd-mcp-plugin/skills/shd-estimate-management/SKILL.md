---
name: shd-estimate-management
description: Use when the user asks to inspect, compare, validate, create or update SHD estimates, proposals, terms or document contracts.
---

# SHD estimates and proposal documents

## Read path

1. Resolve the project, proposal, terms document or contract before acting.
2. Use `shd_list_proposals` and `shd_get_proposal` for proposal registers and
   details.
3. Use `shd_list_terms_documents`, `shd_get_terms_document`,
   `shd_get_terms_document_completeness` and `shd_validate_terms_document` for
   terms and completeness checks.
4. Inspect template capabilities before proposing a template-driven change.
5. Report line items, versions, completeness, approvals and publication state
   only when those fields are returned by the server.

## Mutations

- Creating, replacing items, requesting approval, publishing, restoring or
  deleting a proposal/document requires an exact explicit request.
- Read the latest version and use the tool's concurrency and idempotency fields
  before a write.
- Never publish or request approval as a side effect of an audit or comparison.

See `references/estimate-safety.md` before a proposal or terms mutation.
