# SHD MCP plugin package

This directory is the installable Codex plugin. It packages reusable SHD
workflow Skills and the official SHD MCP connection; it does not contain the
SHD backend or a second MCP server.

The plugin requires an SHD account authorized for the requested projects and
modules. Skills do not grant permissions or bypass server-side ACLs.
Each Skill declares its module scope; the MCP server filters Skill discovery
and Skill resources by the authenticated module access in the same way as
prompts and data resources.

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
- service catalog, version, approval and site-publication workflows;
- short-link, public-alias, rotation and revocation workflows;
- global System Base and authenticated profile workflows;
- agent/controller diagnostics, tunnels, endpoints and runtime actions;
- status-page monitors, groups, history and incidents;
- realtime sessions, event cursors and operational activity;
- Terms documents, revisions, completeness and contract discussions;
- linked Gitea issues, labels, comments and attachments;
- safe bulk-change planning and validation rules.

When the connected MCP host supports MCP Apps UI, the 44 SHD render tools have
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

The controller observability render tools share the versioned
`widgets/controller-observability/v1/` resource. It exposes controller device
inventory and profiles, normalized live states, server-computed binary/numeric
statistics, explicit native vs Influx/Grafana provenance, universal comparison
presets, complete controller topology, telemetry health and operation audit.
Expert-setting controls are enabled only for source-provided writable descriptors.

The active-projects source is `widgets/active-projects/source.html` with its
resource metadata in `widgets/active-projects/widget.json`. Before starting
the backend, generate the ignored runtime files with:

```sh
node scripts/generate-widget-artifacts.mjs
```

The backend then reads the generated `widgets/active-projects/v1/` artifact for
the `ui://shd/active-projects/v1.html` resource.

The standard module resources are generated from the single
`widgets/_shared/universal-widget.html` source by
`scripts/generate-widget-artifacts.mjs`. Each generated artifact still keeps
its own URI, manifest, SHA256 checksum and provenance note: this preserves
resource cache keys and module-scope registration while removing duplicated
HTML, bridge and action runtime code. The generator also injects the shared
`widgets/_shared/widget-theme.css` and `widgets/_shared/write-actions.css`
into the specialized `active-projects` and `controller-observability`
renderers, so every widget uses the same spacing, surfaces, controls, tables
and responsive rules without changing their data contracts. The generator
supports `--check` for a no-write consistency check. Module copy and fallback
tool configuration lives in the sibling
`widgets/_shared/universal-widget-config.json` source and is injected into
each universal standalone artifact by the generator. For an older template
that still contains the inline configuration block, run `--extract-config`
once and then `--migrate-template` once. The specialized applications remain
separate only where their interaction contracts differ. Render tools are
deliberately separate from list tools so data access and UI rendering remain
auditable.

The generated `widgets/*/v1/` directories are ignored and must not be
committed. A fresh checkout or deployment must run the generator before the
MCP backend starts; `--check` can then verify that the local runtime output is
current.

## MCP connection

The package points to `https://shd.xyz.su/mcp` and requests OAuth for that MCP
resource. The client stores the resulting authorization; this repository never
contains an access token.

If a client or SHD installation uses another official endpoint, change the
connection in `.mcp.json` in that client's secure configuration. Do not commit
tokens, cookies, client secrets or private host credentials.
