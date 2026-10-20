# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-10-20

### Added
- Agent-architecture layer, informed by Anthropic's engineering guidance and the Claude Certified
  Architect – Foundations exam domains:
  - `references/agent-architecture.md`: the design order, the agent loop and exits, hub-and-spoke
    orchestration and subagent briefs, code gates, context engineering, error propagation and
    escalation, verification, long-running harnesses, the fix ladder, and a review checklist.
  - `references/tool-design.md`: the tool set, tool definitions, results, error contracts, tool
    choice, structured output and validation-retry, MCP, and tool testing.
  - `references/building-on-claude.md`: choosing between the Claude API, Agent SDK and Claude Code,
    a concept-to-mechanism map, Claude Code for teams and CI, and common wrong answers.
- Templates: `agent-design-spec.md` and `tool-spec.md`.
- Principle 17 (an agent is a loop, tools and context; fix at the cheapest layer). A "when the user
  wants it built" step, agent-design diagnostics and four red-flag phrases.
- Production-hardening patterns absorbed (paraphrased, MIT) from
  [DenisSergeevitch/agents-best-practices](https://github.com/DenisSergeevitch/agents-best-practices)
  and [ooiyeefei/ccc `agentic-system-design`](https://github.com/ooiyeefei/ccc): run triggers,
  prepare/commit tools with approvals bound to the exact action, limits on the resulting state,
  apply-time rechecks, idempotent writes and "unknown" outcomes, fail-closed gates, tree-wide
  budgets and one subagent failure shape, trust labels, output-origin tags, critique-loop stop
  rules, guidance for review panels and voting, memory authority limits, forbidden-event and
  false-success eval cases, extra LLM-as-judge rules, an agent-washing check, and the
  plan-then-execute pattern.
- 19 agent-architecture pitfalls (section G), for 92 in total.
- Anthropic engineering sources and the CCA-F exam guide added to `industry-evidence.md`, with
  caveats.
- Evals 4 (support-agent architecture) and 5 (multi-agent research debugging).
- "Works well with" section in the README, listing companion implementation skills.
- Validator check: reference files over 100 lines must have a `Contents:` line.

### Changed
- The skill description now triggers on agent architecture, tool and MCP design, and building on
  the Claude API, Agent SDK and Claude Code.
- Principle 10 now requires that rules which must always hold are enforced in code.

### Fixed
- A duplicated "Step 4/Step 5" heading in SKILL.md.

## [0.1.0] - 2026-10-16

### Added
- `ai-product-manager` skill: 16 operating principles, a stage router, field diagnostics and a
  red-flag phrase table in `SKILL.md`.
- 13 reference files: role and responsibilities, discovery, solution selection, scoping and
  vertical slices, ontology and guardrails, POC, evaluation, lifecycle and gates, production
  readiness, risk and governance, case studies, pitfall catalog (73 entries), industry evidence.
- 12 one-page templates: project charter, discovery report, AI PRD, POC proof plan, eval plan, UAT
  plan, launch gate checklist, runbook, ADR, ontology and action allow-list, project health check,
  continue/shrink/stop memo.
- Benchmark evals (`evals/`) comparing answers with and without the skill (34/34 vs. 26/34), plus
  example outputs in `examples/`.
- Claude Code plugin marketplace manifests, CI validation, and community-health files.
