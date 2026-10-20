# Industry Evidence (for persuading stakeholders)

Contents: Why AI projects fail · How leading builders say to build · LLM-as-judge reliability ·
Security and governance · The forward-deployed engineer (FDE) model · How to use evidence

Use these to show stakeholders that the problems in this skill are common, documented and
expensive. **Quote carefully:** each claim carries its source and caveats. Check the primary source
before putting a number in a board deck. Figures were collected in 2026, and the landscape moves
fast.

## Why AI projects fail: it's rarely the model

- **RAND Corporation, "The Root Causes of Failure for AI Projects and How They Can Succeed"** (2024,
  RR-A2680-1). It draws on interviews with 65 experienced data scientists and engineers, and cites
  estimates that more than 80% of AI projects fail, about twice the rate of non-AI IT projects.
  Root causes:
  - misunderstanding or miscommunicating the problem (the most common);
  - lacking the necessary data;
  - focusing on the latest technology instead of the problem;
  - inadequate infrastructure;
  - applying AI to problems too hard for it.

  → Supports: discovery, baselines, "certainty over sophistication."
  <https://www.rand.org/pubs/research_reports/RRA2680-1.html>
- **MIT NANDA, "The GenAI Divide: State of AI in Business 2025."** It reported that about 95% of
  organizations saw no measurable P&L return from GenAI pilots, and attributed this mainly to a
  "learning gap": tools that don't retain feedback, adapt to context or fit workflows. It also
  reported:
  - purchased or partnered solutions succeeded about twice as often as internal builds (about 67%
    vs. about a third);
  - more than half of budgets went to sales and marketing, while the clearest ROI was in back-office
    work;
  - employees at most companies used personal chatbots ("shadow AI").

  *Caveat:* small, self-selected sample. This is not a universal failure rate.
  → Supports: workflow integration, feedback loops, back-office focus.
  Coverage: <https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/>
- **Gartner (June 2025):** predicted that over 40% of agentic AI projects will be cancelled by the
  end of 2027, due to escalating costs, unclear business value or inadequate risk controls. It also
  warned of "agent washing" (relabeling existing products as agents).
  → Supports: agent-last selection, cost controls, stop conditions.
  <https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027>
- **Gartner (July 2024):** predicted at least 30% of GenAI projects would be abandoned after POC by
  end of 2025, citing poor data quality, inadequate risk controls, escalating costs and unclear
  business value. → Supports: POC as falsification, data-availability first.
- **S&P Global Market Intelligence (2025 survey):** the share of companies abandoning most AI
  initiatives rose to 42% (from 17% the prior year), and on average organizations scrapped almost
  half of POCs before production. → Supports: pilot purgatory is real; exit criteria.
- **McKinsey, "The State of AI" (2025):**
  - broad use of AI in at least one function, but only a minority reporting enterprise-level EBIT
    impact;
  - "high performers" were far more likely to have fundamentally redesigned workflows.

  → Supports: process redesign and adoption, not tool deployment.

**Don't cite** the widely circulated "IDC: 88% of POCs don't reach production." No primary source
could be located.

## How leading builders say to build

- **Anthropic, "Building effective agents"** (Dec 2024): "find the simplest solution possible, and
  only increase complexity when needed." It distinguishes workflows (predefined code paths) from
  agents (LLM-directed), and catalogs the patterns: prompt chaining, routing, parallelization,
  orchestrator-workers, evaluator-optimizer. It stresses simplicity, transparency and careful
  tool/interface design.
  <https://www.anthropic.com/engineering/building-effective-agents>
- **Anthropic, "Demystifying evals for AI agents"** (2026):
  - grade outcomes, not paths;
  - capability vs. regression suites;
  - pass@k vs. pass^k;
  - 20 to 50 tasks from real failures is a strong start;
  - layer defences (evals + monitoring + A/B + feedback + human review).

  <https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents>
- **OpenAI, "A practical guide to building agents"** (2025):
  - build agents for workflows that resist deterministic automation, otherwise a deterministic
    solution may suffice;
  - maximize a single agent before multi-agent;
  - layered guardrails;
  - rate tools by risk (read/write, reversibility, financial impact);
  - human intervention on failure thresholds and high-risk actions.

  <https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf>
- **Anthropic, "Writing effective tools for agents — with agents"** (Sep 2025):
  - a few thoughtful, task-shaped tools beat wrapping every API endpoint;
  - namespace tool names;
  - return high-signal context;
  - paginate and truncate with sensible defaults;
  - write actionable error messages;
  - describe tools as you would to a new hire;
  - iterate on tools with evals and transcript analysis.

  <https://www.anthropic.com/engineering/writing-tools-for-agents>
- **Anthropic, "Effective context engineering for AI agents"** (Sep 2025):
  - context is a finite attention budget, and recall degrades as it fills;
  - pitch system prompts at the "right altitude";
  - keep tools minimal and non-overlapping;
  - retrieve just in time;
  - for long tasks, use compaction, structured note-taking and sub-agents.

  <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>
- **Anthropic, "How we built our multi-agent research system"** (Jun 2025). A lead agent with
  parallel subagents outperformed a single agent by 90.2% on Anthropic's internal research eval.
  Multi-agent runs used about 15× the tokens of a chat. Token usage alone explained about 80% of
  the performance variance on the BrowseComp benchmark. Detailed subagent briefs and better tool
  descriptions were key fixes.
  *Caveat:* these are a vendor's own numbers on its own evals, for breadth-first research tasks.
  Use them to argue that multi-agent systems are expensive and justified only for high-value,
  parallelizable work, not as a general accuracy gain.
  <https://www.anthropic.com/engineering/multi-agent-research-system>
- **Anthropic, "Effective harnesses for long-running agents"** (Nov 2025):
  - an initializer step plus incremental sessions;
  - a structured task list and a progress log;
  - one feature at a time, verified end to end;
  - commit after each change.

  <https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents>
- **Anthropic, "Code execution with MCP"** (Nov 2025). Loading tool definitions on demand and
  filtering data in a sandbox cut one example workflow from about 150,000 to 2,000 tokens.
  *Caveat:* this is one illustrative workflow, and the sandbox adds its own operating and security
  cost. <https://www.anthropic.com/engineering/code-execution-with-mcp>
- **Anthropic, "Best practices for Claude Code"** (docs). The main recommendations:
  - give the agent a check it can run;
  - explore, then plan, then implement;
  - keep always-loaded instructions short;
  - remember that hooks are deterministic where instructions are advisory;
  - review with a separate session.

  <https://code.claude.com/docs/en/best-practices>
- **Anthropic, Claude Certified Architect – Foundations exam guide** (v1.0, Jul 2026). This is a
  public competency blueprint for production Claude architecture. Its five domains and weights:

  | Domain | Weight |
  |---|---|
  | Agentic architecture and orchestration | 27% |
  | Claude Code configuration and workflows | 20% |
  | Prompt engineering and structured output | 20% |
  | Tool design and MCP integration | 18% |
  | Context management and reliability | 15% |

  Its scenario answers consistently favor:
  - code enforcement over prompt instructions for critical rules;
  - root-cause fixes in tool descriptions over added machinery;
  - explicit subagent context;
  - structured error propagation;
  - explicit escalation criteria over sentiment or self-reported confidence.

  *Caveat:* some product details in the guide (such as the subagent tool's name) already trail the
  live docs. Partner Academy: <https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification>
- **Google PAIR, People + AI Guidebook:** "often a rule or heuristic-based solution will work just
  as well, if not better." Automate tedious or dangerous tasks; augment tasks people value or are
  responsible for. Weigh false positives against false negatives by real-world cost, and design
  graceful failure. <https://pair.withgoogle.com/guidebook/>
- **Hamel Husain & Shreya Shankar, LLM Evals FAQ:**
  - error analysis first (open, then axial coding);
  - binary pass/fail over Likert;
  - evaluators for observed failures;
  - a single domain-expert quality owner;
  - validate LLM judges against human labels;
  - most development time goes to error analysis and evaluation.

  <https://hamel.dev/blog/posts/evals-faq/>
- **"What We Learned from a Year of Building with LLMs"** (Yan, Bischof, Frye, Husain, Liu, Shankar,
  2024): focus on the system, not the model; models aren't a moat.
  <https://applied-llms.org>
- **Lenny's Newsletter / Podcast.** AI product leaders repeatedly name eval-writing as a core PM
  skill, and practitioners describe "evals as the new PRD." Writings on AI product lifecycles argue
  autonomy should be *earned*, starting low and widening as calibration evidence accumulates.

## LLM-as-judge reliability

- **Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena"** (2023). Strong judges
  reached human-level agreement, but showed position bias, verbosity bias and self-enhancement bias.
  Mitigate by swapping order and validating against humans. <https://arxiv.org/abs/2306.05685>
- **Shankar et al., "Who Validates the Validators?"** (2024): evaluation criteria drift as people
  grade outputs. Expect rubrics to evolve with error analysis. <https://arxiv.org/abs/2404.12272>

## Security and governance

- **OWASP Top 10 for LLM Applications (2025):**
  1. Prompt Injection
  2. Sensitive Information Disclosure
  3. Supply Chain
  4. Data and Model Poisoning
  5. Improper Output Handling
  6. Excessive Agency
  7. System Prompt Leakage
  8. Vector and Embedding Weaknesses
  9. Misinformation
  10. Unbounded Consumption

  <https://genai.owasp.org/llm-top-10/>
- **Simon Willison, "The lethal trifecta"** (2025): private data + untrusted content + external
  communication enables prompt-injection exfiltration.
  <https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/>
- **NIST AI RMF 1.0** (Govern / Map / Measure / Manage) and the **Generative AI Profile
  (NIST AI 600-1).** <https://www.nist.gov/itl/ai-risk-management-framework>
- **EU AI Act (Regulation (EU) 2024/1689):** risk tiers, with a 2026 amendment postponing several
  high-risk obligations. Verify current dates with counsel.
- **Moffatt v. Air Canada (2024 BCCRT 149):** company liable for its chatbot's invented policy.

## The forward-deployed engineer (FDE) model

- Pioneered at **Palantir**, which distinguished engineers building one capability for many
  customers from forward-deployed engineers working with one customer across many capabilities.
  Patterns from the field were generalized back into the product.
- AI labs including **OpenAI** and **Anthropic** run forward-deployed / applied-AI teams that embed
  with enterprise customers to deliver production systems. OpenAI's FDE leadership has publicly
  described model capability as a minority of the enterprise deployment gap, with data,
  permissions, evaluation and organization making up the rest. Industry reporting in 2025 described
  steep growth in FDE job postings.
- **The critique to remember:** without a feedback loop into reusable product assets, an FDE is "a
  consultant with a better title." Measure engagements by time to production and asset reuse.

## How to use evidence in a conversation

- Lead with the user's own baseline. External statistics support the point; they don't replace it.
- Pair every statistic with the mechanism it illustrates ("most failures trace to problem
  definition and data, which is why we're measuring the baseline this week").
- Never use failure statistics to argue for doing nothing. Use them to argue for **smaller, verified
  steps.**
