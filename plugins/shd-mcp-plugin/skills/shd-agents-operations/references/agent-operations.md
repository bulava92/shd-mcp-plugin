# Agent operations contract

Start with `shd_agents_overview`, `shd_get_controller_status`,
`shd_agents_get_controller_diagnostics`, `shd_agents_get_diagnostics`, history
and the relevant access-policy tools. Use `shd_agents_get_async_status` for an
operation already returned by the server.

Treat tunnels, endpoint publication/revocation, access-policy replacement,
agent reboot, exit-node/network routing and controller/user-agent settings as
high-impact mutations. Tools such as `shd_agents_create_tunnel`,
`shd_agents_close_tunnel`, `shd_agents_publish_controller_endpoint`,
`shd_agents_revoke_controller_endpoint`, `shd_agents_reboot_user_agent` and
`shd_agents_force_exit_network_route` require explicit authorization and exact
scope. Preserve audit/readback and never print secrets returned by diagnostics.
