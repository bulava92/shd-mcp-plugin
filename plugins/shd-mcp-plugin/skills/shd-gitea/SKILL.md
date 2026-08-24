---
name: shd-gitea
description: Use when the user asks to inspect or manage SHD-linked Gitea issues, labels, comments or issue attachments.
---

# SHD Gitea

See `references/gitea-contract.md` for repository and issue safety.

## Read and resolve

- Resolve the canonical repository and issue identifiers returned by SHD before
  acting.
- Read the issue, labels and current state before creating a comment or
  changing labels.
- Keep Gitea state separate from SHD project/task state; do not claim that a
  label or issue update changed the SHD record unless the server says so.

## Mutations

Creating an issue, commenting, changing labels or uploading an attachment
requires an explicit request. Report repository, issue number, changed labels,
comment/attachment result and server validation. Never put credentials or
private attachment URLs in the response or repository.
