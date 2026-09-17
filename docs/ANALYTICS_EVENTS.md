# Analytics Events

GA4 is loaded via [`src/components/analytics/GoogleAnalytics.tsx`](../src/components/analytics/GoogleAnalytics.tsx)
only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. All custom events are fired through the
single helper `trackEvent()` in [`src/lib/gtag.ts`](../src/lib/gtag.ts), which no-ops safely
if GA hasn't loaded (e.g., local dev without the env var, or an ad blocker).

## Event dictionary

| Event | Fired when | Params |
|---|---|---|
| `page_view` | Every route change (App Router doesn't full-reload, so this is fired manually on pathname/search change) | `page_path` |
| `primary_cta_clicked` | Any `PrimaryCta` component is clicked (header, hero, every CTASection, contact page, 404) | `cta_label`, `cta_location` |
| `phone_clicked` | The click-to-call link is clicked (only rendered when `NEXT_PUBLIC_CONTACT_PHONE` is set) | `phone` |
| `consultation_started` | The `/consultation` form mounts (fires once per page load) | — |
| `consultation_step_completed` | Each time a funnel step is completed and the user advances | `step_number` (1–6), `step_name` (`project_type`, `location`, `budget`, `timeline`, `design_status`, `vision`) |
| `consultation_submitted` | The lead is successfully stored via `/api/leads` — fired after a `2xx` response **and** a real `leadId` comes back in the body | `project_type`, `budget_range` |

Note: there is no `step_number: 7` for `consultation_step_completed` — step 7 (contact info)
ends in `consultation_submitted` instead, since "completing" that step means submitting.

A submission silently discarded as spam (honeypot filled or the timing heuristic tripped —
see the README's "Spam protection" section) still gets a `2xx` response so the bot has no
signal, but with `leadId: null` since nothing was stored. `consultation_submitted` only fires
when `leadId` is truthy, so a caught bot is never counted as a completed consultation.

## Attribution

UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) are
captured on first landing by
[`src/components/analytics/AttributionInit.tsx`](../src/components/analytics/AttributionInit.tsx),
stored in `sessionStorage` (`src/lib/attribution.ts`), and preserved across client-side
navigation. They're read again at submission time and sent to `/api/leads`, which stores them
on the `leads` row (`source`, `medium`, `campaign`, `content`, `term`, `landing_page`,
`referrer`) — so attribution survives even if the visitor lands on `/`, browses for a while,
and submits the form several pages later.

## Known limitation

`NEXT_PUBLIC_GA_MEASUREMENT_ID` is required for any of this to do anything — until it's set,
`trackEvent()` and the GA scripts are no-ops by design (see README "Known Limitations").
