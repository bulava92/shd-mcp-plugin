# SHD MCP in ChatGPT

This file describes the user-side connection. The repository cannot create an
app inside another person’s ChatGPT account and never stores OAuth tokens.

## Custom app

1. Open ChatGPT settings and enable Developer mode for Apps/Connectors.
2. Create a custom app with this MCP endpoint:

   `https://shd.xyz.su/mcp`

3. Complete the SHD OAuth sign-in and consent screen.
4. Start a new chat or refresh the app connection.
5. Test with: `Покажи активные проекты с датой завершения и статусом.`

The server publishes OAuth 2.1 discovery for the root resource and supports
ChatGPT Client ID Metadata Documents (CIMD), PKCE S256 and the
`private_key_jwt` token-endpoint authentication method. Keep the app URL as
`https://shd.xyz.su/mcp`; the retired `/mcp/system-data` resource is not a
valid replacement for the root MCP resource.

The expected flow is:

1. ChatGPT calls `shd_list_projects` with `archived: false`.
2. ChatGPT calls the corresponding module render tool after the list tool
   before the final response when MCP Apps UI is supported:
   `shd_render_projects_widget`, `shd_render_documents_widget`,
   `shd_render_tasks_widget`, `shd_render_finance_widget`,
   `shd_render_crm_widget`, `shd_render_discussions_widget`,
   `shd_render_notifications_widget`, `shd_render_scheduling_widget`,
   `shd_render_inventory_widget`, `shd_render_agents_widget`,
   `shd_render_status_page_widget`, `shd_render_project_db_widget` or
   `shd_render_notes_widget`, `shd_render_project_overview_widget`,
   `shd_render_files_widget`, `shd_render_proposals_widget`,
   `shd_render_terms_widget`, `shd_render_activity_widget`,
   `shd_render_organizations_widget`, `shd_render_gitea_widget` or
   `shd_render_schemes_widget`, `shd_render_task_kanban_widget`,
   `shd_render_team_workload_widget`, `shd_render_project_timeline_widget`,
   `shd_render_crm_funnel_widget`, `shd_render_finance_dashboard_widget`,
   `shd_render_proposal_approvals_widget`, `shd_render_documents_completeness_widget`,
   `shd_render_agents_health_widget`, `shd_render_schedule_calendar_widget`,
   `shd_render_acl_matrix_widget`, `shd_render_inventory_warnings_widget`,
   `shd_render_gitea_board_widget`, `shd_render_schemes_progress_widget`,
   `shd_render_notes_tree_widget` or `shd_render_project_db_preview_widget`.
3. The selected widget renders a register, can call the matching detail tool for
   one selected row and exposes controlled write actions when declared by the
   render metadata.

The widget resources are versioned at `ui://shd/active-projects/v1.html`,
`ui://shd/documents/v1.html`, `ui://shd/tasks/v1.html`,
`ui://shd/finance/v1.html`, `ui://shd/crm/v1.html`,
`ui://shd/discussions/v1.html`, `ui://shd/notifications/v1.html`,
`ui://shd/scheduling/v1.html`, `ui://shd/inventory/v1.html`,
`ui://shd/agents/v1.html`, `ui://shd/status-page/v1.html`,
`ui://shd/project-db/v1.html`, `ui://shd/notes/v1.html`,
`ui://shd/project-overview/v1.html`, `ui://shd/files/v1.html`,
`ui://shd/proposals/v1.html`, `ui://shd/terms/v1.html`,
`ui://shd/activity/v1.html`, `ui://shd/organizations/v1.html`,
`ui://shd/gitea/v1.html`, `ui://shd/schemes/v1.html`,
`ui://shd/task-kanban/v1.html`, `ui://shd/team-workload/v1.html`,
`ui://shd/project-timeline/v1.html`, `ui://shd/crm-funnel/v1.html`,
`ui://shd/finance-dashboard/v1.html`, `ui://shd/proposal-approvals/v1.html`,
`ui://shd/documents-completeness/v1.html`, `ui://shd/agents-health/v1.html`,
`ui://shd/schedule-calendar/v1.html`, `ui://shd/acl-matrix/v1.html`,
`ui://shd/inventory-warnings/v1.html`, `ui://shd/gitea-board/v1.html`,
`ui://shd/schemes-progress/v1.html`, `ui://shd/notes-tree/v1.html` and
`ui://shd/project-db-preview/v1.html`.

The MCP tools remain usable without the widget. A failed OAuth connection is
an account/endpoint configuration problem, not a missing token in this repo.

## Public directory

Directory submission is a separate optional release step. It is needed for
public discovery and reviewed installation, not for internal use or a custom
app added manually in ChatGPT. Before submission, the owner must provide the
production HTTPS endpoint, OAuth metadata, privacy/support URLs, accurate app
metadata, test prompts and any review credentials requested by OpenAI.

Use the official [submission guide](https://developers.openai.com/plugins/deploy/submission)
and [plugin guidelines](https://developers.openai.com/plugins/app-guidelines).

## License choice

This repository currently uses the proprietary SHD MCP Plugin License. Public
visibility means the source can be viewed; it does not grant permission to
redistribute, resell, modify or use it outside an authorized SHD account.

MIT would grant anyone permission to use, copy, modify, publish, sublicense and
sell the plugin, including forks, while retaining only the copyright notice and
license text. Switching to MIT is a product/legal decision and is not done
implicitly by publishing the repository.
