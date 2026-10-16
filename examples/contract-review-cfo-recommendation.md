**My recommendation:** don't renew it as-is, and don't kill it yet either. Fund a **smaller, conditional quarter**. The first half is unlocked now and the second half only unlocks if the tool passes a test we write down in advance. After four months you still can't say whether it works, so another full quarter on the current setup buys nothing except more risk. Six weeks of the right work gets you an evidence-based yes or no.

Below is the email, ready to send once you fill in the bracketed numbers. After it are notes for you.

---

## The email

**Subject:** Contract-review AI: recommendation for next quarter (reduced, conditional funding)

Hi [CFO name],

Short answer: **I recommend we don't renew the contract-review AI as it runs today. Instead, fund a reduced quarter with a hard decision point at week 6.** If it doesn't meet the bar we set in advance, we stop, or we switch to a commercial tool.

**Where we honestly are after four months**
- **Usage:** 10 lawyers have access and about 3 use it weekly. Seven of ten have stopped or never started.
- **Quality:** we can't tell you the accuracy, because we have never measured it. Lawyers say it is "sometimes spot on, sometimes misses things, and you can't tell which." For a contract tool that is the worst kind of error: a missed clause that nobody notices.
- **Control:** changes go straight into the live system with no testing, so quality can shift from week to week without anyone knowing.
- **Cost:** we are 30% over the token budget ([$X] vs. [$Y] planned), and we don't yet know which kinds of requests drive the overspend.

In short, we have a good demo, not a proven tool. That is a fixable position, but not one worth another full quarter of spending.

**What I propose for next quarter**
1. **Freeze uncontrolled changes now.** From today, every change is tested against a fixed set of contracts before it goes live, and it can be rolled back.
2. **Narrow the scope** to the one or two contract types our regular users actually use it for (to be confirmed from the usage logs), and cap spend per review. Both should bring cost back under budget.
3. **Measure it properly.** A senior lawyer, [name, nominated by the GC], marks the correct answers on about 100 real past contracts. We then measure how often the tool misses a must-catch clause, and how many minutes it saves compared with how lawyers work today.
4. **Make misses visible.** The tool will list each required clause as found (with its location in the contract), not found, or unsure, so lawyers can check it quickly instead of guessing.
5. **Benchmark one or two commercial contract-review tools** on the same 100 contracts, so we know whether building our own is still the right choice.

**Funding:** about [50–60]% of this quarter's run rate, in two tranches. Tranche 1 ([$A]) covers weeks 1–6. Tranche 2 ([$B]) is released only if the week-6 test passes. Beyond money, the plan needs about 30–40 hours of a senior lawyer's time over three weeks.

**Decision at week 6 ([date]), with the criteria agreed with the GC before we start:**
- **Continue** if, on the in-scope contract types: it misses must-catch clauses no more often than the GC's agreed threshold; it never claims a clause exists without showing where; it saves a measured [≥30]% of review time; at least 6 of 10 lawyers use it weekly; and cost per contract is within budget.
- **Switch to buy** if a commercial tool matches it at a lower total cost.
- **Stop** if it can't meet the miss-rate bar after two rounds of fixes, or if lawyers still have to re-check everything (no real time saved).

**The math**
- *Renew as-is:* about [1.3 × $Y] next quarter, and in three months we would still have no evidence either way. We would also carry the risk that an unnoticed missed clause reaches a signed contract.
- *Reduced, conditional quarter:* [$A], rising to [$A+$B] only on proof, and a clear decision by [date].
- *Stop today:* we save next quarter's spend, but we lose the four months of learning without finding out whether a narrower version would have paid off.

I'm happy to walk through it for 15 minutes. I'd also like the GC to confirm the quality bar and nominate the reviewing lawyer this week.

Best,
[Your name]

---

## Notes for you (not for the CFO)

**Why this verdict.** The case for continuing would need two things: a core metric that's improving, and people really using the tool. You have neither. Adoption is 30%, and accuracy has never been measured. Still, this isn't a clear stop either. Nothing points to a defect that can't be fixed, like missing data. The problems are about operations and scope, not proof that the model can't do the job, and that is what shrinking is for. Remember that the over-budget spend and the low usage come from scope, not model quality, so cut scope before anyone starts "tuning the model to be cheaper."

**Red flags, most expensive first.**
1. **Errors nobody can see.** "You can't tell when it's wrong" means lawyers either re-check everything, which wipes out the time saved, or trust it, which risks a missed clause in a signed contract. The first is why usage collapsed. The second is the real liability. Fixing this is the reason for the found / not found / unsure output in point 4.
2. **Prompt edits made live in production.** Every complaint-driven change can quietly break something that used to work, and you can't detect it or roll it back. This is the cheapest fix and the most urgent: version every change, pin the model version, and test against the fixed set before go-live.
3. **No baseline.** Without "minutes per contract today" and "how often a human first pass misses a clause," you can't prove value even if the tool is good. Measure both alongside the test set.
4. **Calling it a "POC."** It ran for four months with no written hypothesis and no failure criteria. That makes it a demo with users, and the great GC demo has been standing in for evidence. Don't let anyone describe it as nearly production-ready.
5. **No single owner.** Right now, quality belongs to whoever complains last. Fix it with one name per role: you are accountable for this phase, one senior lawyer has the final say on what counts as correct, the engineering lead owns the test-before-release step, and the GC signs the week-6 decision.

**Assumptions to check before you send** (each one could change the email):
- [ASSUMPTION] **The 3 weekly users focus on a few contract types**, such as NDAs or standard supplier agreements. Pull the usage logs to check. If usage is spread evenly across every type, narrowing is harder, and stop or buy becomes more likely.
- [ASSUMPTION] **The overspend comes from scope**: whole long contracts sent repeatedly, retries, prompts that grew with every patch, and one expensive model used for everything. Break token spend down by user and request type first. If one heavy workflow causes most of it, the cost fix is easy. If spend is high per contract even on simple ones, check the "switch to buy" option harder.
- [ASSUMPTION] **No missed clause has reached a signed contract yet.** Ask the 3 regular users directly. If one has, the email needs to say so, and point 1 becomes "pause use on live contracts until the test set exists."
- [ASSUMPTION] **The 30% threshold for time saved is a placeholder.** Agree it with the GC before sending, or soften it to "a threshold agreed with the GC." Thresholds set after you see the results don't count.

**Legal-domain checks, worth 10 minutes with the GC.** Confirm these against your own jurisdiction:
- **Professional responsibility.** Lawyers remain responsible for AI-assisted work. In the US, see ABA Formal Opinion 512 (July 2024) on generative AI, plus the duties of competence, confidentiality and supervision. This is another reason the tool must make its findings checkable.
- **Confidentiality of contract data.** Check the AI vendor's terms (zero retention, no training on your data). Also check what your own logs store, because full contract text in debug logs is a confidentiality risk.
- **Build vs. buy.** The commercial contract-review market is mature. Purchased tools often succeed more often than in-house builds for needs that don't set you apart from competitors. MIT NANDA's 2025 "GenAI Divide" report found this (roughly two-thirds vs. one-third), though its sample was small and self-selected. That is why the benchmark is in the plan.

**Single next action.** Within 48 hours, you and one engineer pull the last 4 months of logs: usage by lawyer and contract type, and token spend by request type. Owner: you. Due: Monday. Those logs fill in every bracket in the email and tell you which slice to keep. Freeze live prompt edits on the same day. That needs no budget approval.

---

## Appendix: the week-6 test card (to agree with the GC before work starts)

| Item | Definition |
|---|---|
| Test set | ~100 real past contracts of the in-scope types. Correct answers marked by [senior lawyer]. Includes messy, non-standard and badly scanned ones, not only clean templates |
| Fixed version | Prompt, model version, settings and test set locked for each test run, so results can be compared |
| Red line (cannot be relaxed) | Zero cases where it reports a clause as present without quoting its location |
| Must-catch miss rate | Must-catch clauses reported as "found" or silently absent when they're actually missing/present: ≤ [GC-set threshold]. "Unsure" counts as safe, not as a miss |
| Consistency | Same contract run 3 times gives the same found / not found results in ≥ [95]% of clauses |
| Time saved | Lawyer minutes per contract vs. today's measured baseline: ≥ [30]% |
| Adoption | ≥ 6 of 10 lawyers using it weekly on in-scope contracts, measured from logs, not surveys |
| Cost | Cost per reviewed contract ≤ [budget ÷ expected volume] |
| Who signs | Senior lawyer signs quality. Engineering lead signs the test-before-release step. GC signs the go / buy / stop decision |
| If it fails | Stop this phase, or switch to the commercial tool. Keep the test set, because it's reusable for evaluating any vendor |

**Six-week plan**
- **Week 1:** freeze and version changes, pin the model, and analyze the logs. Hold 15-minute conversations with the 7 non-users about why they stopped. Pick the scope. The GC signs the test card.
- **Weeks 1–3:** the senior lawyer marks up the contracts: 50 in week 1, then up to ~100. Engineering builds the found / not found / unsure output. Measure the baseline (minutes per contract today).
- **Weeks 3–5:** run the test. Fix the two biggest failure patterns, re-testing after each change. Run the commercial tools on the same set.
- **Week 6:** decision meeting using the card above. One page, signed.
