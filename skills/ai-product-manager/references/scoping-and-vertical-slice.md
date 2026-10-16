# Scoping, MVP and the Vertical Slice

Contents: 1) Why "complete" kills · 2) The three forces that regrow scope · 3) Coverage vs. depth
vs. quality · 4) Minimum viable deployment: three rules · 5) Horizontal vs. vertical slicing ·
6) The four layers of a slice · 7) Four self-test questions · 8) Slicing in five steps ·
9) Deferrals with return conditions · 10) Exit criteria · 11) Scaling after the slice works

## 1. Why "complete" kills

A common error that nobody admits to is **making the project complete.** Every feature exists, the
UI is finished, every module demos well, and the project dies. You built a system that does
everything at 30% instead of one thing at 90%. Enterprises don't pay for 30%.

A big-bang build fails on three counts. It is slow to validate (three months before first
feedback, by which time requirements, the boss and the team have all changed). Errors are
expensive (tightly coupled modules mean nobody dares touch anything). And it never wins real
adoption (users must understand the whole system before any part helps them). It is also the most
seductive option, because it *looks* right: bosses like full screens, teams like impressive tech,
clients feel they bought the whole package. Yet nobody can say which part actually saves time.

A small slice gets one round of validation every two weeks, or six rounds in three months, each
closer to the truth. A big build gets one round that decides life or death. In a fast-moving field,
iteration speed is the competitive advantage.

## 2. The three forces that regrow scope

"Let's do an MVP first and expand once it works" is the right sentence. But once work begins, scope
grows back, pushed by three well-meaning forces:
1. **The client's completeness instinct:** "it's just one more feature, let's include it." Each
   "just one" is genuine, and together they triple the validation period.
2. **The team's perfectionism:** "it's too rough to launch, what will people think?" So you apply
   production engineering standards to something not yet validated.
3. **Sales' contract path:** "the contract lists these features; acceptance fails if they aren't
   built." The acceptance criteria lock in a feature list, not a business metric.

Rule of thumb: **a six-month "minimum" validation almost always grows back into a big project.**
Measure validation cycles in **weeks**, not months. The point isn't speed for its own sake. It makes
trade-offs unavoidable. Slowness is itself a way to die: within six months you will almost certainly
face a budget review and a personnel change, and either one can end the project.

## 3. Coverage vs. depth vs. quality

Scope has more than one dimension:

| Dimension | Meaning | Can you cut it? |
|---|---|---|
| **Coverage** | How many scenarios, ticket types, users, plants | **Yes, cut hard.** Fewer scenarios keep the same or higher value density |
| **Depth** | How far a single chain goes end to end | **No.** Without a closed loop users still work by hand, and value can't be measured |
| **Quality** | Reliability of outputs | **No,** because unreliable means zero trust. But human review can backstop it |

**A case of cutting the wrong dimension.** A group customer-service assistant had an original scope
of 12 ticket types, 5 channels and 3 languages. The "MVP" cut to 4 ticket types (correct) *and* to
Q&A only, deferring routing and QA to phase two (wrong). Six weeks later it delivered 76% accuracy
on Q&A for 4 types. The business said, "our own knowledge base can do this." The project entered
**"ongoing" status**: not dead, not alive, handed down in quarterly reports year after year. Such
projects share three traits: no deadline, no metric, no referee.

Why do teams cut depth instead of coverage? Depth isn't on the feature list, so nobody signs for
it. And teams treat validation as a shrunk production system, so they build permission frameworks,
multi-tenancy and configurability, which are all sunk cost during validation. **More than half of
validation-stage solutions get overturned and rewritten,** so any investment in "easy to extend
later" has negative expected return. The only selection criterion during validation is *fast*.

**The right cut** for that case: only the returns/exchanges ticket type, but fully end to end and
unattended, from the user's question to generating the work order, writing it into the system and
notifying the customer. Once one type's loop closes, you won't need to sell the next one. The
business will ask when you're doing the next type.

## 4. Minimum viable deployment (MVD): three hard rules

Not MVP, but **MVD**. An MVP cares about making a small product. An MVD cares about **one real
occurrence of value.** Breaking any of these rules makes your validation conclusion untrustworthy:

1. **Real data, no exceptions.** The client brings their own real business data. Validation on
   anonymized samples or synthetic data is the first brick of a validation graveyard. Real data
   holds every devil: field meanings that don't match the docs, 30% nulls, coding rules from three
   years ago, and data that records a *wrong process*. A company that used its own support agent
   internally for a year found its biggest trap: two contradictory answers, each "correct" in its
   context, coexisting in the data. The agent tried to reconcile them, or invented something. They
   ended up consolidating 600+ internal data flows into a single source of truth with one
   authoritative answer per question. Architects may demo on sample data. **Forward-deployed
   engineers write code on the client's infrastructure with the client's real data.**
2. **Shrink scope, never value.** Cut coverage, not depth. The cut must be small enough that value
   density is visibly high, high enough that the business spreads the word for you.
3. **Fix the deadline to force trade-offs.** Measure in weeks. Anything that can't show value within
   those weeks isn't core value yet.

## 5. Horizontal vs. vertical slicing

**Horizontal (by layer):** build the data layer, then retrieval, then the application, then an
admin console. It sounds well engineered. The symptom: every module demos well alone, but
together nothing runs end to end. The business asks, *"So which job can it finish for me?"* and the
answer is none. The progress chart says 99%. Real progress is zero, because no single scenario can
be completed.

Why: each layer is built "for the next layer" without knowing what the next layer needs, so each
builds *generic capability*, and generic capability is never enough for any specific scenario. The
scenario needs "check three policies, then decide refund or no refund." Generic capability offers
"I can look it up for you." The gap between them is the gap between deliverable and not.

**Vertical (by scenario):** cut through all layers to open one complete chain. The chain is narrow,
but fully usable from input to output.

> Horizontal result: "We connected the data pipeline." It makes people nod.
> Vertical result: "Zhang no longer has to merge those four spreadsheets by hand." It makes people pay.

## 6. The four layers of a vertical slice

| Layer | Horizontal approach | Vertical approach |
|---|---|---|
| **Data** | Connect every source; full data governance | Only the minimum dataset for this one scenario. Full governance during validation is pure liability: three months governing data when the scenario needs four fields |
| **Logic** | A generic capability platform | Only this scenario's decision chain |
| **Interaction** | A complete new admin console | **Inside tools users already use:** spreadsheets, email, chat. A new console adds a login, and that alone can drive usage to zero within two weeks. Go to where they are; don't make them come to you |
| **Fallback** | "Later" | **Defined from the start:** who takes over on error, how to revert. Fallback is the trust switch. Without it, the first error makes a user quit permanently |

A vertical slice isn't doing less. It puts all the effort you saved into a single chain, and pushes
it all the way through.

Defining a vertical slice: choose a scenario that is **real, complete, and high-frequency**, and
run it end to end. *Real*: nothing faked. *Complete*: no broken link. *High-frequency*: used again
and again. One genuine occurrence of a real user getting a real result with it is what makes the
slice stand.

## 7. Four self-test questions

1. **After this slice runs, how does a specific person's work change today?** If you can name the
   person and the step they no longer do, the cut is right. If all you can say is "we connected the
   pipeline," it's wrong.
2. **Is any layer of the chain fake?** Fake means synthetic data, hard-coded retrieval, a fallback of
   "later," or a **final step where a human copies and pastes the result into another system.**
   That last one is the most common fake layer. If it's present, the slice is not through.
3. **If it answers wrong, what happens, and who notices first?** No answer means your fallback layer
   is empty.
4. **How many times a month does this scenario occur?** "Once or twice" means value density is too
   low. Pick another scenario.

If two of the four can't be answered at a scope review, the scope must not start.

## 8. Slicing in five steps

1. **List scenarios, not features.** Q&A, search, generation, reports and routing are capabilities,
   not scenarios. Write each scenario as *who / in what situation / must accomplish what*, for
   example "Support agent Zhang, on receiving a return request, must decide whether it meets policy
   and create a work order." Rewriting a 12-item feature list this way often reveals it serves only
   five scenarios, and that several features are the same action requested twice by different
   people. That is the typical bloat of requirement lists.
2. **Score each scenario's opportunity on frequency, unit cost (time and money per manual
   instance), and data availability.** Teams tend to score everything high, which separates nothing.
   Score only frequency and unit cost first. They have objective data and are hard to fool yourself
   on.
3. **Pick the highest score, not the one that demos best.** Teams instinctively pick the scenario
   with the best demo effect, which is often not the most valuable one.
4. **Write all four layers for the chosen scenario:** minimum dataset, decision chain, which existing
   tool it lives in, who takes over on error. Four lines filled in give the slice its shape.
5. **Write every other scenario as a deferral with a return condition** (next section).

The result is one page, the skeleton of your MVP scope contract.

## 9. Deferrals with return conditions

Never write "phase two." Write:

> **Not in this phase: X. Reason: Y. Enters the next phase when: Z.**

Example: *"Not in this phase: multi-language. Reason: non-Chinese tickets are under 3% of volume.
Enters the next phase when non-Chinese tickets exceed 10%."*

Vague promises become arguments at acceptance. Conditional deferrals become consensus. This is the
most valuable page of the scope contract.

## 10. Exit criteria: every validation needs a way out

A validation without an exit becomes a zombie in "ongoing" status: it can't be declared a failure,
and nobody dares invest more. At kickoff, write: **after how many weeks, which metric, what value →
the project graduates into paid deployment. If not met, both sides part ways gracefully.**

Bad wording: "significantly improve efficiency," "improve user experience," "to the business's
satisfaction." By week six anyone can call any of these met.

Template:
> By the end of week 2, the human-intervention rate on returns/exchanges tickets falls from 100% to
> below 30%, on a sample of at least 200 tickets → enter paid deployment. If not met, both parties
> end the engagement gracefully; deliverables and data assets belong to the client.

Required elements: **time, metric, value, sample size, and ownership after failure.** Miss one and
someone will reinterpret the sentence in a later meeting.

Three exits after graduation:
- **Scale:** metric met, and the business asks to expand. Enter paid deployment and pay back the
  validation-stage debt.
- **Adjust:** partly met, or a more valuable scenario discovered. Cut a new slice and run another
  round, still measured in weeks.
- **Part ways:** metric not met, for reasons other than execution. Turn the rejection into a
  roadmap.

**An honest failed validation is worth far more than an "ongoing" project.** It produces a report
that rules out a wrong battlefield, plus reusable data and integration assets.

## 11. Scaling after the slice works

Publicly disclosed enterprise deployments often scale in **jumps, not increments**: a few days of
hands-on validation, then a multi-year contract, or a ten-store pilot followed by thousands of
stores within months. The jump happens because the client has already *seen* value. Trust is
resolved early, and what remains is commercial process. Without one real occurrence of value, you
must push a 4,000-store rollout with slides and promises, which is the slowest and most failure-prone
path. In enterprise terms: win one business unit, plant or region, then use its usage data to knock
on headquarters' door.

Pick the first pilot sites to be **representative, not easiest.** You must prove it works even in
the hardest store. Honest caveat: this only works if the slice was really through. Scaling a 76%
Q&A box from 10 stores to 4,000 just copies the problem 400 times.

**Decision drill.** A returns-only slice works: at the end of week 2, the human-intervention rate
has dropped from 100% to 28% on 240 tickets, so it graduates. The client says: "Great. Next phase,
let's do all 11 remaining ticket types at once and save on separate acceptance rounds. Budget and
people are there."
- *A. Agree to all 12.* Wrong. This turns the vertical slice back into horizontal coverage, at about
  60 points on each of 11 chains. The moment of value that made the client pay won't happen a second
  time, and if it isn't finished, there's no point at which graduation can be judged.
- *B. Refuse; insist on one type at a time.* Right direction, but it only says no. You must also
  give a path.
- *C. Agree, but also pay back the validation debt.* The most dangerous option because it looks like
  it has everything. Paying debt (permissions, eval sets, monitoring and alerting) and expanding
  coverage slow each other down. Each debt item needs stable downstream scenarios before it can be
  fixed, so building them while adding 11 types means rework by week three.
- *D. Pick the next highest-value scenario, add only that one, pay back the debt in parallel, and set
  new graduation criteria.* Correct. It protects value density, reliability and decidability. New
  criteria, because the scenario changed, so metrics, sample size and baseline must be recomputed.
  Reusing old criteria is where many second phases lose control.

Principle: **scale the number of slices, not the width of one slice.** Each added slice produces one
more occurrence of value and renews trust. Adding eleven at once bets on a future where "it will all
work someday," and that future usually doesn't come. Coverage is not value. Enterprises pay for one
concrete occurrence of value, down to the person.
