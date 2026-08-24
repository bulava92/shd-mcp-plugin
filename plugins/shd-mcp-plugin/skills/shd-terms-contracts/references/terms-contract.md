# Terms and contract contract

Read with `shd_list_terms_documents`, `shd_get_terms_document`,
`shd_get_terms_document_completeness`, `shd_list_terms_document_revisions` and
`shd_get_terms_document_revision`. Use `shd_terms_description_comment` and
`shd_terms_point_discussion` only for explicit comment/discussion requests.

`shd_restore_terms_document_revision` is a mutation: resolve the document and
revision, read current state, require confirmation and report readback. Never
restore merely because an older revision looks cleaner, and never confuse
completeness analysis with legal approval.
