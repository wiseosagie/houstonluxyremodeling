import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminConfigured, isValidAdminSession } from "@/lib/adminAuth";
import { buildSqliteSnapshot, listLeads } from "@/lib/db";
import { LEAD_COLUMNS, type LeadRow } from "@/lib/leadRow";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Owner-only export of the leads database. Requires either
// `Authorization: Bearer <LEADS_EXPORT_TOKEN>` (scripts/curl) or a signed-in
// /admin session cookie (the admin page's download buttons). With neither
// LEADS_EXPORT_TOKEN nor ADMIN_PASSWORD set the route doesn't exist (404).
//
//   ?format=json    (default) every lead row as JSON
//   ?format=csv     the same leads as a spreadsheet (opens in Excel)
//   ?format=sqlite  the same leads as a downloadable SQLite database file

function hasValidToken(request: NextRequest, expected: string | undefined): boolean {
  if (!expected) return false;
  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return provided.length > 0 && timingSafeEqual(a, b);
}

// Values starting with = + - @ are prefixed with ' so a submitted name or
// description can't run as a formula when the file is opened in Excel.
function toCsv(leads: LeadRow[]): string {
  const cell = (value: unknown) => {
    let text = value === null || value === undefined ? "" : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const lines = [LEAD_COLUMNS.join(","), ...leads.map((lead) => LEAD_COLUMNS.map((c) => cell(lead[c])).join(","))];
  // Leading BOM so Excel reads the file as UTF-8.
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

export async function GET(request: NextRequest) {
  const token = process.env.LEADS_EXPORT_TOKEN;
  if (!token && !isAdminConfigured()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (!hasValidToken(request, token) && !isValidAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const noStore = { "cache-control": "no-store" };
  try {
    const leads = await listLeads();

    const format = request.nextUrl.searchParams.get("format");

    if (format === "csv") {
      return new NextResponse(toCsv(leads), {
        status: 200,
        headers: {
          ...noStore,
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": 'attachment; filename="leads.csv"',
        },
      });
    }

    if (format === "sqlite") {
      return new NextResponse(new Uint8Array(buildSqliteSnapshot(leads)), {
        status: 200,
        headers: {
          ...noStore,
          "content-type": "application/vnd.sqlite3",
          "content-disposition": 'attachment; filename="leads.db"',
        },
      });
    }

    return NextResponse.json({ count: leads.length, leads }, { status: 200, headers: noStore });
  } catch (error) {
    console.error("[api/leads/export] Failed to export leads", error);
    return NextResponse.json({ error: "Export failed." }, { status: 500, headers: noStore });
  }
}
