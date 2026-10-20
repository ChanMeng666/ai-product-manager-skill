# Risk and Governance

Contents: 1) Risk-tier triage at discovery · 2) High-stakes domains · 3) LLM and agent security
risks · 4) Frameworks: NIST AI RMF, EU AI Act · 5) Data privacy and logging · 6) Liability ·
7) A minimum governance pack

> Regulations and standards change. Treat dates and article references here as orientation, and
> verify them against primary sources and legal counsel for your jurisdiction before relying on
> them.

## 1. Risk-tier triage at discovery

In week one, before any design, answer:
- **What's the worst plausible harm** of a wrong output (money, safety, health, legal rights,
  reputation)? Is it reversible?
- **Who is affected:** employees only, customers, patients, the public?
- **Which regulatory regime applies?** (e.g. EU AI Act tier, sector rules)
- **Which security risks apply?** (§3: does the system read untrusted content? can it act or
  communicate externally?)
- **What autonomy level is acceptable per action?** (`solution-selection.md` §4)

The answers set the scope, timeline and gates. A zero-tolerance domain is not a slower version of a
normal project. It's a different design.

## 2. High-stakes domains: what changes

From the clinical decision-support case (`case-studies.md`):

- **Error tolerance is zero**, which changes everything downstream.
- **Autonomy level is fixed at L2 (suggest).** No diagnosis, no ordering, no patient-facing output,
  nothing written into the formal record.
- **Responsibility:** the AI bears none. The clinician who adopts a suggestion does. So **every
  suggestion must be reviewable.** The bar for the first version is reviewability, not accuracy.
- **Red lines become program-checkable assertions** with a threshold of zero: no unsourced
  conclusions, no definitive tone, no cross-population extrapolation.
- **Source versioning is a hard constraint.** Mixing old and new guideline versions was the biggest
  error source, bigger than model capability.
- **Silence is harder than speech.** Models naturally fill the space with words. You must design
  them to know when they don't know, and to say what information is missing.
- **Transparency drives adoption.** Showing evidence and source versions on the first screen lifted
  adoption from 31% to 79% with the same model.
- **Validation cost grows per category.** Each extra disease, product or jurisdiction needs new
  expert labeling and retrospective review, so cut coverage hard.
- **Audit everything:** who saw which suggestion, when, accepted or not, which source version.

Other domains to treat as high-stakes:
- **Finance:** credit, trading, payments, AML, where model-risk-management rules often apply.
- **Hiring and HR:** employment decisions.
- **Insurance:** pricing and claims.
- **Legal:** advice and contract commitments.
- **Safety-critical industrial operations:** a fabricated repair step can put someone inside a
  machine.

**The meta-lesson:** low-risk projects compete on speed. High-risk projects compete on who dares to
say less.

## 3. LLM and agent security risks

**OWASP Top 10 for LLM Applications (2025):**
1. LLM01 Prompt Injection
2. LLM02 Sensitive Information Disclosure
3. LLM03 Supply Chain
4. LLM04 Data and Model Poisoning
5. LLM05 Improper Output Handling
6. LLM06 Excessive Agency
7. LLM07 System Prompt Leakage
8. LLM08 Vector and Embedding Weaknesses
9. LLM09 Misinformation
10. LLM10 Unbounded Consumption

OWASP also maintains a separate Top 10 for **agentic** applications. It covers goal hijacking, tool
misuse, identity and privilege abuse, memory and context poisoning, cascading failures, and rogue
agents.

PM-level controls:
- **Excessive agency (LLM06)** is a product decision. Shrink the action allow-list
  (`ontology-and-guardrails.md`), use least privilege, and require human approval for irreversible
  actions.
- **The "lethal trifecta"** (a framing popularized by Simon Willison): **private data + untrusted
  content + external communication** in one agent makes data exfiltration via prompt injection
  possible. Break at least one leg. Once an agent has read untrusted input, it shouldn't be able to
  trigger consequential actions or send data out. In security, blocking 95% of attacks is a
  failure.
- **Improper output handling:** never pass model output straight into SQL, shell, HTML or APIs
  without validation.
- **Misinformation (LLM09):** require citations and refusal on missing evidence.
- **Unbounded consumption:** set per-run budgets and per-user rate limits.
- **RAG access control:** retrieval must respect the source systems' permissions, so the assistant
  sees only what the asking user may see.
- **Guardrails vs. evaluators:** inline guardrails must be fast and deterministic (schema, regex,
  light classifiers). Slow LLM judges run asynchronously.
- **Act only on complete tool calls,** and don't stream sensitive text to users before the output
  guardrails have run.

## 4. Frameworks

**NIST AI Risk Management Framework (AI RMF 1.0)** has four functions:
- **Govern:** culture, policies, accountability.
- **Map:** context, intended use, impacts.
- **Measure:** assess and track risks.
- **Manage:** prioritize and act.

Its trustworthiness characteristics:
- valid and reliable;
- safe;
- secure and resilient;
- accountable and transparent;
- explainable and interpretable;
- privacy-enhanced;
- fair, with harmful bias managed.

The **Generative AI Profile (NIST AI 600-1)** lists GenAI-specific risks, including confabulation,
data privacy, information integrity, information security, harmful bias, human-AI configuration, IP,
and value-chain integration. These four functions are a useful checklist even outside the US.

**EU AI Act (Regulation (EU) 2024/1689)** uses a risk-tiered model:
- **Unacceptable risk:** prohibited practices.
- **High risk:** e.g. AI in hiring, credit scoring, education, essential services, law enforcement,
  and safety components of regulated products. It brings obligations for risk management, data
  governance, documentation, logging, human oversight, accuracy and robustness.
- **Limited risk:** transparency duties, such as disclosing AI interaction and labeling synthetic
  content.
- **Minimal risk.**

Timeline (verify before relying on it):
- Prohibitions and AI-literacy duties applied from February 2025.
- General-purpose AI model obligations applied from August 2025.
- A 2026 "Digital Omnibus" amendment postponed several high-risk deadlines: Annex III use cases to
  around December 2027, product-embedded (Annex I) to around August 2028.

Fines for prohibited practices can reach the higher of €35M or 7% of global turnover.

## 5. Data privacy and logging

- Vendor terms: zero data retention, no training on your data, data residency.
- Redact PII **before** the model call where possible, and **before** logs are written. AI logs hold
  employees' and customers' free-text questions, so they're often more sensitive than the business
  data.
- Define log retention and access. Separate audit logs (keep) from debug logs (short retention).
- **Memory is personal data with limited authority.** Store what the user asserted, not model
  guesses; let users see, correct and delete it; a remembered preference never overrides policy.
- Data minimization in the slice: request only the fields the scenario needs (this also speeds up
  security review).
- Shadow AI is real. Employees widely use personal chatbots at work. A sanctioned, usable tool is
  often the best privacy control.

## 6. Liability: assume you own every output

In *Moffatt v. Air Canada* (2024), a Canadian tribunal held an airline liable for its website
chatbot's invented refund policy. The tribunal rejected the argument that the chatbot was
responsible for its own statements, and linking to the correct policy elsewhere didn't cure the
misstatement. Design factual and policy answers to cite authoritative, *versioned* sources, and to
refuse when the source is missing. Put a named business owner behind every customer-facing
commitment.

## 7. A minimum governance pack (one page each)

1. **Risk-tier record:** harms, affected parties, regime, autonomy per action.
2. **Action allow-list and permission table** (read / suggest / never) with business sign-off.
3. **Red-line assertions,** program-checkable, with thresholds and signers.
4. **Data sheet:** sources, owners, permissions, PII handling, retention.
5. **Model and prompt version register** with the eval results that justified each promotion.
6. **Audit-log specification:** what's recorded per decision, and for how long.
7. **Incident runbook** and escalation path with named people.
