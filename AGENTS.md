# AGENTS.md

This file provides project guidance to AI coding assistants (Claude Code, GitHub Copilot, Cursor,
Codex, etc.) working with this repository. Read it before changing anything.

## Project Overview

**ai-product-manager** is an [Agent Skill](https://docs.anthropic.com/en/docs/claude-code/skills)
that gives any agent the judgment and field experience of a senior AI product manager /
forward-deployed engineer (FDE). It covers the full lifecycle of enterprise LLM, RAG and agent
projects: discovery, solution selection, vertical slicing, POCs, evaluation, launch gates,
production readiness, and continue/shrink/stop decisions.

- **Primary content:** Markdown (the skill itself). Tooling: plain Node.js 18+, zero dependencies.
- **Default branch:** `main`
- **Repository:** https://github.com/ChanMeng666/ai-product-manager-skill

## Commands

```bash
node scripts/validate.mjs   # structural checks: frontmatter, line budget, references, orphans, evals.json
```

CI (`.github/workflows/validate.yml`) runs the same script plus a JSON check of the plugin manifests.

## Architecture & Conventions

```
skills/ai-product-manager/
├── SKILL.md            # entry point: principles, workflow, router table, diagnostics (< 500 lines)
├── references/         # loaded on demand, one topic per file (discovery, evaluation, production…)
└── templates/          # one-page fill-in artifacts (charter, PRD, POC plan, eval plan, runbook…)
evals/                  # evals.json (prompts + assertions) and benchmark.md (results)
examples/               # full answers produced with the skill
.claude-plugin/         # plugin.json + marketplace.json for `/plugin marketplace add`
scripts/validate.mjs    # repo checks
```

- **Progressive disclosure:** SKILL.md stays lean and routes to references. Put detail in a
  reference file, not in SKILL.md.
- Every reference/template must be mentioned in SKILL.md, or the validator flags it as an orphan.
- Reference files longer than ~100 lines start with a `Contents:` line.
- Write instructions that explain **why**, not walls of MUST/NEVER. The model using the skill is
  smart; give it reasoning it can generalize.
- Keep the content **domain-general**. Case studies illustrate patterns, so don't overfit the skill
  to one industry.
- English for all repo content. The skill itself tells the agent to answer in the user's language.

## Gotchas & Anti-patterns

- `industry-evidence.md` contains third-party statistics. Only add a figure with a source URL and a
  caveat. Never add the unverified "IDC 88% of POCs" statistic.
- Regulations (EU AI Act dates, etc.) change, so keep the "verify before relying" warning in
  `risk-and-governance.md`.
- `building-on-claude.md` names Claude product mechanisms (tool names, hook events, flags) that
  change often. Keep the "checked against the docs in <month>" note and the "verify before writing
  config" warning, and keep vendor-specific detail in that file. `agent-architecture.md` and
  `tool-design.md` stay vendor-neutral.
- Case-study numbers are illustrative composites. Don't present them as external statistics.
- The `description` frontmatter is the skill's trigger. Keep it ≤ 1024 characters and keep it
  specific about *when* to use the skill.

## Reading Order

1. `README.md`: what the skill is and how to install it
2. `skills/ai-product-manager/SKILL.md`: the skill itself
3. This `AGENTS.md`, then `CONTRIBUTING.md`

## Conventions for Changes

- Follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat(skill): …`,
  `docs: …`, `fix(evals): …`).
- Run `node scripts/validate.mjs` before proposing changes.
- When changing skill behavior, re-run the prompts in `evals/evals.json` with and without the skill
  and record the results in `evals/benchmark.md`.
