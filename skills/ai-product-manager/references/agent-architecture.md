# Agent Architecture: Designing the System Once an Agent Is Justified

Contents: 1) Where this file starts · 2) The design order · 3) The agent loop · 4) Orchestration
and subagents · 5) Deterministic enforcement: code gates, not reminders · 6) Context engineering ·
7) Errors, escalation and handoff · 8) Verification and review · 9) Long-running work · 10) The
fix ladder: debugging a misbehaving agent · 11) Architecture review checklist

Solution selection decides *whether* a step deserves an agent. This file is about *how to build it
so it survives production*. The same judgment applies: every design choice is priced by its error
cost, and the cheapest reliable mechanism wins. An agent is three things, and each one is a product
surface: **a loop** (when it acts and when it stops), **tools** (what it can do; see
`tool-design.md`), and **context** (what it knows at each step). Most production failures trace to
one of the three, rarely to the model itself.

## 1. Where this file starts

Read this after the decision tree in `solution-selection.md` has put at least one step at
"workflow with AI nodes" or "agent". If nothing passed the agent test, most of this file still
applies to the workflow's AI nodes (tools, structured output, errors), but skip the orchestration
sections.

Before designing, have these from earlier stages, or mark them `[ASSUMPTION]`:
- the vertical slice the agent serves, and its exit criteria;
- the read / suggest / never permission table (`ontology-and-guardrails.md`);
- the eval set, or at least 20 real tasks with known good outcomes (`evaluation.md`).

Designing an agent without the eval tasks is designing blind: you'll have no way to tell whether
the next architecture change helped.

## 2. The design order

Design in this order, because each step constrains the next:

0. **Trigger.** Does a run start on request, in a batch, on an event or on a schedule? Anything
   but on-request brings a layer the agent design doesn't cover: idempotency keys, dedup of
   repeated signals, backpressure, a dead-letter queue, state carried between runs. If nobody can
   name the trigger, ship the on-request version behind a manual trigger first.
1. **Outcome and stop state.** What does "done" look like *in the world* (a ticket resolved, a
   record written), not in the transcript? What are the exits: success, error, escalation, paused
   for approval, policy denied, budget exhausted?
2. **Action space.** The allow-listed tools, each with a risk rating. Fewer is better.
3. **Gates.** Which rules must hold *every* time? Those become code, not prompt text (§5).
4. **Topology.** One agent, a workflow with AI nodes, or a coordinator with subagents (§4).
5. **Context plan.** What each agent sees, when, and what survives a long session (§6).
6. **Error and escalation contract** (§7).
7. **Verification:** how a run proves it worked, and who checks (§8).
8. **Budgets:** max turns, tokens, tool calls, wall time and spend per run.

Write the result on one page with `templates/agent-design-spec.md`. If it doesn't fit, the design
isn't clear yet.

## 3. The agent loop

The core loop is simple, and that's the point: call the model, and if it asked for tools, run them,
append the results, and call again. Stop when the model ends its turn without a tool request.

- **Stop on the protocol signal, not on prose.** The model's structured stop reason ("end of turn"
  versus "wants a tool") is the completion signal. Parsing the text for "done" or "I have finished"
  breaks the first time the model phrases it differently.
- **Iteration caps are a safety net, not the stopping mechanism.** Every run needs a hard budget
  (turns, tokens, spend, wall time), but a design that routinely hits the cap is broken. Treat cap
  hits as an alert, and give them a defined exit (return partial results and escalate), never a
  silent cut-off.
- **Let the model choose the next tool from context** when the path really is open-ended. If you
  find yourself writing a decision tree in the system prompt, the step is a workflow: put the tree
  in code and call the model only at the uncertain nodes.
- **Ground every step in real feedback.** Tool results, test runs, database state. An agent that
  reasons for ten steps without touching the environment is guessing.
- **Every tool call gets a result,** including denials, timeouts and cancellations. A call left
  unanswered makes the model guess what happened.
- **Fixed first and last steps are code, not instructions.** If every run starts with the same
  lookup, run it before the loop and seed the result. If every run must end with a sign-off, make
  that the only tool that ends the run.
- **Plan fragile or irreversible work in a read-only phase**, enforced by permissions rather than
  by prompt: gather facts, write the plan, validate it against the source data, get approval,
  execute, verify. A materially changed plan needs approval again.

## 4. Orchestration and subagents

**Default to one agent.** Split only when a single agent's instructions or tool set become
unmanageable, or when the work is genuinely parallel. Multi-agent systems cost much more: one
vendor reported multi-agent research runs using about 15× the tokens of a chat (see
`industry-evidence.md`). They pay off only when the task is valuable and breaks into independent
parts.

When you do split, use **hub-and-spoke**:
- A **coordinator** owns decomposition, delegation, error handling and synthesis. All traffic
  between subagents goes through it, so there is one place to observe, log and fix routing.
- **Subagents get isolated context.** They don't see the coordinator's conversation. Whatever they
  need goes into the brief explicitly. This isolation is the main *benefit* of subagents: a verbose
  search or file exploration stays in the subagent, and only a condensed result returns.
- **Write subagent briefs like a delegation to a capable contractor:** objective, what's already
  known (paste the earlier findings, not a reference to them), output format, tools and sources to
  use, boundaries (what not to cover), and how much effort the task deserves. Vague briefs produce
  duplicated work and gaps.
- **Keep data and metadata separate in handoffs.** Pass the content plus its source, document,
  page and date as structured fields, so attribution survives synthesis.
- **Scale effort to the query.** A simple fact needs one agent and a few tool calls. A broad
  investigation may justify several parallel subagents. Write the scaling rule down; models are bad
  at judging how much effort a task deserves.
- **Give the coordinator goals and quality criteria, not step-by-step procedures.** Procedures in a
  coordinator prompt are a workflow in disguise. If you need the procedure, write it as code.
- **Run independent reads in parallel** (several delegations in one turn), then synthesize.
  **Serialize writes:** sends, payments and record changes run one at a time.
- **Default to one level of delegation.** Before adding a grandchild agent, ask whether its job is
  really one tool on the child. Enforce the depth ceiling in the runner, not the prompt.
- **Budget the whole tree, not each agent:** total spend, depth, concurrency and spawns per parent,
  plus a wall-clock timeout per subagent so one hung call doesn't stall the parent. Subagents
  inherit the parent's restrictions, never its authority to approve.
- **One failure shape.** A crash, a timeout and "ran out of steps without returning a result" all
  come back as the same typed failure, so the coordinator can decide to proceed, retry or escalate.
  Results arrive through a structured return, never parsed from prose.

The most common multi-agent failure is upstream, not downstream: **the coordinator decomposed the
task too narrowly**, and every subagent did its narrow job well. Before blaming a subagent, read
the coordinator's decomposition in the trace.

Least privilege applies per agent. A synthesis agent doesn't need web search. If it frequently
needs one narrow capability (say, checking a single fact), give it that narrow tool and route the
complex cases back through the coordinator. Don't give it the whole search tool set.

## 5. Deterministic enforcement: code gates, not reminders

This is the agent-architecture form of "safety comes from not having the option." A prompt
instruction has a non-zero failure rate. When a rule protects money, safety, privacy or
compliance, a 1% failure rate is an incident schedule. **Anything that must hold every time is
enforced in code.**

Common code gates:
- **Prerequisite gates.** Block a tool until its precondition is met: no refund call until the
  identity check returned a verified customer ID; no write until the read that justifies it ran.
- **Pre-tool hooks** inspect every proposed tool call and can block or redirect it: refunds above a
  limit go to human approval; writes outside the allowed paths are refused.
- **Post-tool hooks** normalize or redact results before the model sees them: convert mixed date
  formats, strip personal data, trim a 40-field record to the 5 fields that matter.
- **Stop or completion hooks** refuse to end a run until a check passes (tests green, schema valid,
  required fields present).
- **Human approval as a gate**, implemented as a real blocking step with a queue, not as "ask the
  user if you're unsure" in the prompt.
- **Split prepare from commit.** `prepare_refund` can run freely; `issue_refund` requires an
  approval record bound to that exact action, target and payload, with an expiry. If the payload
  changes, the approval is void. The agent never approves its own action.
- **Limits apply to the resulting state.** "At most 4 per account" must block two separate requests
  for 3, across sessions and human channels. Enforce it atomically in the system of record, not with
  a counter in the agent's session.
- **Recheck at apply time.** The record may have changed between approval and execution. If it
  did, reject the stale approval and send a fresh proposal.
- **The agent assembles, code computes.** Where a calculation has one right answer (totals, tax,
  eligibility, risk scores), the agent gathers the inputs and deterministic code does the math.
- **Gates fail closed.** A malformed policy, a crashed hook or a timed-out check means *deny*.

Prompts still matter, for the *judgment* parts: which tool fits, how to phrase a reply, when a
case is ambiguous. The split is clean: **code for invariants, prompts for judgment, few-shot
examples for ambiguous judgment.** When a stakeholder says "we told it in the prompt to never do
X," ask whether X being done once is acceptable. If not, X needs a gate.

## 6. Context engineering

Context is a finite attention budget. Recall degrades as it fills, and models attend best to the
start and end of long inputs. The goal is the smallest set of high-signal tokens that lets the
agent do the next step well.

- **System prompt at the right altitude.** Not brittle if-else logic (that's code), not vague
  encouragement ("be careful"). State the goal, the criteria, the boundaries and a few diverse
  examples. Explicit criteria beat adjectives: "flag a comment only when the behavior it claims
  contradicts the code" works; "be conservative" doesn't.
- **Load just in time.** Give the agent references it can follow (IDs, paths, queries, a catalog of
  available documents) instead of pre-loading everything. Pre-load only what's needed on almost
  every run.
- **Trim tool output at the source.** Return the fields the task needs, paginate, and offer a
  concise mode. A tool that dumps raw records spends the attention budget on noise.
- **Keep a facts block outside the summarized history.** In long conversations, summaries blur
  exactly what matters: amounts, dates, IDs, statuses, and what the user said they expect. Keep
  these in a structured block that is carried forward verbatim and updated, never re-summarized.
  Include **approval state** (what is and isn't approved), actions already taken, and a "don't
  redo" list. Losing approval state is how an agent sends the same email twice.
- **Label trust.** Web pages, emails, tickets, uploaded files and third-party tool descriptions
  are data that may contain instructions. They never become policy, however they're phrased.
- **Scope context per role in code.** A role that shouldn't see a field never receives it; the
  dispatcher enforces that, not the prompt.
- **Don't pressure the model into fabrication.** "Complete the task no matter what" invites a
  claimed success. Say instead: "don't report an action as done until a tool result confirms it."
- **Put key findings first** in long inputs, under clear headings.
- **Compact deliberately.** When a session nears its limit, summarize with recall as the first
  priority. Clearing old raw tool results is the safest first cut.
- **Fresh session with a structured summary beats resuming a stale one.** After the world changed
  (files edited, records updated), old tool results in context are wrong. Starting clean with
  "here's what we know, here's what changed" is more reliable than hoping the model notices.
- **Use subagents for exploration** so verbose discovery stays out of the main context.

## 7. Errors, escalation and handoff

**Errors must be structured and honest.** When a tool or subagent fails, return what failed (the
category: transient, invalid input, business rule, permission), whether a retry could help, what
was attempted, and any partial results. Two anti-patterns kill multi-step systems:
- **Hiding the failure.** Returning an empty result as if the search succeeded. Downstream, "no
  records found" and "the lookup timed out" lead to opposite decisions.
- **Failing everything.** Aborting the whole run because one source was unavailable, when the
  synthesis could proceed and say which part is thin.

Recover locally where possible (retry transient errors inside the subagent), and propagate only
what can't be fixed there. The final output should say which conclusions are well supported and
which have gaps.

**Retry reads, not effects.** Automatic retries are for transient failures on idempotent calls.
Payments, sends, deletes and permission changes carry an idempotency key and are never retried
blindly. **A timeout on a write means "unknown", not "failed":** record the intent before the
effect and the outcome after, and reconcile an unknown outcome before retrying, or the customer is
refunded twice.

**A failed or partial read is a gap, never "nothing changed."** Reports say what was checked, what
wasn't, and what failed.

**Escalation triggers that work:**
1. The user explicitly asks for a human. Honor it immediately; don't try to talk them out of it.
2. The policy doesn't cover the case, or the case is an exception to it.
3. The agent can't make progress (repeated failures, missing information it can't obtain).
4. The requested action is above the agent's autonomy level for that action.

**Triggers that don't work:** the model's self-reported confidence and the customer's sentiment.
Neither tracks case complexity well. An angry customer with a simple problem should get the problem
solved; a calm customer with a policy gap needs a human. If you want confidence-based routing,
calibrate the scores against a labeled set first (`evaluation.md`).

**Ambiguity is a question, not a guess.** If a lookup returns several matching customers, ask for
another identifier. Picking the likeliest one is how an agent refunds the wrong account.

**Handoffs carry a structured summary**, because the human can't see the transcript: who, what was
asked, what the agent found, what it tried, what it recommends, and why it stopped. A handoff that
says "customer needs help" just moves the work back to zero.

**Provenance survives synthesis.** Keep claim-to-source mappings through every step. When credible
sources disagree, keep both values with their sources and dates instead of silently picking one.

**Tag how every output was produced:** live model call, cache, partial (some fields defaulted),
fallback or canned answer, or human-entered. Make the tag required and reject untagged output at the
boundary; otherwise a fallback answer or demo data reaches users looking like the real thing.
Monitor the fallback rate: a rising one is an outage nobody was paged for.

## 8. Verification and review

- **Give the agent a check it can run:** tests, a schema validator, a query that confirms the record
  exists. An agent that can verify its own output against the environment improves dramatically;
  one that can only re-read its own text doesn't.
- **Self-review is weak review.** A model that produced an answer keeps its reasoning in context and
  rarely overturns it. Use an independent instance, with fresh context and clear criteria, as the
  reviewer. Instructions like "double-check your work" don't substitute. (Mechanical self-checks
  such as scope, secrets or a schema are fine; it's self-review of judgment that's weak.)
- **Repetition isn't confirmation.** Agents restating a shared claim aren't independent sources.
  Give the verifier the claim and the sources, not the producer's reasoning.
- **Critique loops need a stop rule, not just a cap.** Cap generate-critique-revise at 3 to 4
  rounds, stop when the rubric score doesn't strictly improve, and ship the best round, not the
  last. Later rounds often polish a good answer into a worse one.
- **Split large reviews.** Review each unit (file, document, clause) in its own pass, then run a
  separate pass for cross-unit consistency. One giant pass dilutes attention, and a bigger context
  window doesn't fix that.
- **Grade outcomes, not narration.** "The record exists with the right fields" is evidence. "The
  agent said it updated the record" isn't.

**Several reviewers on one output** (a panel, a vote, a debate) pay off only when the output is
judged on several axes, a bad output is expensive, and the reviewers fail differently.
- **Vote before you debate.** For closed-form answers (a value, a label, pass/fail), independent
  samples and a majority vote capture most of the gain. Debate costs rounds and tokens.
- **Diversity beats protocol.** Reviewers on the same model share blind spots, so their agreement is
  weak evidence. Vary the model family or the inputs before adding rounds.
- **Keep it small** (about 3 reviewers, 2 to 3 rounds), and **seal the first verdicts**: each
  reviewer commits before seeing the others and gets the raw input, not the coordinator's framing.
  A changed position must name the new evidence; otherwise it's sycophancy.
- **A dissent role must cite evidence** for each objection, or it invents flaws to earn its keep.

## 9. Long-running work

Agents that work across many sessions (hours or days) need an external memory of progress, because
each new context starts empty:
- an **initializer** step that sets up the environment, a progress log and a task list;
- a **task list in a structured format** (JSON is less likely than prose to be rewritten by
  accident), where the agent only changes each item's status;
- **one task at a time**, verified end to end before it's marked done;
- a **checkpoint after each task** (commit, saved state) so a crash resumes instead of restarting;
- each session **starts by reading the progress log** and recent changes, and ends in a clean,
  resumable state.

For multi-agent runs, each agent writes a small state manifest the coordinator can reload on
resume. Define a **stall rule** (no new progress in N steps → re-plan or escalate): too loose and
the run loops silently, too tight and it discards good work.

**Memory and self-improvement have authority limits.**
- A remembered preference can shape tone or format; it can't override policy.
- Persist what the user asserted, not tool output or the model's guesses, and let users see,
  correct and delete it.
- An agent that writes its own lessons may never edit its permissions, evals, thresholds or
  budgets. One surprising result, or text from an untrusted source, isn't grounds for a new rule.
- **Never let the system write to its own ground truth.** If agent conclusions flow into the
  knowledge base or eval set they're judged against, the metric becomes self-confirming.

## 10. The fix ladder: debugging a misbehaving agent

When an agent misbehaves, the instinct is to add machinery: a router, a classifier, another agent,
a bigger model. Usually the fix is cheaper and lower. **Find the failing component, then fix it at
the cheapest layer that reliably works.**

1. **Read the transcripts first.** Which component made the first wrong move? Was the coordinator's
   decomposition wrong, did the tool return garbage, or did the model pick the wrong tool? Don't fix
   what didn't break. Record the settings that *actually* ran for the failing worker (model, prompt
   and tool versions, limits), not the intended ones, and find the first point where expected and
   observed state diverge.
2. **Tool definitions.** Two tools with one-line, overlapping descriptions get confused. Rewrite the
   descriptions (what it's for, when to use it instead of its neighbor, input format, an example),
   rename, or split a vague tool. This is the most common root cause and the cheapest fix.
3. **Explicit criteria and examples.** Replace adjectives with conditions. Add 2 to 4 few-shot
   examples of the *ambiguous* cases, showing why one action beats the plausible alternative.
4. **Context.** Is the needed fact missing, buried in the middle, or lost in a summary? Fix the
   facts block, trim noise, move key information up.
5. **Code gates.** If a rule must hold every time and still fails sometimes, stop prompting harder
   and enforce it (§5).
6. **Architecture last.** Split agents, add routing, or change models only when the evidence shows
   the lower layers can't solve it.

Each rung is cheaper to build, test and reverse than the next. Re-run the eval set after every
change. An "obvious" fix that isn't measured is a new untested assumption.
- **Change one variable per test,** and verify with a fresh run. Re-scoring an old transcript tests
  the grader, not the fix.
- **Every added component earns its place.** Before keeping a planner, retry loop, verifier or extra
  agent, run the same tasks with and without it and compare lift and cost together. Count cost per
  *successful* task, including failed attempts: a cheaper run may just give up earlier.
- **Unwritten knowledge is invisible to the agent.** If the rule lives in someone's head or a chat
  thread, write it down, preferably as a tool, validator or eval case rather than more prompt text.
  Prune stale docs, unused tools and bad examples periodically; agents imitate what they're shown.

## 11. Architecture review checklist

Ask these about any agent design, yours or someone else's. A "no" or "don't know" is a finding.

- Does every run end through a defined exit (success, error, escalation, budget)? Is "done" judged
  by the protocol signal and the world state, not by the model's prose?
- Is every tool on the allow-list, risk-rated, and needed by *this* agent's role?
- Is every rule that protects money, safety, privacy or compliance enforced in code? Do gates fail
  closed, are approvals bound to the exact action, and are limits checked on the resulting state?
- Are writes idempotent, never blindly retried, and is a write timeout treated as "unknown"?
- If there are several agents, could one agent do it? Does each subagent get a complete brief? Does
  all traffic go through the coordinator?
- What does each agent see at each step, and what survives a long session verbatim?
- Do errors carry category, retryability and partial results? Can "no results" be told apart from
  "lookup failed"?
- Are escalation triggers explicit conditions, not sentiment or self-confidence? Does the handoff
  carry a structured summary to a real, staffed queue?
- Who verifies the output: the environment, an independent reviewer, or nobody? Is every output
  tagged with how it was produced?
- Are there per-run budgets, and does hitting one alert someone?
- Is the whole bundle (prompts, tool definitions, model version, gates) versioned and gated by the
  eval set?
