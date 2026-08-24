# SHD MCP plugin package

This directory is the installable Codex plugin. It packages reusable SHD
workflow Skills and the official SHD MCP connection; it does not contain the
SHD backend or a second MCP server.

The plugin requires an SHD account authorized for the requested projects and
modules. Skills do not grant permissions or bypass server-side ACLs.

## Included workflows

- active projects with completion dates and statuses;
- project status and risk summaries;
- ProjectBase schema and data-quality audits;
- guarded task workflows;
- project file inspection and actions;
- finance and CRM read/audit workflows;
- finance account, balance, payment and settlement audits;
- analytics, comparisons, reports and task/proposal metrics;
- entity resolution and duplicate-candidate analysis;
- estimates, proposals and estimate-document-contract workflows;
- scheduling events, slots and booking positions;
- Wiki, notes, revisions and note-database workflows;
- discussions, channels, topics, messages and attachments;
- documents, templates, PDFs, revisions and public-link workflows;
- organizations, members, invitations, ACL and two-factor policies;
- notifications, preferences and read-state workflows;
- inventory, assets, stock, procurement and stocktake workflows;
- agent/controller diagnostics, tunnels, endpoints and runtime actions;
- status-page monitors, groups, history and incidents;
- realtime sessions, event cursors and operational activity;
- Terms documents, revisions, completeness and contract discussions;
- linked Gitea issues, labels, comments and attachments;
- safe bulk-change planning and validation rules.

When the connected MCP host supports MCP Apps UI, the 36 SHD render tools have
inline interactive widgets: active projects, module registers and specialized
Kanban, workload, timeline, funnel, dashboard, calendar, matrix, tree and
Project DB views. Each widget sorts or filters normalized records, shows
status/value fields, can load one selected record’s details where supported and
exposes only the write actions declared by its render metadata. A write always
requires an explicit form submission; destructive actions also require a
confirmation checkbox. After a successful mutation, the widget refreshes its
source list.
The same tools still return normal structured data for hosts that do not render
widgets.

The active-projects widget is versioned in `widgets/active-projects/v1/` with a
manifest, SHA256 checksum and source/provenance note. The SHD MCP backend reads
that artifact for the `ui://shd/active-projects/v1.html` resource.

The other versioned resources are stored under `widgets/` with a manifest,
SHA256 checksum and source/provenance note for each resource. Their render
tools are deliberately separate from the list tools so the server can keep
data access and UI rendering auditable.

## MCP connection

The package points to `https://shd.xyz.su/mcp` and requests OAuth for that MCP
resource. The client stores the resulting authorization; this repository never
contains an access token.

If a client or SHD installation uses another official endpoint, change the
connection in `.mcp.json` in that client's secure configuration. Do not commit
tokens, cookies, client secrets or private host credentials.
