# Ontology and Guardrails: Defining What the Agent May Do

Contents: 1) What an ontology is (in plain words) · 2) The three layers · 3) Why the PM must own the
constraint layer · 4) The action allow-list · 5) The concept contract · 6) Worked example ·
7) How to build it · 8) When you can keep it light

## 1. What an ontology is

"Ontology" is the most misused word in enterprise AI. Three common misreadings:
- *"It's a knowledge graph."* Half right. A graph answers *what things are* and *how they connect*.
- *"It's the database schema."* Half right. A schema says how data is *stored*. An ontology says how
  the business is *understood*, by both humans and machines.
- *"It's consultant jargon."* This is the most expensive misreading. Anyone who has built an
  enterprise agent finds that overreach (calling the wrong tool, changing data it shouldn't,
  promising things on the business's behalf) almost always traces back to a missing ontology.

**Definition:** an ontology is an **executable consensus about the business world**. *Executable*
matters: it isn't a picture for humans, but rules a machine follows. Think of it as the traffic
code for your business: where you may go, where you may not, and who has right of way.

Why it suddenly matters: older systems did what humans clicked. Agents choose their own actions,
so the rules must be explicit.

## 2. The three layers

| Layer | Answers | Common mistake |
|---|---|---|
| **Concepts** | What things exist in this business: order, material, work order, due date, customer, approval | Listing nouns without meanings. Two departments both say "due date," one meaning *promised date*, the other *ship date* |
| **Relations** | How they connect: an order has many work orders, work orders depend on materials, material arrival determines the due date, a delay triggers an approval. This is the causal chain the agent follows to find causes | Reversed direction. Does material arrival determine the due date, or does the due date back-schedule the material? Get it backwards and every conclusion is wrong |
| **Constraints** | Who may do what to what, and what must **never** happen: the agent may *suggest* a new due date but not *change* it; purchase orders are submitted only by humans | Written as advice ("please be careful") instead of prohibition ("direct modification forbidden") |

Most teams build the first two layers: nice concept maps and relation diagrams that present well in
reviews. **Almost nobody builds the third, and agents overreach exactly there.** It's a building
declared finished after two floors, with the load-bearing wall missing.

## 3. Why the PM must own the constraint layer

**What an agent can do is defined by its action space, not by the model and not by the prompt.**
People assume a smart enough model will follow the rules. Wrong. The model decides *how* to act.
Whether it *may* act is decided elsewhere.

- Put "modify due date" in the agent's tool list and it **will** modify due dates. Leave it out and
  however smart the model is, it can't, not even once. Hand it keys and it opens doors. Before
  complaining that it opens the wrong doors, count how many keys you gave away.
- **Prompts are advice, not gates.** Writing "do not auto-reschedule, do not auto-place purchase
  orders" in the prompt does nothing if the tool is there. If it's in the action list, the model
  will eventually call it. That is a matter of time, not probability. A typical incident: an input
  looks like an edge case, the model decides it should expedite, and it calls a write API.
- **Safety comes from having no option, not from being reminded.**

The architect can define concepts and relations. **The constraint layer must be decided by the
product owner and the business together**, because it encodes error cost and accountability. The
non-goals list *is* the constraint layer under another name: you remove forbidden actions from the
action space so the agent physically cannot do them.

## 4. The action allow-list

Two ways to write the action list:
- **Blocklist:** list what's forbidden. It can never be complete. Whatever you didn't think of, the
  agent will dare to try.
- **Allow-list:** list only what's permitted, and forbid everything else. Anything not written down
  can't be called. **This is a real guardrail.**

The permission system is its technical enforcement. Constraints written in the doc must end up as
permissions and API authorization, not just text.

Three-column permission table:

| May read | May suggest (a human executes) | Never |
|---|---|---|
| Orders, inventory, work orders, QC records (read-only, broad; reads have no side effects) | Change a due date, expedite materials, adjust priority | Auto-change the production schedule; auto-place purchase orders; auto-commit delivery dates to customers |

Rule for the "never" column: **if a wrong action can't be rolled back, forbid it.** Typical
irreversible or high-stakes actions include placing or cancelling orders, payments and refunds,
permission changes, sending external communications, committing dates or prices, writing to
records of authority (ledgers, medical records), and deleting data.

Also apply the "lethal trifecta" test (see `risk-and-governance.md`). If an agent combines access to
private data, exposure to untrusted content, and the ability to communicate externally,
prompt injection can exfiltrate data. Break at least one leg.

## 5. The concept contract: three sentences per concept

In a multi-component agent system, RAG, rules and the orchestrating agent often speak three
different dialects. Example: "Which contracts were overdue last month?" The agent's answer differs
from finance's by 3 million. Not because the model is dumb, but because to the agent "contract"
meant a document, to RAG it meant a set of clauses, and to the rules engine it was undefined. Or
"amount": the agent used the order total, RAG retrieved the tax-inclusive total, and the alert rule
"amount > threshold" used neither. So the alert either never fired or fired at random.

The fix is not a bigger model. It's an ontology as a **contract** (not a dictionary). Lock each
concept with three sentences:
1. **Who uses it?** (e.g. the agent, when fetching numbers during orchestration)
2. **At which step?** (e.g. the accounts-payable calculation)
3. **What breaks if it's inconsistent?** (e.g. false alerts; reconciliation collapses)

If you can't write three sentences for a word, delete it. It's decoration.

A real incident: in a support agent, RAG's "customer" was a registered account, while the rules
engine's "customer" was the contracting legal entity. Cross-customer aggregation attributed customer
A's contract to customer B, which was a compliance incident caused by an unlocked concept, not a
weak model.

Size: a good ontology usually has **10 to 30 concepts**, the minimum set (customer, contract, order,
amount, status, role…). During validation, never draw a "complete enterprise ontology." That is
platform disease, with negative expected return at that stage.

Order of operations when you inherit a project whose modules disagree: **first ask the business
what the term means** (is "amount" tax-inclusive?), **then** write the contract. Don't swap models,
and don't add more prompts.

## 6. Worked example: order fulfillment

- **Concepts (7 only, serving just the early-warning scenario):** order, material, work order, QC
  record, due date, approval, customer tier. Customer tier is included because it sets handling
  priority: the same delay on a key account gets handled first. More concepts means more ambiguity.
- **Relations:** an order has many work orders; work orders depend on materials; material arrival
  determines the due date; a delay triggers an approval.
- **Constraints:** read orders, inventory, work orders and QC freely; suggest due-date changes,
  material expediting and priority changes; never auto-reschedule, auto-purchase, or auto-commit
  dates to customers. Those three were exactly what the earlier criterion filtered out: *can it be
  rolled back? No, so forbid it.*

## 7. How to build it

**Step 0 (most often skipped):** bring the business owner in. Without their signature this layer is
waste paper.

Then:
1. Inventory the nouns.
2. Connect the relations.
3. Write the forbidden actions down one by one, and enforce them in permissions.

Roles: the **product manager writes**, the **architect reviews**, the **business owner signs.** If
one of the three is missing, the layer won't stand.

Three review questions: Is any concept ambiguous? Does every relation point the right way? Can every
prohibition actually be blocked technically?

Commonly missed:
- **The approval flow.** You wrote "may suggest a due-date change" but not who approves it or how
  the approved change is written back, so it stalls halfway.
- **Audit trail and alerts.** Every agent action must be traceable, and any attempt to trigger a
  forbidden action should alert immediately, not after the fact.

Exercise: list your agent's actions, permitted ones only, then count how many doors you had quietly
left open.

## 8. When you can keep it light

If the agent only answers questions and calls **no write APIs**, the constraint layer can start
simple. You still need concept contracts if multiple components share terms, and you still need
access controls inherited from the source systems in RAG (the agent should see only what the
asking user is allowed to see).
