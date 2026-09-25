---
name: shd-airbase-query
description: Use for read-only natural-language questions about project AirBase records and relationships, such as finding equipment by room or tracing consumers to breakers, cables, switches and terminals.
metadata: modules=airbase
---

# Answer questions from AirBase

Use the authenticated AirBase MCP tools as the source of truth. For a natural-language question, start with the read-only `shd_airbase_query` tool. It searches across the selected Base's tables and follows populated record links in both directions, up to four relationship hops. Do not infer wiring or equipment relationships from names, group numbers or expected conventions.

## Read workflow

1. Resolve the requested project/base. Use the provided base public ID or a project identity already resolved by SHD.
2. Call `shd_airbase_query` with the base, the full question, and up to four concrete `search_terms` extracted from it (room, consumer/device name, breaker, cable, terminal or module label). Do not use generic words such as “device” or “equipment” as search terms. Raise `max_results` when the user explicitly asks for all matching records, up to the tool maximum.
3. Check `partial`, `truncated`, `reverse_scans`, `missing_reverse_schema_tables`, `failed_reverse_scans`, `truncated_reverse_scans` and `relationship_depth_limit_reached`. A capped or failed search must be reported as partial; it is not evidence that the remaining tables contain no matches. A table absent from `reverse_scans` was not scanned for incoming record links.
4. The query tool follows populated outgoing and incoming links by record ID. If the question depends on a relation outside the four-hop traversal or a link was not followed, use the returned canonical table IDs and record titles for a targeted follow-up with `shd_airbase_query`, `shd_airbase_schema` and `shd_airbase_records`.
5. Use live table codes and IDs. UI groups only organize separate tables; stale table IDs copied from a page are not authoritative.

## Relationship questions

- For “which breaker feeds this consumer?”, find the consumer by name or room, check the populated breaker link, and read the linked breaker record. For the reverse question, search or inspect the breaker table's schema-defined consumer links.
- For room and panel questions, search all relevant device tables. A shield's room link does not by itself prove which modules are installed in that shield; resolve the module-to-shield link by record ID.
- For switches, cables, terminals or other equipment, follow the populated links returned by the query. Do not guess field codes or table names.
- Prefer direct record links over computed lookup fields when establishing a relationship. A lookup can help identify a value, but do not present it as a direct link unless the schema confirms that relationship.
- If a link is empty, a record is missing, or several records match, state that explicitly. Do not infer the missing relationship from a group tag, a room number or a device name.
- For a plain text answer, return the findings directly. Do not call AirBase widget-rendering tools unless the user asks for an interactive table or visual view.

MCP tool discovery searches the tool registry, not AirBase records. Use `shd_airbase_query` for cross-table questions and the direct table, schema and records tools for precise follow-up reads.

Keep the answer concise and show the evidence chain, for example: room → consumer → breaker → cable/terminal, with the record titles and field values that support each step. If the data does not support a complete chain, identify the first missing link.
