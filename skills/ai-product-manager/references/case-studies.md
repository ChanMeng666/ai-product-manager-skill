# Case Studies

These are composite cases from enterprise AI delivery practice. The numbers are illustrative of
real orders of magnitude. Use the *patterns* and the *decisions*. Don't quote the figures as
external statistics, and when advising a user never present these cases as specific real events.
Frame them as patterns ("a common failure pattern is…").

Contents: 1) Manufacturing: order-fulfillment assistant · 2) Manufacturing: maintenance knowledge ·
3) Healthcare: clinical decision support · 4) Customer service: "AI auto-reply for 800 tickets a
day" · 5) Internal policy assistant: the 3:07 a.m. incident · 6) Legal: the contract-review rescue ·
7) Patterns across cases

## 1. Manufacturing: AI order-fulfillment assistant

**Request:** "Orders keep slipping. Build us an agent that auto-detects risk, auto-coordinates
planning and procurement, and changes the production schedule directly. Budget is there. Three
months?" Context: a discrete-manufacturing group with 4 plants, 6 systems (ERP, MES, WMS,
procurement, QMS…). Schedules are confirmed by planning; delivery-date promises to customers are
owned by sales.

**Discovery:**
- *Why now?* A major customer was lost to delays last month, and the owner was furious. It's
  incident-driven, so priority is the highest tier and approvals come easily.
- *Where does it hurt?* Risks are found only when customers chase. A planner needs about 40 minutes
  per check and often doesn't know where to look. Shadowing 5 orders measured 38 minutes on average,
  matching the claim. In 3 of the 5, time was lost not knowing which system to check.
- *Insight:* the real pain is **late detection and slow verification,** not "can't auto-act." Risk
  signals typically appear about 10 days before the due date.

**The decision drill (charter stage):**
1. Promise 3 months, connect all 6 systems, a fully autonomous agent: **wrong.** It puts
   auto-rescheduling (error cost: a production line running on a wrong plan) into scope.
2. A two-week demo that "auto-detects delays and suggests actions" to excite leadership: **wrong.**
   Demo impressions replace value validation.
3. **Baseline first, then scope.** In two weeks: measure the delay-rate baseline, build one vertical
   slice, list three hypotheses, write the non-goals. **Correct.** If the baseline shows the delay
   problem is smaller than feared, you've saved three months of team effort.

**Scope (PRD v1.0):** one vertical slice covering *key-account orders → 10-day early warning →
one-click evidence aggregation → cause → suggestion → human approval*.
- *Non-goals (7, each with a reason):*
  1. No auto-rescheduling.
  2. No auto-purchase orders.
  3. No auto-commitment of dates to customers.
  4. No full order coverage.
  5. No group-wide rollout at once.
  6. No auto customer notifications.
  7. No import of all historical work orders.
- *Success metrics* in 3 layers. *Stop conditions:* 3 (metric, time, root cause). Hypothesis
  example: "delay risk is detectable 10 days ahead," partly confirmed; backtest on 120 historical
  orders, and if no clear signal emerges, redefine scope.

**Selection:**
| Step | Choice |
|---|---|
| Evidence aggregation | RAG |
| Attribution | RAG + reasoning |
| Suggestions | Workflow |
| Approval | Workflow + human |
| Auto-schedule | Non-goal |

There is no autonomous agent anywhere.

**POC lesson:** all three systems had a "due date" field, with three different definitions. Until
the definition of "late" is aligned, nothing downstream counts.

**Eval lesson:** the overall 95% included 400 trivial "where's my order" queries. The complex
cross-system inventory and delivery-commitment slice scored 64%, while being 8% of volume and over
70% of manual handling time. The fix was a **three-tier risk table:**
- **High** (delivery commitments, price): ≥95% and mandatory human confirmation.
- **Medium** (inventory checks, rescheduling): ≥88%, auto + ≥10% daily sampled review.
- **Low** (queries, status): ≥98%, fully automatic.
- **All tiers:** audit logs and one-click human takeover.

**Mid-project calls:**
- Recall 62% but "too many alerts" → **shrink** the alert rules.
- Verification time 38 → 12 minutes and sales wants after-sales QC added → **continue, hold the
  boundary.**

## 2. Manufacturing: maintenance knowledge assistant

**Trigger:** a machine on a line went down. It took 4.2 hours to fix, the third time it had broken
the same way, and nobody remembered how it was fixed before. The owner: "Can we do AI for all
equipment plant-wide?" Agreeing means first-version trust burns out before launch.

**Real pain:** three master technicians retire within two years. Baselines:
- mean time to repair: 4.2 h;
- repeat faults: about 30%;
- a newcomer needs 6 weeks to handle faults independently.

**AI suitability:**
- knowledge: 20 years of manuals ✔;
- data: historical work orders ✔;
- feedback loop: repair results recorded ✔;
- error tolerance: **low** (a wrong step can cause a safety incident).

**Counter-intuition #1:** the hard part isn't AI understanding the process. It's the handwritten work
orders from 20 years ago where the equipment-model field is blank.

**Scope cuts:**
- plant-wide → one line;
- all equipment → 3 critical classes;
- all faults → one scenario: *fault description in → probable causes + reference work orders out.*

**Non-goals, written on the first line of the contract:**
1. No auto-dispatch.
2. No ERP field changes.
3. No predictive maintenance.
4. No visual inspection.

**Vertical slice:** scan the equipment → retrieve historical work orders → suggest → a human confirms
and logs the result. It ran end to end before any platform work.

**Data and ontology:** there were four sources (equipment ledger, work orders, scanned manuals,
alarm logs), with four formats, four owners and three departments. Align the ontology first:
equipment, failure mode, component, repair action. Otherwise retrieval quality is luck. Aligning
exposed the dirt:
- one bearing fault written several different ways;
- the model field about 40% blank.

**POC:** the only killer risk was whether retrieval finds the right historical work orders under
this dirty data.
- First retrieval hit rate: about 30%.
- With model-number completion, synonym mapping and description normalization: about 74%. Feasible.
- **About 60% of the engineering effort went to data cleaning and synonym mapping; the model, under
  10%.**

**Permissions:** advice only. Dispatching, equipment-status changes and parts requisitions all need
a human click, because they're irreversible.

**Red line:** never fabricate repair steps. Here a fabrication isn't a wrong answer; someone climbs
into a machine. Every suggestion carries sources, and with no evidence it says so. "I don't know"
beats confident error tenfold. Untraceable claims ≤ 3%, non-negotiable. The plant manager's
question: *"if it's wrong, can I tell on the spot?"*

**UAT on the shop floor:** a technician in thick gloves, one hand on the phone, the screen half
covered in oil.
- Completion was fine, but the **edit rate was high:** masters reordered the three suggested steps
  into their own familiar sequence before acting. Editing before using means distrust.
- Fix: not a bigger model, but under each suggestion, **the two matching historical work orders**
  (which year, which machine, how long, what was done). The edit rate roughly halved.

**Gates and rollout:**
- Eval gate signed by the technical lead; UAT signed by the workshop director; production gate
  signed by equipment and IT jointly.
- Canary: one team for two weeks.
- Rollback: a "use the old process" button, rehearsed three times.
- Runbook for 3 failures: empty retrieval, ledger API timeout, obviously wrong suggestion. Each
  written as symptom/criterion/action/verification.

**Results after two months:**
- MTTR 4.2 → 2.6 h (−38%).
- The bigger win: **newcomer independence 6 → 2 weeks.** That's why the plant manager kept
  investing.

**Counter-intuition #2:** the biggest value wasn't AI replacing masters. It was capturing masters'
knowledge as something searchable before they retired. Not one of the four non-goals was done, and
that's why it launched on time.

**Pitfalls hit:**
1. Five weeks wasted trying to build a platform first.
2. Early focus on accuracy while ignoring citations.
3. Nearly skipping the pilot and going plant-wide.

**Drill:** the pilot went well, and the plant manager wants plant-wide rollout next month *plus*
auto-dispatch.
- *A. Comply.* Wrong.
- *B. Refuse everything.* Wrong.
- *D. Expand and also add predictive maintenance.* Wrong.
- *C. Expand scope, but do auto-dispatch in two steps:* first auto-*fill* the work order with human
  confirmation, run that stably for a month, then discuss auto-dispatch. **Correct.**

Manufacturing lesson: don't rush AI into replacing people. First let it keep what's in people's
heads.

## 3. Healthcare: clinical decision support

**Request:** "Assisted-diagnosis AI for the whole hospital." That sounds clear and says nothing.
Assisted diagnosis could mean differential diagnosis, medication alerts or imaging reads, three
completely different builds.

**Real pain** (two weeks of conversation): night shifts are staffed by rotating junior doctors with
no senior on site.
- 42% of night cases escalated to a senior by phone;
- 26 min average wait;
- guideline adherence 61%.

**Suitability:**
- knowledge: guidelines ✔;
- data: historical cases ✔;
- feedback loop: **none** (adoption outcomes don't flow back);
- error tolerance: **zero.** That one word reshapes everything.

**Autonomy grading:**
- L1 information only;
- L2 candidate suggestions;
- L3 conclusions;
- L4 acting for humans.

This project must stop at **L2.** The hardest part isn't the model. **It's who signs.** If the AI
suggests, a doctor adopts it and something goes wrong, the doctor is responsible. So every
suggestion must be reviewable. The AI's job is to lay out its evidence. The bar for v1 is
reviewability, not accuracy.

**Scope:**
- whole hospital → one department;
- all diseases → 3;
- "give a diagnosis" → "a ranked list of differential-diagnosis candidates with evidence, no
  conclusion."

Each extra disease isn't +1 cost: it needs new expert labeling and a new retrospective review, so 3
was the most that could be done properly. **Counter-intuition:** the feature to cut first is the
smartest one, giving the conclusion directly. It demos best and is least likely to pass acceptance.

**Non-goals:**
1. No final diagnosis.
2. No dosage calculation.
3. No imaging reads.
4. Never patient-facing.
5. Nothing written into the formal conclusion field of the medical record.

**Data:** guidelines, historical cases, lab system, medication records. They don't "know" each
other, so build the ontology first: disease, symptom, test, drug. Then the dirt:
- free-text chief complaints with a dozen phrasings each;
- lab tests with three coding schemes across three systems;
- some historical cases filed under the wrong department.

About 60% of effort went to data cleaning; model tuning under 20%.

**First red line:** no candidate diagnosis without a specific source. Retrieval misses yield "I don't
know," plus *which information is missing.*

**POC:** one question: can the real candidate ranking put the correct diagnosis in the top 3?
- 300 retrospective cases, double-blind labeled by two associate chief physicians with a third-party
  tie-breaker.
- First run: top-3 hit rate 68%. Laying out every miss showed the cause wasn't intelligence: it
  **cited outdated guideline versions,** mixing old and new recommendations.
- After making guideline versioning a hard constraint: **87%**, with the model untouched.

**Red lines as assertions:**
1. No unsourced conclusion.
2. No definitive diagnostic tone.
3. No cross-population extrapolation.

Untraceable-claim threshold: **zero.** Any unsourced claim blocks the whole output. Low confidence
means neither going silent nor answering anyway: the review step is **in the UI**, with an evidence
panel beside each candidate showing which guideline version it came from, even if the doctor never
clicks.

**UAT** with real night-shift doctors (not IT colleagues), simulating 3 a.m. with other patients
waiting. Can they understand it within 3 minutes, and would they use it?
- Round 1 adoption: **31%.** Consistent reason: "not that it's inaccurate, but I don't know *why* it
  says this," which points at transparency, not the model.
- The evidence panel moved to the first screen. Round 2: **79%**, same model.

**Gates:**
- red-line interception 100%;
- source traceability 100%;
- weekly retrospective re-test;
- experts randomly audit 20 outputs weekly.

**Canary and rollback:**
- Canary: one department, one month, **nights only** (seniors are present by day).
- Rollback: one click to no-AI mode, but all suggestion records are preserved (who saw it, when,
  adopted or not, source, guideline version).

**Runbook:**
- empty retrieval → human;
- guideline version conflict → block output;
- a doctor reports a bad suggestion → freeze for the shift, retro next day.

**Six-month results:**
- night escalations 42% → 23%;
- wait 26 → 11 min;
- guideline adherence 61% → 84%.

The client's own view of the biggest gain: junior doctors were no longer afraid of night shifts.

**Pitfalls:**
1. Treating "assisted diagnosis" as one requirement when it's a dozen.
2. Using accuracy as the launch standard when the bar is reviewability.
3. Writing human review into the plan but not into the interface.

## 4. Customer service: "AI auto-reply for 800 tickets a day"

**Request:** "Too many tickets, 800 a day. We want AI auto-reply." It contains a complaint, a number
and a solution, and no problem. The problem would be *why are there so many tickets, and where do
they get stuck?*

**Approach A (requirement executed):** confirm the stack, pull historical tickets, build a knowledge
base, connect the ticketing system, demo ten FAQs well, ship with a feature manual. After a month,
auto-reply share was **12%.** Only about 100 of 800 tickets were knowledge questions. The other 700
were "check my order status," "change my address," "where's my refund approval": actions, which
involve systems, permissions and responsibility. 12% wasn't failure; it was the true ceiling. One
question ("how many of the 800 are knowledge questions?") would have revealed it before the first
line of code.

**Approach B (problem solved):**
1. Go on-site and hand-classify 200 random tickets.
2. Find the real problem: cross-system lookup is slow, not "can't answer."
3. Split by **risk**, not technology:
   - *can look up* → retrieval + APIs;
   - *can change* → tool calls + permission control;
   - *can compensate* → human review.

   The more an action changes data or affects customers, the later it goes.
4. Vertical slice: only "order status lookup," about 260 tickets a day.
5. Define the eval set and human fallback, then launch.

Results:
- first phase covered 260 tickets a day;
- average handling time −41%;
- every privileged action human-confirmed;
- zero complaints in three months.

**The difference** isn't technical skill; the developer may be stronger. It's what was asked. One
answered *what does the client want?* The other answered *what does the client actually lack?*
Requirements can be implemented. Only problems can be solved.

## 5. Internal policy assistant: the 3:07 a.m. incident

**Context:** an internal policy and process assistant for frontline staff, about 2,000 questions a
day (company policy, expense rules, approval flows). Users had grown from 20 to 180 over six months,
and business metrics were improving. The team was solid: eval set, monitoring and feedback loop
existed.

**Timeline:**
- **16:20:** routine knowledge update. Operations uploads the new travel-expense standard and
  *replaces* the old version.
- **16:40:** vector index rebuilt automatically, with no anomaly.
- **17:00 to midnight:** new-policy questions answered correctly.
- **02:50:** an employee asks how last December's travel allowance is calculated. Cross-year
  questions follow the policy valid at the time, but the old document is gone. The system answers
  last December's question with the new policy.
- **03:07:** the employee senses something is off and asks in an internal group, where finance sees
  it: the answer is wrong, and it involves money.
- **03:40:** the screenshot goes to the finance head.
- **04:00:** the finance head calls the CEO and demands a shutdown.
- **09:00:** the system is off, and so is the phase-two expansion. A project that ran for six months
  goes back to near-demo status: re-evaluation, re-pilot, re-approval.

**The irony: no technical component ever broke.** Every step was reasonable on its own.

Root causes, all operational design rather than model capability:
1. No knowledge versioning, so the time dimension was lost.
2. No knowledge boundary.
3. No refusal on uncertainty.
4. No error grading (money treated like wording).
5. No stop condition, so the only fallback was shutdown.

It was fixed in two days, yet stayed off for two weeks, because it lacked the fallback and tracing
layers.

The follow-up drill (43 stale-document answers, 6 on money) and its answer are in
`production-readiness.md` §11.

## 6. Legal: the contract-review rescue

**State when inherited (three months in):**
- 12 accounts in the client's legal department, 4 really using it;
- the demo was great, but nobody can say what the accuracy is;
- users say "sometimes very accurate, sometimes you can't tell it's wrong";
- engineers edit prompts and ship directly with no tests;
- last month it missed a key clause, and the client circulated an internal notice;
- leadership wants a formal launch this year with 40% of budget left.

**You have two weeks and can do one thing:**
- *A. Build three new features* (contract comparison, risk highlighting, batch processing) to
  impress leadership.
- *B. Build an eval set and an eval gate,* so quality becomes a measurable number.
- *C. Push adoption* from 4 to 12 users.

**Answer: B.** The deadliest problem isn't too few features or users. **Quality isn't measurable.**
"Sometimes you can't tell it's wrong" means trust is on the verge of collapse. An eval set lets you:
1. judge whether the current state can launch at all;
2. regression-test every future prompt change;
3. talk to leadership with data instead of feelings.

With quality unmeasurable, adding features or users just multiplies the incident probability. One
more missed clause and the project is cancelled, however many features it has. B doesn't exclude A
and C, but under "one thing in two weeks," do the one that unlocks everything else.

FDE principle: **when you don't know what to do, find the problem that blocks all the others.** This
project was stuck at the pilot → production gate, and the missing item was the eval gate.

## 7. Patterns across cases

- The client's stated solution was wrong every time. The real problem was narrower and more
  valuable.
- **Data cleaning and definitions consumed about 60% of the effort;** model work was small.
- The biggest quality gains came from **sources, versions and transparency,** not bigger models.
- Adoption problems were **trust** problems, fixed in the interface.
- Every successful project kept its non-goals list intact, and that's *why* it shipped on time.
- Scope was cut on coverage (one line, one department, one ticket type) while depth stayed end to
  end.
- Every incident was operational design (versioning, boundaries, refusal, grading, stop conditions),
  not model failure.
