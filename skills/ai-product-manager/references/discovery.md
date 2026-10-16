# Discovery: Turning a Vague Request into a Verified Problem

Contents: 1) What discovery is (and isn't) · 2) The first conversation · 3) Stakeholder map ·
4) RACI · 5) Interviews · 6) Baselines · 7) Is AI suitable? Is it worth it? · 8) Hypothesis ledger ·
9) Discovery outputs · 10) Worked example

## 1. Discovery is challenging requirements, not collecting them

| Activity | What it does | Output |
|---|---|---|
| Requirement collection | Records what the client says | A list |
| Requirement analysis | Classifies and prioritizes the list | A priority table |
| **Discovery** | Questions whether the requirements are right at all | **A judgment: what to do, and above all what not to do** |

The first two optimize the order of a possibly wrong list. Everyone works hard and nobody slacks,
yet the project heads the wrong way. That is the most painful kind of failure and the hardest to
diagnose in a retro, because everyone did their job.

Discovery asks three questions, and skipping any of them bends the direction:
1. **Does this pain actually exist?**
2. **Even if it exists, is it worth solving?**
3. **Even if it's worth solving, is now the right time?**

Discovery in eight words: *replace guesses with evidence*. Collection is note-taking. Discovery is
judgment, and judgment is what the employer pays for.

## 2. The first conversation

When a client says "we want an agent," the instinctive questions ("what features? what budget?
which model?") all sound professional, and all come too early. They hand the power to define the
product to someone with no frame of reference for a new category. People are poor at imagining what
they want and good at judging what's wrong. So mature teams show something first and then ask what's
wrong.

Three more distortions to watch for:
- **Second-hand requirements.** A business pain passes to IT ("we need a data platform") and then
  to procurement ("must meet standard X"). It distorts at each hop. Vendors then deliver against the
  translation, not the pain. An RFP that says "we need a knowledge-base platform" usually means
  nobody visited the business line.
- **Loudest is not most painful.** The pain voiced in the meeting room is the loudest one. The
  critical data often hides in a process nobody thought to mention.
- **Bought is not used.** A company can buy a specialist tool, report it as "deployed," and still
  see senior staff keep using a general-purpose chat tool because the purchased one is "too rigid to
  edit."

### The three-question sequence (ask in this order)
1. **"Why now?"** Not six months ago, not six months from now. The answer reveals the motive: an
   incident, an executive decision, or competitor envy. The motive sets priority, resources and how
   much authority you can borrow.
2. **"Where does it hurt? Walk me through the last time this happened."** This pulls the
   conversation from solution back to the scene, from the system they imagine to the buttons they
   pressed.
3. **"If this is never solved, what's the worst that happens?"** This digs out error cost and red
   lines, which feed the non-goals list directly. Asked first, it sounds pessimistic and shuts the
   client down.

### The "who does it now" sieve
Ask: **"Who does this today, and how many hours a week does it take?"** This one question forces
out three things:
- **A specific person** (a name, not a department). If nobody can name one, the project is
  ownerless land. Projects owned only by IT, with nobody from the business signing, get quietly cut
  at the next budget cycle.
- **A number.** "Improve support efficiency" is a direction. "The support lead spends three hours
  every Monday merging last week's escalations from four systems by hand" is a pain.
- **The workaround.** "Actually Zhang does most of it" or "the system has it, but we export to a
  spreadsheet and recalculate." The official flowchart shows how the organization *should* run.
  Workarounds show how it *actually* runs. Every workaround is an unmet need.

Three follow-ups that act as gates:
- **"Do they redo it afterwards?"** If yes, the real accuracy bar might be around 90% plus human
  review, which is often cheaper than chasing 99%. *(Economics gate)*
- **"If this isn't done, who hurts?"** This tests for a real business owner. No answer is the
  second red flag. *(Pain gate)*
- **"Which table or system is the data in right now?"** The answer is often "spread across seven
  systems, three versions disagree, the authoritative one is in a veteran's personal spreadsheet."
  That isn't bad news. You got the exam paper early. *(Feasibility gate)*

Every enterprise AI project must pass all three gates: **pain** (a specific person's specific
pain), **economics** (what solving it is worth), and **feasibility** (how far you can get given the
client's data reality). Anything unanswered: fix it now, because after launch it costs about a
hundred times more. If any answer is missing, the project's real name is "TBD."

Watch for the "attractive problem" bias: much enterprise AI budget flows to sales and marketing
because those demos look good, while returns often concentrate in unglamorous back-office work such
as contract review, procurement and risk control (see `industry-evidence.md`). Pick problems worth
money, not problems that demo well. Selection discipline matters: one team spent weeks building
Android features before learning the client mandated iPhones internally.

## 3. Stakeholder map (interests, not the org chart)

An org chart shows reporting lines. A stakeholder map shows **interests**. Never write "the
business side" as one entry; it covers hundreds of people and tells you nothing.

For each stakeholder type, fill two columns: **what they care about** and **what you can get from
them.**

| Stakeholder | Cares about | You can get |
|---|---|---|
| Business sponsor | Losses from the problem (e.g. delays) | Budget and priority. Without their nod nothing starts |
| Business owner / frontline expert (e.g. planner) | Less overtime, less blame | The real on-the-ground detail: how risks are actually found, which step jams |
| IT / information department | System stability, data security | Access, interfaces. Often in tension with what users want ("will your aggregation hammer our DB?") |
| End users | Is it easy, does it fit the way they already work | Adoption. They rarely speak up, but they decide whether it's used |
| Compliance / risk | No overreach, traceability | Red lines. Most often forgotten, and can halt the project after one incident |

**Put opponents on the map.** A map of supporters is pretty and useless. Opponents hold the
constraints and red lines you haven't seen. When you read the non-goals list aloud, the loudest
objector is your most critical stakeholder. Leave them out and they'll be waiting for you in the
process later. Whichever type you can't fill in is the interview gap you need to close.

## 4. RACI: who is accountable

A stakeholder map answers *who cares*. A RACI answers *who is responsible*. Mixing them evaporates
responsibility.

- **R**esponsible (executes; can be several people)
- **A**ccountable (owns the outcome; **exactly one** person)
- **C**onsulted
- **I**nformed

In AI projects the single A matters even more. When an agent changes something automatically,
everyone will say "I didn't decide that." The most dangerous signal is not people fighting over
responsibility. It is a critical activity with **nobody** accountable. Discovering the night before
launch that nobody can sign off a step is the most common and most lethal failure.

Examples: *define success metrics*, accountable: the AI PM. *Go/no-go for launch*, accountable: VP
Supply Chain. Lay key activities in rows and roles in columns. Each empty A cell is next week's
meeting. Without these two maps, "consensus" is just everyone being polite while thinking different
things.

## 5. User interviews: ask for actions, not wishes

Never ask "what features do you want?" That sends you straight back to collecting solutions, and
once a user starts listing features you stop hearing their real situation.

Ask instead: **"The last time this went wrong, what exactly did you do?"** Who did you contact
first? Which systems did you check, and in what order? How long did it take? The more specific the
question, the truer the answer, and pain leaks out of the details of real actions. Actions don't
lie, and they are more honest than any requirements document.

Sit beside the user and watch. One shadowing session is worth several meetings.

## 6. Baselines: weigh the pain yourself

A baseline is today's state as a measurable number: minutes per verification, orders handled per
day, delays per month. It is the control group for every later claim of improvement. Skip it today,
and in week six you have no acceptance standard, only "it feels better," and feelings are the first
thing project pressure distorts.

**Cross-check interview claims with measurement.** In the order-fulfillment case the team shadowed
five orders. A verification took 38 minutes on average, and the planner had claimed "about 40." The
numbers matched, so the pain was real, not exaggerated. Breaking it down, three of the five orders
lost time because the planner *didn't know where to look*. That turned "cross-system evidence
aggregation" from a feature the client wanted, which can be questioned, into a data-backed pain,
which can't. As a feature, the boss asks "is it worth it?" As a pain, the boss asks "why didn't we
do this earlier?"

Three numbers every discovery needs: **how many people do it now, how long each instance takes,
and what one error costs.** Without them, every later improvement is an adjective.

## 7. Is AI suitable here? Is it worth doing?

### AI-suitability: four boxes
| Box | Question | Example (maintenance knowledge case) |
|---|---|---|
| Knowledge stock | Is there existing knowledge to draw on? | 20 years of maintenance manuals: yes |
| Data | Does the data exist and can you access it? | Historical work orders: yes, but dirty |
| Feedback loop | Do outcomes flow back so the system can learn or be checked? | Repair results recorded: yes |
| Error tolerance | How bad is a wrong answer? | Low: a wrong repair step can cause a safety incident |

Low tolerance doesn't mean "don't do it." It means the design changes: advice only, sources
mandatory, humans confirm every irreversible action. When tolerance is **zero** (clinical), every
downstream design choice changes again; see `case-studies.md`.

### Worth-doing: three factors
- **Frequency:** how often does it happen?
- **Unit time or cost:** how long or how expensive is each instance?
- **Error cost:** how bad is a mistake today?

Scenarios low on all three should not get AI.

### Three motives behind "we want an agent"
Efficiency problem, risk problem, coordination problem, or "a competitor did it" (face). An
incident-driven project gets top priority and easy approvals. A face-driven project gets neither.
Plan resources accordingly.

## 8. The hypothesis ledger

List every assumption the project depends on. Mark each with an **evidence level** (confirmed /
partly confirmed / pure guess) and sort by **cost if wrong**. Then retire them one by one, starting
with the most expensive.

| Hypothesis | Evidence level | How to verify | Cost if wrong |
|---|---|---|---|
| Delay risk is detectable 10 days before the due date | Partly confirmed | Backtest on 120 historical orders | Project redefined |
| Planners accept suggestions but not auto-execution | Pure guess | Pilot behavior telemetry + short survey | Adoption failure |
| Core fields are retrievable from the three systems | Pure guess | Pull 20 real orders field by field | Stop |

If every row says "confirmed," the charter is probably worthless. A charter without hypotheses
means the author made no judgments and simply restated the client's requests.

## 9. Discovery outputs (one page each)

- **Project charter** (`templates/project-charter.md`): one-line positioning (*for whom, in what
  situation, solving what*, with no "empower / closed loop / leverage"), baseline, non-goals with
  reasons, hypothesis ledger, success metrics, stop conditions.
- **Discovery report** (`templates/discovery-report.md`): stakeholder map, RACI, interview findings,
  baselines, as-is vs. to-be flow, AI-suitability, recommended slice, non-goals.

Start the **organizational critical path** in week 1, in parallel with discovery: vendor onboarding, security review, third-party-risk and data-protection assessments. These often take 6 to 12 weeks and are the most common hidden cause of a slipped date.

Week one asks about direction. Week two fills in evidence. Keep that order, or the evidence just
props up a wrong direction.

## 10. Worked example: two PMs, one request

Request: "Order delays are only discovered right before the due date. Build an AI assistant to
detect delay risk early, analyze causes, and ideally suggest actions." Context: a large discrete
manufacturer, multiple plants, six systems.

- **PM A**, day 1, opens a diagramming tool: an agent as orchestrator, six system integrations, a
  knowledge base, a risk-scoring tool. Three days later: a 12-page spec and high-fidelity
  prototypes. Three months later the demo is great, then the business asks, *"if it judges wrong,
  who is responsible?"* Nobody can answer, and the project stalls before the pilot.
- **PM B**, day 1, draws nothing and asks three questions: what is the real delay rate, how long
  does a salesperson take to discover one delay, and what does one day of delay cost the customer?
  B hands in one page: a problem definition, a baseline, three hypotheses to test, and a non-goals
  list. B validates on 120 historical orders, narrows "early warning" to *evidence aggregation and
  suggestions for key-account orders with human approval*, and enters a pilot.

The difference: **baseline first, boundary first, responsibility first.** None of it is technical
skill, and none of it needs a line of code.
