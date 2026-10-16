# POC Proof Plan: <project>

> A POC exists to **falsify** the highest-risk assumption. If any of the five sections is missing,
> the plan isn't done.

## 1. Highest-risk assumption (dies if false)
"<assumption>". Why it's the one: <consequence if false>.

Other assumptions (deferred, with return conditions):
| Assumption | Consequence (dies / hurts / optimizable) | When we'll test it |
|---|---|---|

## 2. Failure criteria (written BEFORE the actions, with numbers)
- Fails if: <e.g. accuracy < 85% on the edge-case set>
- Fails if: <e.g. null rate > 30% and not routed to a human>
- Fails if: <e.g. human-intervention rate > 40%>
- Signed by (name): …

## 3. Validation actions (each must be able to fail)
| Experiment | Design | Failure signal | Days |
|---|---|---|---|
| Data availability | Pull 20 real records, field by field; check definitions + read permission | ≥ 3 core fields unobtainable → stop | 1–3 |
| End-to-end | Follow 10 real cases start to finish; log time + stalls per step | Any step over its limit, or needs a human to patch data | 4–8 |
| Error cost | Inject edge + high-risk samples (true positives AND look-alikes); FP and FN separately; time to spot a false alarm | Unpredictable failure modes or no rollback | 6–11 |
| Adoption | N real users, 1–2 weeks, observe only; daily opens + acceptance rate | Opens below baseline usage line | 12–14 |

## 4. Evidence level
What counts as evidence (logs, labeled results, telemetry) vs. what doesn't (demo video,
impressions).

## 5. Time box
Hard end date: <date>. On that date we decide **continue / shrink / stop.** There is no "let's see."

## Conclusion (fill at the end)
- Result per experiment: …
- Where it failed: …
- Conclusion: continue (signed by business owner) / shrink (signed by product) / stop (signed by
  sponsor + business)
- Basis: …
