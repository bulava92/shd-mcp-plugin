---
name: shd-project-files
description: Use when the user asks to inspect project files, obtain a file link, share or zip a file, rename or move a path, or delete project files.
---

# SHD project files

## Resolve paths

1. Call `shd_list_files` with the exact `project_code` and, when supplied, the
   path.
2. Resolve the exact file or directory path and distinguish files from
   directories before any action.
3. Use `shd_get_file_link` only when the user asks for a temporary file link or
   download.

## Actions

`shd_create_file_action` supports the explicit actions `share-link`, `zip-link`,
`rename`, `move` and `delete`. Use the exact action matching the request. For
rename, move and delete, confirm the source/destination and replacement scope
from the current listing first. Mutating actions require a stable
`idempotency_key`; delete additionally requires `confirm: true` and the server
version/confirmation fields accepted by its schema.

Do not expose bearer tokens or raw secret material in prose or logs. Return a
temporary URL only when the user explicitly asks for it. Do not overwrite,
publish, share or delete a path merely because the user asked to inspect it.

See `references/file-actions.md` for the file-action boundary.
