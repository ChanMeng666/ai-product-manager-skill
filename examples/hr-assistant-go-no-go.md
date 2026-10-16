**Short version:** the memo should say **no to all 8,000 employees on Monday, and yes to a bounded pilot starting Monday**, with a written path to full rollout in about 4 to 5 weeks if the pilot meets criteria agreed now. That way the VP keeps her Monday date and you don't stake 8,000 employees' pay and leave questions on one test score. A bare "no" gets routed around. A bare "yes" gets you called into the retro in week three.

Below is the memo, ready to send once you fill in the `[brackets]`. After it: notes for you, and an appendix.

---

## Memo: HR Policy Assistant, Go/No-Go for Monday [26 Oct]

**To:** [VP of People] · **Cc:** [Engineering lead], [HR Ops lead], [Employment counsel], [Security/Privacy lead]
**From:** [You] · **Date:** Thursday [22 Oct]

### Recommendation

**GO for a 3-week pilot starting Monday with ~400 employees. NO-GO for all 8,000 employees on Monday.** If the pilot meets the exit criteria below, we expand to 10%, then everyone, with full rollout targeted for the week of [23 Nov].

### Why not everyone on Monday

1. **94% means about 1 answer in 17 is wrong, and we don't yet know which ones.** If each of 8,000 employees asks two questions in launch week [ASSUMPTION], that's about 950 wrong answers about pay, leave, benefits and conduct in week one. Employees will act on them: booking leave they aren't entitled to, missing an enrolment deadline, misreading a disciplinary process. Each of those becomes an HR case, and some become disputes.
2. **The 94% tells us how it does on our test, not on employees' real questions.** The 500 questions were [written by the project team / drawn from real HR tickets]. They were graded by [engineers / HR policy experts]. Broken down by policy area, the weakest area scores [X%] ([area], e.g. leave in [jurisdiction]). That area, not the average, is what the first complaints will be about.
3. **In employment matters, the company owns what the assistant says.** In *Moffatt v. Air Canada* (2024), a tribunal held the company liable for a policy its chatbot made up, and having the correct policy published elsewhere didn't help. Employment counsel should confirm how this applies to statements made to our own employees, but we should plan on owning every answer.
4. **Employees will type things into this tool that HR is legally obliged to act on:** harassment, discrimination, medical conditions, whistleblowing, distress. The assistant must not answer these as policy lookups. They need routing to a person, and counsel must confirm whether a message to the bot counts as notice to the company.
5. **A full launch is the moment we're least able to recover.** Everyone opens the launch email at 9 a.m. Monday. That load hits a hosted model with rate limits we haven't load-tested [confirm], and a first impression of "slow and sometimes wrong" with 8,000 people is very hard to undo.

None of this says the system is bad. 94% on a first test set is a strong start. Engineering's confidence is about whether the system works. The open question is whether HR is ready to own its mistakes at company scale, and only a pilot can answer that.

### What starts Monday

- **Who:** ~400 employees, picked at random from [3] groups, with at least one frontline/hourly group and one location outside HQ's jurisdiction. Not volunteers, and not only HR-friendly teams.
- **How it answers:** every answer cites the policy document and its effective date. If it can't find a current source, it says "I couldn't find a policy that covers this; contact HR at [channel]." Sensitive topics (harassment, discrimination, medical, legal disputes, decisions about a specific person's employment) never get an AI answer. They get a fixed message with a direct route to HR.
- **Safety nets:** a visible "Ask a person instead" button, a thumbs-down button that creates an HR review item, and a kill switch that engineering has tested.
- **Who owns errors:** [HR Ops lead, by name] owns answer quality and reviews flagged answers within [1 business day]. [Engineering on-call, by name] owns outages and the kill switch.

### Pre-agreed exit criteria (Friday [13 Nov])

| Measure | Expand if | Stop or fix if |
|---|---|---|
| Correct answers on ~300 real pilot questions, graded by HR experts | ≥ 95% overall, and ≥ 90% in **every** policy area | Any area below 85% |
| Answers on pay, leave, benefits or termination with no valid current source | **0** (never relaxed) | Any one: that topic is paused until fixed |
| Sensitive topics answered by the AI instead of routed | **0** (never relaxed) | Any one: same |
| Employees who use it again within 2 weeks | ≥ [40%] | < [20%] |
| Questions still going to the HR inbox from pilot groups vs. before | Down [≥ 20%] | Flat or up |
| p95 response time at pilot peak | ≤ [5 s] | > [10 s] |

**Decision on [13 Nov]:** expand to ~800 employees (10%) for one week, then everyone; or extend the pilot; or shrink to the policy areas that passed. If we miss a criterion, the default is to **narrow the scope, not cancel**. For example, launch everything except [leave and pay] and send those to HR until they pass.

### What I need by Friday [23 Oct] to start the pilot Monday

1. **Engineering:** kill switch tested and timed; model and prompt versions pinned; citations and the "no source, no answer" rule turned on.
2. **HR Ops:** a named owner for wrong answers, and the list of sensitive topics that must go to a person.
3. **Security/Privacy:** the hosted-LLM vendor's data terms confirmed (no training on our data, retention period), and personal details stripped from logs before they're stored.
4. **Counsel:** a yes/no on the notice question and on the in-tool disclaimer wording.

If any of these four isn't done, the pilot starts when it is. I won't trade these items for the date.

**Decision requested from:** [VP of People], by Friday [23 Oct].

---

## Notes for you (not part of the memo)

**Get these facts before Thursday.** Each takes hours, not weeks, and some of them change the memo.

1. **Where did the 500 questions come from, and who graded them?** If the project team wrote them and engineers graded the outputs, the 94% is the team marking its own exam. Say so softly in the memo ("graded by the build team; independent grading pending"). Then have an HR policy expert regrade a random 100 of the 500. If agreement is low, the real number is unknown, and the pilot becomes the first real measurement. Also ask whether earlier model outputs were ever used as the "right answers". If so, the score is close to meaningless.
2. **Ask engineering to break the 94% down** by policy area, by jurisdiction or country, by employee type (salaried, hourly, union, contractor), and by questions where the right answer is "I don't know / ask HR". They already have the run results, so this is a re-cut, not a re-run. The worst cell goes into the memo's second bullet. Expect two or three weak cells under a good total. That's normal, and it's the strongest argument for the pilot.
3. **Read the ~30 wrong answers yourself.** Sort them into: harmless wording, wrong but obviously wrong, and **wrong and plausible on money, leave or employment status**. Even 5 in the third group makes a concrete line for the memo: "5 of the 30 errors were confident wrong answers about [parental leave / final pay]."
4. **Run 100 real questions.** Ask HR Ops for 100 recent questions from the HR inbox or ticket system, picked at random and anonymised. Run them through the assistant and have one HR expert grade them. If that score is much lower than 94%, your memo gets stronger. If it holds, you can offer a shorter 2-week pilot. Either result helps you.
5. **Check how documents are versioned.** Of the ~1,200 documents, how many have been superseded, and does each carry an effective date? A common failure: a policy gets replaced, and the assistant answers "how was my leave calculated last year?" with this year's rule. It looks right, and it's wrong about money. If documents have no effective dates, add "answers only about current policy" as a pilot boundary.
6. **Check access control.** Are any of the 1,200 documents restricted, such as manager-only guidance, pay bands or investigation procedures? Retrieval must respect each user's permissions. Otherwise the first leak is an HR incident in itself.
7. **Regulatory items to confirm with counsel and privacy, by jurisdiction:**
   - **EU/UK employees** [ASSUMPTION]: you probably need a data-protection impact assessment, since this is employee data in a new technology at scale.
   - **Works councils** (e.g. Germany): introducing a tool that logs employee questions usually needs works-council agreement beforehand. That alone can rule out a company-wide Monday.
   - **EU AI Act:** an HR policy Q&A tool is generally not in the high-risk category, which covers AI that makes or supports employment decisions. It does carry a duty to tell people they're talking to AI. Verify the current dates and scope with counsel, because these provisions have been amended.
   - **Union agreements:** if any employees are covered by collective agreements that differ from standard policy, the assistant must not give union members the standard answer.
8. **Capacity.** Ask engineering for the provider's rate limits and the results of a load test at roughly 8,000 users opening it within an hour. If there's no load test, that alone justifies a staged rollout, and it's the argument engineering is least likely to dispute.
9. **Baseline.** Find out how many HR inbox tickets arrive per week today, and how long they take to resolve. Without that number, the pilot can't show value and the VP has no story for leadership. HR Ops can pull it in an hour.

**Expect pushback from the VP.** She'll likely say "Engineering says it's ready" or "people are already using ChatGPT for this." Your answer: "Agreed, we want it out. The pilot is how we get to 8,000 without our first headline being a wrong answer about someone's pay. And a sanctioned tool is the right answer to shadow ChatGPT use, which is why I want its first impression to be good." Give her the choice of *which part goes first*, not *whether to go*.

**Ask engineering in writing before Thursday:** "If this gives a wrong answer at 3 a.m. Sunday, who is the first person to know, what do they do, and how long does the kill switch take? When did we last test it?" If nobody can answer in one line, that answer goes into the memo.

**Your next action:** today, send two requests. To [Engineering lead]: the per-area breakdown of the 94% plus the 30 failures. To [HR Ops lead]: 100 random recent employee questions and the weekly ticket baseline. Ask for both **by Tuesday end of day**, so Wednesday is for grading and Thursday is for writing.

---

## Appendix: launch checklist for the full rollout (all items must be ticked before going past 10%)

**Quality**
- [ ] Fixed test set, versioned, including real employee questions, multi-jurisdiction questions, "should refuse" questions, and attempts to get it to say things it shouldn't
- [ ] Pass lines written before the run, with a named signer: [HR policy expert] signs quality, [VP of People] signs the business decision
- [ ] Same question asked 5 times and reworded 3 ways gives the same policy answer (consistency check)

**Risk**
- [ ] Error severity graded: wording issue / wrong but harmless / wrong on money, leave or employment status (zero tolerance without a source)
- [ ] Sensitive topics routed to a person, verified by test, not just written in the prompt
- [ ] Retrieval respects document permissions, verified by test with a non-manager account
- [ ] Every policy document has an effective date; superseded versions are kept and marked, never deleted

**Visibility and recovery**
- [ ] Every answer logged with the documents it used and their versions; personal details stripped before storage; retention period set: [__]
- [ ] Alerts on "no source" rate, thumbs-down rate, latency and errors, not just uptime
- [ ] Kill switch and rollback tested. Last test: [date], took [min]
- [ ] Fallback when it's off: HR inbox and phone, staffed for [+X%] volume during rollout weeks

**Ownership**
- [ ] One-page runbook; first person called if it breaks out of hours: [name]
- [ ] Every policy document change re-runs the test set before going live
- [ ] Vendor data terms, privacy assessment, works council/union consultation (where applicable), and counsel sign-off on file
- [ ] Load test at expected peak passed; quota increase confirmed with the provider

**Sign-offs:** Eval gate: [Engineering lead] · User acceptance: [HR Ops lead] · Production: [VP of People] + [Engineering on-call owner]
