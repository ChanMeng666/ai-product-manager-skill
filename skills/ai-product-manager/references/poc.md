# POC: Falsify the Highest-Risk Assumption

Contents: 1) POC vs. demo · 2) Why POCs turn into demos · 3) The highest-risk assumption ·
4) Failure criteria first · 5) Technical spikes · 6) The four POC experiments · 7) A two-week
schedule · 8) The three conclusions · 9) Common mistakes · 10) Decision drill

## 1. POC vs. demo

A familiar story: a two-week demo impresses leadership, who say "good, keep going," and then
nothing happens. The project hangs, because apart from "it can be done," nothing was validated, so
nobody knows what to do next.

Rule of thumb: **if a validation concludes "fully feasible, no issues," it was probably a demo.**

A demo is a promotional video: it must look good. A POC is a medical checkup: it must find what's
wrong. One proves "it works." The other finds where it *doesn't*.

| | Demo | POC |
|---|---|---|
| Purpose | Prove it can be done | **Find the boundary where it fails** (falsification) |
| Samples | The easiest, cleanest | **Deliberately hard,** the error-prone ones |
| Runs | Once | **A batch;** pass rate and failure distribution |
| Failure | Hidden; success ends it | **Failure is the point:** it shows where the boundary is |
| First sentence | "Look, it works" | "If X fails, do we still do the project?" |

Why "validation" and not "testing"? Testing checks whether the code you wrote is correct.
Validation checks whether the idea itself holds.

## 2. Why POCs turn into demos

Pressure: leadership wants to see something, and there are two weeks. There's no time to feed hard
samples, so you show what runs. The defence is to **write the acceptance criteria before you start,
including what counts as failure, and name who signs.** Without a signer, the criteria don't exist.
You can't test brakes only on a dry straight road.

Three signs you've drifted into a demo: all samples are easy; it was run once; the conclusion lists
no weaknesses. **A POC that finds no failure points is a failed POC,** because it produced no
information.

A related failure: building the POC as a **mini version of the product**, implementing all ten
features and clicking through them in the demo. A feature-list POC proves *you can build*, not that
*the thing can succeed*. The first gives you comfort. The second gives decision-makers a basis.

## 3. The highest-risk assumption

A POC validates **one** assumption: the one that, if falsified, **kills the project**. The highest
risk is usually not the hardest technical problem. It's often mundane: data quality, permissions,
fallback logic. It gets skipped because it doesn't look like a technical highlight.

Ranking in four steps:
1. List every "if this is false, the project dies" assumption.
2. Sort by consequence: **dies**, **hurts**, or **can be optimized**.
3. Put only the "dies" one into the POC.
4. Write the rest as deferrals with return conditions.

Example:
| Assumption | Consequence | Decision |
|---|---|---|
| When 17% of real tickets lack an order number, the agent does **not** invent one | Dies (fabricated order IDs in production) | **POC** |
| The latest policy version is retrievable | Hurts | Next round |
| Response time < 2 s | Can be optimized | Deferred, not blocking |

The top item is rarely the coolest one.

## 4. Failure criteria first

**Write "what counts as failure" before writing the validation steps.** If you don't know what
failure looks like, you'll stay at "almost successful" forever. Failure criteria carry numbers:
- Wrong: "fails if results are poor."
- Right: "fails if accuracy < 85%"; "fails if the null rate is > 30% and nothing routed to a human";
  "fails if the human-intervention rate is > 40%."

Each experiment must be designed so it **can fail**, meaning it has a clear failure outcome that you
decided in advance and that can be judged directly when the run is done.

## 5. Technical spikes

Validate the highest-risk assumption efficiently with a **technical spike**: a hard time-boxed probe
that answers one question and then stops. It grows no features.

| | Spike | Regular development |
|---|---|---|
| Goal | Answer one question | Deliver a feature |
| Time box | Hard (e.g. 3 days) | Flexible |
| Code fate | Conclusions are the asset; code is usually thrown away | Code goes to main |

## 6. The four POC experiments

Each one is designed as an experiment that can fail.

**1. Data availability.** *This is the foundation and the most common cause of death.*
- Does the data exist in the systems? Do field meanings match? Do you have **permission** to read it?
- Experiment: pull 20 real records (e.g. orders) and fetch every required field.
- Failure: three or more core fields unobtainable → **stop**. Don't build anything further.
- It gets ignored because "checking data takes minutes, right?" It doesn't: one word can mean three
  different things in three systems. In the order case, all three systems had a "due date" field
  with three definitions. Until you agree what "late" means, everything downstream is wasted.

**2. End-to-end feasibility.**
- Not whether each step works, but whether the whole chain does. Steps that each score 90 can chain
  to zero; the seams are the danger. A relay team of fast runners still loses on a dropped baton.
  For example, step 1 outputs an order ID, step 2 needs a work-order ID, and nobody converts it.
- Experiment: follow 10 real cases from start to finish with no skipped steps. Record each step's
  duration and where and for how long it stalls.
- Failure: any step's stall exceeds your limit, or it needs a human to patch data to pass.

**3. Error cost.**
- What happens when it's wrong? Can the error be detected? Can it be rolled back? These are
  consequence, monitoring and remedy, and all three are needed.
- Experiment: deliberately construct edge-case and high-risk samples. In the order case: 5
  historical orders that really were late (can it flag them early?) plus 3 that *looked* late but
  weren't (does it raise false alarms?).
- Measure false-positive and false-negative rates **separately**. Mixed together they mean nothing.
  False alarms often destroy trust faster than misses. Also measure how long a planner needs to
  recognize a false alarm, because that time is the cost.
- Failure: failure modes are unpredictable, or failures can't be rolled back.
- Shortcut: list every irreversible action first and watch those hardest.

**4. Will users use it?** *The most often skipped, and the most fatal.*
- If the first three pass and users don't use it, the project still dies, and you can't find a
  technical error to blame.
- Experiment: real users use it for 1 to 2 weeks at their normal pace. You only observe and don't
  intervene. Record daily opens and the acceptance rate of suggestions. Use behavior data, not
  "do you like it?" Users are polite: they say "nice" and never open it again.
- Failure: opens below your line. Set the line from the baseline: if they used to check the systems
  N times a day and your product gets fewer, it adds no value. Low opens usually mean the alerts
  are too noisy. **Narrow the scope (tighten alert conditions). Don't retune the model; tuning can't
  fix noise.** This is a product problem, not a model problem.

## 7. A two-week schedule

- Days 1 to 3: data availability.
- Days 4 to 11: run the experiments.
- Days 12 to 14: user trial.
- The remainder: write the report.

Write the stop conditions before starting, not after.

## 8. The three conclusions (there is no fourth)

| Conclusion | Condition | Signed by |
|---|---|---|
| **Continue** (into a pilot, not a full rollout) | All four pass, and error cost is acceptable | Business owner |
| **Shrink and redo** | First three pass, adoption fails. Usually not a big technical problem | Product |
| **Stop** | Data unavailable, or error cost uncontrollable. Stopping gracefully beats grinding on for three months | Sponsor + business, jointly |

The POC report contains at least five things: how the experiments were designed, the actual data,
where it failed, which conclusion, and the evidence.

The value of a POC is often not "proving it works" but **proving it doesn't, at minimum cost.** The
ordering: *early failure < late failure < "no failure but misdirected investment."*

A worked ledger: a POC falsified "won't fabricate missing order numbers" within a five-day spike.
On the surface that's failure. In reality it's a win. Without the POC, the team signs a 3M contract
on demo impressions, production fabricates order IDs, and complaints, compensation and broken trust
follow. With the POC, the root cause is traced to the data source, and "data governance first"
becomes the roadmap, which leaves the client trusting you *more*.

## 9. Common mistakes

1. No pre-agreed criteria. Defining success halfway through guarantees endless dispute.
2. Watching without recording. Everyone stares at the screen, and afterwards nobody can quote a
   number.
3. Ending with only a demo video. A video is a souvenir, not a conclusion.
4. **Cleaning the bad data so the demo looks good.** This is the reddest flag of all (see the drill).
5. Time box expires and the decision is "let's watch a bit longer." When the box ends, decide.

## 10. Decision drill

You're the FDE on the POC above. The tech lead says: "For the demo, let's hand-clean the 17% of
samples missing order numbers. Accuracy reaches 90%, and it's an easy pass."
- **A. Agree.** Wrong. You'd personally hide the highest-risk assumption. The prettier the demo, the
  harder it explodes at scale.
- **B. Refuse; make "no fabrication on missing order numbers" the highest-risk assumption and test
  exactly that.** Correct. The highest risk must be hit with the dirtiest reality.
- **C. Both: a cleaned demo externally, raw results internally.** This is boiling the frog slowly.
  Decision-makers still see "it works," and the risk still reaches production.

**Any "clean up the bad data so the demo looks better" is a POC red flag. A POC validates reality;
it doesn't put makeup on it.**

Five lines to memorize:
1. A POC exists to falsify.
2. Failure criteria come before actions.
3. Highest risk ≠ hardest. It means "falsified = dead."
4. Evidence must be measurable, not retold.
5. When the time box ends, decide. There is no "let's see."

Deliverable: `templates/poc-proof-plan.md`, covering highest-risk assumption, failure criteria,
validation actions, evidence level and time box. If any of the five is missing, it isn't done.
