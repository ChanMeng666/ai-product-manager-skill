<!-- AGENT-FIRST NOTICE -->
> [!IMPORTANT]
> ### 🤖 Read this with your AI agent — don't read it by hand.
> This repo is written agent-first. Point Claude Code, GitHub Copilot, Cursor, or any agent at it:
> *"Read the README and SKILL.md, then install and use this skill."*
<!-- /AGENT-FIRST NOTICE -->

<div align="center">

# 🧭 AI Product Manager Skill

### Give any AI agent the judgment of a senior AI product manager, so your LLM, RAG and agent projects survive past the demo

Turn *"we want an agent"* into a verified problem. Pick rules, workflow, RAG or agent for the right
reasons. Slice an MVP that actually ships, run POCs that try to fail, build evals that produce
verdicts, and pass launch gates with a way back.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-green?style=flat-square)](https://docs.anthropic.com/en/docs/claude-code/skills)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-SKILL.md-blue?style=flat-square)](https://agentskills.io)
[![Validate](https://github.com/ChanMeng666/ai-product-manager-skill/actions/workflows/validate.yml/badge.svg)](https://github.com/ChanMeng666/ai-product-manager-skill/actions/workflows/validate.yml)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-EA4AAA?style=flat-square&logo=githubsponsors)](https://github.com/sponsors/ChanMeng666)

</div>

## Why this exists

Most enterprise AI projects don't die because the model is weak. They die **after a great demo**.
Nobody measured a baseline, nobody owned errors, the scope grew back, "95% accuracy" hid a 64%
slice, a pilot quietly became production, or a 3 a.m. incident had no runbook. Public research
points the same way: problem definition, data and organizational adoption, not model capability,
are the usual causes of failure (see [industry evidence](skills/ai-product-manager/references/industry-evidence.md)).

Senior AI PMs and forward-deployed engineers learn this the expensive way, one failed project at a
time. This skill packages that judgment so **anyone** can borrow it: a founder scoping a first AI
feature, an engineer moving into product, a consultant walking into a client kickoff, or a PM
writing a go/no-go memo by Thursday.

## What it changes in your agent's answers

With the skill loaded, your agent stops cheerleading and starts doing what a seasoned AI PM does:

| Without the skill, agents tend to… | With the skill, the agent… |
|---|---|
| Accept "build an agent that does it all" and start designing | Treats it as a proposed solution, asks *why now / where it hurts / worst case*, and measures a baseline first |
| Choose the most advanced architecture | Walks the certainty axis (**rules → workflow → RAG → agent**) and keeps irreversible actions out of the AI's tool list |
| Shrink scope by cutting features | Cuts **coverage, never depth**: one vertical slice, end to end, on real data, inside tools users already use |
| Treat a POC as a demo | Writes **failure criteria with numbers first** and targets the assumption that kills the project if it's false |
| Trust "94% accuracy" | Asks for the denominator, who labeled it, the worst slice and the control group, then grades errors by cost |
| Say "yes, launch" or "no, wait" | **Keeps the red line and shrinks the scope:** a bounded pilot with exit criteria, rollback rehearsed, and a named 3 a.m. owner |
| Keep investing "a bit more" | Holds the project to **stop conditions written before the money was spent** |

Every substantive answer leads with a **verdict**, ranks the **red flags** by cost, fills in a
**one-page artifact**, and ends with **one next action** and an owner.

## What's inside

```
skills/ai-product-manager/
├── SKILL.md         16 operating principles · stage router · field diagnostics · red-flag phrases
├── references/      loaded only when relevant (progressive disclosure)
└── templates/       one-page artifacts the agent fills in with your specifics
```

| Reference | Covers |
|---|---|
| [`role-and-responsibilities`](skills/ai-product-manager/references/role-and-responsibilities.md) | 7 duties and 4 things that aren't yours · how technical to be · AI PM vs. FDE vs. engineer vs. architect · 7-layer responsibility map · 6 AI product forms |
| [`discovery`](skills/ai-product-manager/references/discovery.md) | The first questions · stakeholder map · RACI · interviews · baselines · AI-suitability · hypothesis ledger |
| [`solution-selection`](skills/ai-product-manager/references/solution-selection.md) | Certainty axis · decision tree · when an agent is justified · autonomy levels · HITL · agent patterns · ADRs |
| [`scoping-and-vertical-slice`](skills/ai-product-manager/references/scoping-and-vertical-slice.md) | Minimum viable *deployment* · coverage vs. depth · 4-layer slice · deferrals with return conditions · exit criteria |
| [`ontology-and-guardrails`](skills/ai-product-manager/references/ontology-and-guardrails.md) | Concepts/relations/constraints · action allow-lists · "prompts are advice, not gates" |
| [`poc`](skills/ai-product-manager/references/poc.md) | POC vs. demo · highest-risk assumption · the 4 POC experiments · spikes · continue/shrink/stop |
| [`evaluation`](skills/ai-product-manager/references/evaluation.md) | 4-layer eval matrix · golden sets · error analysis · groundedness · LLM-as-judge · the "95%" traps · eval vs. UAT vs. pilot |
| [`lifecycle-and-gates`](skills/ai-product-manager/references/lifecycle-and-gates.md) | 7 stages · 4 gates · Demo/POC/Pilot/Production by evidence · sunk cost and stop conditions |
| [`production-readiness`](skills/ai-product-manager/references/production-readiness.md) | 12-item launch gate · canary · rollback drills · AI-quality SLOs · runbooks · incident triage |
| [`risk-and-governance`](skills/ai-product-manager/references/risk-and-governance.md) | High-stakes domains · OWASP LLM Top 10 · lethal trifecta · NIST AI RMF · EU AI Act |
| [`case-studies`](skills/ai-product-manager/references/case-studies.md) | Manufacturing, maintenance, clinical, customer service, a policy-assistant incident, a contract-review rescue |
| [`pitfalls`](skills/ai-product-manager/references/pitfalls.md) | 73 pitfalls: symptom → why it kills → fix |
| [`industry-evidence`](skills/ai-product-manager/references/industry-evidence.md) | RAND, MIT NANDA, Gartner, McKinsey, Anthropic, OpenAI, Google PAIR and more, with sources and caveats |

**Templates:** project charter · discovery report · AI PRD · POC proof plan · eval plan · UAT plan ·
launch gate checklist · runbook · ADR · ontology and action allow-list · project health check ·
continue/shrink/stop memo.

## Installation

Pick **one** method.

### Method 1: Claude Code plugin marketplace (recommended)

```text
/plugin marketplace add ChanMeng666/ai-product-manager-skill
/plugin install ai-product-manager@chan-ai-product-manager
```

### Method 2: Copy into your skills folder

The skill lives at `skills/ai-product-manager/`. Copy that folder into your user-level skills
directory:

```bash
# macOS / Linux / Windows (Git Bash or WSL)
git clone --depth 1 https://github.com/ChanMeng666/ai-product-manager-skill.git /tmp/_aipm \
  && mkdir -p ~/.claude/skills \
  && cp -r /tmp/_aipm/skills/ai-product-manager ~/.claude/skills/ai-product-manager \
  && rm -rf /tmp/_aipm
```

```powershell
# Windows PowerShell
git clone --depth 1 https://github.com/ChanMeng666/ai-product-manager-skill.git "$env:TEMP\_aipm"
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills" | Out-Null
Copy-Item -Recurse "$env:TEMP\_aipm\skills\ai-product-manager" "$env:USERPROFILE\.claude\skills\ai-product-manager"
Remove-Item -Recurse -Force "$env:TEMP\_aipm"
```

For a single project instead of every project, copy it to `<your-project>/.claude/skills/`.

### Method 3: Other agents and Claude.ai

The skill follows the open **Agent Skills** format (`SKILL.md` + resources), so any agent that
supports it can load the `skills/ai-product-manager/` folder. On Claude.ai, zip that folder and
upload it under **Settings → Capabilities → Skills**. For agents without skill support, point the
agent at `SKILL.md` and ask it to follow the instructions.

## Usage

You don't need to name the skill. Describe your situation, and it triggers on AI product work:

> *"A client says they want an AI agent that handles complaints end to end, decides compensation
> and replies automatically. Kickoff is tomorrow. What should I ask, propose and avoid?"*

> *"Our RAG assistant scored 94% on a 500-question test set and the VP wants it live for 8,000
> employees on Monday. Write my go/no-go recommendation."*

> *"Our contract-review 'POC' has run for 4 months: 3 of 10 lawyers use it, nobody knows the
> accuracy, and we're 30% over the token budget. The CFO asks whether to keep funding it."*

More things to try:
- "Should this be RAG, a workflow, or an agent?", followed by your requirement
- "Turn these meeting notes into a one-page project charter with non-goals and stop conditions."
- "Design the eval plan and red lines for our support copilot."
- "We're launching next week. Run the launch gate checklist on this plan."
- "Health-check my AI project and tell me the one thing to do next."
- "I'm a backend engineer moving into AI PM. What should I actually learn?"

It works in any language. Ask in Chinese, Spanish, Japanese, and so on, and the agent answers in
that language.

## Benchmark

Three realistic scenarios were each run with and without the skill (same model), then scored by an
independent grader agent against objective assertions:

| Scenario | With skill | Without skill |
|---|---|---|
| Bank "end-to-end complaints agent" kickoff prep | **11/11** | 7/11 |
| HR RAG assistant "94% accuracy, launch Monday" go/no-go | **11/11** | 9/11 |
| Contract-review "POC" rescue memo to the CFO | **12/12** | 10/12 |
| **Total** | **34/34 (100%)** | 26/34 (76%) |

Without the skill, a strong model already gives reasonable advice. What the skill adds is
**structure for judgment**: it reframes the solution as a problem, scopes one slice end to end,
writes stop conditions before spending, names one owner, refuses to let "94%" stand in for
everything, and puts a sendable deliverable first. The cost: answers are longer and use about 2×
the tokens. Read the [full benchmark and caveats](evals/benchmark.md), or the
[example outputs](examples/).

## Principles at a glance

1. A request is a proposed solution, not a problem.
2. Measure the baseline before drawing architecture.
3. Define "good" and "who owns errors" on day one.
4. Price the error before the feature.
5. Stay left on the certainty axis: rules → workflow → RAG → agent.
6. The first deliverable is a non-goals list.
7. Cut coverage, never depth.
8. A POC exists to falsify the highest-risk assumption.
9. Evidence over impressions: four eval layers, not one number.
10. Safety comes from not having the option, not from reminders.
11. Write stop conditions before you start.
12. Never skip a maturity level; grade by evidence.
13. Assume it will fail in production, and plan the detection and the way back.
14. Exchange contracts, not opinions.
15. Accountability has exactly one name.
16. Under pressure: keep the red line, shrink the scope.

## Sources and acknowledgements

The skill distills field practice from a 31-lesson Chinese-language video course on enterprise AI
product management and forward-deployed engineering (published on Bilibili). It is cross-checked
and extended with public guidance:
- Anthropic's [*Building effective agents*](https://www.anthropic.com/engineering/building-effective-agents) and [*Demystifying evals for AI agents*](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- OpenAI's [*A practical guide to building agents*](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)
- Google [PAIR's People + AI Guidebook](https://pair.withgoogle.com/guidebook/)
- Hamel Husain and Shreya Shankar's [LLM Evals FAQ](https://hamel.dev/blog/posts/evals-faq/)
- [OWASP's Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- the [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)
- RAND's research on [why AI projects fail](https://www.rand.org/pubs/research_reports/RRA2680-1.html)

Case studies are anonymized composites, and their numbers are illustrative. Regulatory details
change, so verify them for your jurisdiction.

## Contributing

Field lessons, pitfalls, eval cases and better evidence are very welcome. See
[CONTRIBUTING.md](CONTRIBUTING.md) and run `node scripts/validate.mjs` before opening a PR. Agents
working on this repo should read [AGENTS.md](AGENTS.md).

## ❤️ Sponsor

[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-GitHub-EA4AAA?style=for-the-badge&logo=githubsponsors)](https://github.com/sponsors/ChanMeng666)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/chanmeng66u)

## 📄 License

Released under the [MIT](LICENSE) license.

---

<!-- CHAN MENG PERSONAL BRAND -->
<div align="center">
  <a href="https://github.com/ChanMeng666" target="_blank">
    <img src="./.github/brand/chan-meng-logo.svg" alt="Chan Meng" width="160" />
  </a>

  <p><strong>Chan Meng</strong><br/>Need a custom app like this one? I build them — let's talk.</p>

  <a href="mailto:chanmeng.dev@gmail.com"><img src="https://img.shields.io/badge/Email-chanmeng.dev@gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="Email Chan Meng"/></a>
  <a href="https://github.com/ChanMeng666"><img src="https://img.shields.io/badge/GitHub-ChanMeng666-181717?style=flat-square&logo=github&logoColor=white" alt="Chan Meng on GitHub"/></a>
</div>
<!-- /CHAN MENG PERSONAL BRAND -->
