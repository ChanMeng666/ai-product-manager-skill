# Pitfall Catalog

Contents: A) Framing and discovery · B) Solution and scope · C) Ontology, permissions and safety ·
D) POC and evaluation · E) Lifecycle and decisions · F) Production and operations · G) Agent
architecture and tools

How to use this: scan the user's plan against each section and report the pitfalls that apply,
**most expensive first.** For each one, say what you observed, why it kills projects, and the fix.
The "see" column points to the reference with the full treatment.

## A. Framing and discovery

| # | Pitfall | Symptom | Why it kills | Fix | See |
|---|---|---|---|---|---|
| A1 | Treating the request as the problem | "We want an agent" becomes the spec | You solve the imagined problem, not the real one; hard to question later | Three first questions: why now / where it hurts / worst case | discovery §2 |
| A2 | Asking "what features do you want?" | Feature list from people with no frame of reference | Hands product definition to someone who can't imagine the category | Ask "the last time this went wrong, what did you do?" | discovery §5 |
| A3 | No baseline | "It seems better" at the review | Improvement can't be proven, so nobody signs | Measure minutes per task, volume and error cost before design | discovery §6 |
| A4 | Second-hand requirements | RFP says "knowledge-base platform" | Each hand-off distorts; vendors deliver against the translation | Go on-site; shadow real users | discovery §2 |
| A5 | Ownerless project | Only IT attends; no business name | Quietly cut at the next budget cycle | "Who does this today?" must return a person's name | discovery §2 |
| A6 | Solving the demo-friendly problem | Budget goes to flashy front-office use cases | Returns are often in unglamorous back-office work | Score scenarios by frequency × unit cost | scoping §8 |
| A7 | Supporters-only stakeholder map | Map has no opponents or compliance | Hidden red lines appear mid-project | Include opponents; read non-goals aloud at kickoff | discovery §3 |
| A8 | Two accountable owners (or none) | "Everyone" in the A column | Nobody owns the failure; blame cycles | Exactly one A per activity | discovery §4 |
| A9 | Charter with no hypotheses | Every assumption marked "confirmed" | Author restated requests instead of judging | Hypothesis ledger with evidence levels | discovery §8 |
| A10 | Buzzword positioning | "Empower / close the loop / leverage" | Positioning not thought through | For whom, in what situation, solving what | discovery §9 |
| A11 | Ignoring the organizational critical path | Plan starts building in week 1 | Vendor onboarding, security and third-party-risk review often take 6 to 12 weeks and quietly eat the timeline | Start procurement/security review in week 1, in parallel with discovery | discovery §9 |
| A12 | Skipping build vs. buy | In-house build assumed | Purchased or partnered tools often succeed more often for non-differentiating needs | Compare against commercial options before committing | industry-evidence |

## B. Solution and scope

| # | Pitfall | Symptom | Why it kills | Fix | See |
|---|---|---|---|---|---|
| B1 | Agent-first | Agent chosen before asking about determinism | Uncertainty written into production; every error costs more | Decision tree, left to right | selection §2 |
| B2 | Autonomy creep | "Suggest" quietly becomes "and just change it" | Error cost jumps about two orders of magnitude | Set autonomy per action; irreversible actions go on the non-goals list | selection §4 |
| B3 | Deciding what isn't the PM's call | PM picks frameworks; or engineering decides auto-execution | Wrong person decides error cost | The rule: does it change error cost, cost or UX? | role §4 |
| B4 | PM promising for other teams | "ML says it can"; "it can integrate" in the contract | Whole project pays for one person's promise | Can-commit / cannot-commit list for presales | role §2 |
| B5 | Making it complete | Everything at 30% | Enterprises don't pay for 30% | One scenario at 90% | scoping §1 |
| B6 | Cutting depth instead of coverage | Q&A only, routing in "phase 2" | No closed loop, so value can't be measured; "ongoing" forever | Cut coverage, keep end-to-end depth | scoping §3 |
| B7 | Horizontal slicing | Data layer done, retrieval done, nothing runs end to end | "99%" progress, zero real value | Vertical slice through all four layers | scoping §5 |
| B8 | Fake layer in the slice | Synthetic data, hard-coded retrieval, human copy-paste at the end | The slice isn't really through | Four self-test questions | scoping §7 |
| B9 | New console nobody logs into | Separate admin UI for the pilot | One extra login can drive usage to zero within two weeks | Embed in existing tools (sheet, email, chat) | scoping §6 |
| B10 | Production engineering during validation | Multi-tenancy, config systems in the POC | More than half of validation solutions get rewritten | Validation criterion is speed only | scoping §3 |
| B11 | Validation measured in months | Six-month "MVP" | Regrows into a big project; budget or personnel change kills it | Weeks, with a fixed deadline | scoping §2 |
| B12 | "Phase two" promises | Vague deferrals | Become fights at acceptance | "Not X because Y; enters next phase when Z" | scoping §9 |
| B13 | No exit criteria | Pilot with no end date or metric | Zombie project, neither dead nor alive | Time + metric + value + sample + post-failure ownership | scoping §10 |
| B14 | Widening the slice after success | "Do the other 11 types at once" | Back to horizontal; the moment of value isn't repeated | Add one highest-value slice; pay debt; new criteria | scoping §11 |

## C. Ontology, permissions and safety

| # | Pitfall | Symptom | Why it kills | Fix | See |
|---|---|---|---|---|---|
| C1 | Constraints as prompts | "The prompt says not to" | Prompts are advice; if a tool is listed it will be called | Remove the action; allow-list | ontology §3–4 |
| C2 | Blocklist permissions | List of forbidden actions | Never complete | Allow-list only | ontology §4 |
| C3 | Undefined shared terms | Agent, RAG and rules disagree on "amount" or "customer" | Wrong totals, false alerts, compliance incidents | Three-sentence concept contract; ask the business first | ontology §5 |
| C4 | Platform disease | "Complete enterprise ontology" during validation | Negative expected return | 10 to 30 concepts serving one scenario | ontology §5 |
| C5 | Suggest without approval path | "May suggest a date change" but no approver or write-back | Stalls halfway | Define approver, flow and write-back | ontology §7 |
| C6 | Lethal trifecta | Private data + untrusted input + external send in one agent | Prompt-injection exfiltration | Break one leg | risk §3 |
| C7 | RAG ignores source permissions | Assistant returns docs the user can't see | Data leak | Inherit access control at retrieval | risk §3 |

## D. POC and evaluation

| # | Pitfall | Symptom | Why it kills | Fix | See |
|---|---|---|---|---|---|
| D1 | POC as demo | Easy samples, one run, no weaknesses found | No information; can't decide next step | Hard samples, batch runs, failure distribution | poc §1 |
| D2 | POC as mini-product | Ten features implemented "small" | Proves you can build, not that it can succeed | Test only the "dies if false" assumption | poc §3 |
| D3 | Cleaning dirty data for the demo | "Remove the 17% missing IDs" | Hides the highest risk; explodes at scale | Make the dirty data the test | poc §10 |
| D4 | Criteria written after the run | Threshold set to fit results | That's curve fitting, not acceptance | Thresholds + signer before running | eval §7 |
| D5 | No red line | Every threshold negotiable | Erodes under pressure until nothing holds | At least one non-relaxable red line (fabrication / overreach) | eval §7 |
| D6 | One accuracy number | "95%, ship it" | Hides denominator, long tail, lack of control group | Four questions; layered metrics | eval §9–10 |
| D7 | Self-certified labels | Prompt author grades outputs; model output used as reference | Inflated, meaningless scores | Independent expert labels; benevolent-dictator owner | eval §3 |
| D8 | No long-tail or adversarial samples | Eval set is all "functional" | Incidents live in edge cases | Tier by production ratio | eval §4 |
| D9 | Grading only the final answer | Agent fails three tools, then fabricates politely, and passes | Hidden fabrication | Tool correctness + groundedness + outcome-state checks | eval §6 |
| D10 | Unpinned eval context | Model/prompt/KB not locked | Can't tell better from worse | Version bundle per eval run | eval §3 |
| D11 | Manual-only evals | Evals skipped by the third change | Regressions ship silently | Evals in CI; block on regression | eval §6 |
| D12 | Unvalidated LLM judge | Judge trusted without checking against humans | Biased, drifting verdicts | TPR/TNR against held-out human labels | eval §8 |
| D13 | Ignoring consistency | Same question, different answers | Users lose trust instantly | Repeat runs, perturbation tests, pass^k | eval §10 |
| D14 | Eval used as UAT | "Scores pass, so it's accepted" | Business says "not what I wanted" | Translate metrics into business terms; business signs | eval §11 |
| D15 | Scripted UAT | Users follow a script to all-green | A demo, not acceptance | Unscripted real tasks; record stalls, edits, abandonment | eval §12 |
| D16 | Role instead of name on sign-off | "Business owner" signs | Everyone assumes someone else checked | Names | eval §12 |
| D17 | Cherry-picked pilot users | Ten most cooperative users | Proves nothing | Random sampling, including skeptics | eval §11 |
| D18 | Performance targets during pilot | Staff assessed on usage | Data shows cooperation, not value | Observe, don't judge | eval §13 |

## E. Lifecycle and decisions

| # | Pitfall | Symptom | Why it kills | Fix | See |
|---|---|---|---|---|---|
| E1 | Wrong order | Architecture before baseline | Late discovery costs 10× to 100× | Seven stages sorted by correction cost | lifecycle §1 |
| E2 | Skipping the pilot | POC → full rollout | Production responsibility on demo evidence | Bounded pilot with exit conditions | lifecycle §4 |
| E3 | Over-grading maturity | POC called "production" | Expectations jump to full rollout | Grade by evidence: data / users / responsibility | lifecycle §5 |
| E4 | Demo-driven development | Highlight, curated samples, demo, budget, wall | Permission to invest in the wrong direction | Gates with evidence | lifecycle §5 |
| E5 | Sunk-cost continuation | "Let's invest a bit more" | Small failure becomes a big one | Pre-written stop conditions | lifecycle §7 |
| E6 | Tuning the model to fix noise or cost | Retuning when users mute alerts | Noise and cost come from scope | Shrink scope | lifecycle §7 |
| E7 | Vague stop conditions | "Stop if results are poor" | Anyone can call any result "not bad" | Metric + threshold + time point + action | lifecycle §7 |
| E8 | Only watching engineering credibility | Tech all green, business all red | Nobody uses it, no money saved, org rejects it | Hold all three lines | lifecycle §6 |
| E9 | No decision records | "Decided back then, don't ask" | Re-arguing; contradictory additions | ADR for hard-to-reverse choices | selection §8 |

## F. Production and operations

| # | Pitfall | Symptom | Why it kills | Fix | See |
|---|---|---|---|---|---|
| F1 | No error taxonomy | "It might be wrong sometimes" | Can't defend against unimagined errors | List error types; likelihood × severity | production §1 |
| F2 | All-green monitoring with wrong answers | Only latency and availability tracked | 200 OK while users are harmed | At least one AI-quality SLO | production §5 |
| F3 | Unrehearsed rollback | Rollback "exists" on paper | No rollback in practice | Drill and time it | production §4 |
| F4 | No 3 a.m. owner | Runbook is a contact list | 90-minute outage, no basis for retro | Named first responder; symptom/criterion/action/verification | production §7 |
| F5 | Human takeover with no capacity | "Transfer to human" as universal fallback | Flooded queue or nobody responds | Narrow triggers, SLA, queue owner | production §8 |
| F6 | Knowledge without versions | Replacing documents in place | Time dimension lost; wrong historical answers | Effective-date ranges; supersede, never delete | production §9 |
| F7 | Hot-editing prompts in production | Engineers ship prompt edits untested | Silent regressions; missed clauses | Version bundle + CI eval gate | production §9 |
| F8 | Floating model versions | "Latest" alias in production | Vendor changes alter behavior; no rollback | Pin snapshots; re-eval before switching | production §9 |
| F9 | Unredacted logs | Raw employee/customer questions stored | Logs more sensitive than business data | Redact before writing; retention policy | production §6 |
| F10 | Fixing before containing | "Hotfix by tomorrow morning" | Exposure continues; risky promise | Isolate high-risk channel, trace affected outputs, then fix | production §11 |
| F11 | All-or-nothing shutdown | Full stop for a tiered problem | Max cost; "unstable" reputation | Stop by risk tier and channel | production §11 |
| F12 | Incidents not fed back | Same failure recurs | Lessons lost | Every incident becomes an eval case | production §12 |
| F13 | No capacity plan | Rollout to everyone at once on a hosted LLM | Rate limits, quotas and latency spike at peak, so the first impression is an outage | Load-test at peak, request quota increases, stage the rollout | production §5 |

## G. Agent architecture and tools

| # | Pitfall | Symptom | Why it kills | Fix | See |
|---|---|---|---|---|---|
| G1 | Critical rule only in the prompt | "We told it never to refund over the limit" | Prompts fail at a non-zero rate; each failure is real money or a compliance breach | Enforce in code: hook, prerequisite check or blocking approval | architecture §5 |
| G2 | Multi-agent by default | Five agents for a task one agent could do | Many times the tokens, more failure points, harder to debug | One agent first; split on evidence | architecture §4 |
| G3 | Subagents assumed to share context | Subagent redoes work or contradicts earlier findings | Subagents start without the parent's conversation | Complete briefs: findings, constraints, output format, boundaries | architecture §4 |
| G4 | Blaming the downstream agent | Subagents "fixed" repeatedly; gaps remain | The coordinator decomposed the task too narrowly | Read the trace from the top; fix the first wrong move | architecture §4, §10 |
| G5 | Vague, overlapping tool descriptions | Agent picks the wrong tool some of the time | Misrouting looks random and gets "fixed" with routers | Rewrite descriptions: purpose, when to use instead of neighbor, formats, example | tools §3 |
| G6 | Tool sprawl | 15+ tools per agent, one per API endpoint | Selection reliability drops; least privilege lost | A few task-shaped tools per role; namespace; split roles | tools §2 |
| G7 | Silent or generic errors | "Operation failed", or an empty list on timeout | Agent retries blindly, or tells users "no records" when the system was down | Structured errors: category, retryable, message, partial results | tools §5 |
| G8 | Stopping on prose or on the cap | Parsing "I'm done"; runs end when the turn limit hits | Unpredictable endings; silent truncation | Stop on the protocol signal; caps are an alerting safety net with a defined exit | architecture §3 |
| G9 | Sentiment or self-confidence as escalation trigger | Angry-but-simple cases escalated, calm policy gaps kept | Human queue floods while real risks stay with the agent | Explicit triggers: asked for a human, policy gap, no progress | architecture §7 |
| G10 | Self-review as quality control | "Double-check your answer" in the prompt | The generator rarely overturns its own reasoning | Environment checks; independent reviewer instance | architecture §8 |
| G11 | Context stuffing | Everything pre-loaded; facts lost in summaries | Attention dilutes; amounts and dates drift | Just-in-time loading, trimmed tool output, a verbatim facts block | architecture §6 |
| G12 | Retrying for data that isn't there | Validation-retry loop until a required field is filled | Retries invent the missing value | Nullable fields; route missing data to review | tools §7 |
| G13 | Machinery before diagnosis | Router, classifier or bigger model added after one bad run | Cost and complexity rise; root cause untouched | Read transcripts; climb the fix ladder; re-run evals after each change | architecture §10 |
| G14 | Blind retry of a write | Timeout on a refund, so the agent calls it again | Duplicate payments, emails or records | Idempotency keys; a write timeout is "unknown" and gets reconciled first | architecture §7 |
| G15 | Unbound or stale approval | "Approved" covers whatever the agent sends next | The approved action and the executed one differ | Approval bound to exact action and payload, with expiry; recheck at apply time | architecture §5 |
| G16 | Limits checked per request | Two "add 3" requests pass a max of 4 | The invariant breaks across requests, sessions and channels | Check the resulting state atomically in the system of record | architecture §5 |
| G17 | Fallback passed off as real output | Canned or demo answers reach users unlabeled | Silent outage; trust collapses when found | Required origin tag on every output; monitor the fallback rate | architecture §7 |
| G18 | Council by default | Several same-model reviewers debate every output | Multiplied cost; shared blind spots read as agreement | Vote for closed-form answers; diverse, small panels only where error cost justifies it | architecture §8 |
| G19 | Agent writes to its own ground truth | Agent conclusions added to the eval set or knowledge base | Metrics become self-confirming | Reference data read-only to the agent; human curation only | evaluation §3 |
