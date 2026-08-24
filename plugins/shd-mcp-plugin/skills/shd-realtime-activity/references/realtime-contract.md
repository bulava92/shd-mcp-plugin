# Realtime and activity contract

Use `shd_start_realtime_session`, `shd_get_realtime_events` and
`shd_terminate_realtime_session` for the session lifecycle. Use the relevant
read-only audit/activity tool for historical records, such as
`shd_get_audit_history`, when the request is about what already happened.

Keep session IDs, scopes, cursors and last-seen timestamps separate. A retry
must not create a second session unless the server explicitly supports an
idempotency key. Termination requires the exact returned session ID and should
be confirmed by terminal readback.
