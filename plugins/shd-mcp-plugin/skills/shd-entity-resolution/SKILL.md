---
name: shd-entity-resolution
description: Use when the user asks to find a CRM entity, resolve duplicate names, compare counterparties, or determine whether records refer to the same business object.
---

# SHD entity resolution

## Resolve first

1. Prefer an exact returned ID, code or external reference over a name.
2. Search with `shd_list_crm`, then read candidates with
   `shd_get_crm_entity`.
3. Inspect `shd_list_crm_entity_links` when relationships, projects or deals
   are part of the identity decision.
4. Compare only fields returned by SHD. Report candidate records, matching
   evidence, conflicting evidence and unresolved fields separately.

## Safety

- A similar name is not proof of a duplicate.
- Do not merge, delete, reassign ownership or change a relationship while
  resolving identity.
- A write requires an exact target, an explicit user request and the current
  server validation contract. Read the record again after a permitted write.

See `references/entity-resolution.md` for the candidate-report format.
