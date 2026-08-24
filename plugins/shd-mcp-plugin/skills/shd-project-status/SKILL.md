---
name: shd-project-status
description: Use when the user asks for a status report, operational summary, risks, blockers, next actions, or a cross-module overview of one SHD project.
---

# SHD project status

## Resolve the project

- If the user supplied an exact project code, use it directly.
- If the user supplied only a name, call `shd_list_projects` with `q` once,
  choose only an unambiguous exact match, and ask for the project code when
  multiple projects match.

## Read the context

For a full summary call `shd_get_project_context` with the resolved
`project_code`, `include` set to the requested sections, and
`limit_per_section: 100`. The available sections are:

`summary`, `tasks`, `discussions`, `documents`, `finance`, `terms`, `agents`.

Request only the sections needed for a narrow question. Do not pretend that a
section is empty when the server reported it unavailable or the user lacks
access.

## Report

Separate the result into:

- confirmed project state;
- current deadlines or status values returned by SHD;
- blockers and risks supported by retrieved records;
- next actions, clearly marked as recommendations;
- unavailable or unresolved sections.

Do not convert a task deadline into a project deadline, infer a completion date
from activity, or claim deployment success from a status field. This workflow is
read-only unless the user separately requests a specific change.

See `references/context-sections.md` for section selection and unavailable data.
