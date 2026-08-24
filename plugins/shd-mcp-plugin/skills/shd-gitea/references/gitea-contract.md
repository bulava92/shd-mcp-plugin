# Gitea contract

Use `shd_list_gitea_issues` and `shd_list_gitea_labels` for discovery. Writes
are `shd_create_gitea_issue`, `shd_comment_gitea_issue`,
`shd_update_gitea_issue_labels` and `shd_upload_gitea_issue_attachment`.

Resolve the repository and issue from returned server data, preserve the
current issue state before a label update, and use an idempotency key when the
tool schema offers one. A comment or attachment is an external side effect;
require exact user intent and report readback. Do not assume Gitea permissions
from SHD project permissions alone.
