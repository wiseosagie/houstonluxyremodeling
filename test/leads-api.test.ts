// Exercises POST /api/leads directly (no HTTP server, no test framework
// dependency — Node's built-in `node:test` runner, run via `npm test`)
// against an in-memory SQLite database (SQLITE_DB_PATH=":memory:" below).
//
// Run with: npm test  (see package.json / test/register.mjs for the
// alias-resolution + TypeScript-stripping + "server-only" wiring this needs).

import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

process.env.SQLITE_DB_PATH = ":memory:";
delete process.env.RESEND_API_KEY;
delete process.env.LEAD_NOTIFICATION_EMAIL;

const { POST } = await import("@/app/api/leads/route.ts");
const { getDb } = await import("@/lib/db.ts");
const { calculateLeadScore, classifyLead } = await import("@/lib/leadScoring.ts");

let ipCounter = 0;
function freshIp() {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

function makeRequest(body: Record<string, unknown>, ip: string = freshIp()) {
  return new NextRequest("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

function validLead(overrides: Record<string, unknown> = {}) {
  return {
    projectType: "kitchen",
    zipCode: "77019",
    budgetRange: "100k_250k",
    timeline: "1_3_months",
    designStatus: "need_design_and_construction",
    projectDescription: "Test project",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "713-555-0100",
    consent: true,
    website: "",
    formStartedAt: Date.now() - 10_000, // well past the 2.5s bot heuristic
    ...overrides,
  };
}

function countLeads(): number {
  const row = getDb().prepare("select count(*) as count from leads").get() as { count: number };
  return row.count;
}

function getLead(leadId: string) {
  return getDb().prepare("select * from leads where lead_id = ?").get(leadId) as Record<string, unknown>;
}

test("Test 1 — valid submission stores the lead and returns a real ID", async () => {
  const before = countLeads();
  const res = await POST(makeRequest(validLead()));
  const body = await res.json();

  assert.equal(res.status, 201);
  assert.equal(body.success, true);
  assert.ok(body.leadId, "expected a real leadId");
  assert.equal(countLeads(), before + 1);

  const row = getLead(body.leadId);
  assert.equal(row.status, "NEW");
  assert.ok(row.created_at);
});

test("Test 2 — honeypot filled: generic success, nothing stored, no validation details leaked", async () => {
  const before = countLeads();
  const res = await POST(makeRequest(validLead({ website: "spam-site.com" })));
  const body = await res.json();

  assert.equal(res.status, 201, "must look like a normal success, not a 400/403");
  assert.equal(body.success, true);
  assert.equal(body.leadId, null, "must not return a real lead id for a lead that was not stored");
  assert.equal(body.error, undefined);
  assert.equal(body.details, undefined);
  assert.equal(countLeads(), before, "no row should be inserted");
});

test("Test 3 — fast submission caught by the timing heuristic", async () => {
  const before = countLeads();
  const res = await POST(makeRequest(validLead({ formStartedAt: Date.now() })));
  const body = await res.json();

  assert.equal(res.status, 201);
  assert.equal(body.leadId, null);
  assert.equal(countLeads(), before, "no row should be inserted");
});

test("Test 4 — invalid email still returns a normal 400 with validation details, nothing stored", async () => {
  const before = countLeads();
  const res = await POST(makeRequest(validLead({ email: "not-an-email" })));
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.ok(body.details, "legitimate validation errors must still be reported");
  assert.equal(countLeads(), before, "no row should be inserted");
});

test("Test 5 — rate limiting: 6th rapid submission from the same IP is rejected with 429", async () => {
  const ip = freshIp();
  const statuses: number[] = [];
  for (let i = 0; i < 6; i++) {
    const res = await POST(makeRequest(validLead({ email: `rl-${i}@example.com` }), ip));
    statuses.push(res.status);
  }

  assert.deepEqual(statuses.slice(0, 5), [201, 201, 201, 201, 201]);
  assert.equal(statuses[5], 429, "6th request within the window should be rate-limited");
});

test("Rate limiting — a different IP is unaffected by another IP's limit", async () => {
  const res = await POST(makeRequest(validLead({ email: "unaffected@example.com" }), freshIp()));
  assert.equal(res.status, 201);
});

test("Test 6 — no Resend credentials configured: lead still stores and returns 201 with a real ID", async () => {
  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_NOTIFICATION_EMAIL;

  const before = countLeads();
  const res = await POST(makeRequest(validLead({ email: "no-email-config@example.com" })));
  const body = await res.json();

  assert.equal(res.status, 201);
  assert.ok(body.leadId);
  assert.equal(countLeads(), before + 1);
});

test("Test 7 — Resend configured but failing: lead still stores and returns 201 with a real ID", async () => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.LEAD_NOTIFICATION_EMAIL = "internal@example.com";

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    throw new Error("simulated network failure");
  }) as typeof fetch;

  try {
    const before = countLeads();
    const res = await POST(makeRequest(validLead({ email: "resend-fails@example.com" })));
    const body = await res.json();

    assert.equal(res.status, 201, "a notification failure must never surface as a failed submission");
    assert.ok(body.leadId, "expected a real leadId even though the email failed");
    assert.equal(countLeads(), before + 1, "the lead row must still exist");
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.RESEND_API_KEY;
    delete process.env.LEAD_NOTIFICATION_EMAIL;
  }
});

test("Test 8 — full UTM attribution is stored on the lead row", async () => {
  const res = await POST(
    makeRequest(
      validLead({
        email: "attribution-test@example.com",
        source: "google",
        medium: "cpc",
        campaign: "river_oaks_test",
        content: "launch_test",
        term: "luxury_remodeling_houston",
        landingPage: "/",
        referrer: "test referrer",
      })
    )
  );
  const body = await res.json();
  assert.equal(res.status, 201);

  const row = getLead(body.leadId);
  assert.equal(row.source, "google");
  assert.equal(row.medium, "cpc");
  assert.equal(row.campaign, "river_oaks_test");
  assert.equal(row.content, "launch_test");
  assert.equal(row.term, "luxury_remodeling_houston");
  assert.equal(row.landing_page, "/");
  assert.equal(row.referrer, "test referrer");
});

test("Test 9 — lead score and classification are computed correctly through the full API -> DB path", async () => {
  const overrides = { budgetRange: "1m_plus", timeline: "immediately", projectType: "kitchen", zipCode: "77019" };
  const res = await POST(makeRequest(validLead({ email: "scoring-test@example.com", ...overrides })));
  const body = await res.json();
  assert.equal(res.status, 201);

  const expectedScore = calculateLeadScore({
    budgetRange: overrides.budgetRange,
    timeline: overrides.timeline,
    projectType: overrides.projectType,
    neighborhoodSlug: "river-oaks", // 77019
  });
  const expectedClassification = classifyLead(expectedScore);

  assert.equal(expectedScore, 70, "sanity check: budget 30 + location 15 + timeline 15 + kitchen 10 = 70");
  assert.equal(expectedClassification, "PRIORITY");

  const row = getLead(body.leadId);
  assert.equal(row.lead_score, expectedScore);
  assert.equal(row.lead_classification, expectedClassification);
  assert.equal(row.neighborhood, "River Oaks");
});
