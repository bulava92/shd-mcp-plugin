# Analytics contract

- Every metric has an explicit scope, period, unit and source operation.
- A server total is authoritative; a locally calculated total must be marked as
  calculated and list the rows used.
- A comparison must use the same period boundaries and unit on both sides.
- Missing data, denied access and a zero value are different outcomes.
- Recommendations follow the evidence and are not written back to SHD unless a
  separate mutation is explicitly requested.
