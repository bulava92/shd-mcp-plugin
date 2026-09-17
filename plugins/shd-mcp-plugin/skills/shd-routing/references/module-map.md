# SHD module map

- Projects and project context → `shd_list_projects`, `shd_get_project`,
  `shd_get_project_context`.
- ProjectBase → `shd_project_db_*`, `shd_project_base_*`.
- Tasks → `shd_list_tasks`, `shd_get_task`, task mutation tools.
- Files → `shd_list_files`, file action tools.
- Discussions → channel, topic, message search and attachment tools.
- Documents → document, template, revision, PDF and publication-link tools.
- Organizations and ACL → members, invitations, audit and two-factor policy
  tools.
- Notifications → notification, preference and read-state tools.
- Inventory → stock, asset, procurement, reservation and stocktake tools.
- Agents → controller/user-agent status, diagnostics, tunnels, endpoints and
  network-operation tools.
- Status Page → monitor, history, group and incident tools.
- Realtime and activity → session, event-cursor and audit/activity tools.
- Terms and contracts → Terms documents, completeness, revisions and point
  discussion tools.
- Gitea → linked issue, label, comment and attachment tools.
- Finance and CRM → module-specific finance/CRM tools.
- Proposals, terms and document contracts → proposal/terms/document tools.
- Scheduling → `shd_get_scheduling_overview` and scheduling tools.
- Wiki and notes → note-space, page, revision and database tools.
- Unknown or permission-sensitive capability → `shd_capabilities` first.
