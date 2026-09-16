# Lead Scoring

Implemented in [`src/lib/leadScoring.ts`](../src/lib/leadScoring.ts). Server-side only —
score and classification are computed in the `/api/leads` route handler and are never sent
to the browser or exposed to the homeowner.

## How it works

Four factors are summed into a single integer score:

| Factor | Values | Points |
|---|---|---|
| **Budget** | $1M+ | 30 |
| | $500K–$1M | 25 |
| | $250K–$500K | 20 |
| | $100K–$250K | 15 |
| | $50K–$100K | 5 |
| | Under $50K | 0 |
| | Not sure | 5 |
| **Location** | River Oaks / Memorial / Tanglewood / West University | 15 |
| | Other Houston-area ZIP | 5 |
| **Timeline** | Immediately | 15 |
| | 1–3 months | 15 |
| | 3–6 months | 10 |
| | 6–12 months | 5 |
| | Researching | 0 |
| **Project type** | Whole-home renovation | 15 |
| | Home addition | 12 |
| | Kitchen | 10 |
| | Primary suite | 8 |
| | Outdoor living | 8 |
| | Other | 5 |

Maximum possible score: **75** (30 + 15 + 15 + 15).

Location is derived from the submitted ZIP code via a best-effort prefix match against the
four initial focus neighborhoods (`src/lib/zipNeighborhood.ts`). A ZIP outside those prefixes
still submits normally and simply scores as "Other Houston area" — neighborhood detection is
a scoring input, never a submission requirement.

## Classification thresholds

| Classification | Score |
|---|---|
| `PRIORITY` | ≥ 45 |
| `QUALIFIED` | ≥ 25 and < 45 |
| `NURTURE` | < 25 |

These thresholds are placeholders chosen to roughly split the 0–75 range into thirds,
weighted toward budget and timeline (the two factors most predictive of a project that's
ready to move). **They have not been validated against real conversion data.**

## Reviewing after 90 days

All tunable values live in `BUDGET_SCORES`, `TIMELINE_SCORES`, `PROJECT_TYPE_SCORES`,
`FOCUS_NEIGHBORHOOD_SCORE` / `OTHER_HOUSTON_AREA_SCORE`, and `PRIORITY_THRESHOLD` /
`QUALIFIED_THRESHOLD` at the top of `src/lib/leadScoring.ts`. To recalibrate:

1. Export `leads` (score, classification, and eventual `status` outcome — `WON`/`LOST`/etc.)
   after ~90 days of real traffic.
2. Check whether `PRIORITY` leads are actually converting to `WON` at a meaningfully higher
   rate than `QUALIFIED` leads. If not, adjust weights or thresholds.
3. Change the constants in one file — nothing else in the codebase needs to change, since the
   API route, admin views, and email notification all read `lead_score` /
   `lead_classification` off the stored row rather than recomputing.
