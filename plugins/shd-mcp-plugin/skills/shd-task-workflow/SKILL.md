---
name: shd-task-workflow
description: Use when the user asks to find, inspect, create, update, reschedule, archive, or delete SHD tasks or task-project data.
---

# SHD task workflow

See `references/task-contract.md` for identifier resolution, conflict handling
and mutation readback requirements.

## Read and resolve

- Use `shd_list_task_projects` when the request concerns a task project or its
  status.
- Use `shd_list_tasks` with `project_code`, `project_id`, `q`, `archived`,
  `limit` or `offset` to find tasks.
- Use `shd_get_task` for one resolved task and
  `shd_get_task_project_meta` for statuses, tags, sprints, views and custom
  fields.
- Read comments or attachments only when they are relevant to the request.
- After `shd_list_tasks` returns, always pass normalized task records to
  `shd_render_tasks_widget` before the final response when the host supports
  MCP Apps UI. Use the structured task list or plain text only when the render
  tool is unavailable or returns an error.

Do not create a task from an ambiguous project name or duplicate a task that
already matches the request.

## Mutations

Only mutate when the user explicitly asks for the exact operation:

- create with `shd_create_task`;
- update fields with `shd_update_task`;
- change status with `shd_update_task_status`;
- archive with `shd_archive_task`;
- delete with `shd_delete_task` and the server's explicit confirmation contract.

Before updating, pass the latest `updated_at` when the tool accepts it. Use an
idempotency key when the tool schema accepts one. If the server reports a
conflict, stop and show the current state; do not overwrite it by guessing.

Report the task ID, changed fields, server validation, conflict state and final
status. Never treat a suggested change as authorization to execute it.
