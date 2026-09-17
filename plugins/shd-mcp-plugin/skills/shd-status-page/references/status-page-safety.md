# Status-page safety contract

Read with `shd_get_status_page_monitors` and
`shd_get_status_page_monitor_history`. Mutations are
`shd_publish_status_page_incident`, `shd_create_status_page_group`,
`shd_update_status_page_group`, `shd_delete_status_page_group`,
`shd_create_status_page_monitor`, `shd_update_status_page_monitor` and
`shd_delete_status_page_monitor`.

Before a mutation, resolve the canonical monitor/group IDs, read the latest
state and show the public scope, message, duration or target being changed.
Report server validation and final status. Deletion and incident publication
are consequential actions and must never be inferred from a question asking for
diagnosis.
