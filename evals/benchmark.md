# Benchmark: with vs. without the skill

**Setup:** 3 realistic AI-PM scenarios from [`evals.json`](evals.json). Each prompt ran once with the
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

## Results

| Scenario | Iteration 1: with skill | Iteration 1: without | Iteration 2: with skill | Iteration 2: without (regraded) |
|---|---|---|---|---|
| Bank "end-to-end complaints agent" kickoff prep | **8/8** | 4/8 | **11/11** | 7/11 |
| HR RAG assistant "94% accuracy, launch Monday" go/no-go | **8/8** | 6/8 | **11/11** | 9/11 |
| Contract-review "POC" rescue memo to the CFO | **8/8** | 7/8 | **12/12** | 10/12 |
| **Total** | **24/24 (100%)** | 17/24 (71%) | **34/34 (100%)** | 26/34 (76%) |

## What the skill changed

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

- **N = 1 run per configuration per scenario.** Treat this as directional, not statistically robust.
- With-skill answers are **30–50% longer** and use about **2× the tokens** (≈71–86k vs. ≈37–39k per
  run), mostly from reading reference files.
- The baseline model is strong. Without the skill it already gives reasonable advice. The skill's
  gains are in **judgment structure**: reframing the problem, slicing by error cost, writing stop
  conditions, naming owners, and producing sendable artifacts.
- At 100%, the assertions no longer separate good answers from great ones. The grader's remaining
  notes were that deciding thresholds were sometimes left as placeholders and that answers ran long.
  The first is addressed by a "commit to numbers" rule added after iteration 2, which hasn't been
  re-benchmarked yet.

Full iteration-2 answers produced with the skill are in [`../examples/`](../examples/).
