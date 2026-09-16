# Testing Checklist

## Verified during Phase 1 build (automated, this session)

Using `next build` (production build) and a headless-Chromium (Playwright) smoke pass across
every page at desktop (1440px) and mobile (375–390px) viewports:

- [x] Production build compiles with zero TypeScript errors and zero build warnings
- [x] Every page returns HTTP 200 (desktop + mobile): `/`, `/luxury-remodeling-houston`,
      `/houston`, `/how-it-works`, `/consultation`, `/privacy`, `/terms`, `/contact`,
      `/matching-service-disclosure`
- [x] `/this-page-does-not-exist` returns HTTP 404 and renders the custom 404 page
- [x] Zero browser console errors on any page (other than the expected 404 resource log)
- [x] Zero failed network requests on any page
- [x] No horizontal scroll at 375px on any page
- [x] All images eventually load (see note below on a false-positive during testing)
- [x] Full 7-step consultation funnel walked end-to-end via scripted interaction:
      project type → ZIP → budget → timeline → design status → vision → contact → submit
- [x] Back-navigation from step 5→4 and step 4→3 confirmed to retain the previously selected
      value (re-rendered with the correct option still marked selected)
- [x] ZIP step client-side validation confirmed (Continue disabled until 5 digits entered)
- [x] Contact step validation confirmed (name/email/phone/consent all required before submit
      is enabled)
- [x] `POST /api/leads` exercised live: with no Supabase credentials configured, it correctly
      returns `500` with a user-facing error message, and the UI displays that error inline
      without losing any of the homeowner's entered data (they can retry without re-entering
      the whole funnel)
- [x] UTM parameters (`utm_source=google&utm_medium=cpc&utm_campaign=test`) attached to the
      `/consultation` URL were confirmed to be captured and included in the submitted payload
- [x] `npm audit`: reduced from 5 vulnerabilities (1 critical, 4 high) on the initially
      scaffolded dependency versions to 2 (1 moderate, 1 high, both inside Next.js's own
      bundled build-time `postcss`, not runtime-reachable) by pinning `next@15.5.25`
      (patched) and React 19

**Testing note:** during the first smoke pass, several below-the-fold gallery images
intermittently reported as "not loaded" in a scripted check that ran immediately after page
load. Investigating directly (server logs showed no errors; the same URLs returned instantly
on a follow-up request) confirmed this is standard Next.js **dev-server** cold-cache latency
the first time a given image size is transformed — not a broken asset. All images render
successfully in production builds and on any subsequent request. `deviceSizes` was still
tightened in `next.config.mjs` as a genuine improvement (the initial config allowed
unnecessarily large 2048–3840px transforms for images that never render wider than ~700px).

## Requires manual verification before launch (no live credentials in this environment)

- [ ] Real Supabase project: run `supabase/migrations/0001_init.sql`, confirm a live
      submission inserts a row with the expected `lead_score` / `lead_classification`
- [ ] Real Resend account + verified sending domain: confirm the notification email arrives,
      renders correctly on a phone email client, and matches the fields in
      `src/lib/email.ts`
- [ ] Rate limiting: submit 6+ times rapidly from one IP within an hour and confirm the 6th
      is rejected with `429`
- [ ] Honeypot: confirm a bot-style submission with the hidden `website` field populated is
      silently discarded (returns success, no DB row created)
- [ ] GA4: once `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, confirm all six events in
      `docs/ANALYTICS_EVENTS.md` appear in GA4 DebugView
- [ ] Google Search Console: verify ownership via `NEXT_PUBLIC_GSC_VERIFICATION` once a
      property is created for the live domain
- [ ] Cross-browser pass on Safari/iOS (this session's headless testing was Chromium-only)
- [ ] Real screen reader pass (VoiceOver/NVDA) through the consultation funnel
- [ ] Lighthouse / PageSpeed Insights run against the deployed (not local) production build,
      since real-world Core Web Vitals depend on Vercel's edge network and CDN caching
