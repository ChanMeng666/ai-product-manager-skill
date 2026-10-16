# Role and Responsibilities

Contents: 1) Seven duties · 2) Four things that are not yours · 3) Interface-style collaboration ·
4) How technical an AI PM must be · 5) Role map · 6) The seven-layer responsibility expansion ·
7) Six AI product forms · 8) Capability self-assessment · 9) Career advice

## 1. The seven duties (ranked by importance)

1. **Define the problem.** This is not collecting requirements. It is translating the business
   side's vague frustration into a business problem that can be verified. "Order delays are
   annoying" is a frustration. The problem is: what is the actual delay rate, how far before the
   due date is a delay discovered, and how many person-hours does each discovery cost?
2. **Define what "good" means,** meaning the evaluation: metric, samples, and scoring rule. If you
   cannot say what counts as a wrong answer, you have not defined the product. Teams that skip this
   argue forever, because nobody shares the same standard of right and wrong.
3. **Define boundaries.** What you won't do, when to stop, and how out-of-scope situations are
   handled.
4. **Define responsibility.** Who may use it, who reviews errors, who has authority to roll back.
   Traditional products barely need this. For AI products it is mandatory.
5. **Organize collaboration.** Translate and make trade-offs between ML, engineering, architecture,
   business, and presales.
6. **Manage uncertainty.** Keep a hypothesis ledger, sorted by the cost of being wrong, and retire
   the items one by one.
7. **Own the business metric.** This is the only duty shared with traditional PMs. The other six
   are new.

Duties 2 and 4 are the ones most often skipped, always with the same excuse: "too early, let's see
once it's built."

## 2. Four things that are NOT the AI PM's responsibility

Unclear boundaries are the main source of finger-pointing in AI projects. Not owning these four
doesn't mean ignoring them. You participate by handing over **definitions, not implementations**.

| Not yours | Owner | What you contribute instead |
|---|---|---|
| Model capability ceiling | ML / model team | Scenarios and real samples. You receive the capability boundary and typical failure modes, then translate them into a usable product scope |
| Code quality and engineering | Engineering | Input/output contracts and non-functional requirements (latency, concurrency, idempotency), plus how the product behaves on exceptions |
| System integration and permission enforcement | Architecture | Business rules: who may do which action under which conditions |
| Commercial commitments and contract scope | Presales / sales | A "can commit / cannot commit" list, so promises beyond capability never reach the contract |

**What is always yours:** the problem definition, the eval standard, the boundaries and non-goals
list, and responsibility and rollback authority. If someone else wrote those, the project is no
longer yours.

**The most dangerous overreach** is the PM promising on behalf of ML ("this can be done") or
architecture ("this can be integrated"). Once a promise is written into a contract or charter, the
whole project pays for it, not the person who made it. Boundaries don't dodge responsibility. They
make it traceable, and teams with clear boundaries deliver faster.

## 3. Interface-style collaboration

What you exchange with ML, engineering and architecture should be **contracts, not discussions**.
A contract can be checked for delivery. A discussion cannot.

Before every cross-team review, write three lines:
1. What I am handing over.
2. What I need from you.
3. What happens if this item is missing.

If you can't write the three lines, the meeting shouldn't happen.

Example with ML. You hand over: the scenario description, a real sample set, and the scoring rule.
You get back: the capability ceiling, typical failure modes, and the order of magnitude of cost and
latency. The classic fight: "our model is 95%" against "your 95% doesn't hold for us." One side
tested easy samples. The other needs the long tail. Always state the **sample composition** with
any accuracy number.

Self-check: *in your last cross-team review, did you hand over definitions or opinions?* If it was
opinions, nothing will change after that meeting.

## 4. How technical must an AI PM be?

There are two failure modes. **Too little:** you can't tell whether "we can't do that" means truly
impossible, too expensive, or unwilling, and you become a relay for whatever engineering says.
**Too much:** you write prompts and pick frameworks yourself, so nobody runs the product. Docs go
stale, nobody chairs reviews, and the team loses direction.

**Understand costs and boundaries, not implementations.** Technical understanding exists so you
aren't misled in three situations:

1. **"That can't be done."** Is it truly impossible (change the requirement), uneconomic (change the
   approach), or unwanted (a collaboration problem, not a technical one)?
2. **Option discussions.** Ask for latency, cost and error rate every time, not just "how good is
   it." Big model or small model is not about which is more advanced. It is about whether you can
   accept the latency and cost, and only the PM can make that call, because the business is theirs.
3. **Incidents.** Is the failure in the model (adjust the prompt or swap models), the data (fix the
   source), or the process (change the product design)? Misdiagnose and the whole team fixes the
   wrong thing.

### The five layers: what you must know and what you can skip

| Layer | Must know | Can skip |
|---|---|---|
| Model | Capability boundaries and unit price of the candidate models | Training, fine-tuning hyperparameters |
| Prompt and context | Context windows fill and truncate, so more material is not always better | Prompt micro-tuning |
| Retrieval | If retrieval is wrong, everything downstream is wrong, so evidence must be traceable and shown to users | Embedding and index internals |
| Tools and orchestration | Every tool call is an external action that can fail (timeouts, errors, dirty data), so define what the user sees and the fallback | Framework choice |
| Evaluation and monitoring | No eval means no basis for launch. **You must personally own this layer** because acceptance is the PM's job | Harness implementation details |

### The single criterion

For any technical decision, ask: **does this change the error cost, the cost, or the user
experience?** If yes, you must understand it and take part in the decision. Whether the agent may
auto-modify the production schedule changes error cost, so you decide. Which orchestration framework
to use changes none of the three, so delegate it. This one rule removes about 80% of technical
meetings from your calendar.

Common follow-ups:
- *Should I learn to code?* Enough to read API docs and make one end-to-end call.
- *How do I listen in technical reviews?* For three things only: the option's error cost, its unit
  cost, and how it fails over.
- *Jargon I don't understand?* Ask "does this affect user experience?" If not, stop digging.

## 5. Role map: who answers for what

To find out what a role really is, ignore the job title. Ask: **if this project fails, whose
responsibility is it?** Titles are cheap to change. Responsibility is not. It either has an owner
or sits empty, and it never disappears.

The classic failure: presales promised "3 months, 95% accuracy". Engineering built every feature in
the spec. Architecture integrated all six systems. ML hit the metric on the given samples. At the
end the client said: "this isn't what I wanted." In the retro all four statements were true, and
nobody was wrong. **The cell "accountable for the business outcome" was empty from day one.** AI PMs
and FDEs exist to fill that cell.

| Role | Core question | Delivers | Responsibility ends at |
|---|---|---|---|
| Software engineer | Can this feature be implemented? | Working features, stable code, implemented interfaces | Functional correctness (output variability is a model trait, not an engineering defect) |
| ML engineer | Where is the capability ceiling? | Model evaluation, capability boundary, **typical failure modes** | Meeting the metric *on given samples* |
| Architect | Can it connect, scale, and stay governed? | Integration plan, data flows, permission enforcement, security boundary | System stability and security |
| Presales / solutions | How do we sell it without exceeding scope? | Proposal, quote, commitment list | Contract signature |
| AI product manager | Is this worth doing, what counts as success, who bears errors? | Problem definition, non-goals, success metrics, eval plan, launch gates | A measurable change in the business result |
| Forward-deployed engineer (FDE) | All of the above, plus on-site delivery | Full solution plus a reusable asset pack | Business result plus accumulated assets |

The further down the table, the closer responsibility sits to the business. **The other roles'
finish lines are where the FDE starts.** An FDE is an AI product owner with engineering skills,
working on the client's site, who translates vague business needs into AI systems that can be
delivered, verified and operated, and who answers for the business result. *Forward* means three
things: forward to the client's site (watch real people do the work), forward into the business
process (whose work will this change?), and forward to the moment before the problem is defined.

### FDE vs. agent developer: six dimensions

| Dimension | Agent developer | FDE |
|---|---|---|
| Starting point | A defined technical requirement | A vague business frustration, and possibly the conclusion "don't build this" |
| Core actions | Code, debug, tune | Interview, define, integrate, validate (coding is not first) |
| Success criterion | Feature shipped, metric met | Business metric genuinely improved |
| Delivery end point | Code merged | Running system plus reusable assets: eval set, ontology, connectors, runbook, policy config |
| Biggest gap | Business understanding | No obvious gap. It is a full-stack responsibility role across business, engineering and operations |
| Reaction to failure | Swap the model, tweak the prompt | Go back to the problem definition. Repeated technical failure usually means the problem was defined wrong |

Reusable assets compound: a second project can take about 40% of the first one's effort.

## 6. The seven-layer responsibility expansion

When an agent enters an enterprise, its responsibility boundary expands outward layer by layer:

1. **Model calls.** Prompts, tools, context. This is the easiest layer and the one that makes
   people overrate themselves.
2. **Data.** Can you get real data? Is it clean? Who authorizes it? Does it need masking?
3. **Systems.** How it connects to existing ERP, CRM or ticketing. Will interfaces be opened? Can
   results be written back?
4. **Permissions.** Who sees what, who changes what, and can every action be traced to a person?
5. **Process.** Does the current way of working change? Who reviews? Will the business adjust?
6. **People.** Will users adopt it, can they use it, and will they still use it once the novelty
   fades?
7. **Production operations.** Who watches the metrics, who iterates, who takes the 3 a.m. call?

Layers 1 and 7 usually have owners. **Layers 2 to 6 are where projects die**, often without an
incident anyone can point to, because no purely technical role naturally owns them. Unowned layers
don't show up as risks in status reports. They surface as change requests, launch delays, and
acceptance that never happens.

**Exercise:** draw seven boxes (data, integration, permissions and compliance, process change,
training, post-launch operations, business outcome) and write a *person's name* in each. Empty boxes
and "everyone" are your risks.

**Claiming more boxes** needs no approval and can start tomorrow:
1. Measure a baseline yourself. If you can't pull the data, count by hand.
2. Write a non-goals list with reasons, and read it aloud at kickoff. Whoever objects is a key
   stakeholder you must align with.
3. Adopt a post-launch metric (for example, suggestion acceptance rate or weekly active users) and
   own it for three months after launch.

All three move responsibility from after the fact to before it.

## 7. Six AI product forms, sorted by who catches errors

This is not a ranking of sophistication. It is a ranking of **responsibility**. Further right means
the AI carries more responsibility, so evals, gates and rollback matter more.

| # | Form | Who catches errors | Example |
|---|---|---|---|
| 1 | Chat assistant | The user, who asks and judges | Internal Q&A bot |
| 2 | Copilot | The human, who makes the decision | Drafting replies for an agent to review |
| 3 | Process orchestration | Fixed path; AI judges at a few nodes | Routing exception tickets |
| 4 | Autonomous agent | The system itself, whose actions change state | Auto-rescheduling production |
| 5 | Embedded capability | Hidden inside an existing system; users may not notice | Auto-classification in an ERP |
| 6 | AI-native business | The whole process is redesigned around AI | An AI-first service line |

**The most common mistake** is building a scenario that only suits form 2 as form 4, because it
"sounds more advanced." "Suggest handling actions" is half a step from "just change the schedule
too." That half step takes the error cost from 30 minutes of planner review to a production line
running on a wrong plan, about two orders of magnitude.

Test for a non-goals item: *is this excluded because it shouldn't be done, or because it can't be
done yet?* "Can't yet" is a hypothesis to verify, not a non-goal.

## 8. Capability self-assessment (four layers)

Score yourself 1 to 5 on each item. Write 0 where you have no idea; a blank is information too.
Judge the **shape**, not the total.

- **Business layer:** value identification, scope engineering, stakeholder alignment, baseline
  measurement.
- **Solution / engineering layer:** system integration, architecture, solution selection.
- **Validation layer:** risk validation, eval design, UAT and pilot design.
- **Operations layer:** production operations, observability, incident response, organizational
  adoption.

The typical developer shape is high engineering, blank business, partly blank validation, blank
operations. That shape means *can demo, can't deliver*. To grow, don't learn more frameworks. Fill
one box in the business layer and one in the operations layer.

## 9. Career advice for people moving into AI PM / FDE work

- **Don't agonize over which technology to learn.** Tech generations turn over every 6 to 12
  months. Product generations last 3 to 5 years. Frameworks expire; judgment doesn't.
- **Go deep into one real scenario end to end,** even a small one (a friend's company, a process
  near you). Demos give you a sense of achievement. Only full cycles build judgment.
- **Claim boxes to the right:** process, people, business outcome.
- **Practice turning requirements into problems.** For your next task, ask: what problem does this
  solve? How is it solved today, and at what cost (the baseline)? What happens if it isn't solved?
- **Attach evidence to every judgment.** Replace "I think this is better" with "I ran it 200 times;
  this is 11% better."
- Choosing between a deep platform-engineering role and a messy on-site delivery role: early in
  your career, with solid technical basics, the delivery role builds the scarcer skill (judgment on
  ambiguous problems). If you love deep technical work, stay deep. The FDE path demands a high
  tolerance for dealing with all kinds of people.
