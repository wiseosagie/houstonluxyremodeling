import "server-only";
import type { LeadClassification } from "./leadScoring";

type LeadNotificationInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  neighborhood: string | null;
  projectType: string;
  budgetRange: string;
  timeline: string;
  designStatus: string;
  projectDescription: string;
  leadScore: number;
  leadClassification: LeadClassification;
  source: string;
  landingPage: string;
  createdAt: Date;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(lead: LeadNotificationInput) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 12px 6px 0;color:#6E5F4A;font-family:Arial,Helvetica,sans-serif;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#22201D;font-family:Arial,Helvetica,sans-serif;font-size:14px;">${escapeHtml(value)}</td>
    </tr>`;

  return `
  <div style="background:#FAF7F2;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border:1px solid #EFEAE3;">
      <div style="background:#22201D;padding:20px 24px;">
        <p style="margin:0;color:#FAF7F2;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Houston Luxury Remodeling</p>
        <h1 style="margin:6px 0 0;color:#FFFFFF;font-size:18px;">New Houston Remodeling Lead</h1>
      </div>
      <div style="padding:20px 24px;">
        <p style="display:inline-block;margin:0 0 16px;padding:4px 10px;background:${
          lead.leadClassification === "PRIORITY" ? "#7A5E3B" : lead.leadClassification === "QUALIFIED" ? "#AB9A80" : "#DFD6C9"
        };color:#FFFFFF;font-size:12px;letter-spacing:1px;text-transform:uppercase;">${lead.leadClassification}</p>
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          ${row("Name", `${lead.firstName} ${lead.lastName}`)}
          ${row("Phone", lead.phone)}
          ${row("Email", lead.email)}
          ${row("ZIP", lead.zipCode)}
          ${row("Neighborhood", lead.neighborhood ?? "Other Houston area")}
          ${row("Project", lead.projectType)}
          ${row("Budget", lead.budgetRange)}
          ${row("Timeline", lead.timeline)}
          ${row("Design status", lead.designStatus)}
          ${row("Lead score", String(lead.leadScore))}
          ${row("Classification", lead.leadClassification)}
          ${row("Traffic source", lead.source || "direct")}
          ${row("Landing page", lead.landingPage || "n/a")}
          ${row("Date/time", lead.createdAt.toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CT")}
        </table>
        ${
          lead.projectDescription
            ? `<div style="margin-top:16px;padding:12px;background:#F7F5F2;">
                 <p style="margin:0 0 4px;color:#6E5F4A;font-size:12px;">Project description</p>
                 <p style="margin:0;color:#22201D;font-size:14px;white-space:pre-wrap;">${escapeHtml(lead.projectDescription)}</p>
               </div>`
            : ""
        }
      </div>
    </div>
  </div>`;
}

function buildEmailText(lead: LeadNotificationInput) {
  return [
    "NEW HOUSTON REMODELING LEAD",
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `ZIP: ${lead.zipCode}`,
    `Neighborhood: ${lead.neighborhood ?? "Other Houston area"}`,
    `Project: ${lead.projectType}`,
    `Budget: ${lead.budgetRange}`,
    `Timeline: ${lead.timeline}`,
    `Design status: ${lead.designStatus}`,
    `Project description: ${lead.projectDescription || "(none provided)"}`,
    `Lead score: ${lead.leadScore}`,
    `Classification: ${lead.leadClassification}`,
    `Traffic source: ${lead.source || "direct"}`,
    `Landing page: ${lead.landingPage || "n/a"}`,
    `Date/time: ${lead.createdAt.toLocaleString("en-US", { timeZone: "America/Chicago" })} CT`,
  ].join("\n");
}

export type EmailResult = { sent: boolean; error?: string };

export async function sendLeadNotificationEmail(
  lead: LeadNotificationInput
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.EMAIL_FROM || "Houston Luxury Remodeling <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error(
      "[lead-notification] Skipped: RESEND_API_KEY or LEAD_NOTIFICATION_EMAIL is not configured."
    );
    return { sent: false, error: "email_not_configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `New Houston Remodeling Lead — ${lead.leadClassification} — ${lead.firstName} ${lead.lastName}`,
        html: buildEmailHtml(lead),
        text: buildEmailText(lead),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[lead-notification] Resend API error", response.status, body);
      return { sent: false, error: `resend_${response.status}` };
    }

    return { sent: true };
  } catch (error) {
    console.error("[lead-notification] Failed to send email", error);
    return { sent: false, error: "network_error" };
  }
}
