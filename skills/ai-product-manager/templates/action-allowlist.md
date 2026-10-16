# Ontology and Action Allow-List: <agent>

> Written by product · reviewed by architecture · **signed by the business owner** (name): …

## 1. Concepts (10–30; each must pass the three-sentence contract)
| Concept | Definition (business-confirmed) | Who uses it | At which step | If inconsistent… |
|---|---|---|---|---|
| e.g. amount | tax-inclusive order total | agent, payables step | AP calculation | false alerts; reconciliation breaks |

## 2. Relations (check direction)
- <A> has many <B> · <B> depends on <C> · <C> determines <D> · <event> triggers <approval>

## 3. Permission table
| May read (no side effects, broad) | May suggest (a human executes) | Never (not in the tool list) |
|---|---|---|
| | | |

## 4. Allow-listed tools (everything else forbidden)
| Tool | Read / write | Reversible? | Financial / legal impact | Autonomy | Approval required |
|---|---|---|---|---|---|

## 5. Approval and write-back flows
For each "suggest": who approves, through which flow, how the approved change is written back.

## 6. Enforcement and audit
- Enforced in: <permission system / API auth>, not only in prompts.
- Every action logged with trace ID; attempted forbidden actions **alert immediately.**
- Lethal-trifecta check: private data? untrusted input? external send? → which leg is broken: …

## Review questions
Any ambiguous concept? Any relation pointing the wrong way? Can every prohibition be blocked
technically?
