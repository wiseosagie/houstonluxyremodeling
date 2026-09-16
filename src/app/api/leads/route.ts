import { NextRequest, NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/lib/validation";
import { calculateLeadScore, classifyLead } from "@/lib/leadScoring";
import { neighborhoodFromZip } from "@/lib/zipNeighborhood";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
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

  // Honeypot: a real visitor never populates this hidden field.
  if (data.website) {
    // Respond as if successful so bots gain no signal, but do not persist.
    return NextResponse.json({ success: true }, { status: 201 });
  }

  // Basic bot heuristic: forms filled in under 2.5 seconds are almost always
  // automated. formStartedAt is set client-side when the funnel mounts.
  if (data.formStartedAt && Date.now() - data.formStartedAt < 2500) {
    return NextResponse.json({ success: true }, { status: 201 });
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

  let leadId: string | null = null;
  try {
    const supabase = getSupabaseServerClient();
    const { data: inserted, error } = await supabase
      .from("leads")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        zip_code: data.zipCode,
        neighborhood: neighborhood?.name ?? null,
        project_type: data.projectType,
        budget_range: data.budgetRange,
        timeline: data.timeline,
        design_status: data.designStatus,
        project_description: data.projectDescription,
        lead_score: leadScore,
        lead_classification: leadClassification,
        source: data.source || null,
        medium: data.medium || null,
        campaign: data.campaign || null,
        content: data.content || null,
        term: data.term || null,
        landing_page: data.landingPage || null,
        referrer: data.referrer || null,
        status: "NEW",
      })
      .select("lead_id")
      .single();

    if (error) throw error;
    leadId = inserted?.lead_id ?? null;
  } catch (error) {
    console.error("[api/leads] Failed to store lead", error);
    return NextResponse.json(
      { error: "We were unable to save your request. Please try again." },
      { status: 500 }
    );
  }

  // The lead is safely stored. Email delivery failure must never lose or
  // roll back the database record — log and continue.
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
    console.error(
      `[api/leads] Lead ${leadId} stored successfully but notification email failed: ${emailResult.error}`
    );
  }

  return NextResponse.json({ success: true, leadId }, { status: 201 });
}
