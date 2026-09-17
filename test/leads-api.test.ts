// Exercises POST /api/leads directly (no HTTP server, no test framework
// dependency — Node's built-in `node:test` runner, run via `npm test`).
// Covers the honeypot fix and a rate-limit regression check.
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
  const db = getDb();
  const row = db.prepare("select count(*) as count from leads").get() as { count: number };
  return row.count;
}

test("Test A — normal human (empty honeypot) validates and stores", async () => {
  const before = countLeads();
  const res = await POST(makeRequest(validLead()));
  const body = await res.json();

  assert.equal(res.status, 201);
  assert.equal(body.success, true);
  assert.ok(body.leadId, "expected a real leadId");
  assert.equal(countLeads(), before + 1);
});

test("Test B — honeypot filled: generic success, nothing stored, no validation details leaked", async () => {
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

test("Test C — invalid legitimate field still returns a normal 400 with validation details", async () => {
  const res = await POST(makeRequest(validLead({ email: "not-an-email" })));
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.ok(body.details, "legitimate validation errors must still be reported");
});

test("Test D — fast submission caught by the timing heuristic", async () => {
  const before = countLeads();
  const res = await POST(makeRequest(validLead({ formStartedAt: Date.now() })));
  const body = await res.json();

  assert.equal(res.status, 201);
  assert.equal(body.leadId, null);
  assert.equal(countLeads(), before, "no row should be inserted");
});

test("Test E — normal valid submission stores with the correct lead score", async () => {
  const before = countLeads();
  const overrides = { budgetRange: "1m_plus", timeline: "immediately", projectType: "kitchen" };
  const res = await POST(makeRequest(validLead(overrides)));
  const body = await res.json();

  assert.equal(res.status, 201);
  assert.ok(body.leadId);
  assert.equal(countLeads(), before + 1);

  const expectedScore = calculateLeadScore({
    budgetRange: overrides.budgetRange,
    timeline: overrides.timeline,
    projectType: overrides.projectType,
    neighborhoodSlug: "river-oaks", // 77019
  });
  const row = getDb()
    .prepare("select lead_score, lead_classification from leads where lead_id = ?")
    .get(body.leadId) as { lead_score: number; lead_classification: string };

  assert.equal(row.lead_score, expectedScore);
  assert.equal(row.lead_classification, classifyLead(expectedScore));
});

test("Rate limiting — 6th rapid submission from the same IP is rejected with 429", async () => {
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
