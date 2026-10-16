# Lifecycle, Maturity Levels and Gates

Contents: 1) Why order matters · 2) The seven stages · 3) The four gates · 4) Demo / POC / Pilot /
Production · 5) Grading a project by evidence · 6) The three responsibility lines · 7) Continue,
shrink or stop · 8) How to tell leadership "stop" · 9) The FDE eight-step workflow

## 1. Why order matters: the cost of late discovery

An AI project has essentially one correct order, and it's sorted by **cost of correction, from low
to high**, not by workload. Most projects fail not because one step was done badly but because the
steps were out of order.

Why the order goes wrong:
1. Technology is visible and business work isn't, so teams do the visible part first.
2. Demos look like progress. Baselines and hypotheses look like nothing.

The same wrong belief, discovered at different stages:

| Discovered at | Cost |
|---|---|
| Problem discovery | Rewrite one page (1×) |
| POC / evaluation | Redo the solution and test set (≈10×) |
| Production | Business damage, lost trust, large-scale rework (≥100×) |

The same defect: found in a POC, fixed in an afternoon. In a pilot, two weeks. In production, an
external incident plus a retro. So the first move on any AI request is **measuring the baseline, not
building architecture.** Architecture answers *how*. The baseline answers *whether*.

The first cause of death for enterprise AI projects isn't weak technology. **It's doing the right
thing at the wrong time.** Stage judgment is the most basic engineering judgment.

## 2. The seven stages

| # | Stage | Sole outputs |
|---|---|---|
| 1 | **Problem discovery** | What the problem is, and today's numbers (baseline). No baseline, nothing else |
| 2 | **Boundary definition** | A PRD whose core is: **non-goals, success metrics, stop conditions** |
| 3 | **Design and selection** | Rules / RAG / workflow / agent / human, and why. Data, permissions, integration |
| 4 | **POC** | One specific hypothesis validated: one point, pierced all the way through as a vertical slice |
| 5 | **Evaluation** | Metrics and a tiered test set: normal, edge, high-risk, long tail. No long tail, no launch basis |
| 6 | **Pilot** | Real business, controlled scope and blast radius. The risk is people: not using it, bypassing it, not trusting it, using it but not following suggestions |
| 7 | **Production operations** | Launch is the start: metric monitoring, feedback loop, cost operations |

## 3. The four gates

A gate is **not an approval ritual.** It turns one judgment into one piece of evidence. Valid gate
evidence states four things: **on which samples, which metric, what level passes, and what happens
if it doesn't.**

| Gate | Pass conditions | Prevents |
|---|---|---|
| **G1, before POC** | Problem clearly defined; scope contains a non-goals list; success metric measurable | Building lots of features without knowing what you're trying to prove |
| **G2, before evaluation** | A runnable vertical slice exists; high-risk hypotheses listed and ranked | A solution built on unverified assumptions |
| **G3, before pilot** | Test-set pass rate meets the line; high-risk samples have fallback strategies; rollback possible | Carrying known defects into the real business |
| **G4, before production** | Business metric moved; adoption meets target; SLA and contingency plan ready | Technically working, but nobody uses it and nobody owns incidents |

Every gate answers the same question: **on what basis do we proceed?** All four gates together
should fit on **one page.** If they don't, the judgment isn't clear yet.

**The value of a gate isn't stopping projects. It makes "don't continue" a dignified, evidence-based
decision.** Teams fail at this not because they're afraid to stop, but because they never wrote the
criteria in advance. Stop conditions written after work begins get held hostage by the time already
invested.

Named signers (from the launch-readiness practice):
- **Eval gate:** signed by the technical lead.
- **Acceptance gate:** signed by the business owner.
- **Production gate:** signed jointly by operations and the business.

A gate without a named signer is just a reminder list.

## 4. Demo / POC / Pilot / Production: four questions, not a progress bar

These are **maturity levels**, measured not by difficulty but by **how much real consequence you
dare let it bear.**

| Level | Answers | Data / path / users | Cost of failure |
|---|---|---|---|
| **Demo** | Roughly what does this look like? Is it technically possible? | Data we picked, path we set. A communication tool, not an engineering stage | None. Finding infeasibility here is the cheapest success |
| **POC** | Does the riskiest layer hold? | Still our conditions. Validates **one** risk hypothesis, not product completeness | Low. It's *supposed* to be allowed to fail; a failed POC is a risk removed early |
| **Pilot** | Does it hold in real users' hands? | Users' own tasks, real traffic, limited scope and population, **rollback switch at hand** | Medium but controlled. The main risk shifts from tech to people |
| **Production** | Can it become part of the process? | Owned budget, on-call, SLOs, a way back | High; it's in the business chain. The core question is what happens when it loses control, not what more it can do |

**The most confused pair is POC and pilot.** Many teams go straight from POC to production. A POC
holds under *our* arrangements: our data, our path, invited users. POC → pilot adds **reality** (real
data, process, consequences). Pilot → production adds **governance**: gates, canary releases,
rollback, monitoring, on-call, budget. These two transitions together usually take longer than
everything before them.

Exit conditions between levels:
- **Demo → POC:** is the risk hypothesis written? Which layer is the most dangerous? (Also: real
  scenario, business confirmed, baseline quantifiable.)
- **POC → Pilot:** do real users want it, or must they edit four things before daring to send?
  Completion, edit and abandonment rates. Is telemetry in place? (Also: highest-risk hypothesis has a
  clear verdict; an eval plan exists; key roles will take part.)
- **Pilot → Production:** are the three gates signed? Has rollback been rehearsed? Are SLOs set? Is
  the runbook written? Who's on call?

**Iron rule: never skip a level.** Skipping doesn't just raise risk. It means carrying
production-level responsibility on demo-level evidence. The three most common shortcuts:
1. POC done → straight to full rollout.
2. A pilot without exit conditions that quietly becomes production.
3. Production without rollback drills or an on-call person.

**Decision drill:** the day the POC passes, the business says "full rollout, everyone from Monday."
Options: (1) roll out and fix as you go; (2) "no, wait until we reach production grade"; (3) **a
bounded pilot: one department, 50 people, two weeks, exit conditions written down.** Choose (3). It
neither says no nor hands over control. It turns "can we use it?" into an experiment with a time,
a scope and exit conditions. People who only say "wait" get routed around. People who say "sure,
full rollout" get called to the retro in week three.

## 5. Grading a project by evidence (not by duration)

Three questions place any project:
1. **Whose data is it?**
2. **Whose control are the users in?**
3. **Who's responsible when it breaks?**

| Data | Users | When it breaks | Level |
|---|---|---|---|
| We picked it | Invited by us | We absorb it | Demo |
| Real | Volunteers | There's still a way back | Pilot |
| Production | They depend on it for work | Someone is on call | Production |

A fuller self-assessment (see `templates/project-health-check.md`): Is the data curated samples,
partly real, or fully real? Is it used only internally, on trial by the business, or daily by
frontline staff? Is there a fixed eval set? Observability? Rollback? A clear answer to "who do we
call?" **Any cell you can't answer puts the project one level lower.**

The most common grading error isn't grading too low. It's **grading too high:** calling a POC
"production," which pulls the business's expectations straight to "when is full rollout?" when you
haven't even seen real data. **Honest grading is the fastest way to accelerate a project,** because
once graded, you know the next action.

The **"Demo-driven development"** death loop looks reasonable at every step:
1. Pick the highlight. The easiest feature to make look good is usually the least painful and least
   valuable.
2. Curate samples, which pushes the hardest part to the very end.
3. Demo with a polished UI, so decision-makers are persuaded on the wrong basis.
4. Get resources (headcount, budget) for an unvalidated direction.
5. Hit the wall: real data, systems and permissions won't connect, with half the budget spent and
   promises made.

Its most expensive effect isn't the useless demo. **It grants permission to keep investing in the
wrong direction.** The moment after a demo, when everyone's satisfied, is the most dangerous point in
a project: team confidence and real risk peak together.

The **four demo illusions** (polishing the demo makes all of them worse):
1. **Data illusion:** clean curated samples vs. missing fields, mixed formats and conflicting
   definitions. Test: how much does demo data overlap with production data?
2. **Boundary illusion:** only the happy path. In reality perhaps 30% of requests are vague,
   out-of-scope or self-contradictory. Test: what happens when it can't answer? "Never tried" means
   a landmine.
3. **Scale illusion:** one user, one call vs. concurrency, latency budgets and cost caps. Test: at
   100× demo volume, what are the cost and latency?
4. **Responsibility illusion:** at the demo someone rescues it ("we'll optimize that later"). At 3
   a.m. in production nobody does. Test: if it fails at midnight, who's the first to know, and what
   do they do?

## 6. The three responsibility lines

Enterprise AI must hold three lines at once. Missing any one means delivery isn't complete.
- **Business value:** is it worth investing in? This is the lead line from demo to production.
- **Engineering credibility:** will it hold up? This gets heavy only from pilot onward.
- **Organizational adoption:** do people use it and accept it? This decides the game in production.

Technologists watch only the middle line, because they can judge it themselves; the other two
require asking other people. Business failure comes in three forms:
1. **Nobody uses it,** because they don't trust it (they must re-verify everything, giving back the
   time saved) or it's inconvenient (they must leave their usual interface).
2. **Value never materializes.** 40 minutes became 38, but nobody hires one fewer person for two
   minutes, and with no baseline nobody can verify the "improvement," let alone sign for it.
3. **The organization rejects it.** It changes someone else's process and responsibility boundary,
   so it gets shelved for a series of non-technical reasons.

Self-check (all three need a "yes"): Can you state the time saved as a number? Can users use it
without leaving their current interface? Is someone on the business side willing to sign for it?
If not, it's still a technology project.

**Lifecycle self-assessment grid:** columns Demo / POC / Pilot / Production × rows business value /
engineering credibility / organizational adoption. Mark each cell *blank / partial evidence /
complete evidence*. Grade the project honestly, and name the **one** next thing to do.

## 7. Continue, shrink or stop

This decision is harder than "how to build," because it fights human nature. By midway, time,
reputation and budget are all invested, and that **sunk cost** holds your judgment hostage. Everyone
has a motive to say the same five words: *"let's invest a bit more."* Those are the most expensive
words in the project. If the root cause doesn't change, three months later you stop anyway, three
months poorer, with the team's faith in AI spent too. What must happen only arrives later; it never
disappears.

**The only fix: write the stop conditions before you start,** in the PRD, next to the success
metrics. Use the rationality you have beforehand to hedge the emotion you'll feel afterwards. The
standard belongs to the project, not to any person.

| Signal | Condition | Action |
|---|---|---|
| **Continue** | Core metric improving **and** users really using it (both!) | Invest more; push the validated part into production. Don't keep polishing in the pilot. Good metrics with no usage means you optimized something nobody needs; heavy usage with no metric gain is just activity |
| **Shrink** | Direction right, scope too big: noise or cost out of control (too many alerts and users muting them; inference cost over budget and finance asking questions) | **Shrinking scope beats tuning the model.** Noise and cost come from scope, not model capability. This is the one tech teams most often get backwards |
| **Stop** | A root-cause defect no tuning fixes. Most commonly **the data doesn't exist**, not poor quality but never produced (e.g. no "material kit-complete time" column in any system) | Stop this phase. Don't negate the whole direction; keep the two separate |

Write stop conditions as **judgeable sentences** that answer yes or no. Not "stop if results are
poor." By then anyone can explain the results as "not bad."

Three copy-ready stop conditions:
1. **Metric-based:** core metric below 60% for four consecutive weeks → stop this phase.
2. **Time-based:** no complete closed loop within eight weeks → stop this phase.
3. **Root-cause-based:** key data doesn't exist in business systems and can't be filled within six
   months → stop.

A stop condition has four required parts: **metric, threshold, observation point, and what happens
when it triggers.**

Three drills:
- **A.** Recall 62% (above the 60% stop line), and planners say "the alerts are useful, but there
  are too many per day to read." → **Shrink.** It's adoption, not accuracy. Tighten alert rules to
  the top-priority classes and cut the noise first.
- **B.** The slice works: verification time dropped from 38 to 12 minutes. Sales wants after-sales
  QC added "while we're at it." → **Continue, but hold the boundary.** Push the validated slice to
  production. Put after-sales QC on the non-goals list or explicitly in the next phase. Expanding
  right after a validation succeeds is the classic crash point, because the second phase's value
  can then no longer be measured.
- **C.** Six weeks without a closed loop. The core material data doesn't exist, and IT says the
  system upgrade is next year. → **Stop** this phase. It triggers the time-based condition, and the
  root cause is missing data.

Small failures are tuition. Big failures are incidents. "Invest a bit more" looks gentlest and costs
most: it drags an affordable small failure into an unaffordable big one.

## 8. How to tell leadership "stop"

- Don't say "we can't build it." State the root cause: "the data is missing, and the system upgrade
  is scheduled for next year."
- Show the math: continuing three more months costs X, with success probability Y. Stopping now
  loses Z.
- Present the stop as a **roadmap**: what would have to be true to restart (e.g. "data governance
  first").
- Decision-makers don't fear bad news. They fear bad news without evidence, and bad news held back.

## 9. The FDE eight-step workflow

**Discover → Define → Investigate → Design → POC → Pilot → Production → Improve.** For each step,
write the key actions, outputs and gate conditions. **Tailor by uncertainty, not by workload:** say
which steps can be compressed for this project and which must be reinforced, and why. Example: a
read-only internal Q&A bot can compress Design. A clinical decision-support tool must reinforce
Investigate, the eval gates and Production.
