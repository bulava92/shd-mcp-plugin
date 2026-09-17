# Document safety contract

Useful read tools include `shd_list_contracts`, `shd_get_contract`,
`shd_list_document_revisions`, `shd_list_document_templates`,
`shd_list_document_comments`, `shd_list_document_external_links` and
`shd_list_document_public_links`. PDF inspection uses
`shd_download_document_pdf`; generation uses `shd_generate_document_pdf`.

Treat these as separate side effects: `shd_send_document`,
`shd_publish_document_public_link`, `shd_save_document_contract` and
`shd_document_contract_workflow`. Before any of them, resolve the document,
read the current state and require the exact requested action. Report recipient,
visibility, expiry, revision and server validation when returned. A public link
is never a harmless preview and must not be created just to test access.
