---
name: shd-notifications
description: Use when the user asks to inspect SHD notifications, notification modules, read state or preferences, or mark notifications read.
---

# SHD notifications

See `references/notification-contract.md` for read-state and preference
boundaries.

## Read

- Use `shd_list_notifications` with bounded filters and preserve notification
  IDs and timestamps.
- Use module, read-state and preference tools only for the authenticated user
  or the explicitly authorized scope.
- Distinguish unread, read, muted and unavailable data; do not invent a missing
  notification source.

## State changes

Marking one or more notifications read or changing preferences changes user
state. Do it only when explicitly requested, use the returned IDs, and report
the number and final state. Never mark a whole feed read merely because it was
displayed or summarized.
