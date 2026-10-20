# Agent Design Spec: <system name>

- **Owner (accountable):** <name> · **Version:** <prompt+model+tools bundle id> · **Date:** YYYY-MM-DD
- **Serves slice:** <the vertical slice and its exit criteria> · **Eval set:** <link, N tasks>

## 1. Outcome and exits
- **Trigger:** <on request | batch | event | schedule>; for non-request triggers: idempotency key, dedup, dead-letter, state between runs
- **Done means (world state, not transcript):** <e.g. ticket closed with refund recorded in billing>
- **Exits:** success · structured error · escalation to <queue> · paused for approval · policy denied · budget exhausted (<max turns / tokens / $ / minutes>, across the whole agent tree)

## 2. Topology
<single agent | workflow with AI nodes | coordinator + subagents>. **Why not simpler:** <one sentence>

| Agent / node | Job | Model | Tools (allow-listed) | Gets as input | Returns |
|---|---|---|---|---|---|

## 3. Action space and gates
| Tool | R/W | Reversible? | Autonomy level | Code gate (hook / prerequisite / approval) |
|---|---|---|---|---|

**Invariants enforced in code** (never only in the prompt):
1. <e.g. no refund call until identity verified>
2. <e.g. refund > $<limit> → blocked, routed to approval>

## 4. Context plan
- **Always loaded:** <system prompt essentials, ≤ N tokens>
- **Loaded just in time:** <docs / records via which tool>
- **Facts block carried verbatim:** <IDs, amounts, dates, statuses, user's stated expectation, approval state, actions already taken>
- **Untrusted inputs (data, never instructions):** <web pages, emails, uploads, third-party tool text>
- **Long sessions:** <compaction rule / progress file / fresh session with summary>

## 5. Errors, escalation, handoff
- **Error contract:** category · retryable · message · partial results. "No results" ≠ "lookup failed".
- **Escalate when:** user asks for a human (immediately) · policy gap or exception · no progress after <N> attempts · action above autonomy level
- **Handoff summary fields:** <who, request, findings, attempts, recommendation, why stopped>
- **Queue owner and SLA:** <name, response time, timeout behavior>

## 6. Verification
- **Run-level check:** <test / schema + semantic validation / record exists>
- **Independent review:** <reviewer instance or human sampling rate>
- **Eval gates:** <metric, slice, threshold, red line> (see eval plan)

## 7. Observability and change control
- Trace per run: prompt version, model version, tool calls, tokens, cost, latency, exit type
- Every output tagged with its origin: live · cache · partial · fallback · human; alert on a rising fallback rate
- Any change to prompts, tool definitions, gates or model → eval gate before release

## 8. Open risks and assumptions
| Assumption | Evidence today | How we'll test it | Kill/change signal |
|---|---|---|---|

*If it doesn't fit on one page, the design isn't clear yet. Simplest topology that passes the eval
set wins.*
