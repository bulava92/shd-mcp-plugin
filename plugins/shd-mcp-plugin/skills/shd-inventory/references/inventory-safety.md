# Inventory safety contract

Read tools cover items/assets, procurement, locations, movements, lots,
reservations, receipts, stocktakes, labels, assignments, maintenance and the
inventory audit log. Use the narrowest `shd_list_inventory_*` or
`shd_get_inventory_*` tool and preserve pagination.

Side-effecting operations include `shd_reserve_inventory_stock`,
`shd_release_inventory_stock`, `shd_receive_inventory_stock`,
`shd_write_off_inventory_stock`, `shd_close_inventory_stocktake`,
`shd_create_inventory_resource`, `shd_update_inventory_resource` and
`shd_inventory_action`. Resolve the exact target and latest quantity first;
require explicit confirmation for irreversible or bulk operations and verify
the resulting movement/audit record.
