# Write preflight

Before a multi-record write, record:

`module → scope → match rule → current count → affected count → skipped/ambiguous count → validation result → idempotency key`

Stop on an ambiguous match, validation failure, conflict or missing readback.
