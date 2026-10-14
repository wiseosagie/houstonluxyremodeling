import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { DatabaseSync } from "node:sqlite";
import { getDb, getLegacyDb, listLeads, snapshotDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Owner-only export of the leads database. Requires
// `Authorization: Bearer <LEADS_EXPORT_TOKEN>`; when that variable is unset
// the route doesn't exist (404), so it can never be open by accident.
//
//   ?format=json    (default) every lead row as JSON
//   ?format=sqlite  a downloadable copy of the SQLite file itself
//   ?db=legacy      read the original data/app.db instead of data/leads.db

function isAuthorized(request: NextRequest, expected: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return provided.length > 0 && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  const expected = process.env.LEADS_EXPORT_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (!isAuthorized(request, expected)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const noStore = { "cache-control": "no-store" };
  const params = request.nextUrl.searchParams;
  const legacy = params.get("db") === "legacy";

  let db: DatabaseSync | null = null;
  try {
    db = legacy ? getLegacyDb() : getDb();
    if (!db) {
      return NextResponse.json({ error: "Legacy database not found." }, { status: 404, headers: noStore });
    }

    if (params.get("format") === "sqlite") {
      return new NextResponse(new Uint8Array(snapshotDb(db)), {
        status: 200,
        headers: {
          ...noStore,
          "content-type": "application/vnd.sqlite3",
          "content-disposition": `attachment; filename="${legacy ? "app" : "leads"}.db"`,
        },
      });
    }

    const leads = listLeads(db);
    return NextResponse.json({ count: leads.length, leads }, { status: 200, headers: noStore });
  } catch (error) {
    console.error("[api/leads/export] Failed to export leads", error);
    return NextResponse.json({ error: "Export failed." }, { status: 500, headers: noStore });
  } finally {
    // The legacy handle is opened per request; the main one is shared.
    if (legacy) db?.close();
  }
}
