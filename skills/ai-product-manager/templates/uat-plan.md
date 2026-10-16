# UAT Plan: <system>

> UAT is not a second eval. Users test with **their own real tasks, without a script.**

## Participants (at least three types)
| Name | Type (daily heavy user / skeptic / newcomer) | Role |
|---|---|---|

## Tasks (5–8 real, user-supplied)
| # | Task (from the user's real work) | Type (routine / most painful / cross-system) |
|---|---|---|

## Observation (record only; don't prompt or help)
Per task: stall points · number of edits before use · abandoned (y/n) · time taken.

## Metrics (from telemetry, not surveys)
| Metric | Pass line |
|---|---|
| Completion rate | |
| Edit rate (edited before using) | |
| Abandonment rate | |

## Acceptance checklist (business language)
| Business requirement | Pass / Fail | Signer (a NAME, not a role) |
|---|---|---|
| e.g. for 100 real orders, delivery date matches manual calculation ≥ 95%, zero later than committed | | |
| e.g. abnormal orders correctly routed to a human | | |
| e.g. no customer data mixed between orders | | |
| e.g. every rejection reason traceable | | |

## If it fails, where it goes back to
- Wrong task → discovery · Scope too wide → minimum version · Model weak → eval.

## Next step after passing
Production gate → shadow mode → canary (scope, duration, comparison metrics, degradation threshold).
Signer: … Observation period: …
