# Launch Gate Checklist: <system>  (any unticked item = no production)

## Quality is measurable
- [ ] 1. Fixed eval set (not assembled on the spot), version-locked
- [ ] 2. Covers main scenarios **and** adversarial / long-tail samples
- [ ] 3. Explicit pass thresholds, written before the run, with a signer

## Risk is controlled
- [ ] 4. Error types graded; each grade has a handling strategy
- [ ] 5. High-risk outputs require human confirmation (in the UI, not just the plan)
- [ ] 6. Overreaching actions 100% blocked, verified by test (allow-list enforced in permissions)

## Observable
- [ ] 7. End-to-end tracing; every call traceable and reproducible (trace ID)
- [ ] 8. Core metrics monitored **with alerts**, including at least one AI-quality metric

## Recoverable
- [ ] 9. Rollback to the last stable version within minutes. **Last drill: <date>, took <min>**
- [ ] 10. Human fallback path when the system is unavailable

## Someone is responsible
- [ ] 11. SLOs defined and measurable (availability, p95 latency, quality, adoption)
- [ ] 12. Runbook complete; **first responder at 3 a.m.: <name>**

## Also confirm
- [ ] Model snapshot + prompt version pinned (version bundle ID: …)
- [ ] Logs redacted before storage; retention: …
- [ ] Data / privacy sign-off: …
- [ ] Risk-tier record and action allow-list signed by the business owner
- [ ] Cost budget per task + per-run limits; kill switch tested
- [ ] Canary plan: stages, comparison metrics, degradation thresholds

## Gates and signers
| Gate | Signer(s), by name | Date |
|---|---|---|
| Eval gate | Tech lead: | |
| Acceptance (UAT) gate | Business owner: | |
| Production gate | Operations + business: | |
