# Notification contract

Read with `shd_list_notifications`, `shd_list_notification_modules`,
`shd_get_notification_read_state`, `shd_get_notification_preferences` and,
for document-specific items, `shd_list_document_notifications`.

State-changing tools are `shd_update_notification_preferences`,
`shd_mark_notification_read`, `shd_mark_all_notifications_read` and
`shd_mark_notifications_read`. Require explicit scope for bulk marking,
prefer stable notification IDs, and report server readback. A list response is
not authorization to alter every item in it.
