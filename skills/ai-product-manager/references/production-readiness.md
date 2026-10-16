# Production Readiness: Launch Is a Process, Not an Event

Contents: 1) Production thinking: four questions · 2) The 12-item launch gate · 3) Shadow mode and
canary releases · 4) Rollback · 5) SLOs and monitoring · 6) Observability and logging ·
7) Runbooks and tabletop drills · 8) Human takeover · 9) Versioning and change control ·
10) Cost controls · 11) Incident triage · 12) The AIOps chain

## 1. Production thinking: four questions

**Production thinking means designing the system on the assumption that it will fail,** then
answering four questions:

1. **How will it fail?** Not *whether*, but *how*. Write an error-type list: wrong answers, missed
   items, out-of-scope answers, answers it shouldn't give, right but too slow, right but too
   expensive. You can't defend against an error you never imagined.
2. **What happens when it does?** Grade risk on a matrix with likelihood on one axis and severity on
   the other. Errors involving money, legal or employee rights sit in a different class from
   imprecise wording. Each cell gets its own handling strategy.
3. **How will you know?** Observability: **logs** say what happened, **traces** say which step
   caused it, **metrics** say whether the trend is improving. The requirement is to know **before the
   business tells you.**
4. **What do you do after it fails?** At least three layers:
   - **Contain:** can you switch back to the last stable state within minutes?
   - **Fallback:** when the system is off, does the business have an alternative path?
   - **Trace:** can every output produced during the failure window be found and checked one by one?

What each missing answer costs you:

| Missing | Consequence |
|---|---|
| How will it fail? | You don't know what to defend against |
| What happens? | All errors are treated the same |
| How will you know? | You wait for the business to tell you |
| What next? | Your only move left is to shut it down |

## 2. The 12-item launch gate (five categories)

Any item without a tick means **no production.** Copy this into reviews (also in
`templates/launch-gate-checklist.md`):

**Quality is measurable**
1. A fixed eval set exists, not one assembled on the spot.
2. The eval set covers the main scenarios **and** adversarial samples.
3. There's an explicit pass threshold (e.g. pass rate ≥ 90%), written before the run.

**Risk is controlled**
4. Error types are graded, with a different handling strategy per grade.
5. High-risk outputs have a human confirmation step.
6. Overreaching actions are **100%** blocked, and this can be tested.

**Observable**
7. End-to-end tracing: every call is traceable and reproducible.
8. Core metrics have monitoring **and alerts**, not just logs.

**Recoverable**
9. Rollback to the last stable version within minutes.
10. Human fallback design: when the system is unavailable, the business has an alternative path.

**Someone is responsible**
11. SLOs are defined and measurable.
12. The runbook is complete, **and it says who is the first responder at 3 a.m.**

Item 12 is the quickest test of whether a project has really reached production: *If this system
breaks at 3 a.m. tonight, who is the first person? Do they have one page telling them what to do?*
If either answer is missing, then whatever the accuracy and however beautiful the demo, you're not
in production.

Also confirm: model and prompt versions pinned; data and privacy sign-off; risk-tier record
(`risk-and-governance.md`); cost budget per task; kill switch.

## 3. Shadow mode and canary releases

Passing the gates still doesn't mean "turn it all on."
1. **Shadow mode:** the system runs on real traffic but only records; it has no effect. Compare its
   outputs with what humans actually did.
2. **Canary:** expand in tiers, for example 1% → 10% → 100%, by team, region or risk tier.

The value of a canary isn't only limiting losses. It produces **conclusions that only real traffic
can give.** Before starting, define the comparison metrics and the **degradation thresholds** that
trigger an automatic or manual halt. Prepare the way back before moving forward.

Case pattern: one team only (maintenance), one department, nights only (clinical, where senior
doctors are absent at night but present by day, so it's off during the day), two regions (sales).

## 4. Rollback

A rollback plan answers five questions:
1. Roll back to what?
2. How long does it take?
3. Who does it?
4. What happens to data written during the switch?
5. **When was it last rehearsed, and how long did it actually take?**

The last one is most often omitted and most fatal: **an unrehearsed rollback is no rollback.**

Design examples:
- An "**use the old process**" button in the corner of the UI that returns to the original
  work-order mode (rehearsed three times before launch in the maintenance case).
- One-click "no-AI mode" (clinical case). **But some things can't be undone:** every suggestion
  already produced must be kept intact with who saw it when, whether it was accepted, its sources,
  and the guideline version number. This is not for the regulator. It's for the retro three months
  from now.
- Because outputs are stochastic, verify a rollback against a representative eval set, not one test
  query.

## 5. SLOs and monitoring

SLOs are measurable promises, not "we hope it's usable": availability ≥ 99.5%, p95 latency ≤ 4 s,
**suggestion acceptance rate ≥ 40%.**

You need at least **one AI-quality metric** alongside the standard ones (p95 latency, availability,
critical error rate), for example the untraceable-claim ratio. Otherwise the system can return
**200 OK while answering wrongly**: traditional monitoring stays green while users are continuously
harmed.

**Capacity at peak.** Hosted LLMs have rate limits and quotas, and latency rises under load. Before a broad rollout, load-test at realistic peak (Monday 9 a.m., month-end), request quota increases ahead of time, and stage the rollout so demand ramps up gradually. Decide what users see when the provider throttles.

Useful AI production metrics:
- **Quality:** sampled online-judge pass rates per failure mode, untraceable-claim ratio, refusal
  ("I don't know") rate, consistency.
- **Adoption:** acceptance / edit / reject ratios, weekly active eligible users, bypass rate.
- **Operations:** p50/p95 latency, time to first token, tokens per task, **cost per successful
  task**, timeout and tool-error rates.
- **Risk:** guardrail trip rate, blocked forbidden-action attempts, PII incidents, injection
  attempts.
- **Human handoff:** escalation rate, time to human, queue depth.

## 6. Observability and logging

- **Tracing** records the full path of one request (receive → retrieve → tool calls → generate →
  return), strung together by one trace ID. A trace answers "where did *this* request get stuck?"
  Logs answer "what has happened historically?" Log the prompt version, model version, retrieved
  document IDs and versions, tool calls, tokens, latency and cost on every run. Open standards such
  as the OpenTelemetry GenAI semantic conventions exist for this.
- **Enterprise red line: logs must be redacted.** AI logs are often *more* sensitive than business
  data, because they contain employees' natural-language questions. Redact before writing to disk,
  and agree a retention period. (Message-content capture is opt-in in standard conventions for this
  reason.)

## 7. Runbooks and tabletop drills

A runbook isn't a contact list. It turns "what do we do if this breaks" into **steps that need no
creativity to execute,** because during a real incident creativity is what people lack most.

Write up at least three high-frequency failures. For each, cover **symptom → criterion → action →
verification.** Examples:
- Empty retrieval result → route to a human; answering is not allowed.
- Guideline/policy version conflict → block output entirely.
- A user reports a bad suggestion → freeze for the shift; retro the next day.
- Source-system API timeout → degrade to read-only with a banner; retry with backoff.

Run a **tabletop drill** before launch. Same fault, two teams:
- *Unprepared:* offline after 90 minutes, and nothing to base the retro on.
- *Prepared:* minute 1, alert fires and loss is contained. Minute 10, scope reduced per the runbook.
  Minute 30, the trace ID locates upstream rate limiting. Minute 90, the service is still available.

The difference isn't intelligence. It's having written the playbook as an asset beforehand.

**Who writes the runbook?** The person who'll be woken up at 3 a.m. If that person hasn't been
decided, the project has a bigger problem. Settle the owner, then the runbook. **A runbook is
responsibility assignment, not documentation.**

## 8. Human takeover

Three classes must go to a human:
1. **Low confidence:** empty retrieval, conflicting sources.
2. **Irreversible actions:** placing orders, changing permissions.
3. **High-risk actions** involving money or compliance.

Make the handoff real: a queue with an owner, an SLA, timeout behavior and fallback wording.
"Transfer to a human" is no universal fallback. With too broad a trigger, the queue floods and real
dangers get diluted. With nobody responding, you've handed responsibility to someone who doesn't
exist.

Put review **into the UI**, not just into the plan. The clinical case lesson: human review written
only in the design doc doesn't happen. It must be visible on screen, with the evidence panel on the
first screen.

## 9. Versioning and change control

The **policy-assistant incident** (full case in `case-studies.md`) happened with no technical
component broken. Its root causes are typical:
- **Knowledge without versions.** Replacing a document deleted the old policy, which was still valid
  for an earlier time period. The system lost the *time dimension*, not data. Fix: documents carry
  effective-date ranges and are superseded, never deleted.
- **No knowledge boundary.** The assistant assumed it could answer everything. It didn't know some
  questions need a time scope or an applicable entity.
- **No refusal rule.** When retrieval missed, it answered from the closest document instead of
  saying "I can't find a policy basis for that period; please ask finance."
- **No error grading.** A wrong money-policy answer was treated like a wording slip.
- **No stop condition.** With nothing defined for "what state should the system be in until it's
  fixed?", the only option was a full shutdown.

Change-control rules:
- **Pin model snapshots and prompt versions.** Treat prompt + model + parameters + tool definitions
  + knowledge snapshot as one immutable **version bundle.** Production never points at "latest."
  Rollback is a pointer change.
- Every prompt edit, model swap or knowledge update goes through the eval gate in CI. In one
  contract-review project, engineers edited prompts straight into production with no tests, and a
  missed key clause triggered an internal client notice.
- A vendor's model update is a change to your product. Track deprecations and re-run evals.

## 10. Cost controls

- Budget **per run**: max steps, max tokens, max tool calls, max wall time. Every agent run needs an
  explicit exit (final answer, error, or budget exhausted).
- Rate limits per user. Unbounded consumption is a listed LLM security risk.
- Route easy requests to cheaper models and hard ones to stronger models.
- Use caching where possible.
- Model cost at the run level. Multi-step loops multiply tokens, so falling per-token prices don't
  guarantee falling bills.
- When inference cost exceeds budget, **shrink scope** before tuning (see `lifecycle-and-gates.md`
  §7).

## 11. Incident triage: contain first, fix second

**The first principle of a production incident isn't "fix it fast." It's "put the risk in a cage."**
Containment and tracing always come before repair.

**Drill:** an assistant has been in production for three months. In the last 7 days, 43 answers
retrieved outdated documents. No errors, no complaints, because the answers *look* normal. Six of the
43 involve money policies; the rest are process explanations.
- *A. Full shutdown and rollback.* Risk instantly zero, but 180 users lose the tool today, the
  business asks why, a three-month index update is lost, and the "unstable system" impression
  sticks. Maximum cost for a problem that should be graded.
- *B. Keep running; hotfix tonight, release in the morning.* Users notice nothing, but the six money
  answers may already have caused damage, and "fixed by morning" turns effort into a risky promise.
  It also ignores the 43 that already happened. Fixing the future isn't managing the past.
- *C. Keep running, but temporarily disable auto-answers for money-related questions and route them
  to humans; everything else continues.* Isolates risk by tier.
- *D. Don't stop, don't fix; first pull all 43 records and assess impact.* Sizes the damage, but
  exposure continues meanwhile.

**Answer: C, plus two immediate actions.**
1. Pull all 43 records now and assess impact within two hours. If it's larger than expected,
   escalate to A. So C and D run together; they aren't alternatives.
2. Immediately fix the root cause: old documents get **version validity periods** instead of being
   replaced. Otherwise it happens again next week.

When a client refuses downtime despite real risk, **split the binary into risk tiers and channels:**
close the high-risk channel, keep the low-risk one. Clients usually reject the *way* risk is reduced,
not risk reduction itself. Offer "which part stops and which part continues," not "stop or don't."

## 12. The AIOps chain

**Agent → Tracing → Metrics → Logs → SLO → Alert → Incident → Rollback → Continuous improvement**

- *Tracing* is the base of all operations: every step, tool call and retrieved document per request.
- *Metrics* aggregate traces. You can't read 2,000 traces one by one.
- *Logs* are raw records for locating specific cases afterwards.
- *SLO* is the measurable promise.
- *Alert* defines when to wake someone.
- *Incident* defines the process: who commands, who communicates, who fixes.
- *Rollback* caps how long an incident can last, and it's the link that matters most.
- *Continuous improvement:* **every incident becomes a new eval case.** Don't waste an incident.

This chain mirrors classic microservice operations, and that's no coincidence. **A deployed agent is
an online service first and an AI system second.** The ceiling on enterprise AI delivery is set by
operations capability, and this is exactly where most AI practitioners are weakest. Many can draw a
RAG architecture but not a tracing data flow, and can quote context window sizes but not how to set
an SLO. Teams skip this not out of disagreement but for lack of time, and then an incident arrives
and every deferred debt is due at once, often on the day the system gets shut down.

Proving an agent can launch comes in two halves:
- **First half: can we judge it?** Evals that produce verdicts.
- **Second half: dare we hand it to production?** Open the door safely and keep it held.

The thresholds chain together: eval thresholds become UAT pass lines, which become production-gate
criteria. Six artifacts close the loop:
1. Four-layer eval matrix
2. Golden-set list
3. Threshold cards
4. UAT task list
5. Three gates
6. Production checklist

The quality bar for all of them: **hand them to someone else, and that person can make a judgment or
stop the bleeding on their own, without your extra explanation.** Launch is not an action. It is a
process that has an owner, an order, and a way back.
