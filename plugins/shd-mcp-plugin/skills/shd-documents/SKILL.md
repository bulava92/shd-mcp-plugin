---
name: shd-documents
description: Use when the user asks to inspect, generate, send, publish, revise or audit SHD documents, templates, comments or public links.
---

# SHD documents

See `references/document-safety.md` before handling publication, PDF or
contract-related document actions.

## Read and prepare

- Resolve the project and document identifiers before reading content.
- Read the document, relevant template/configuration, revisions and comments
  needed for the requested result; do not treat a filename as authorization.
- Keep document status, approval state, external links and public links
  separate in the report.
- Use the document's returned revision or version when a write accepts one.
- In a UI-capable MCP host, pass normalized list records to
  `shd_render_documents_widget`; keep the structured document list as the
  fallback and use `shd_get_contract` only for an explicitly selected record.

## Mutations and publication

Generating a PDF, sending a document, saving a contract, publishing a public
link or changing document state requires an explicit request. Explain the
target and audience before publication, preserve the server's ACL and expiry
rules, and perform readback when the tool provides it. Never expose private
links, bearer values or document content outside the authorized result.
