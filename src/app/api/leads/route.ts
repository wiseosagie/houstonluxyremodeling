import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/lib/validation";
import { calculateLeadScore, classifyLead } from "@/lib/leadScoring";
import { neighborhoodFromZip } from "@/lib/zipNeighborhood";
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

  // No database — the notification email is the only record of this lead,
  // so a failed send must be reported as a failed submission.
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
    landingPage: data.landingPage,
    createdAt,
  });

  if (!emailResult.sent) {
    console.error(`[api/leads] Notification email failed for lead ${leadId}: ${emailResult.error}`);
    return NextResponse.json(
      { error: "We were unable to submit your request. Please try again or call us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, leadId }, { status: 201 });
}
