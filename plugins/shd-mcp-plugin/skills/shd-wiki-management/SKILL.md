---
name: shd-wiki-management
description: Use when the user asks to search, read, compare, create or update SHD Wiki, notes, pages, collections, databases, revisions or attachments.
---

# SHD Wiki and notes

## Read path

1. Resolve the note space and page tree with `shd_list_note_spaces`,
   `shd_get_note_space_tree` and `shd_list_note_pages`.
2. Search with `shd_search_note_blocks`, then read the selected page with
   `shd_read_note_document` or `shd_get_note_page`.
3. Use revision and operation tools to compare versions before proposing a
   replacement or restore.
4. Keep attachments, backlinks, comments, database records and page content as
   separate objects in the report.

## Mutations

Creating, replacing, moving, archiving, deleting, importing, granting members
or changing review state requires an exact explicit request. Read the current
object first, preserve the latest revision/version and use the dedicated
operation contract. Read back the persisted result after a successful write.

See `references/wiki-safety.md` for content and revision boundaries.
