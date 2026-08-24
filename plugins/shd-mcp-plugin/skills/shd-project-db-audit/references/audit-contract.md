# ProjectBase audit contract

Use this contract for every read-only ProjectBase audit.

1. Resolve the canonical Base identity before selecting tables. Treat a
   user-provided project code as an alias until the server returns the
   authoritative identity.
2. Discover tables only when the request does not name them. Do not load every
   table just to find a possible issue.
3. Read the schema before records for every selected table. Keep the table
   name explicit in each subsequent request.
4. Bound record reads with the smallest useful limit and preserve the server's
   pagination or truncation metadata.
5. Report evidence as `table → record → field → observed value → reason →
   priority`. Mark a finding as unverified when the schema or record needed to
   prove it was unavailable.

Never repair an audit finding inside the audit workflow. A repair requires a
separate proposal, an explicit mutation request, the current schema and
records, the server's validation/dry-run contract, and final readback.
