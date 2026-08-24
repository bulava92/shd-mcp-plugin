# Discussion contract

Use the narrowest tool for the request:

- discovery: `shd_list_discussion_channels`,
  `shd_list_discussion_topics`;
- content: `shd_list_discussion_messages`, `shd_search_discussions`;
- writes: `shd_add_discussion_message`, `shd_update_discussion_message`;
- files: `shd_upload_discussion_attachment`.

Resolve the canonical channel/topic/message identifiers before a write. Keep
searches bounded, distinguish no results from denied scope, and retain the
server's pagination or conflict fields. A message edit or attachment upload is
a side effect: require explicit user intent and report the final server result.
