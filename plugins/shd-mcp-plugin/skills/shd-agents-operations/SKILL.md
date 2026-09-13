---
name: shd-agents-operations
description: Use when the user asks to inspect SHD agents, controllers, diagnostics, tunnels, access rules, endpoints, monitoring or agent runtime actions.
---

# SHD agents operations

See `references/agent-operations.md` before touching runtime, network or access
configuration.

## Diagnose first

- Resolve the controller, user agent or tunnel identity from
  `shd_agents_overview`, status and diagnostic tools.
- Read current access policies, settings, history and async status before
  proposing an action.
- Keep diagnostics, configuration, endpoint publication and network routing as
  separate operations. Never expose credentials, private keys or tunnel data.

## Controller data and widgets

- For a controller device list, call `shd_get_controller_source_inventory`, then
  `shd_render_controller_devices_widget` with the complete result and scoped
  `meta.sourceArgs`.
- For current states across controllers, call `shd_get_home_live_state`, then
  `shd_render_controller_live_state_widget`.
- For one presence, binary state or numeric sensor statistics, call
  `shd_get_controller_state_statistics`, then
  `shd_render_controller_statistics_widget`. The server result is authoritative
  for counts, intervals, durations, percentages, medians and hourly buckets;
  do not calculate them from raw history in the model.
- For raw time-series history, call `shd_get_controller_source_history`, then
  `shd_render_controller_history_widget`. Keep the detailed rows in the widget
  after a successful render and use plain text only when the UI call is
  unavailable or fails.

## High-impact actions

Creating/closing tunnels, publishing or revoking endpoints, replacing access
policies, rebooting an agent, changing exit-network routing or enabling
monitoring requires an explicit target and user request. For asynchronous
actions, return the operation ID, poll only as needed and report terminal
status. Do not retry a network or reboot action blindly.
