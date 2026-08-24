# SHD MCP Plugin

Public installable plugin package for SHD project workflows. It combines Codex
Skills with the authenticated SHD MCP server and keeps business logic, ACLs,
OAuth and persisted data in SHD itself.

## What the user installs

The package contains:

- `.codex-plugin/plugin.json` — plugin metadata;
- `.mcp.json` — the official SHD Streamable HTTP MCP endpoint;
- `skills/` — routing, project, ProjectBase, task, file, finance, CRM,
  analytics, estimates, scheduling, entity resolution, Wiki, discussions,
  documents, organizations/ACL, notifications, inventory, agents, status-page,
  realtime/activity, Terms/contracts and Gitea workflows;
- `assets/` — plugin branding;
- `widgets/` — versioned MCP Apps resources with manifest, checksum and
  provenance metadata;
- `.agents/plugins/marketplace.json` — a ready local marketplace entry.

It does not contain the SHD Laravel application, database code or credentials.

## Install in Codex

Clone this repository and register its marketplace:

```bash
git clone https://github.com/bulava92/shd-mcp-plugin.git
cd shd-mcp-plugin
codex plugin marketplace add "$PWD"
codex plugin add shd-mcp-plugin@shd-public
```

After installation, start a new Codex thread so the plugin Skills are loaded.

## ChatGPT custom app

ChatGPT uses the same SHD MCP server connection, but it is added separately in
the ChatGPT account: open Settings → Apps/Connectors → Developer mode, create
a custom app and set the MCP URL to `https://shd.xyz.su/mcp`. Complete the SHD
OAuth flow and refresh the app after server metadata changes.

The active-projects result can render an inline MCP Apps widget. It is a small
dashboard with:

- `Проект → Дата завершения → Статус`;
- sorting by the nearest deadline;
- local search by project name/code;
- a refresh action, a project-details panel and controlled project actions.

If the host does not support MCP Apps UI, the data tool and the plain Markdown
table remain fully usable.

The backend serves the checked-in widget artifact at
`ui://shd/active-projects/v1.html`; its manifest and `SHA256SUMS` are kept next
to the HTML resource under `plugins/shd-mcp-plugin/widgets/active-projects/v1/`.

The same data/render contract is available for Documents, Tasks,
Finance, CRM, Discussions, Notifications, Scheduling, Inventory, Agents,
Status Page, Project DB, Notes, Project overview, Files, Proposals, Terms,
Activity, Organizations and access, Gitea Issues and Schemes:

- `shd_render_documents_widget` → `ui://shd/documents/v1.html`;
- `shd_render_tasks_widget` → `ui://shd/tasks/v1.html`;
- `shd_render_finance_widget` → `ui://shd/finance/v1.html`;
- `shd_render_crm_widget` → `ui://shd/crm/v1.html`;
- `shd_render_discussions_widget` → `ui://shd/discussions/v1.html`;
- `shd_render_notifications_widget` → `ui://shd/notifications/v1.html`;
- `shd_render_scheduling_widget` → `ui://shd/scheduling/v1.html`;
- `shd_render_inventory_widget` → `ui://shd/inventory/v1.html`;
- `shd_render_agents_widget` → `ui://shd/agents/v1.html`;
- `shd_render_status_page_widget` → `ui://shd/status-page/v1.html`;
- `shd_render_project_db_widget` → `ui://shd/project-db/v1.html`;
- `shd_render_notes_widget` → `ui://shd/notes/v1.html`.
- `shd_render_project_overview_widget` → `ui://shd/project-overview/v1.html`;
- `shd_render_files_widget` → `ui://shd/files/v1.html`;
- `shd_render_proposals_widget` → `ui://shd/proposals/v1.html`;
- `shd_render_terms_widget` → `ui://shd/terms/v1.html`;
- `shd_render_activity_widget` → `ui://shd/activity/v1.html`;
- `shd_render_organizations_widget` → `ui://shd/organizations/v1.html`;
- `shd_render_gitea_widget` → `ui://shd/gitea/v1.html`;
- `shd_render_schemes_widget` → `ui://shd/schemes/v1.html`;
- `shd_render_task_kanban_widget` → `ui://shd/task-kanban/v1.html`;
- `shd_render_team_workload_widget` → `ui://shd/team-workload/v1.html`;
- `shd_render_project_timeline_widget` → `ui://shd/project-timeline/v1.html`;
- `shd_render_crm_funnel_widget` → `ui://shd/crm-funnel/v1.html`;
- `shd_render_finance_dashboard_widget` → `ui://shd/finance-dashboard/v1.html`;
- `shd_render_proposal_approvals_widget` → `ui://shd/proposal-approvals/v1.html`;
- `shd_render_documents_completeness_widget` → `ui://shd/documents-completeness/v1.html`;
- `shd_render_agents_health_widget` → `ui://shd/agents-health/v1.html`;
- `shd_render_schedule_calendar_widget` → `ui://shd/schedule-calendar/v1.html`;
- `shd_render_acl_matrix_widget` → `ui://shd/acl-matrix/v1.html`;
- `shd_render_inventory_warnings_widget` → `ui://shd/inventory-warnings/v1.html`;
- `shd_render_gitea_board_widget` → `ui://shd/gitea-board/v1.html`;
- `shd_render_schemes_progress_widget` → `ui://shd/schemes-progress/v1.html`;
- `shd_render_notes_tree_widget` → `ui://shd/notes-tree/v1.html`;
- `shd_render_project_db_preview_widget` → `ui://shd/project-db-preview/v1.html`.

Each widget accepts normalized records from its list tool, keeps the plain
structured response as a fallback and uses the MCP Apps bridge before the
`window.openai` compatibility API.

The official OpenAI directory is optional. It is useful for public discovery,
one-click installation and review of a public app; it is not required for an
internal team or a manually added ChatGPT custom app. See the official
[MCP server guide](https://developers.openai.com/plugins/build/mcp-server),
[UI guide](https://developers.openai.com/plugins/build/chatgpt-ui), and
[submission guide](https://developers.openai.com/plugins/deploy/submission)
when public listing is the goal.

## Connect SHD

Installation and authorization are separate steps:

1. The client reads `.mcp.json` and opens the SHD OAuth flow.
2. The user signs in to SHD and approves the requested MCP connection.
3. SHD issues the client an authorization; the client stores it securely.
4. Every tool call is checked again by SHD for organization, project and
   module permissions.

The user does not need to put a token in this repository. A personal access
token may be used only if the selected MCP client and SHD deployment
explicitly support it; enter it in that client's secure connection settings,
never in `.mcp.json`, Skills or an issue.

SHD OAuth supports ChatGPT CIMD clients with PKCE S256 and
`private_key_jwt` client authentication. The server validates the client
assertion against ChatGPT's published JWKS; the plugin package never stores
the assertion, access token or refresh token.

For ChatGPT or another MCP client without Codex plugin installation, add the
same HTTPS endpoint as a custom MCP app and complete OAuth there. The public
repository packages the workflows; it does not grant access to the server.

## Troubleshooting

- **Plugin installs but tools are unavailable:** reconnect SHD OAuth and start
  a new thread.
- **Projects are missing:** the SHD account or organization lacks access, or
  the project is archived; verify permissions in SHD.
- **A write is rejected:** the server ACL, required role, version or conflict
  check rejected it. Do not bypass the error with a different token.
- **A module is not covered by a dedicated skill:** use `shd-routing`; the MCP
  server still exposes the current authenticated tool catalog, while skills
  provide focused workflow and safety guidance for common module operations.
- **Another SHD installation is required:** use its approved MCP URL and its
  OAuth resource in the client's secure connection configuration.

## Development

Keep changes inside the plugin package. The authenticated MCP server, OAuth
deployment and runtime verification remain private server-side concerns. Do not
place credentials, private host details or backend implementation in Skills or
widget assets.

## License

The repository is public source, but the plugin and SHD branding are distributed
under the proprietary [SHD MCP Plugin License](LICENSE). Public visibility does
not grant rights to redistribute, resell, modify or reuse the package outside
the permitted SHD use.
