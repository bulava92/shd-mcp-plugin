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

## High-impact actions

Creating/closing tunnels, publishing or revoking endpoints, replacing access
policies, rebooting an agent, changing exit-network routing or enabling
monitoring requires an explicit target and user request. For asynchronous
actions, return the operation ID, poll only as needed and report terminal
status. Do not retry a network or reboot action blindly.
