import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdminConfigured, isValidAdminSession } from "@/lib/adminAuth";
import { listLeads } from "@/lib/db";
import type { LeadRow } from "@/lib/leadRow";
import { BUDGET_OPTIONS, DESIGN_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS, TIMELINE_OPTIONS } from "@/lib/constants";

// Private lead viewer — password login (src/lib/adminAuth.ts), never indexed,
// not in the sitemap or INDEXABLE_ROUTES.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads Admin",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  invalid: "Incorrect password.",
  locked: "Too many incorrect attempts. Try again in an hour.",
};

function labelFor(options: readonly { value: string; label: string }[], value: LeadRow[keyof LeadRow]) {
  return options.find((o) => o.value === value)?.label ?? String(value ?? "");
}

function formatDate(iso: LeadRow["created_at"]) {
  return new Date(String(iso)).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " CT";
}

function LoginForm({ error }: { error?: string }) {
  return (
    <form method="post" action="/api/admin/login" className="mt-8 max-w-sm space-y-4">
      <label className="block">
        <span className="block text-sm text-charcoal-light mb-2">Password</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full border border-stone-300 bg-white px-4 py-3 text-base focus:border-bronze-dark focus:outline-none"
        />
      </label>
      {error && ERRORS[error] && <p className="text-sm text-red-700">{ERRORS[error]}</p>}
      <button type="submit" className="btn-primary w-full">Sign in</button>
    </form>
  );
}

function LeadsTable({ leads }: { leads: LeadRow[] }) {
  if (leads.length === 0) {
    return <p className="mt-8 text-charcoal-light">No leads yet.</p>;
  }

  return (
    <div className="mt-8 overflow-x-auto border border-stone-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase tracking-widest2 text-stone-600">
          <tr>
            {["Received", "Name", "Contact", "Project", "Budget", "Timeline", "Location", "Score", "Status"].map((h) => (
              <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 bg-white">
          {leads.map((lead) => (
            <tr key={String(lead.lead_id)} className="align-top">
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(lead.created_at)}</td>
              <td className="px-4 py-3 whitespace-nowrap font-medium">
                {lead.first_name} {lead.last_name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <a href={`mailto:${lead.email}`} className="block text-bronze-dark hover:underline">{lead.email}</a>
                <a href={`tel:${lead.phone}`} className="block hover:underline">{lead.phone}</a>
              </td>
              <td className="px-4 py-3 min-w-[16rem]">
                <span className="block whitespace-nowrap">{labelFor(PROJECT_TYPE_OPTIONS, lead.project_type)}</span>
                <span className="block text-xs text-stone-600">{labelFor(DESIGN_STATUS_OPTIONS, lead.design_status)}</span>
                {lead.project_description && (
                  <span className="mt-1 block whitespace-pre-wrap text-charcoal-light">{lead.project_description}</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{labelFor(BUDGET_OPTIONS, lead.budget_range)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{labelFor(TIMELINE_OPTIONS, lead.timeline)}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {lead.zip_code}
                <span className="block text-xs text-stone-600">{lead.neighborhood ?? "Other Houston area"}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {lead.lead_score}
                <span className="block text-xs text-stone-600">{lead.lead_classification}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {lead.status}
                <span className="block text-xs text-stone-600">{lead.source || "direct"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const signedIn = isValidAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  const leads = signedIn ? await listLeads() : [];

  return (
    <div className="container-page py-12 md:py-16">
      <p className="eyebrow mb-4">Admin</p>
      <h1 className="text-3xl md:text-4xl">Leads</h1>

      {!isAdminConfigured() ? (
        <p className="mt-8 text-charcoal-light">Admin access is not configured (ADMIN_PASSWORD is not set).</p>
      ) : !signedIn ? (
        <LoginForm error={error} />
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="text-charcoal-light">
              {leads.length} {leads.length === 1 ? "lead" : "leads"}, newest first
            </p>
            <a href="/api/leads/export?format=csv" className="btn-ghost">Download CSV</a>
            <a href="/api/leads/export?format=sqlite" className="btn-ghost">Download .db</a>
            <form method="post" action="/api/admin/logout">
              <button type="submit" className="btn-ghost">Sign out</button>
            </form>
          </div>
          <LeadsTable leads={leads} />
        </>
      )}
    </div>
  );
}
