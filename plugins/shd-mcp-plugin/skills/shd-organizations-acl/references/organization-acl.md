# Organization and ACL contract

Read with `shd_list_organization_members`, `shd_list_organization_invitations`,
`shd_list_organization_audit` and
`shd_get_organization_two_factor_policy`. Resolve users and organizations from
server-returned IDs.

Mutations include invitation operations, member add/update/remove,
organization create/update/archive/restore and
`shd_update_organization_two_factor_policy`. Every mutation needs explicit
authorization, the latest relevant state, and final server/audit readback when
available. Do not disclose invitation secrets or use an email/name match as a
substitute for a returned user identity.
