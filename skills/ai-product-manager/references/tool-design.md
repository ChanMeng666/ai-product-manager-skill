# Tool Design: The Agent's Action Space and Its Contracts

Contents: 1) Tools are the interface, not plumbing · 2) Choosing the tool set · 3) Writing tool
definitions · 4) Tool results · 5) Error contracts · 6) Controlling tool choice · 7) Structured
output and validation · 8) MCP: integrating external systems · 9) Testing tools

An agent can only be as good as the tools it's given. Tool definitions are read by the model on
every call and decide which action it takes, so they are product surface, not plumbing. And the
tool list *is* the action space: whatever is on it will eventually be called (see
`ontology-and-guardrails.md` for the allow-list that decides what goes on it).

## 1. Tools are the interface, not plumbing

A traditional API is written for a developer who reads the docs once and writes deterministic code.
A tool is written for a model that reads the description every time and decides on the fly. Two
consequences:
- **Ambiguity becomes misrouting.** A human developer who sees `analyze_content` and
  `analyze_document` reads the docs. A model guesses, differently on different runs.
- **Verbosity becomes cost and confusion.** Every field a tool returns spends attention budget.

Write tools the way you would onboard a capable new hire to an internal system: what it's for, when
to use it, what it needs, what comes back, and what the usual mistakes are.

## 2. Choosing the tool set

- **Few, high-value tools beat a wrapper per API endpoint.** Selection reliability drops as the
  list grows. As a working rule, keep each agent to the handful of tools its role needs (around 4
  to 5 is a healthy range for a focused agent), and split roles before letting one agent hold 15+.
  The right number depends on the model and the tools, so treat this as a heuristic and measure
  selection accuracy on your own tasks.
- **Shape tools around tasks, not endpoints.** If the agent always lists availability and then
  books, one `schedule_meeting` tool that does both is safer and cheaper than two calls the model
  must chain correctly. The exception is a consequential commit: never fold a step that needs
  approval into a tool the agent can call freely. Split it into prepare and commit tools
  (`agent-architecture.md` §5).
- **Constrain generic tools.** Replace `fetch_url(any)` with `load_document(id)` that validates
  the source. Replace `run_sql(any)` with named, parameterized queries. A generic tool is a
  blocklist problem in disguise.
- **Namespace names** by service and resource (`crm_get_customer`, `billing_issue_refund`) once
  more than one system is connected, so similar verbs don't collide.
- **Rate every tool:** read-only or write, reversible or not, and the money or compliance impact.
  The rating decides its autonomy level and whether it needs a code gate
  (`agent-architecture.md` §5).
- **Prefer an existing integration** for standard systems (ticketing, code hosting, docs) and build
  custom tools only for what is specific to the workflow.

## 3. Writing tool definitions

The description is the primary input the model uses to choose a tool. Most "the agent picked the
wrong tool" bugs are fixed here, before any architecture change.

A good definition states:
- **Purpose in one sentence**, using the words users and the system prompt use.
- **When to use it instead of its nearest neighbor.** "Use for orders placed online; for in-store
  purchases use `pos_lookup_receipt`."
- **Inputs:** unambiguous names (`customer_id`, not `id`), formats with an example
  (`"2026-03-01"`, ISO 8601), required vs optional, and allowed values as enums.
- **What comes back**, including what an empty result means.
- **Edge cases and limits:** maximum page size, what happens with partial matches.

Make mistakes hard rather than documenting them: require absolute identifiers instead of relative
ones, use enums instead of free text, and reject invalid input with a helpful error.

**An ID in model output or user text is a lookup candidate, not proof.** Act only on records that
an authorized read brought into this run. Prices, eligibility and required disclosures come from
the owning system: the model selects them, it doesn't compute or restate them.

Also check the system prompt. A keyword rule there ("whenever the user mentions a document, call
`analyze_document`") can silently override a well-written description.

## 4. Tool results

- **Return high-signal, human-readable fields.** Resolve opaque IDs into names where the model
  needs them; drop internal fields it doesn't.
- **Trim, filter and paginate at the source,** with sensible defaults. Offer a concise and a
  detailed mode if both are needed.
- **Normalize formats** (dates, currencies, status codes) before the model sees them, in the tool or
  a post-tool hook, so it doesn't reason over three timestamp formats.
- **Keep source metadata** (document, page, URL, date) in structured fields next to the content.

## 5. Error contracts

A tool that fails with "Operation failed" leaves the agent two bad options: retry blindly or give
up. Return a structured error instead:

| Field | Purpose |
|---|---|
| category | `transient` (timeout, rate limit), `validation` (bad input), `business_rule` (policy forbids it), `permission` |
| retryable | whether trying again could succeed |
| message | what went wrong and how to fix the call, in plain words |
| partial results | anything that did succeed |

- **Business-rule failures are not retryable.** Say so, and include wording the agent can pass on
  to the user ("refunds above the limit need a supervisor; I've opened a request").
- **Distinguish "no matches" from "lookup failed."** An empty list is a successful answer. A timeout
  is not. Encode them differently, or the agent will tell a customer they have no orders when the
  database was down.
- Use the protocol's error flag where one exists (MCP has one), so clients can tell errors from
  results without parsing text.

## 6. Controlling tool choice

Most APIs let you set how tool use is chosen:
- **auto:** the model may answer in text or call a tool. The default for conversational agents.
- **any / required:** the model must call some tool. Useful when the output must be structured
  but the right schema depends on the input.
- **forced:** the model must call a specific tool. Useful to guarantee a first step (extract
  metadata before anything else), then release control on later turns.

When a capped action is exhausted, the refusal should say what to do next ("revision limit
reached; finalize with the best draft"), so the agent changes course instead of retrying.

Forcing a tool guarantees that it gets called, not that the call is correct. Order-of-operations
rules that matter for money or compliance still belong in a prerequisite gate.

## 7. Structured output and validation

When downstream code consumes the output, make it structured: a JSON schema enforced through tool
definitions or the API's native structured-output mode.

- **A schema fixes syntax, not meaning.** It guarantees valid JSON with the right fields. It doesn't
  guarantee the line items add up to the total or that a value landed in the right field. Add
  semantic checks in code.
- **Make fields nullable when the source may lack them.** A required field the document doesn't
  contain is an instruction to invent a value.
- **Give categories an escape hatch:** `unclear`, or `other` plus a detail string. Forced choices
  produce confident misclassification.
- **Build in self-checks:** extract `stated_total` and `calculated_total` and compare; set a
  `conflict_detected` flag when sources disagree.
- **Validation-retry loops:** on failure, retry with the original input, the failed output and the
  specific validation errors. This fixes format and structure errors. **It can't recover
  information that isn't in the source.** If the field is missing, retrying produces invention;
  return null and route to review instead.
- **Few-shot examples** of tricky documents (varied layouts, missing fields) reduce invented values
  more than extra instructions do.

For large offline jobs, batch interfaces are typically much cheaper but have no latency guarantee
and can't run a multi-turn tool loop inside one request. Use them for overnight or weekly work,
never for a check someone is waiting on. Match requests to results by ID, and resubmit only the
failed items, with the fix applied.

## 8. MCP: integrating external systems

The Model Context Protocol (MCP) standardizes how agents connect to external systems: servers
expose **tools** (actions), **resources** (readable content) and **prompts** (templates).

- **Expose catalogs as resources.** A list of available documents, schemas or open issues as a
  resource saves the agent dozens of exploratory tool calls.
- **Every connected server's tools compete for selection.** Connecting ten servers "just in case"
  degrades routing for all of them. Connect what the role needs, and write descriptions good enough
  that the agent prefers the right server's tool over a generic built-in.
- **Keep secrets out of shared config.** Reference environment variables instead of committing
  credentials. Separate shared, project-level server config from personal, experimental config.
- **For many tools, load definitions on demand.** Presenting tools as discoverable code or a
  searchable catalog, and filtering large data inside an execution sandbox, can cut token use by
  orders of magnitude, at the price of running and securing that sandbox.
- **Rate the effect, not the name.** A read-only annotation, a harmless-sounding name, or an HTTP
  GET that saves something doesn't make a tool read-only. Reaching a connector proves access, not
  permission for this user, this action, now.
- **Third-party servers are third-party code** with your agent's permissions. Review them like a
  dependency, and apply the lethal-trifecta test (`risk-and-governance.md`).

## 9. Testing tools

- **Evaluate tools with realistic tasks,** not unit calls: give an agent 20 or more real tasks,
  read the transcripts, and look for wrong tool picks, malformed parameters, redundant calls and
  confusion between neighbors.
- **Let an agent critique the tools.** Feeding transcripts back to a model and asking it to rewrite
  confusing descriptions is a cheap, effective improvement loop. Re-run the tasks to confirm.
- **Track per-tool metrics:** selection accuracy, error rate by category, average calls per task,
  tokens returned.
- **Tool definitions are part of the version bundle.** A changed description is a changed product:
  it goes through the eval gate like a prompt edit.

Record each tool's contract on `templates/tool-spec.md`.
