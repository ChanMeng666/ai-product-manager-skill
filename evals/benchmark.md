# Benchmark: with vs. without the skill

**Setup:** realistic AI-PM and agent-architecture scenarios from [`evals.json`](evals.json). Each prompt ran once with the
skill loaded and once without (same model, Claude Opus 5.5, as a Claude Code subagent). An
independent grader agent then scored each answer against objective assertions, with the same
strictness for both configurations.

- **Iteration 1:** 8 assertions per eval (core AI-PM judgment).
- **Iteration 2:** the skill was revised based on the grader's notes, and assertions were added:
  - no leaked internal codes;
  - no composite cases presented as real events;
  - domain-specific critical path;
  - capacity at peak;
  - sendable deliverable first;
  - build vs. buy.

  The iteration-1 baseline answers were re-graded against the extended list.
- **Iteration 3 (v0.2.0):** the agent-architecture layer was added (agent architecture, tool design,
  building on Claude). Two new architecture scenarios ran with and without the skill, and the
  grader was blind to which answer was which. The three original scenarios were re-run with the
  skill as a regression check.

## Results

| Scenario | Iteration 1: with skill | Iteration 1: without | Iteration 2: with skill | Iteration 2: without (regraded) |
|---|---|---|---|---|
| Bank "end-to-end complaints agent" kickoff prep | **8/8** | 4/8 | **11/11** | 7/11 |
| HR RAG assistant "94% accuracy, launch Monday" go/no-go | **8/8** | 6/8 | **11/11** | 9/11 |
| Contract-review "POC" rescue memo to the CFO | **8/8** | 7/8 | **12/12** | 10/12 |
| **Total** | **24/24 (100%)** | 17/24 (71%) | **34/34 (100%)** | 26/34 (76%) |

### Iteration 3: agent architecture (v0.2.0)

| Scenario | With skill | Without skill |
|---|---|---|
| Support agent on the Claude Agent SDK: "6 agents, each with all 22 endpoints" | **12/12** | 8/12 |
| Multi-agent research assistant: narrow coverage, silent timeouts, tool confusion; "add a QA agent and the biggest model?" | **10/10** | 7/10 |
| **Total** | **22/22 (100%)** | 15/22 (68%) |

Regression check with the skill: bank kickoff **11/11**, HR go/no-go **11/11**, contract rescue
**12/12**. The new references did not dilute the original PM behavior.

**What the architecture layer changed:**
- **Support agent.** *Without the skill,* the agent already pushed back to one agent with scoped
  tools and a code-enforced refund cap. But it:
  - listed "strong frustration detected" as an escalation trigger;
  - gave no structured error contract, and nothing to tell "no orders" apart from "system down";
  - left out a recommendation in the handoff;
  - left budgets as "N turns".

  *With the skill,* it took a decision on each of the six proposed agents, and:
  - took the customer ID from the verified session rather than from model arguments;
  - made the $200 limit cumulative, so it can't be split;
  - added a stop check that blocks "refund issued" claims with no record behind them;
  - added a model-free test suite that must block 100% of gate bypasses;
  - set tiered thresholds, signed in advance.
- **Research debug.** *Without the skill,* the diagnosis was right, but:
  - it was never confirmed against transcripts;
  - it didn't say that subagents don't inherit the coordinator's context;
  - the plan had no owner and no next action.

  *With the skill,* it treated the diagnosis as a hypothesis to confirm in the traces, and:
  - replaced most of the proposed QA agent with a cheap code gate (each planned subtopic is
    covered or declared missing);
  - drafted the tool descriptions;
  - made "zero silent omissions" a red line in the test set;
  - ended with a dated next action for a named owner.

**Re-check after absorbing companion-skill patterns** (prepare/commit tools, idempotent writes,
output-origin tags, review panels and others; see the CHANGELOG). Evals 4 and 5 were re-run with
the skill only and graded blind: **12/12** and **10/10**, so there was no regression. The support
answer now also checks the refund cap cumulatively per order inside the refund service, as well as
in a pre-tool hook, and it removes the SDK's built-in shell and file tools from the agent. The
grader called it long but dense. Baselines were not re-run, because the change only adds content
to the skill.

## What the skill changed (iterations 1–2)

- **Bank kickoff.**
  - *Without the skill,* the agent adopted the "end-to-end agent" as the north star and spread phase
    1 over 3–5 complaint categories. It wrote no stop criteria and didn't ask for a single
    accountable owner.
  - *With the skill,* it treated the request as a proposed solution and split it by error cost.
    Rules handle compensation policy and retrieval handles the investigation. Approving money and
    sending replies stay with a named human. It also drafted a read / suggest / never permission
    table, one end-to-end slice, and pre-written stop conditions.
- **HR assistant.** *Without the skill,* "I don't know" behavior was only raised as a question, and
  there was no named owner or runbook behind the kill switch. *With the skill,* abstention and
  citations were required, the 94% was broken down by slice and source, policy versioning was
  addressed, and a randomized pilot came with exit criteria written in advance.
- **Contract-review rescue.**
  - *Without the skill,* the answer never graded the project's maturity honestly, and coaching notes
    came before the email.
  - *With the skill,* the email to the CFO comes first: a smaller, two-tranche quarter, gated by a
    test agreed with the general counsel before work starts. It freezes live prompt edits and
    traces the 30% overrun back to usage logs.

## Honest caveats

- In iteration 3 the baseline was already strong on architecture: it rejected the 6-agent design
  and enforced the refund cap in code without help. The skill's gains are in the details that
  decide production incidents: escalation signals, error contracts, budgets, verification, and
  owners.
- **N = 1 run per configuration per scenario.** Treat this as directional, not statistically robust.
- With-skill answers are **30–50% longer** and use about **2× the tokens**. Per run that is
  ≈71–86k vs. ≈37–39k in iteration 2, and ≈77–92k vs. ≈42–45k in iteration 3. Most of the extra
  comes from reading reference files.
- The baseline model is strong. Without the skill it already gives reasonable advice. The skill's
  gains are in **judgment structure**: reframing the problem, slicing by error cost, writing stop
  conditions, naming owners, and producing sendable artifacts.
- At 100%, the assertions no longer separate good answers from great ones. The grader's remaining
  notes were that deciding thresholds were sometimes left as placeholders and that answers ran long.
  The first is addressed by a "commit to numbers" rule added after iteration 2, which hasn't been
  re-benchmarked yet.

Full iteration-2 answers produced with the skill are in [`../examples/`](../examples/).
