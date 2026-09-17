---
name: shd-discussions
description: Use when the user asks to find, read, search, create or edit SHD discussion channels, topics, messages or attachments.
---

# SHD discussions

See `references/discussion-contract.md` for the tool map and message safety
rules.

## Resolve and read

- Resolve the organization or project context before selecting a channel.
- Use `shd_list_discussion_channels` and `shd_list_discussion_topics` before
  reading messages when an ID is not already known.
- Use bounded reads with `shd_list_discussion_messages` or
  `shd_search_discussions`; preserve pagination and returned identifiers.
- Treat private channels and messages as server-authorized data. Do not infer
  membership or quote content outside the returned scope.

## Mutations

Only create or edit a message, or upload an attachment, when the user asks for
that exact operation. Confirm the target topic, preserve the latest message
identity/version when available, and report the server result. Never delete or
rewrite discussion history by guessing a topic from its display name.
