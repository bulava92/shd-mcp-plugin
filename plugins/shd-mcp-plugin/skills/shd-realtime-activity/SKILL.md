---
name: shd-realtime-activity
description: Use when the user asks to inspect SHD realtime events, start or terminate a realtime session, or review operational activity and audit history.
---

# SHD realtime and activity

See `references/realtime-contract.md` for session lifecycle and event handling.

## Read and observe

- Resolve the authorized project/module scope before reading events or audit
  history.
- Use bounded event reads and preserve event IDs, cursors and timestamps.
- Distinguish historical audit records from a live realtime session; do not
  claim that an event stream is complete when it was truncated or disconnected.

## Session lifecycle

Starting or terminating a realtime session is a stateful operation. Require an
explicit request, retain the returned session ID and scope, avoid duplicate
starts on retry, and terminate only the requested session. Report connection
or terminal state rather than fabricating an event.
