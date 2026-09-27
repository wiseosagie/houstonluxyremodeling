import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/lib/validation";
import { calculateLeadScore, classifyLead } from "@/lib/leadScoring";
import { neighborhoodFromZip } from "@/lib/zipNeighborhood";
import { insertLead } from "@/lib/db";
import { sendLeadNotificationEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSubmissionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot: a real visitor never sees or fills this hidden field.
  // Basic bot heuristic: forms filled in under 2.5 seconds are almost always
  // automated. formStartedAt is set client-side when the funnel mounts.
  const isBot =
    Boolean(data.website) || (data.formStartedAt !== undefined && Date.now() - data.formStartedAt < 2500);

  if (isBot) {
    // Respond exactly like a real success (same status, same shape) so a bot
    // gains no signal that anything was rejected — but leadId is null since
    // nothing was stored, which lets our own client tell the difference
    // without exposing it in the response itself.
    return NextResponse.json({ success: true, leadId: null }, { status: 201 });
  }

  const neighborhood = neighborhoodFromZip(data.zipCode);
  const leadScore = calculateLeadScore({
    budgetRange: data.budgetRange,
    timeline: data.timeline,
    projectType: data.projectType,
    neighborhoodSlug: neighborhood?.slug ?? null,
  });
  const leadClassification = classifyLead(leadScore);
  const createdAt = new Date();
  const leadId = randomUUID();

  try {
    insertLead(leadId, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      zipCode: data.zipCode,
      neighborhood: neighborhood?.name ?? null,
      projectType: data.projectType,
      budgetRange: data.budgetRange,
      timeline: data.timeline,
      designStatus: data.designStatus,
      projectDescription: data.projectDescription,
      leadScore,
      leadClassification,
      source: data.source,
      medium: data.medium,
      campaign: data.campaign,
      content: data.content,
      term: data.term,
      landingPage: data.landingPage,
      referrer: data.referrer,
    });
  } catch (error) {
    // The lead was never persisted — this is the one case where we must not
    // claim success. No internal error detail is exposed to the client.
    console.error("[api/leads] Failed to store lead", error);
    return NextResponse.json(
      { error: "We were unable to submit your request. Please try again or call us directly." },
      { status: 500 }
    );
  }

  // The lead is safely stored — everything below is best-effort. Email
  // notification is an optional convenience, never a condition of success:
  // a missing configuration or a failed send must never lose or roll back
  // the lead that's already in SQLite.
  const emailResult = await sendLeadNotificationEmail({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    zipCode: data.zipCode,
    neighborhood: neighborhood?.name ?? null,
    projectType: data.projectType,
    budgetRange: data.budgetRange,
    timeline: data.timeline,
    designStatus: data.designStatus,
    projectDescription: data.projectDescription,
    leadScore,
    leadClassification,
    source: data.source,
    medium: data.medium,
    campaign: data.campaign,
    content: data.content,
    term: data.term,
    landingPage: data.landingPage,
    referrer: data.referrer,
    createdAt,
  });

  if (!emailResult.sent) {
    console.error(`[api/leads] Lead ${leadId} stored successfully but notification email failed: ${emailResult.error}`);
  }

  return NextResponse.json({ success: true, leadId }, { status: 201 });
}
