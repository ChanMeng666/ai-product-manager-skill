# Runbook: <system>

> Written by the person who will be woken at 3 a.m. Steps must need **no creativity** to execute.

- First responder (primary / backup): … / …
- Escalation: … → … → …
- Dashboards: … · Trace lookup: … · Kill switch / rollback command: …
- Last rollback drill: <date>, took <minutes>

## Severity grading
| Grade | Example | Response |
|---|---|---|
| S1 | money / legal / safety-related wrong output reached users | contain within minutes; close the channel |
| S2 | degraded quality on a non-critical slice | route slice to human; fix next business day |
| S3 | cosmetic / wording | ticket |

## Failure 1: <e.g. retrieval returns empty>
- **Symptom:** …
- **Criterion (how to confirm):** …
- **Action:** … (e.g. route to human; answering is not allowed)
- **Verification:** …

## Failure 2: <e.g. source-system API timeout>
- **Symptom / Criterion / Action / Verification:** …

## Failure 3: <e.g. user reports a wrong suggestion>
- **Symptom / Criterion / Action / Verification:** … (e.g. freeze the slice for the shift; retro next day)

## Incident order of operations
1. **Contain:** isolate by risk tier; close high-risk channels, keep low-risk ones.
2. **Trace:** pull every affected output in the window; assess impact within <2h>.
3. **Fix the root cause.**
4. **Add the incident as an eval case.**
