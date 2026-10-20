# Evaluation: From a Score to a Verdict

Contents: 1) Why one-dimensional evals fail · 2) The four-layer eval matrix · 3) Golden sets ·
4) Eval tiers · 5) Error analysis first · 6) Tool correctness and groundedness · 7) Thresholds and
red lines · 8) LLM-as-judge done right · 9) The "95% accuracy" traps · 10) Four launch thresholds ·
11) Eval vs. UAT vs. pilot · 12) UAT done right · 13) Pilot done right · 14) Building an eval set
from zero

## 1. Why one-dimensional evals fail

A project's eval report says "overall 92." The demo goes smoothly and the business says "this is
the one." On day three after launch it's urgently halted. The 92 proved it did fine on the questions
*we chose.* It proved nothing about three things decision-makers actually care about: is it stable
when real data is dirty, does every statement have a source, and will users actually use it?

Most teams do evaluate. They run a one-dimensional eval (one sample batch, one accuracy number) and
let that dimension stand in for all the others:
1. The samples were hand-picked, so dirty data never entered.
2. Only the final answer's resemblance is checked, so fabrication is invisible.
3. A wrong date and a fabricated order ID each lose one point.
4. Nobody knows how many people a score of 89 saves.

**Evals produce verdicts, not scores.** When someone asks "can this agent launch?", don't answer
with a number. Ask: which four layers did you evaluate, what kind of evidence is it, and who signed
the red lines?

## 2. The four-layer eval matrix

| Layer | Question | Evidence method |
|---|---|---|
| **Model quality** | Is it right? Is it grounded? | Automated runs on the eval set |
| **System reliability** | Does it hold under load? How does it degrade when parts fail? | Load tests + fault injection |
| **User adoption** | Do users actually use it? | UAT + telemetry |
| **Business value** | Is it worth further investment? | Pilot before/after comparison against the baseline |

Don't expect one kind of evidence to answer four questions. Many teams die in layers 2 and 3:
answers are right but so slow nobody waits, or right but users don't trust them and rewrite
everything before sending. Accuracy never measures either.

## 3. Golden sets

The foundation of evaluation is the **golden set**, which has three properties:
1. **Represents the real distribution** (sampled from production logs or real records, not
   invented).
2. **Has reference answers** (labeled by domain experts).
3. **Is reproducible:** lock the model version, prompt version and knowledge-base snapshot.
   Otherwise, when last month's 89 becomes this month's 76, you can't tell whether things got better
   or worse.

No real data yet? Sample production logs and hand-label **30** to start. Thirty from the real
distribution beat 300 smooth invented ones. For agents, 20 to 50 simple tasks drawn from real
failures are a good start. A good task is one where two experts would agree on pass or fail.

**Who labels:** appoint one domain expert as the final quality authority (a "benevolent dictator"),
so the standard doesn't drift across a committee. For high-stakes domains, use dual independent
labeling with a third-party tie-breaker. In the clinical case, two associate chief physicians
labeled 300 retrospective cases blind, and that set became the yardstick for the whole project.

**Keep the golden set out of the system's reach.** If agent conclusions flow back into the
knowledge base or eval set they're judged against, the metric becomes self-confirming. Reference
data is read-only to the agent; new cases arrive through human curation.

Synthetic data is acceptable only to fill coverage gaps. Build it from explicit dimensions
(intent × persona × difficulty), not free-form generation. It is unreliable in specialized or
high-stakes domains.

## 4. Eval tiers (allocate by production ratio, not evenly)

| Tier | Tests | Examples |
|---|---|---|
| **Functional** | Normal requests | "Where is my order?" |
| **Edge** | Thresholds, missing fields, ambiguity | 17% of real tickets lack an order number |
| **Adversarial** | People deliberately pushing it | Prompt injection, out-of-scope requests, contradictory instructions |

Also tag by **risk** (read-only vs. write-back) and by **segment** (key accounts vs. long tail).
**Incidents almost never happen in the functional tier.** If 17% of real tickets lack order numbers
and your eval set has none, you'll never learn that this agent fills in a plausible-looking order
number at exactly that moment. A test set without long-tail samples can't serve as a basis for
launch.

Two kinds of suites:
- **Capability evals** start at a low pass rate and measure progress on hard tasks.
- **Regression evals** stay near 100% and guard against backsliding. Saturated capability evals
  graduate into the regression suite.

Balance cases where a behavior *should* occur against cases where it *should not* (e.g. should
escalate vs. should not escalate), or you'll optimize one side only.

## 5. Error analysis first

Before writing evaluators, read outputs. This is the most reliable practice in the public eval
literature (see `industry-evidence.md`):
- After every significant change, read 20 to 50 real outputs or traces yourself. The PM should do
  this personally, not outsource it.
- **Open coding:** write a free-form note on what went wrong in each trace. **Axial coding:** cluster
  the notes into a failure taxonomy. Stop when new traces reveal no new failure modes.
- In long agent traces, label the **first upstream failure**. Later errors are often consequences.
- Write evaluators for **observed** failure modes, not imagined ones. Don't draft a rubric before
  looking at data. Criteria drift as you read ("criteria drift" is normal; expect it).
- Prefer **binary pass/fail per failure mode** over 1 to 5 scales. It forces decisions and improves
  agreement. Report per-check pass rates plus a "pass-all" rate. Avoid weighted composite scores.
- A 100% pass rate means the eval is saturated, not that the product is perfect.
- Re-sample fresh production traces every 2 to 4 weeks, and feed new production failures into the
  regression set. Every incident becomes a test case.

## 6. Tool correctness and groundedness

**Tool correctness:** evaluate what the agent did in the middle, not only its final reply. Did it
pick the right tool? Were the parameters right? Did it spin in loops to look busy? Grading only the
final message will pass a run that "failed three tool calls and then gracefully made something up."

For agents, also grade the **outcome state**, not just the agent's claim. "The reservation exists in
the database" is an outcome. "The agent said it booked" is not.

**Specify forbidden events, not only the expected outcome.** A case passes only if the run also
didn't skip an approval, write before reading, or retry a send. Add **false-success cases** (the run
ends one step short of done, and the agent must say so) and requests that span two capabilities.
Fixtures carry the starting permissions and approval records; a transcript alone can't reproduce a
decision.

**Groundedness:** does every claim have a source? It is the only cure for fabrication. Users don't
mind "I don't know"; that wastes ten seconds. They mind confident claims without sources, because
those lead to wrong decisions.

Make both automatically checkable:
- Force outputs to carry a `source_id` for every factual claim.
- If retrieval finds nothing, answer "I don't know," and say which information is missing.
- Track the **untraceable-claim ratio** (claims with no valid source ÷ all claims).

Now evaluation moves from manual spot checks to a check that runs every day, wired into CI. Every
prompt edit, model swap or knowledge update re-runs automatically and blocks on regression.
Manual-only evals will be skipped by the third change.

For RAG, evaluate retrieval separately first (recall@k, MRR on labeled queries), then generation
(context relevance, faithfulness, answer relevance). If retrieval is wrong, generation can't be
right.

## 7. Thresholds and red lines

The most contaminated part of evaluation isn't the samples. **It's the threshold.** Running the eval
and then drawing a "reasonable" line is curve fitting, not an acceptance standard. The order is:
**write the thresholds, assign who may sign or relax them, then run.**

Keep at least **one red line that can never be relaxed,** usually fabrication or overreach. Without
any red line, thresholds erode under deadline pressure until none holds.

Write red lines as **assertions a program can judge yes or no**, not principles. Principles can't be
tested; assertions can. Clinical example:
1. No conclusion without a source.
2. No diagnosis stated in a definitive tone.
3. No extrapolation across populations (an adult protocol must not be applied to children).

Thresholds follow the error cost. In the maintenance case, the untraceable-claim ratio had to stay
≤ 3%. In the clinical case it was **zero:** one unsourced claim blocks the entire output.

Threshold card format (see `templates/eval-plan.md`): metric, slice, sample size, pass line, who
signs, who may relax it (or "nobody" for a red line), and what happens on failure.

## 8. LLM-as-judge done right

- Use **one focused judge per failure mode** with a binary verdict. Don't use one judge for "overall
  quality."
- **Validate the judge against human labels.** Measure true-positive and true-negative rates on a
  held-out labeled set (on the order of 100+ examples per failure mode, with both passes and fails),
  and keep the test split untouched until the end.
- Known biases: position bias (prefers the first or second answer), verbosity bias (prefers longer
  answers), and self-preference (rates its own model family higher). Mitigate by swapping order and
  counting a win only if it holds both ways, and by preferring a different model family as judge.
- Ask for the **critique before the verdict.** Verdict-first invites after-the-fact justification.
- Strip source cues (model names, telltale formatting) from candidates. A judge never grades
  candidates it generated.
- **A judge that picks the best of N is an optimizer.** The system drifts toward whatever the judge
  likes, so validate it before it selects, and audit a sample of its picks against humans.
- **Re-check agreement on fresh labels on a schedule,** and retire a judge whose agreement drops.
  For high-stakes calls, use two judges from different model families and send disagreements to a
  human.
- Generic metrics (helpfulness scores, ROUGE, BERTScore) are poor quality measures. At most they help
  you *find* traces worth reading.
- Don't use slow LLM judges as synchronous guardrails. Inline guardrails should be fast
  (schema checks, regex, light classifiers). Judges run asynchronously.

## 9. The "95% accuracy" traps

"We ran the test set and got 95%." Then the room goes quiet for two seconds and someone says, "So we
can launch?" Before nodding, check three traps:

1. **The denominator.** Accuracy is an exam score, and we wrote the exam. Where did the 1,000 test
   items come from: random production traffic, or the team brainstorming? **Who judged
   correctness?** If the prompt author judged their own outputs, that's self-certification, not
   evaluation. Worst of all is using the model's previous output as the reference answer and
   comparing a revised version against it, which yields an easy 98% that proves nothing. In the
   order case, 400 of 1,000 items were "where's my order?" queries the model almost never misses.
   They quietly lifted the overall score by more than ten points and diluted the 200 hard items.
2. **The average hides the long tail.** 95% is a volume-weighted mix. Broken down: simple queries
   99%, routine changes 92%, but complex cross-system inventory and delivery-commitment cases, the
   ones that decide whether the system is worth anything, only **64%**. Those were 8% of request
   volume but more than 70% of manual handling time. The average is the most deceptive statistic
   there is.
3. **No control group.** 95% compared to what? If veteran staff score 97%, launching *degrades*
   quality. If a rules-and-workflow solution scores 88%, you must justify the extra 7 points
   against the inference cost.

The four questions to ask in the meeting:
1. Where did the test set come from, who judged it, and was model output used as the reference?
2. Broken down by scenario, what is the **worst slice**? Don't give me the total; give me the worst
   cell.
3. What do humans score today, and what does a rules baseline score? Is 95 progress or regression?
4. **If it's wrong, who notices first, how fast, and how is it contained?**

Accuracy answers "is the model good?" Launch must answer "once this system is inside the real
business, will something go wrong?" Those are two different questions.

## 10. Four launch thresholds (beyond accuracy)

1. **Layered metrics.** Never look at one total. Layer by scenario (separate metrics and pass lines
   per request type; simple high-volume ones might need 98%, while a critical one at 80% still gets
   watched on its own), by customer segment (key accounts have different tolerance), and by risk
   (read-only vs. write-back are judged by different standards). After layering you will almost
   always find two or three failing cells under a pretty total, and those cells decide launch.
2. **Asymmetric error cost.** The same single error can differ 1,000×. A suggestion a human glances
   at and rejects is an experience problem. A due date auto-changed and synced to the customer is an
   incident. Don't chase zero errors. **Grade errors:** which are tolerable, which must be blocked,
   which need a second human confirmation.
3. **Recoverability.** If it's wrong, does anyone notice? How fast? At what cost to fix? A system
   with human review and a fully automatic system nobody watches can share an accuracy number and
   differ by three orders of magnitude in risk. **An 85% system with reliable fallback is often more
   launchable than a 95% system running naked.**
4. **Consistency.** This is unique to AI. The same question with the same context, asked twice, gets
   different answers. Accuracy can't see it (each answer may be right), but users lose trust
   instantly. Test it: run the same inputs 3 to 5 times and measure the agreement rate and variance
   of key fields. Then perturb (rephrase, add irrelevant info, reorder) and check whether the
   conclusion drifts. For customer-facing critical flows, report **pass^k**: the probability that
   *all* k trials succeed. At 75% per trial, pass^3 is only about 42%.

Before and after: "intent recognition ≥ 90%" (a wish) became a three-tier criteria table plus a
fallback (a plan). See the risk-tiered table in `solution-selection.md` §4.

## 11. Eval vs. UAT vs. pilot

Three terms mixed in every meeting. The consequences: things that should be done aren't, things
already done get redone, and a careful eval gets dismissed with one "this isn't what I wanted."

**Eval looks at scores, UAT at signatures, pilot at behavior.**

| | Model eval | User acceptance test (UAT) | Pilot |
|---|---|---|---|
| Where | Offline | Pre-production, real business cases | Production, real traffic |
| When | Continuously; many times a day | Once, before launch | After UAT, before scale |
| Judge | Reference answers / rules | **The business users** who own the work | **Real users' behavior:** they vote with their feet |
| Question | Is this version better or worse than the last? | Can this be handed over into the real process? | Do people really use it? Should we scale? |
| Output | Eval report (tiered results + version comparison) | **Signed** acceptance checklist | Behavior data from the pilot period |
| Failure means | Iterate the model or prompt | Revisit requirements | Possibly rethink whether the scenario is worth it |

**Eval decides whether to keep iterating. UAT decides whether it can be delivered. Pilot decides
whether to scale.** They address three uncertainties (does the tech work, does the business accept
it, do users use it) and can't substitute for each other. Ask in the meeting: *who is the judge for
this?*

Three common mix-ups:
1. **Eval used as acceptance.** "All scores pass, ship it." Scores are technical. Business acceptance
   is the delivery standard, and someone must translate between them. Fix: translate each metric
   into what it means for the business and agree on the line together. An eval that gave a polite,
   well-worded reply with a delivery date wrong by three days might still score 80% on text
   similarity. For the business it's a total error.
2. **UAT used as pilot.** "UAT signed, open it to everyone." UAT runs in an idealized setting:
   pre-picked cases, cooperative people, plenty of time. Real life brings dirty data, extreme
   phrasing, and unforeseen combinations. The pilot exists to catch those, within a controlled blast
   radius.
3. **A pilot that is really a demo.** Picking the 10 most cooperative users, running two weeks and
   declaring success is not a pilot. A real pilot samples users **randomly**, sets metrics **in
   advance**, and is **allowed to fail**.

## 12. UAT done right

The failure: UAT passes, everyone signs and celebrates, and three months later nobody uses it ("we
still prefer the old way"). Most teams run UAT as a second eval with the same people, same mindset
and same question types, just with a user clicking the mouse.

- **Eval: we test with tasks we constructed. UAT: users test with their own real tasks.** Evals need
  scripts to be reproducible. **UAT must have no script.** Hand users a script and they follow it to
  all-green, and that's a demo. Real signals hide where you didn't prompt: where they paused, how
  many things they edited, whether they abandoned the task.
- Collect **5 to 8+ real tasks** from users, covering three kinds: the most routine (is it worth
  replacing the current way?), the most painful process (does it collapse on dirty data?), and
  cross-system tasks (does it make you switch windows?).
- Pick at least three user types: daily heavy users, **skeptics**, and complete newcomers. Skeptics'
  feedback is often worth ten times the praise.
- Observe and record only three things: **stall points, edits, abandonment.**
- Metrics, captured by telemetry rather than surveys (users misremember and are polite):
  - **Completion rate.**
  - **Edit rate.** If users edit before using, they don't trust it. If they must change four things
    before daring to send, it didn't save time. It added a proofreading job. Completion can be 100%
    and the product has still failed.
  - **Abandonment rate.** One stall, a user blames themselves. Three, they return to the old way and
    never come back. That isn't a UX problem; it means this scenario shouldn't be AI.

  Edit rate and abandonment predict abandonment of the product earlier than any accuracy number.
- Write acceptance criteria in **business language** users can judge: "can I click fewer times?",
  "would I dare send this directly?" Example: "for 100 real orders, the system's delivery date
  matches the manual calculation ≥ 95%, and **zero** dates are later than the committed date."
- Checklist columns: business requirement | pass/fail | **signer (a person's name, not a role)**.
  With "business owner" as a role, three people show up, each assuming the other two checked.
- Decide in advance where each failure type goes back to: wrong task → back to discovery; scope too
  wide → back to the minimum version; model weak → back to eval. These three fixes differ about 10×
  in cost.
- Passing UAT is not full rollout. It opens the second gate only; production gates, shadow mode and
  canary release follow. The UAT report states the next step, who signs, and how long to observe.
- Hold the line: don't release until every must-pass item is signed. A week's delay beats launching
  with unsigned items.

## 13. Pilot done right

- **Random** users, a bounded scope (e.g. two regions' sales teams), a fixed period (e.g. four
  weeks), and pass/shrink/extend/stop branches written **before** it starts.
- Watch four numbers: **adoption rate, human-takeover rate, rollback rate, bypass rate** (share of
  users routing around the system).
- The **human-takeover rate** is the truth serum. The system "handled 1,000 items," but 400 were
  redone by humans. It separates "looks like it's running" from "really in use."
- Observe, don't judge. Don't attach performance targets to staff during the pilot, or the data turns
  into a display of cooperation.
- The pilot's risk is usually people, not technology: not using it, routing around it, not trusting
  it, or using it but ignoring its suggestions. None of these show up in a bug list, and each can
  sink a pilot.

## 14. Building an eval set from zero (three weeks)

- Week 1: hand-curate **50** real Q&A pairs or tasks as a seed set.
- Week 2: run a baseline and find the lowest-scoring scenarios.
- Week 3: add targeted items up to **100 to 120.**

Don't start by chasing 500 items. That's procrastination, not eval building.
