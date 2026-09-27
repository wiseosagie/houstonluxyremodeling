# Houston Luxury Remodeling — Phase 1 MVP

A lead-generation and homeowner-to-professional matching website for
**houstonluxuryremodeling.com**. Houston Luxury Remodeling does not perform construction —
it connects Houston homeowners planning significant ($100,000+) residential renovations with
independent remodeling and design-build professionals. See
[`/matching-service-disclosure`](src/app/matching-service-disclosure/page.tsx) for the full
disclosure shown on the live site.

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Fast to deploy, excellent SEO primitives (metadata API, sitemap/robots as code, RSC for fast first paint), one deployment target for pages + API route |
| Styling | Tailwind CSS | Rapid, consistent design-system implementation without a component library dependency |
| Database | SQLite (Node's built-in `node:sqlite`) | Zero-config, file-based, no external service or account needed for an MVP's lead volume. See [`src/lib/db.ts`](src/lib/db.ts). |
| Email | Resend (HTTP API, no SDK) — **optional, non-blocking notification only** | See [`src/lib/email.ts`](src/lib/email.ts). The SQLite `leads` table is the system of record; the notification email is a best-effort convenience layered on top. A missing config or a failed send is logged and never blocks, loses, or rolls back a stored lead — see "Email notifications" below. |
| Hosting | Azure Static Web Apps | Configured deploy target — see [`.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml`](.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml). `node:sqlite` requires Node 24+; confirm the Azure resource's Next.js hybrid/SSR support actually executes the dynamic `/api/leads` route in production — see "Production deployment" below. |
| Validation | Zod | Shared shape between the form and the server-side API validation |

This is intentionally **not** over-engineered: no CMS, no ORM, no state-management library, no
component framework beyond Tailwind + a handful of hand-built components. Every dependency in
`package.json` is used.

## Project structure

```
src/
  app/                        Routes (App Router) — one folder per page, + api/leads, sitemap.ts, robots.ts
  components/
    layout/                   Header, Footer
    home/                     Homepage-only sections (Hero, CategoryGrid, AreasServed)
    shared/                   Reused across pages (CTASection, FAQ, ServiceCard, LocationCard, TrustSection, ProcessSteps, Breadcrumbs, InspirationGallery, PrimaryCta, PhoneLink, Wordmark)
    consultation/             The 7-step funnel: ConsultationForm (orchestrator), FormProgress, OptionCard, steps/*, ConfirmationScreen
    analytics/                GoogleAnalytics (GA4 loader + pageview tracker), AttributionInit (UTM capture)
  lib/                        constants, validation (Zod), leadScoring, zipNeighborhood, email, rateLimit, db (SQLite), gtag, attribution
  data/                       images.ts — the single source of truth for every photo used on the site
data/app.db                   SQLite database file (git-ignored, created on first run)
docs/                         Deep-dive docs referenced below
test/                         `node --test` suite for the leads API (honeypot, timing heuristic, rate limit) — see "Testing" below
```

## Local development

```bash
npm install
cp .env.example .env.local     # fill in what you have; see "Environment variables" below
npm run dev                    # http://localhost:3000
```

The site **runs and renders fully** with zero environment variables set. Google Analytics,
Search Console verification, the phone number, and structured-data extras simply don't render
until configured. The consultation funnel is fully usable end to end and writes to a local
SQLite file (`data/app.db`, created automatically) with zero configuration — lead-notification
email is the only piece that requires credentials, and it's intentionally optional (see "Email
notifications" below).

```bash
npm run typecheck   # tsc --noEmit
npm run lint         # next lint (not currently configured — see "Known Limitations")
npm run build        # production build
npm test             # node --test — leads API: honeypot, timing heuristic, rate limit
```

## Environment variables

See [`.env.example`](.env.example) for the full, commented list. Summary:

| Variable | Required for | Notes |
|---|---|---|
| `SQLITE_DB_PATH` | Storing leads | Optional — defaults to `./data/app.db`. The file and its parent directory are created automatically on first use. |
| `RESEND_API_KEY` / `LEAD_NOTIFICATION_EMAIL` | Lead notification email | **Optional.** Leave unset — the app stores every lead in SQLite regardless; a missing config, or any failure from Resend, only skips/fails the notification email (logged, e.g. `email_not_configured`, `resend_401`, `network_error`) and never affects the stored lead. See "Email notifications" below. |
| `EMAIL_FROM` | Lead notification email | Only relevant if the above two are set. Defaults to Resend's shared sandbox address. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics | **GA4 Measurement ID required from you.** Entirely inert (no script loads, no events fire) until this is set. Get it from GA4 Admin → Data Streams → your web stream. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG metadata | Set to the real production domain before launch |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Search Console | **Verification token required from you.** From Search Console → Settings → Ownership verification → HTML tag method — copy only the `content="..."` value, not the full tag. Renders as `<meta name="google-site-verification">` when set. |
| `NEXT_PUBLIC_CONTACT_PHONE` | Click-to-call UI | Optional — omitted entirely (no fabricated number) until a real monitored line exists |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public-facing contact address (`/contact`, footer, legal pages via `CONTACT_EMAIL` in `src/lib/constants.ts`) | Defaults to `hello@houstonluxuryremodeling.com`. **You must confirm this inbox exists and receives mail before launch** — the code uses the address, but nothing in this repo can verify the mailbox itself. |

## Production deployment

Target: **Azure Static Web Apps** — see
[`.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml`](.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml).
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`,
`NEXT_PUBLIC_CONTACT_PHONE`, and `NEXT_PUBLIC_CONTACT_EMAIL` are wired through as build-time
`vars` in that workflow; set them in the repo's GitHub Actions variables.

1. **Database — the requirement that matters most.** SQLite is a single file on disk
   (`SQLITE_DB_PATH`, default `./data/app.db`). For leads to persist, the Azure Static Web
   Apps compute plan backing this app must give the running process **writable, persistent
   local disk that survives between requests and across deploys/restarts** — not an ephemeral
   or read-only filesystem. This has **not been verified against the actual Azure resource**
   as part of this fix; confirm it directly (see "Azure Static Web Apps" note below) before
   relying on it for real leads. If the plan's filesystem is ephemeral, `SQLITE_DB_PATH` must
   point at a mounted persistent volume, or leads will silently reset on every cold start —
   this repo does not attempt to solve that for you.
2. **Azure Static Web Apps and the dynamic `/api/leads` route.** This app ships a standard
   Next.js hybrid build (no `output: "export"`/`"standalone"`) with `/api/leads` as a
   server-rendered route, not a static one. Whether Azure Static Web Apps' Next.js
   integration actually executes that route in production depends on the plan/tier and how
   the resource is configured — **this cannot be confirmed from the repository alone.**
   Submit one real test lead against the deployed URL after every deploy that touches
   `src/app/api/leads/route.ts` or `src/lib/db.ts`, and query the deployed database (or check
   logs) to confirm it was actually persisted, not just that the HTTP response looked
   successful.
3. Point the `houstonluxuryremodeling.com` DNS at Azure and set `NEXT_PUBLIC_SITE_URL`
   accordingly (the apex domain — see `src/middleware.ts` for the www → apex redirect).
4. Create Google Analytics 4 and Google Search Console properties for the live domain, set
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_GSC_VERIFICATION` as GitHub Actions
   variables, and redeploy.
5. Confirm the `NEXT_PUBLIC_CONTACT_EMAIL` inbox exists and is monitored.
6. If you want lead-notification email, set `RESEND_API_KEY` and `LEAD_NOTIFICATION_EMAIL` —
   optional, and safe to add or remove at any time without affecting lead storage.

## Database schema

Defined in [`src/lib/db.ts`](src/lib/db.ts) (Node's built-in `node:sqlite`, no external
dependency). The `leads` table includes every field specified in the brief (contact info,
project details, lead score/classification, full UTM attribution, and a `status` pipeline
column defaulting to `NEW`) plus `internal_notes` / `assigned_partner` for manual triage. The
schema is created automatically on first run (`create table if not exists`) — no separate
migration step. Rate limiting (below) is intentionally **in-memory only**, not SQLite-backed —
there is no `lead_rate_limits` table.

The schema is intentionally additive-friendly for Phase 2 (see below) — new columns or tables
(e.g., a `partners` table) can be added directly in `db.ts`.

## Lead scoring

See [`docs/LEAD_SCORING.md`](docs/LEAD_SCORING.md) for the full point breakdown,
classification thresholds, and how to recalibrate after 90 days. Implementation:
[`src/lib/leadScoring.ts`](src/lib/leadScoring.ts).

## Email notifications

**Optional, non-blocking, by design.** The SQLite `leads` table is the system of record; the
notification email in [`src/lib/email.ts`](src/lib/email.ts) is a best-effort convenience
layered on top, sent via Resend's HTTP API. The API route
([`src/app/api/leads/route.ts`](src/app/api/leads/route.ts)) always inserts the lead into
SQLite **first**, and only attempts the notification afterward:

- If `RESEND_API_KEY` or `LEAD_NOTIFICATION_EMAIL` is unset, `sendLeadNotificationEmail`
  returns `{ sent: false, error: "email_not_configured" }` and logs a `console.error`.
- If Resend is configured but the request times out, throws, has a network failure, or
  returns a non-2xx response, the same thing happens (`network_error` / `resend_<status>`).
- In every case, the response to the homeowner is still `201` with a real `leadId` — a missing
  or failed email **never loses, blocks, or rolls back a stored lead.** Include
  `RESEND_API_KEY` and `LEAD_NOTIFICATION_EMAIL` (and optionally `EMAIL_FROM`) whenever you
  want the notification; the lead pipeline behaves identically either way.

## Spam protection

Three independent layers, all server-side in
[`src/app/api/leads/route.ts`](src/app/api/leads/route.ts):

1. **Rate limiting** ([`src/lib/rateLimit.ts`](src/lib/rateLimit.ts)) — max 5 submissions per
   IP hash per rolling hour, in-memory only (see "Known limitations" below).
2. **Honeypot** — a hidden `website` field (`src/components/consultation/steps/StepContact.tsx`)
   that's visually hidden, `tabindex="-1"`, and `aria-hidden` so real visitors never see or
   reach it; a bot that fills every field populates it.
3. **Timing heuristic** — submissions completed in under 2.5 seconds from when the funnel
   mounted are treated as automated.

Any of the three causes the request to be **silently discarded**: the response is a normal
`{ success: true }` 2xx (so a bot gets no signal anything was rejected, and no validation
details are ever leaked), but with `leadId: null` instead of a real id, since nothing was
stored. The client (`ConsultationForm.tsx`) only fires the `consultation_submitted` GA4 event
when a real `leadId` comes back, so a caught bot submission is never counted as a completed
consultation.

## Testing

`npm test` runs [`test/leads-api.test.ts`](test/leads-api.test.ts) via Node's built-in
`node:test` runner (no test framework dependency) directly against the `POST /api/leads`
handler, using an in-memory SQLite database (`SQLITE_DB_PATH=":memory:"`, never the real
`data/app.db` file). It covers: a normal submission (stored, real ID), the honeypot being
filled (nothing stored), the timing heuristic (nothing stored), a genuinely invalid field
still returning a normal 400 (nothing stored), rate limiting (6th rapid request from one IP
gets a 429; a different IP is unaffected), submission succeeding with no Resend credentials
configured, submission succeeding when a configured Resend call fails, full UTM attribution
being stored on the row, and lead score/classification being correct through the complete
API → database path (not just the scoring function in isolation). See
[`test/register.mjs`](test/register.mjs) / [`test/alias-loader.mjs`](test/alias-loader.mjs)
for the small amount of plumbing this needs (resolving the `@/*` path alias and Next's
extensionless subpath imports under plain Node, and the `--conditions=react-server` flag so
`import "server-only"` no-ops instead of throwing).

## Imagery

See [`docs/IMAGE_INVENTORY.md`](docs/IMAGE_INVENTORY.md) for the full inventory, sourcing
rationale (including why the Canva connector wasn't the right fit for this — read that doc's
first section), and exactly where each image is used.

## SEO

See [`docs/SEO_SUMMARY.md`](docs/SEO_SUMMARY.md) for per-page titles/descriptions,
structured data, and technical SEO implementation.

## Analytics & attribution

See [`docs/ANALYTICS_EVENTS.md`](docs/ANALYTICS_EVENTS.md) for the full event dictionary and
how UTM attribution is captured and preserved through the funnel.

## Testing

See [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md) for exactly what has and hasn't
actually been run against the current codebase, and what still requires manual verification
before launch.

## Known limitations

- **Legal pages need attorney review.** `/privacy`, `/terms`, and
  `/matching-service-disclosure` are written to be honest and reasonably complete, but they
  are not a substitute for review by a Texas-licensed attorney, particularly around consumer
  data privacy obligations and any home-services-specific disclosure requirements.
- **No live GA4/Search Console credentials.** Both require real accounts this environment
  doesn't have access to. Both are fully implemented and gated on their environment
  variables — set `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_GSC_VERIFICATION` and they
  activate with no code changes.
- **`NEXT_PUBLIC_CONTACT_EMAIL` inbox existence is unverified.** The code correctly uses
  `hello@houstonluxuryremodeling.com` everywhere (via `CONTACT_EMAIL` in
  `src/lib/constants.ts`) — **you must confirm that inbox exists and receives mail** before
  launch; nothing in this repo can verify that for you.
- **No phone number.** `NEXT_PUBLIC_CONTACT_PHONE` is left blank by design — nothing is
  fabricated. Click-to-call UI and the `phone_clicked` event simply don't render until a real,
  monitored number is added.
- **Rate limiting is best-effort for an MVP**, not enterprise-grade bot defense: purely
  in-memory (per warm process, not shared across serverless instances, resets on cold start),
  plus a honeypot field and a minimum-fill-time heuristic (see "Spam protection" above).
  Sufficient to blunt naive spam bots; a determined attacker could still get through, and a
  burst of legitimate visitors whose requests all arrive without a usable `x-forwarded-for`
  header would collapse into one shared bucket. Reassess if spam or false-positive blocking
  becomes a real problem; do not add a distributed rate limiter without a concrete need.
- **SQLite requires persistent, writable local disk on the host.** See "Production
  deployment" above — this has not been verified against the actual Azure Static Web Apps
  resource. On a host with an ephemeral filesystem, the `leads` table resets on every
  deploy/cold start, silently losing every lead since the last restart.
- **No ESLint config is present**, so `npm run lint` currently prompts for interactive setup
  rather than running. Pre-existing gap, not introduced by this round of changes.
- **ZIP → neighborhood matching is prefix-based**, not a real geocoding service. It's used
  only for lead-scoring convenience and internal notes, never to block submission.
- **Cross-browser and screen-reader testing is still outstanding.** No Safari/iOS pass and no
  real VoiceOver/NVDA pass have been performed against the current build.
- **No Lighthouse/visual mobile QA has been run against this build.** Prior documentation in
  this repo claimed specific Lighthouse scores and a Playwright-based mobile pass; neither
  `lighthouse` nor `playwright` is a dependency in this repository, so those claims could not
  be reproduced and should not be relied on. Run both before launch.

## Phase 2 recommendations

In priority order, based on what would most directly answer the Phase 1 success question
(are we attracting and qualifying $100K+ Houston renovation leads):

1. **Instrument first, then expand.** Get 4–8 weeks of real traffic and lead data before
   building anything else — the lead-scoring thresholds and even the project-category list
   are informed guesses right now.
2. **Individual neighborhood SEO pages** (`/houston/river-oaks`, etc.) — the data model
   (`NEIGHBORHOODS` in `src/lib/constants.ts`) and `/houston` page structure were built so
   this is a route-splitting exercise, not a redesign.
3. **A minimal internal leads dashboard** (even a single authenticated `/admin/leads` page
   querying SQLite directly, or a migration to a hosted Postgres provider with a proper admin
   UI) so status updates (`CONTACTED` → `QUALIFIED` → …) don't require opening the database
   file by hand.
4. **Real partner portfolios**, once available, to replace/supplement the stock "Design
   Inspiration" imagery with genuine completed-project photography (with partner permission).
5. **A `partners` table + basic routing rule** once there's more than a handful of
   participating professionals, so "which partner gets this lead" isn't a manual decision
   every time.
6. Everything else in the original brief's "do not build in Phase 1" list, roughly in the
   order it's listed — CRM integration and automated routing before contractor accounts,
   contractor accounts before a bidding marketplace, etc.
