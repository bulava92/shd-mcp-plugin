# Task workflow contract

Resolve task context before acting:

- use a canonical task-project identifier when the server returns one;
- search by explicit project, task ID or bounded query rather than guessing
  from a display name;
- read task-project metadata before changing status, sprint, tags or custom
  fields;
- retain `updated_at`, version or equivalent conflict data from the latest
  read whenever the mutation schema supports it.

For a write, report the exact operation, task ID, changed fields, idempotency
key when used, server validation, conflict result and readback state. A
conflict or ambiguous match is a stop condition: show the current state and
ask for a narrower target instead of overwriting it.

Delete and archive operations require their server-side confirmation contract.
Never treat a proposed task change or a natural-language suggestion as write
authorization.
