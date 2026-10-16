# AI PRD: <feature / project>  (v1.0)

> The core of an AI PRD is three things: **non-goals, success metrics, stop conditions.** Everything
> else supports those.

## 1. Problem and business metric
- Problem (verifiable): …
- Baseline: … (method, sample)
- Business metric it moves, and the target: …

## 2. Users and workflow
- Primary user(s) by name or role, and where the feature lives (existing tool): …
- Current workflow → new workflow (mark AI / human / system steps): …

## 3. Why AI (and why not rules)
- Rules or workflow baseline considered: … result: …
- Chosen option on the certainty axis (rules / workflow / RAG / agent), with justification: …

## 4. Vertical slice (this release)
| Layer | Definition |
|---|---|
| Data (minimum set) | |
| Logic (decision chain) | |
| Interaction (host tool) | |
| Fallback (who takes over, how to revert) | |

## 5. Autonomy and human-in-the-loop (per action)
| Action | Autonomy (inform / suggest / conclude / execute) | Reversible? | Human step | Approver |
|---|---|---|---|---|

## 6. Permissions (read / suggest / never)
| May read | May suggest | Never |
|---|---|---|

## 7. Non-goals
| Not doing | Reason |
|---|---|

## 8. Deferrals with return conditions
| Not in this phase | Because | Enters next phase when |
|---|---|---|

## 9. Success metrics (three layers) and red lines
- Model quality (per slice): …
- Adoption: completion / edit / abandonment / acceptance: …
- Business: …
- **Red lines (program-checkable assertions, non-relaxable):** …

## 10. Error handling and UX
- Error types (likelihood × severity) and handling per grade: …
- What the user sees when: retrieval is empty / a tool fails / confidence is low / out of scope: …
- Sources and citations shown how: …

## 11. Non-functional requirements
Latency (p95), cost per task budget, concurrency, availability, data residency and privacy: …

## 12. Stop conditions and exit criteria
- Stop: metric / time / root cause (each with threshold, observation point, action): …
- Graduation: by <date>, <metric> reaches <value> on ≥ <n> samples → <next stage>; otherwise …

## 13. Open hypotheses (from the ledger)
| Hypothesis | Evidence level | Verification plan |
|---|---|---|

## 14. Owners
Accountable for the outcome: … · Eval gate signer: … · UAT signer: … · Production gate signers: …
