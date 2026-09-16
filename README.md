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
| Database | Supabase (Postgres) | Managed Postgres with RLS, generous free tier, simple JS client, easy migration path to a fuller CRM in Phase 2 |
| Email | Resend (HTTP API, no SDK) | Simple, modern transactional email API; called directly via `fetch` to avoid an extra dependency |
| Hosting | Vercel | First-class Next.js support, zero-config preview deployments, edge network for Core Web Vitals |
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
  lib/                        constants, validation (Zod), leadScoring, zipNeighborhood, email, rateLimit, supabaseServer, gtag, attribution
  data/                       images.ts — the single source of truth for every photo used on the site
supabase/migrations/          SQL schema (leads, lead_rate_limits, RLS)
docs/                         Deep-dive docs referenced below
```

## Local development

```bash
npm install
cp .env.example .env.local     # fill in what you have; see "Environment variables" below
npm run dev                    # http://localhost:3000
```

The site **runs and renders fully** with zero environment variables set. Google Analytics,
the phone number, and structured-data extras simply don't render until configured. The
consultation funnel is fully usable end to end; only the final database write and email will
fail (gracefully — see "Known Limitations") until Supabase/Resend are configured.

```bash
npm run typecheck   # tsc --noEmit
npm run lint         # next lint
npm run build        # production build
```

## Environment variables

See [`.env.example`](.env.example) for the full, commented list. Summary:

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | — | Present for future client-side/Phase 2 use; the current API route uses the service role key exclusively |
| `SUPABASE_SERVICE_ROLE_KEY` | Storing leads | Server-only. Never expose to the browser. |
| `RESEND_API_KEY` | Lead notification email | Get one at resend.com |
| `EMAIL_FROM` | Lead notification email | Defaults to Resend's shared sandbox address until a sending domain is verified |
| `LEAD_NOTIFICATION_EMAIL` | Lead notification email | Inbox that receives every new lead |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics | GA4 is entirely inert without this |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG metadata | Set to the real production domain before launch |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Search Console | HTML-tag verification value |
| `NEXT_PUBLIC_CONTACT_PHONE` | Click-to-call UI | Optional — omitted entirely (no fabricated number) until a real monitored line exists |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `/contact` page | Defaults to `hello@houstonluxuryremodeling.com` — **create this inbox before launch** |

## Production deployment (Vercel + Supabase)

1. **Supabase**: create a project, then run `supabase/migrations/0001_init.sql` in the SQL
   editor (or `supabase db push` with the CLI). Copy the project URL, anon key, and service
   role key into your environment.
2. **Resend**: create an account, verify a sending domain for `houstonluxuryremodeling.com`
   (or use the shared sandbox address short-term), and generate an API key.
3. **Vercel**: import this repository, set all environment variables from `.env.example` in
   the Vercel project settings, and deploy. No build configuration is needed beyond the
   default Next.js preset.
4. Point the `houstonluxuryremodeling.com` DNS at Vercel and set `NEXT_PUBLIC_SITE_URL`
   accordingly.
5. Create Google Analytics 4 and Google Search Console properties for the live domain, set
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_GSC_VERIFICATION`, and redeploy.

## Database schema

Defined in [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). The
`leads` table includes every field specified in the brief (contact info, project details,
lead score/classification, full UTM attribution, and a `status` pipeline column defaulting to
`NEW`) plus `internal_notes` / `assigned_partner` for manual triage. Row Level Security is
enabled with **no anon-key policies defined at all** — every read/write happens server-side
through the Supabase service role key (which bypasses RLS), so the public anon key currently
has zero access to lead data. A small `lead_rate_limits` table (IP hash + timestamp only, no
PII) backs the rate limiter.

The schema is intentionally additive-friendly for Phase 2 (see below) — new columns or tables
(e.g., a `partners` table) can be added without touching this migration.

## Lead scoring

See [`docs/LEAD_SCORING.md`](docs/LEAD_SCORING.md) for the full point breakdown,
classification thresholds, and how to recalibrate after 90 days. Implementation:
[`src/lib/leadScoring.ts`](src/lib/leadScoring.ts).

## Email notifications

See [`src/lib/email.ts`](src/lib/email.ts). Sent via Resend's HTTP API on every successful
lead submission. If email delivery fails, the failure is logged (`console.error`) but the
already-stored database row is never rolled back or deleted — the lead is safe regardless of
email delivery status. Configuration: `RESEND_API_KEY`, `EMAIL_FROM`,
`LEAD_NOTIFICATION_EMAIL`.

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

See [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md) for what was verified
automatically this session (full funnel walkthrough, all pages at desktop + mobile, console
error checks, dependency security audit) versus what requires manual verification with live
credentials before launch.

## Known limitations

- **Legal pages need attorney review.** `/privacy`, `/terms`, and
  `/matching-service-disclosure` are written to be honest and reasonably complete, but they
  are not a substitute for review by a Texas-licensed attorney, particularly around consumer
  data privacy obligations and any home-services-specific disclosure requirements.
- **No live third-party credentials.** Supabase, Resend, GA4, and Search Console all require
  real accounts this environment doesn't have access to. Every integration point uses a
  clearly named environment variable and fails gracefully (logs, doesn't crash, doesn't lose
  data) when unset — see `docs/TESTING_CHECKLIST.md`'s "requires manual verification" section.
- **`NEXT_PUBLIC_CONTACT_EMAIL` and the domain's DNS/inbox don't exist yet.** The `/contact`
  page defaults to `hello@houstonluxuryremodeling.com`; create that inbox before launch or
  override the env var.
- **No phone number.** `NEXT_PUBLIC_CONTACT_PHONE` is left blank by design — nothing is
  fabricated. Click-to-call UI and the `phone_clicked` event simply don't render until a real,
  monitored number is added.
- **Rate limiting is best-effort for an MVP**, not enterprise-grade bot defense: an in-memory
  check (per warm serverless instance) plus a Supabase-backed IP-hash counter, plus a
  honeypot field and a minimum-fill-time heuristic. Sufficient to blunt naive spam bots; a
  determined attacker could still get through. Reassess if spam becomes a real problem.
- **ZIP → neighborhood matching is prefix-based**, not a real geocoding service. It's used
  only for lead-scoring convenience and internal notes, never to block submission.
- **Cross-browser testing this session was Chromium-only** (headless, via Playwright). Safari
  /iOS and a real screen reader pass are still outstanding — see the testing checklist.
- **Next.js dev-server image latency**: the first request for a given on-demand image size is
  slow in `next dev` (no persistent transform cache). This is a dev-only artifact, not a
  production issue — see the note in `docs/TESTING_CHECKLIST.md`.

## Phase 2 recommendations

In priority order, based on what would most directly answer the Phase 1 success question
(are we attracting and qualifying $100K+ Houston renovation leads):

1. **Instrument first, then expand.** Get 4–8 weeks of real traffic and lead data before
   building anything else — the lead-scoring thresholds and even the project-category list
   are informed guesses right now.
2. **Individual neighborhood SEO pages** (`/houston/river-oaks`, etc.) — the data model
   (`NEIGHBORHOODS` in `src/lib/constants.ts`) and `/houston` page structure were built so
   this is a route-splitting exercise, not a redesign.
3. **A minimal internal leads dashboard** (even a Supabase Studio saved view or a single
   authenticated `/admin/leads` page) so status updates (`CONTACTED` → `QUALIFIED` → …) don't
   require the Supabase dashboard directly.
4. **Real partner portfolios**, once available, to replace/supplement the stock "Design
   Inspiration" imagery with genuine completed-project photography (with partner permission).
5. **A `partners` table + basic routing rule** once there's more than a handful of
   participating professionals, so "which partner gets this lead" isn't a manual decision
   every time.
6. Everything else in the original brief's "do not build in Phase 1" list, roughly in the
   order it's listed — CRM integration and automated routing before contractor accounts,
   contractor accounts before a bidding marketplace, etc.
