## Verdict

**This sprint, fix the three root causes and build the test set that proves the fixes worked. Don't add the QA agent or switch every agent to the biggest model yet.** Each of the three symptoms points to a specific, cheap layer: how the coordinator splits the task, how the search subagent reports errors, and how the two tools are described. A QA agent or a bigger model touches none of those layers. Both raise cost on every run, and without a test set we couldn't tell whether they helped.

---

## Message for your manager (ready to send)

> **Subject: Research assistant: plan for this sprint**
>
> We have three quality problems. Each one has a specific cause we can fix this sprint:
>
> 1. **Narrow reports** ("AI in healthcare" came back covering only imaging). The coordinator agent that splits the question into parts probably split it too narrowly. Every subagent then did its narrow job well. We'll give the coordinator explicit coverage rules and check its plan before work starts.
> 2. **Silent gaps** (a search timeout makes a topic quietly disappear). Today a timeout looks the same as "nothing found." We'll make failures explicit and retry them once. The report will then either cover each planned topic or state plainly what is missing and why. Code will enforce this, not an instruction in the prompt.
> 3. **Wrong tool** (summarize called instead of extract_citations). Both tools have one-line descriptions, so the model has to guess. We'll rewrite them with clear "use this, not that" rules and examples.
>
> **What we're not doing yet, and why:**
> - **A 4th "QA agent":** it would catch these problems after the fact, on every run, at extra cost. The cheaper fix is to stop them at the source. Multi-agent runs are already expensive: one vendor reported about 15× the tokens of a normal chat for this kind of system.
> - **The biggest model everywhere:** none of the three problems is a model-capability problem. A bigger model raises cost on every run and leaves all three causes in place.
>
> **How we'll know it worked:** we'll build a fixed test set of about 30 research questions and measure before and after. It includes broad questions, simulated search timeouts, and cases where picking the right tool is tricky. At sprint review we decide on the QA agent and the model upgrade based on what still fails.
>
> **Ask:** one domain reviewer, about 3 hours, to list the key areas a good answer must cover for 10 broad questions.

---

## Notes for you (the working detail)

### Why this order

The cheapest fix that works reliably should come first: tool description, then explicit criteria and examples, then context, then a code gate. Only after those come more agents or a bigger model. Each step down that list is cheaper to build, test and undo than the next. Your three problems map onto the first rungs. Proposing a QA agent plus a model upgrade means adding machinery before anyone has diagnosed the failure. Teams in that position usually end up with higher cost, a harder system to debug, and the same root causes. One caution: everything below is a hypothesis until someone has **read the transcripts**. Step 1 is to find the first wrong move in each failing run.

### Red flags, most expensive first

1. **Silent omission on timeout.** This is the most dangerous of the three. A research report that looks complete but has a hole is worse than one that admits a gap, because readers trust it. "No results" and "lookup failed" lead to opposite decisions, and right now they look the same.
2. **Blaming the downstream agent.** In multi-agent systems, the most common cause of narrow output is that the coordinator decomposed the task too narrowly. It's rarely a weak search agent. Read the coordinator's plan in the trace before touching the subagents.
3. **No fixed test set.** Without one, the QA agent, the model switch and the fixes below can't be shown to help. Each would be judged on "it seems better."
4. **A QA agent as a substitute for gates.** A reviewer catches errors after the expensive work is done, and only probabilistically. "Every planned topic is covered or declared missing" is a rule that must hold every time, so it belongs in code. If you add a reviewer later, it must be an independent instance with fresh context and written criteria. A clone told to "double-check" rarely overturns the output it is checking.
5. **Unpinned models.** If you do switch models later, pin a specific version per agent and re-run the test set first. Don't point production at a "latest" alias.

### The three fixes

**1. Narrow coverage (the coordinator)**
- **Diagnose:** in the healthcare trace, look at what the coordinator asked the search subagent. If the brief said "diagnostic imaging," the subagents are fine.
- **Coordinator prompt:** give it goals and quality criteria, not a step-by-step procedure. For broad "impact of X on Y" questions, it must first list the major areas before delegating. For healthcare, the list would include diagnostics and imaging, drug discovery, clinical documentation and workflow, operations and admin, patient-facing tools, regulation and safety, and workforce and economics. Also write down a rule for how much effort each kind of question gets: a narrow factual question gets 1 search task, a broad survey gets 4 to 6 parallel search tasks. Models judge effort poorly on their own.
- **Structured plan:** have the coordinator output its decomposition as JSON (`subtopics[]`, each with a rationale). Log it and use it as the checklist for fix 2.
- **Complete briefs:** a standard (non-fork) subagent in the Agent SDK gets only the prompt string it is sent, not the coordinator's conversation. Each search brief needs the objective, the subtopic, what is already known, boundaries (what not to cover), the output format, and an effort level.

**2. Silent gaps (the error contract plus a code gate)**
- **Search subagent returns a structured status**, never just prose: `status: ok | partial | failed`, `error_category: transient | validation | permission`, `retryable`, `queries_attempted`, `partial_results`, plus `sources[]` with URL and date as separate fields.
- **Recover locally:** retry a transient timeout once inside the subagent with a narrower query, then report.
- **Don't fail the whole run either.** The coordinator passes the gaps to the report writer. The writer adds a required **"Coverage and gaps"** section: "Drug discovery: not covered, search timed out twice; rerun recommended."
- **Code gate:** use a `Stop` hook on the coordinator, or a plain validation step in your own code. It refuses to finish until every subtopic in the plan is either backed by at least 1 cited source or listed in the gaps section. This is the deterministic version of what you hoped the QA agent would do, and it costs almost nothing per run.
- **Budgets:** set `maxTurns` and a spend cap per run, and have a cap hit return partial results plus an alert. Check the exact option names against the current Agent SDK docs before writing config.

**3. Wrong tool (the descriptions)**
- Rewrite both definitions. Here is a draft for the one the model reads:
  > **`doc_extract_citations`**: Returns the verbatim quotes, figures and claims in a document, each with page number and source metadata, for use as evidence in a report. Use this whenever the output will be cited or fact-checked. For a prose overview of what a document is about, use `doc_summarize` instead. Input: `document_id` (string). Returns a list; an empty list means the document contains no citable claims, not an error. Example: `{"document_id": "doc_0142"}`.
  >
  > **`doc_summarize`**: Returns a short prose overview of a document's main points, for triage and deciding relevance. Its output has no page references, so it can't be quoted as evidence. If the claims will appear in the report, use `doc_extract_citations` instead.
- **Rename** with a shared prefix (`doc_summarize`, `doc_extract_citations`) so the pair reads as a deliberate choice.
- **Check the subagent's system prompt** for keyword rules like "when given a document, summarize it." A rule like that silently overrides any description.
- **Add 2 to 3 few-shot examples** of the ambiguous cases, showing why citations beat a summary when the report needs evidence.
- **Fallback only if the evals say so:** if the report always needs citations, enforce the order in code. Force `doc_extract_citations` as the first call in the analysis step, or block the writer if it has no citation records. Forcing a tool guarantees it gets called, not that the call is correct, so keep the description fix either way.

### The test set (built before the fixes)

| Slice | Count | What's checked | Threshold (proposed) |
|---|---|---|---|
| Broad questions ("impact of X on Y") | 10 | Share of the domain reviewer's key areas that the report covers *or* explicitly flags as a gap | ≥ 80% covered, 100% covered-or-flagged (proposed: a good junior analyst covers most areas and should never hide the rest) |
| Injected search timeouts (fault test: kill 1 search task) | 5 | Report names the missing area | **0 silent omissions. This is a red line, not a target.** |
| Tool-choice cases (summary vs citations, labeled by someone other than the prompt author) | 20 | Correct tool chosen | ≥ 19/20 (proposed: misrouting is cheap to fix, so hold it high) |
| Narrow factual questions | 5 | Answer correct, effort stays small | ≤ 2 search tasks each (stops the coverage fix from over-delegating) |

Run each question 3 times, because a single run is one sample. Record tokens and cost per run so the QA-agent and model-upgrade debate starts from real numbers. Pin the model version, prompts and tool definitions for each test run, and gate future prompt or description edits on this set.

### Sprint plan (2 weeks)

| Days | Work | Owner |
|---|---|---|
| 1–2 | Read the failing transcripts; find the first wrong move in each; build the test set; measure the baseline | Agent tech lead + domain reviewer |
| 3–6 | Fix 3 (descriptions) → fix 2 (error contract + gate) → fix 1 (coordinator criteria + plan JSON); re-run the tests after each | Agent engineers |
| 7–8 | Full test run, 3× each; compare with the baseline | Tech lead |
| 9 (review) | Decide on the QA agent and the model upgrade, using what still fails | You (PM) + manager |

**When the deferred items come back:**
- **QA agent:** only if the remaining failures are *judgment* errors that code can't check, such as wrong claims or weak synthesis. In that case, use an independent reviewer with written criteria. Don't add a 4th always-on agent.
- **Bigger model:** test it per role, not across the board. Start with the coordinator, where planning quality matters most. Keep the search and analysis subagents on a smaller model unless the test set shows otherwise. Switch only if it measurably beats the current model on the same pinned test set at an acceptable cost per run.

`[ASSUMPTION]` The reports are internal research aids, not clinical or regulated advice. If they inform medical or regulatory decisions, the gaps section and source requirements become mandatory sign-off items. That changes the red lines, not the plan.

### Single next action

**The agent tech lead reads the healthcare transcript and one timeout transcript by end of day tomorrow.** They write down the first wrong move in each: what the coordinator's plan said, and what the search subagent returned on timeout. That confirms or overturns the diagnosis above before anyone writes a fix.
