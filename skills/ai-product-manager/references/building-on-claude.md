# Building on Claude: Mapping the Design to Claude's Mechanisms

Contents: 1) How to use this file · 2) Choosing the surface · 3) The concept map · 4) Agent SDK ·
5) Claude Code as a team platform · 6) Claude Code in CI · 7) Claude API features that matter for
agents · 8) Common wrong answers · 9) Further learning and companion skills

Use this file only when the user is building on Claude (the Claude API, the Claude Agent SDK, or
Claude Code). The design principles in `agent-architecture.md` and `tool-design.md` are
vendor-neutral. This file says which Claude mechanism implements each one.

**Product details change often.** Names and flags below were checked against Anthropic's docs in
October 2026 (code.claude.com/docs and platform.claude.com/docs). Before you write configuration or
code that depends on an exact field or flag, check the current docs. Give the user the mechanism
and the reason, not memorized syntax.

## 1. How to use this file

The same principles the Claude Certified Architect – Foundations exam tests run through this file:
- enforce critical rules in code;
- fix root causes at the cheapest layer;
- give subagents explicit context;
- keep tools few and well described;
- protect the context window;
- match the API mode to the latency need.

The exam guide is a useful public checklist of what a competent Claude architect knows. Treat it
as a competency map, not as product documentation. Some of its details already trail the live docs.

## 2. Choosing the surface

| If the user needs… | Build on | Why |
|---|---|---|
| A single model call, or a fixed workflow with AI nodes | **Claude API** (Messages) with tool use | Full control; the workflow lives in your code |
| A custom agent with a file system, shell, built-in tools, hooks, sessions and subagents | **Claude Agent SDK** | It's the same agent loop and tools that power Claude Code, as a library |
| A hosted agent with a managed sandbox and no harness to run | **Managed Agents** on the Claude platform | The harness and the sandbox are operated for you |
| Developers working faster in a repository | **Claude Code**, configured for the team | Shared instructions, commands, skills, hooks and MCP servers |
| Automated review, triage or generation in CI | **Claude Code headless** (`-p`) or the GitHub Action | Non-interactive, scriptable, structured output |

Start with the simplest surface that works. Many "agents" are an API call with two tools.

## 3. The concept map

| Design concept | Claude mechanism |
|---|---|
| Agent loop with protocol stop signal | `stop_reason`: `tool_use` means run the tools and continue; `end_turn` means done. The Agent SDK runs this loop for you |
| Per-run budgets | SDK `maxTurns` / `max_turns`, a spend cap (`maxBudgetUsd` / `max_budget_usd`), and limits on subagent depth and concurrency |
| Coordinator and subagents | The **Agent tool** (formerly named "Task"). Define subagents with `AgentDefinition` (description, prompt, tools, model, skills, MCP servers, max turns) or as Markdown files in `.claude/agents/` |
| Explicit subagent briefs | A non-fork subagent receives only the Agent tool's prompt string (plus project instructions and its own definition), not the parent conversation. A **fork** copies the conversation instead |
| Parallel subagents | Several Agent tool calls in one turn |
| Least privilege per agent | `tools` / `disallowedTools` on each subagent; `allowedTools` and permission modes on the session |
| Code gates on tool calls | **Hooks.** `PreToolUse` can deny a call (exit code 2, or a JSON `permissionDecision` of `deny`) or escalate it to the user (`ask`). `PostToolUse` can transform or check results. `Stop` / `SubagentStop` can refuse to let a run end until a check passes |
| Always-on project knowledge | `CLAUDE.md` (or `AGENTS.md`), loaded every session. Keep it short |
| On-demand knowledge and procedures | **Skills** (`SKILL.md`), loaded only when relevant (progressive disclosure) |
| Path-specific conventions | `.claude/rules/*.md` with `paths:` globs; they load only when matching files are touched |
| External systems | **MCP servers**: shared in a project `.mcp.json` with `${ENV_VAR}` secrets, personal ones at user scope |
| Structured output | Tool use with a JSON schema, `tool_choice` (`auto`, `any`, or a forced tool), and the API's native structured outputs (a JSON-schema output format; strict tool schemas) |
| Context management | Subagents for exploration, compaction (`/compact`, auto-compaction), context editing (clearing old tool results), memory files, prompt caching for stable prefixes |
| Sessions and branching | `resume` (continue a session by ID), `fork_session` / `forkSession` (branch from a shared baseline). A fork branches the conversation, not the files on disk |
| Offline bulk work | **Message Batches API:** roughly half price, results within 24 hours, no latency guarantee, one request per item (no multi-turn tool loop inside a request), matched by `custom_id` |
| Grounded answers | Citations on documents; keep source metadata in tool results |

## 4. Agent SDK

- **What it gives you:** Claude Code's harness as a library (Python and TypeScript), with built-in
  file, shell and search tools, the agent loop, hooks, sessions, permissions, subagents, MCP and
  skills. You write the tools and gates specific to your domain.
- **Gates belong in hooks or in your tool code**, not in the system prompt. A refund limit is a
  `PreToolUse` check on the refund tool, or a check inside the tool itself. A required identity
  check is a prerequisite your tool code verifies before acting.
- **Subagents isolate context.** Only the subagent's final message returns to the parent. Put file
  paths, earlier findings, error messages and decisions into the Agent tool prompt, because nothing
  else is passed. Subagents can spawn their own subagents (up to a configurable depth), so cap
  depth, concurrency and spend for any open-ended task.
- **Recent models delegate readily.** Set the spend and concurrency limits and say in the prompt when
  delegation is wanted; don't rely on the model's own restraint.
- **Sessions.** Resume when the earlier context is still true. After the environment changed, a
  fresh session seeded with a structured summary is usually more reliable than resuming with stale
  tool results.
- **Restrict tools per subagent.** A reviewer gets read-only tools. A tool left out of a subagent's
  list doesn't exist in its session.

## 5. Claude Code as a team platform

When the deliverable is "make our developers effective with Claude Code," configuration is the
product. Put each kind of knowledge where it belongs:

| What | Where | Why |
|---|---|---|
| Team conventions that apply almost everywhere | Project `CLAUDE.md` (aim for under 200 lines) | Loaded every session. Every line costs attention, so cut anything whose removal wouldn't cause mistakes |
| Personal preferences | `~/.claude/CLAUDE.md` or a gitignored `CLAUDE.local.md` | Not shared. A classic bug is team rules living at user level, so new teammates never get them |
| Conventions for some file types | `.claude/rules/` with `paths:` globs | Loads only when relevant; works across directories where a subdirectory CLAUDE.md can't |
| Repeatable procedures and domain knowledge | Skills in `.claude/skills/` | Load on demand. Frontmatter can restrict tools (`allowed-tools`), run the skill in an isolated subagent (`context: fork`), or make it user-only (`disable-model-invocation`) |
| Team slash commands | Skills (or `.claude/commands/`) committed to the repo | Shared through version control; personal variants live under `~/.claude/` |
| Rules that must always hold | Hooks and permission rules in `.claude/settings.json`; organization-wide policy in managed settings | Instructions are advisory; hooks and permissions are deterministic |
| External tools | `.mcp.json` (shared) vs user scope (personal) | Secrets via environment variables, never committed |
| Specialized helpers | Subagents in `.claude/agents/` | Isolated context and restricted tools |
| Packaging all of the above | A **plugin** (skills, agents, hooks, MCP servers, commands) | One install for the whole team |

Working practices worth teaching a team:
- **Plan mode for large or ambiguous changes** (multi-file refactors, migrations, architectural
  choices). Execute directly when you could describe the diff in one sentence.
- **Give Claude a check it can run:** tests, a build, a linter, a screenshot. Then it can verify
  instead of asserting.
- **Use explore subagents** for broad codebase searches, so the main context stays clean.
- **Clear between unrelated tasks.** After two failed corrections, start fresh with a better prompt.
- **Separate writer and reviewer sessions.** A fresh context isn't attached to code it just wrote.
- **Concrete input/output examples** when prose instructions get interpreted inconsistently, and an
  interview step ("ask me questions before you build") for underspecified work.

## 6. Claude Code in CI

- Run non-interactively with `claude -p` (print mode). Without it, a CI job waits for input that
  never comes.
- Request machine-readable output (`--output-format json`, with a JSON schema when the output feeds
  another step, such as inline PR comments).
- Restrict tools and permissions explicitly for unattended runs.
- **Review with an independent instance**, not the session that generated the change.
- **Cut false positives before adding coverage.** A review bot that cries wolf trains developers to
  ignore it. Use explicit reporting criteria, define severity levels with examples, and temporarily
  disable a noisy category while you fix it.
- On re-review after new commits, pass the earlier findings and ask only for new or unresolved
  issues.
- Large diffs: review per file, then one cross-file pass.
- Blocking checks stay synchronous. Batch processing suits nightly or weekly reports, never a
  pre-merge gate.

## 7. Claude API features that matter for agents

- **Tool use and `tool_choice`:** `auto` for conversation, `any` to require a tool when the right
  schema depends on the input, a forced tool to guarantee a first step.
- **Structured outputs:** native JSON-schema output and strict tool schemas guarantee valid
  structure. Semantic validation (totals add up, fields consistent) is still your code's job.
- **Prompt caching** for stable prefixes (system prompt, tool definitions, large reference
  documents). It cuts cost and latency on multi-turn agents. Design prompts so the stable part
  comes first.
- **Message Batches** for bulk offline work (see the concept map).
- **Citations** for document-grounded answers.
- **Model choice per role:** a smaller model for high-volume routing or extraction, a stronger one
  for planning and hard judgment. Pin versions and re-run the eval set before switching
  (`production-readiness.md`).

## 8. Common wrong answers

These options look plausible and come up constantly in design reviews:

| Tempting answer | Why it's wrong | Better |
|---|---|---|
| "Add a line to the system prompt: never refund over the limit" | Probabilistic; it fails at some rate, and each failure costs money | Hook or tool-level check, with an escalation path |
| "The agent keeps confusing two tools, so add a routing classifier" | Over-engineered; the cause is usually the descriptions | Rewrite the descriptions first, then measure |
| "Escalate when the customer sounds angry, or when the model's confidence is below 0.7" | Sentiment and self-reported confidence don't track complexity | Explicit triggers: asked for a human, policy gap, no progress |
| "The subagent will know what we discussed" | Non-fork subagents start without the parent conversation | Put the findings and constraints in the brief |
| "Give every agent every tool, just in case" | Selection degrades; least privilege is lost | 4–5 role-specific tools, plus narrow cross-role ones |
| "Have it double-check its own work" | Self-review rarely overturns its own reasoning | Independent reviewer instance, or an environment check |
| "Move everything to the batch API to save half" | No latency guarantee | Batch only work nobody is waiting on |
| "Use a bigger context window for the 40-file review" | Attention dilutes regardless of window size | Per-file passes plus a cross-file pass |
| "Retry until the extraction validates" | Retries can't recover data absent from the source | Nullable fields; route the missing data to review |
| "Put the team's rules in my `~/.claude/CLAUDE.md`" | User scope isn't shared | Project `CLAUDE.md`, rules, or a plugin |

## 9. Further learning and companion skills

- Anthropic engineering posts:
  - "Building effective agents"
  - "Writing effective tools for agents"
  - "Effective context engineering for AI agents"
  - "How we built our multi-agent research system"
  - "Effective harnesses for long-running agents"
  - "Code execution with MCP"
  - "Equipping agents for the real world with Agent Skills"
  - "Demystifying evals for AI agents"

  Sources are in `industry-evidence.md`.
- The Claude Certified Architect – Foundations exam guide (Anthropic Partner Academy). It sets out
  five domains: agentic architecture and orchestration, tool design and MCP, Claude Code
  configuration, prompt engineering and structured output, and context management and reliability.
- Anthropic Academy courses: Building with the Claude API, Claude Code in Action, Introduction to
  MCP, Introduction to Agent Skills, Introduction to Subagents.
- **Companion skills for implementation.** Suggest these to the user; don't assume they're
  installed:
  - Anthropic's `claude-api` and `mcp-builder` skills;
  - the `agent-sdk-dev`, `plugin-dev` and `mcp-server-dev` plugins;
  - open-source harness and context-engineering skill collections.

  This skill decides *what* to build and how to judge it. Those help write the code.
