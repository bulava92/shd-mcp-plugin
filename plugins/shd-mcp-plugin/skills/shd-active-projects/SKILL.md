---
name: shd-active-projects
description: Use when the user asks for all active SHD projects, project deadlines, project statuses, or a project register sorted by the nearest completion date.
---

# Active SHD projects

## Workflow

1. Call `shd_list_projects` once with `archived: false` and `limit: 100`.
2. If the user supplied a search term, pass it as `q`; otherwise do not add a
   search filter.
3. Use the project fields returned by that tool. Do not call
   `shd_get_project` once per row just to repeat list data.
4. Sort projects with a non-null `deadline` in ascending order. Put projects
   without a deadline after dated projects; do not invent a date.
5. Return the compact table:

   `Проект | Дата завершения | Статус`

6. If the user is in a UI-capable MCP host, call `shd_render_projects_widget`
   after the data call, passing the returned `data` array as `projects` and the
   returned `meta` object as `meta`. The widget is optional; the plain table
   remains the fallback for hosts without MCP Apps UI.
7. Preserve the server's project name/code and status. If a deadline is a
   datetime, format it with its returned timezone when available; otherwise
   keep the value unmodified and state that timezone data was unavailable.

## Boundaries

- “Активные” defaults to non-archived projects (`archived: false`). If the user
  means a particular business status rather than archive state, ask which
  status or report the returned statuses without filtering them locally.
- Do not use task due dates as project completion dates.
- If the server indicates more records than the tool can return, report that
  the current tool limit was reached; do not claim a complete list.
- This workflow is read-only and must not update, archive or delete projects.

See `references/project-widget.md` for the data/render boundary.
