# Eval Plan: <system>

## 1. Four-layer matrix
| Layer | Question | Metric(s) | Evidence method | Owner |
|---|---|---|---|---|
| Model quality | Right? Grounded? | per-failure-mode pass rate, untraceable-claim ratio | automated eval set in CI | |
| System reliability | Holds under load? Degrades gracefully? | p95 latency, error rate under fault injection | load test + fault injection | |
| User adoption | Do they use it? | completion / edit / abandonment, acceptance rate | UAT + telemetry | |
| Business value | Worth more investment? | baseline → pilot delta | pilot before/after | |

## 2. Golden set
- Source: <production logs / real records>. Size: <start 30–50 → 100–120>.
- Labeled by: <domain expert name> (final authority). High-stakes: double-blind + tie-breaker.
- Locked: model version <…>, prompt version <…>, knowledge snapshot <…>.

| Tier | Share (match production) | Examples |
|---|---|---|
| Functional | | |
| Edge (missing / ambiguous / threshold) | | |
| Adversarial (injection, out-of-scope) | | |
Also tagged by risk (read-only vs. write) and segment.

## 3. Failure modes (from error analysis, not imagination)
| Failure mode | Binary check | Automated how (code / LLM judge / human) | Judge validated? (TPR / TNR) |
|---|---|---|---|

## 4. Threshold cards (written before running)
| Metric | Slice | Min sample | Pass line | Signer | Who may relax |
|---|---|---|---|---|---|
| Untraceable-claim ratio | all | 200 | ≤ 3% | | **nobody (red line)** |
| | | | | | |

## 5. Launch thresholds beyond accuracy
- Layered metrics: worst slice = …
- Error grading: tolerable / block / second confirmation: …
- Recoverability: who notices, how fast, fix cost: …
- Consistency: N repeats agreement ≥ …; perturbation drift ≤ …; pass^k for critical flows ≥ …
- Control group: human score … · rules baseline …

## 6. Regression
Runs on every prompt / model / knowledge change. Blocks merge on regression. Incidents are added
as cases.
