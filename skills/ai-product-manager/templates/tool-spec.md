# Tool Spec: `<service_resource_verb>`

- **Owner:** <name> · **Used by agents:** <roles> · **Risk:** read | write · reversible? · money/compliance impact
- **Autonomy level:** inform | suggest | conclude | execute · **Gate:** <none | prerequisite | hook | human approval>
- **Effects:** idempotent? <yes / key = …> · retry policy: <reads: auto on transient · writes: never blind; a timeout = unknown, reconcile first> · prepare/commit split? <tool names>

## Description (what the model reads)
> <One-sentence purpose in users' words.> Use this when <situation>. For <neighboring case>, use
> `<other_tool>` instead. <Key limits or edge cases.> Example: <realistic call>.

## Inputs
| Name | Type / format | Required | Allowed values / example | Notes |
|---|---|---|---|---|

## Output
| Field | Meaning | Always present? |
|---|---|---|

- **Empty result means:** <successful search, nothing matched>
- **Trimmed/paginated:** <default page size, concise vs detailed mode>
- **Source metadata included:** <doc id, page, URL, date>

## Errors
| Category | Example | Retryable | Message to the agent | Partial results? |
|---|---|---|---|---|
| transient | timeout, rate limit | yes | | |
| validation | bad date format | after fix | | |
| business_rule | over refund limit | no | <wording the agent may pass to the user> | |
| permission | not allowed for this user | no | | |

## Tests
- Realistic tasks that should pick this tool: <N> · tasks that should pick its neighbor: <N>
- Metrics: selection accuracy · error rate by category · avg calls per task · tokens returned

*The description is part of the version bundle: a change goes through the eval gate like a prompt
edit.*
