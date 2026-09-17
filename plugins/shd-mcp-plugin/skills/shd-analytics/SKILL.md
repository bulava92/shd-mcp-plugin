---
name: shd-analytics
description: Use when the user asks for SHD project or company analytics, trends, comparisons, metrics, charts, reports, or time summaries.
---

# SHD analytics and reports

## Scope

1. Resolve the organization or project scope before aggregating values. Use an
   exact `project_code` when the user supplied one; otherwise resolve it with
   `shd_list_projects`.
2. Use `shd_get_project_context` for a bounded cross-module summary and request
   only the sections needed for the question.
3. For task effort use `shd_get_task_time_report`; use
   `shd_export_task_time_report` only when the user asks for an export.
4. For proposal analytics use `shd_get_proposal_public_analytics` only for a
   resolved proposal or public analytics scope accepted by its schema.
5. If the requested metric does not map to a known tool, call
   `shd_capabilities` and report the unavailable capability instead of inventing
   an endpoint or field.

## Reporting rules

- State the period, scope, currency and timezone returned by SHD.
- Distinguish totals returned by the server from calculations made from rows.
- Preserve null, unavailable and permission-denied sections as separate states.
- Do not infer profitability, completion, approval or trend direction from one
  record or from a missing section.
- Present chart-ready data as a compact table with labels, units and source
  fields. Use a UI resource only when the server advertises a matching widget.

See `references/analytics-contract.md` before composing a multi-section report.
