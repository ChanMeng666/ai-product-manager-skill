# Project Charter: <project name>

> One page. If it doesn't fit, the judgment isn't clear yet.
> Version: v0.1 · Date: YYYY-MM-DD · Owner (accountable): <name>

## 1. One-line positioning
For **<who>**, in **<situation / trigger>**, to **<outcome>**.
*(No "empower", "closed loop" or "leverage". If one appears, rewrite the line.)*

## 2. Why now
<incident / executive mandate / competitor / other>. This sets priority: <high / medium / low>.

## 3. Problem and baseline
| Metric | Today (measured, not estimated) | How measured | Sample |
|---|---|---|---|
| e.g. minutes per verification | 38 min | shadowed 5 orders | n=5 |
| e.g. delays per month | | | |
| e.g. cost of one error | | | |

## 4. Non-goals (at least as long as section 5)
| We will NOT | Because | Revisit when |
|---|---|---|
| e.g. auto-change the production schedule | irreversible; error cost = line runs on a wrong plan | slice stable 3 months + separate risk review |
| | | |

## 5. Scope of this phase (one vertical slice)
Scenario: **<who> / <when> / <must accomplish>**. Data: <minimum set>. Lives in: <existing tool>.
Fallback: <who takes over on error, how to revert>.

## 6. Hypothesis ledger (sorted by cost if wrong)
| Hypothesis | Evidence level (confirmed / partial / guess) | How to verify | Cost if wrong |
|---|---|---|---|
| | | | |

## 7. Success metrics (three layers)
- **Business:** <metric, baseline → target, by when>
- **Adoption:** <e.g. acceptance rate ≥ 40%, weekly active eligible users>
- **Quality / safety red line:** <e.g. untraceable claims ≤ 3%; zero overreach>

## 8. Stop conditions (written now, before investment)
1. Metric: <core metric> below <threshold> for <N> consecutive weeks → stop this phase.
2. Time: no closed loop within <N> weeks → stop this phase.
3. Root cause: <key data> does not exist and can't be produced within <N> months → stop.

## 9. Responsibility
| Activity | Accountable (one name) |
|---|---|
| Define success metrics | |
| Go / no-go to pilot | |
| Review errors / rollback authority | |

## 10. Three-line contract for the next review
1. I hand over: …
2. I need from you: …
3. If missing: …
