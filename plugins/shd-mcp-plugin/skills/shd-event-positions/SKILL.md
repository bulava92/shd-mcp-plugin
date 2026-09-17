---
name: shd-event-positions
description: Use when the user asks about SHD events, booking availability, scheduling slots, event types or booking positions.
---

# SHD events and scheduling

## Read path

1. Start with `shd_get_scheduling_overview` when the scope is broad.
2. Use `shd_list_scheduling_event_types`,
   `shd_list_scheduling_availability`, `shd_list_scheduling_slots` and
   `shd_list_scheduling_bookings` for the exact requested view.
3. Preserve the returned timezone, slot state, booking state and integration
   status. Do not turn an available slot into a confirmed booking.

## Mutations

`shd_hold_scheduling_slot`, `shd_create_scheduling_booking`,
`shd_confirm_scheduling_booking`, `shd_reschedule_scheduling_booking` and
`shd_cancel_scheduling_booking` are explicit writes. Read the current slot or
booking first, pass the current concurrency/idempotency values accepted by the
schema and report the final server state.

See `references/scheduling-safety.md` for the state boundaries.
