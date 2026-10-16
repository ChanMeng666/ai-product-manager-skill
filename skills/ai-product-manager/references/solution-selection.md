# Solution Selection: Rules, Workflow, RAG, or Agent?

Contents: 1) The certainty axis · 2) The decision tree · 3) When an agent is justified ·
4) Autonomy levels and human-in-the-loop · 5) Decomposing a real project · 6) Agent design patterns
from public guidance · 7) Cost, latency and model choice · 8) Writing it down

The most frequent question, "RAG, agent, or workflow?", usually comes from someone who already has
the direction wrong. **Most requirements should not start with an agent.** Choose by certainty, not
by sophistication. The more advanced the option, the higher its error cost tends to be. A wrong
choice doesn't make you slower. It makes you pay for that choice on every future error.

## 1. The certainty axis

```
RULES ──────── WORKFLOW ──────── RAG ──────── AGENT
fully certain   fixed path,        answer lives    decides its own next step
                AI judges at       in documents,   AND its actions change
                some nodes         retrieve and    system state
                                   summarize
certainty  ◀──────────────────────────────────────▶  autonomy
error cost: low ─────────────────────────────────▶ high
```

- **Rules:** fully deterministic if-then logic, such as field validation, format conversion, or
  "does the order exceed the credit limit?" Not intelligent, but the most stable, fastest, cheapest
  and least error-prone option. Making this a model inference adds uncertainty and maintenance cost
  for nothing. It's like hiring a PhD to check that 1 + 1 = 2.
- **Workflow:** a fixed path where AI makes a judgment at certain steps. Example: when an exception
  ticket arrives, notify planning, procurement and quality in order. Who to notify and in what
  order are fixed; only "is this an exception?" needs a model.
- **RAG:** the answer already exists in your documents and needs to be found and summarized, such as
  equipment fault history, contract clauses, or manual steps. The model doesn't need to know the
  answer. It needs to search, read and summarize. The answer has a source, so it is more credible.
- **Agent:** decides its own next step, **and its action changes system state.** When it acts on
  real things, a mistake is no longer just words. It has already changed the schedule, sent the
  order, or moved the money. Use it only when nothing to its left works.

First principle: **stay left unless you are pushed right.** Whatever the left can solve, the right
turns into a liability.

## 2. The decision tree

Root question: **does this task have a deterministic answer?** Don't think about models until you
have answered it.

```
Deterministic answer with clear rules?        ── yes ──▶ RULES
        │ no
Path fixed, uncertainty only at some steps?   ── yes ──▶ WORKFLOW (+ AI at those nodes)
        │ no
Is the answer contained in existing material? ── yes ──▶ RAG (with citations)
        │ no
All three agent conditions hold? (below)      ── yes ──▶ AGENT + human approval on key actions
        │ no
Reframe the problem, or put it on the non-goals list
```

Ask from left to right. Never choose from right to left. Choosing from the right means you fell in
love with agents first and then invented reasons to justify one. In practice about 90% of
requirements are assigned at the first branch.

## 3. When an agent is justified

All three must hold **at the same time**:
1. There is no deterministic path.
2. The system must decide its own next step based on the situation.
3. The action changes system state.

If there's a fixed path, use a workflow. If the answer is in documents, use RAG. Forcing an agent
into either case turns a simple problem into a complex one.

Even when all three hold, **put a human approval on key actions** (human-in-the-loop). This isn't
distrust of the model. It leaves a way back. The agent runs fast; the human can still brake.

Checklist before building an agent: no deterministic path? needs to decide its next step? action
changes state? human approval configured? Four yeses, then build. Anything less, go back left.

## 4. Autonomy levels and human-in-the-loop

Set the autonomy level explicitly, per action, based on error cost and reversibility:

| Level | The AI… | Typical use |
|---|---|---|
| L1 Inform | Surfaces information and evidence only | Risk alerts, evidence aggregation |
| L2 Suggest | Proposes ranked candidates with reasons and sources; a human decides | Clinical differential suggestions, repair suggestions |
| L3 Conclude | Gives a conclusion a human usually accepts, with sampling review | Low-risk classification |
| L4 Execute | Acts on its own | Read-only queries, status sync, low-risk reversible writes |

Rules of thumb:
- **Irreversible or money/compliance actions** (placing orders, changing permissions, committing
  delivery dates to customers, changing production schedules) default to L2 at most, with a human
  executing.
- **Read access can be broad, write access narrow.** Reads have no side effects. The tighter the
  write path, the wider you can open the read path.
- Risk-tiered execution, as in the order-fulfillment case:
  - *High risk* (delivery-date commitments, price changes): ≥95% accuracy **and** mandatory human
    confirmation, never auto-executed.
  - *Medium risk* (inventory checks, rescheduling): ≥88% accuracy, auto-execute plus daily sampled
    review of at least 10%.
  - *Low risk* (queries, status sync): ≥98% accuracy, fully automatic with log monitoring.
  - *Everything:* audit logs on all writes, alerts on anomalous patterns, one-click fallback to
    human handling on any customer complaint.
- **Human takeover must be real.** The handoff queue needs an owner, an SLA, a timeout behavior and
  fallback wording. If the trigger is too broad, the queue floods and real dangers get diluted. If
  nobody responds, you have handed responsibility to a person who doesn't exist.

## 5. Decomposing a real project

The same project uses different options for different steps. Order fulfillment: the client
originally asked for "an agent that auto-detects risk, auto-coordinates planning and procurement,
and changes the production schedule."

| Step | Choice | Reason |
|---|---|---|
| Cross-system risk evidence aggregation | RAG | No deterministic answer; the answer lives in ERP/MES records |
| Root-cause attribution | RAG + light reasoning | Reasoning over cause and effect, but still helping a human think, not acting |
| Handling suggestion | Workflow | The handling paths are few and fixed; the model chooses one and fills parameters |
| Push for approval | Workflow + human | Approver and process fixed; the human is the brake |
| Auto-change production schedule | **Non-goals list** | A wrong schedule means materials, labor hours and due dates all go wrong together. Not "can't," but "not worth it now." Re-evaluate separately once the rest runs smoothly |

The final product contains **no autonomous agent at all**, and the client's problem is fully solved.
The goal is not to use the coolest thing. It is to make the problem disappear. Real strength is
knowing when you don't need it.

## 6. Agent design patterns from public guidance

Public guidance from model vendors converges on the same advice. See `industry-evidence.md` for
sources.

- **Start with the simplest thing that works**, often a single well-prompted LLM call with
  retrieval, and add complexity only when it demonstrably improves outcomes. Agentic systems trade
  latency and cost for task performance. Make that trade consciously.
- **Workflows vs. agents:** workflows orchestrate LLMs and tools through predefined code paths.
  Agents let the LLM direct its own process and tool use. Prefer workflows for well-defined,
  predictable tasks, and agents for open-ended problems where the number of steps can't be
  predicted.
- **Common workflow patterns:**
  - *Prompt chaining:* fixed sequential steps with checks between them.
  - *Routing:* classify the input, then send it to a specialized path. This is also how you keep
    expensive models for hard cases.
  - *Parallelization:* split independent subtasks (sectioning), or run the same task several times
    and vote.
  - *Orchestrator-workers:* a central LLM breaks the task down dynamically and delegates.
  - *Evaluator-optimizer:* one LLM generates, another critiques against clear criteria, and the
    loop repeats.
- **Single agent before multi-agent.** Split into multiple agents only when one agent's
  instructions or tool set become unmanageable.
- **Tools are product surface.** Clear names, descriptions and parameters, plus guardrails, matter
  as much as prompts. Treat the agent's tool list as its action space (see
  `ontology-and-guardrails.md`).
- **Layered guardrails:** relevance and safety classifiers, PII filtering, tool risk ratings
  (read-only vs. write, reversible vs. irreversible, financial impact), output validation, plus
  human escalation when failure thresholds are exceeded or a high-risk action is requested.

## 7. Cost, latency and model choice

- Ask three numbers for every option: **latency, unit cost, error rate.** "Is it good?" is not
  enough.
- "Big or small model" is not about which is more advanced. Can you accept the latency and cost at
  production volume? Estimate the cost at **100× demo volume** before committing.
- Price the extra accuracy against a baseline. If rules reach 88% and the LLM reaches 95%, is the
  extra 7 points worth the inference cost and the new failure modes?
- Pin model versions in production and re-run evals before switching. A provider's model update is
  a change to your product.

## 8. Writing it down

Selection choices are hard to reverse, so record them as ADRs (`templates/adr.md`): context,
decision, **what you gave up**, and consequences that someone could later prove wrong. Example: *"Chose
pgvector because the team knows it and operations are light. Gave up Milvus's higher throughput.
Acceptable because this project's QPS is under 500. If QPS exceeds 2,000, revisit."*

ADR rules:
- It's a **record of a verdict**, not a blueprint. A design doc says what the system looks like. An
  ADR says why you chose it.
- Write one only for **hard-to-reverse** decisions: database, framework, service split, model
  serving, data partitioning. Don't write one for variable names.
- If you can't write the consequences, you haven't thought the decision through. Force yourself to
  write "if we chose B instead…"
- Status: proposed / accepted / deprecated / superseded. An ADR can be superseded, but is **never
  deleted**.
- What ADRs save is not writing time but **re-arguing time.** Without one, a team with Kafka plus
  RabbitMQ watched a newcomer add a third bus, and rolling it back took two weeks. With one, the
  newcomer read it and stopped.
- Red flag: "it was decided back then, don't ask why." When you inherit an expensive old decision,
  don't keep it blindly (that hides debt) and don't rip it out blindly (that's jumping without
  thinking). Back-fill the ADR (original reasons, current cost), *then* decide.
