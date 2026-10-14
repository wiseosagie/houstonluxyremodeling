import "server-only";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import type { LeadClassification } from "./leadScoring";
import { LEAD_COLUMNS, type LeadRow } from "./leadRow";
import { insertTableLead, isTableStorageConfigured, listTableLeads } from "./tableStore";

// Two interchangeable backends hold the `leads` records:
//
// - Azure Table Storage, whenever AZURE_TABLES_CONNECTION_STRING is set. This
//   is production: the Static Web App's managed backend has a throwaway disk
//   that is wiped on deploys/restarts, so a file there loses leads.
// - SQLite (Node's built-in `node:sqlite`) otherwise — a local file
//   (`data/leads.db`, created on first use) for development, or `:memory:`
//   for the test suite.
//
// Either way a lead is the same flat row (`LeadRow`, columns as in SCHEMA),
// so the export and the snapshot below don't care which backend is active.

const SCHEMA = `
  create table if not exists leads (
    lead_id text primary key,
    created_at text not null,
    updated_at text not null,

    first_name text not null,
    last_name text not null,
    email text not null,
    phone text not null,

    zip_code text not null,
    neighborhood text,

    project_type text not null,
    budget_range text not null,
    timeline text not null,
    design_status text not null,
    project_description text not null default '',

    lead_score integer not null default 0,
    lead_classification text not null default 'NURTURE',

    source text not null default '',
    medium text not null default '',
    campaign text not null default '',
    content text not null default '',
    term text not null default '',
    landing_page text not null default '',
    referrer text not null default '',

    status text not null default 'NEW',
    assigned_partner text,
    internal_notes text
  );

  create index if not exists leads_created_at_idx on leads (created_at desc);
  create index if not exists leads_status_idx on leads (status);
  create index if not exists leads_classification_idx on leads (lead_classification);
`;

function resolveDbPath(): string {
  const configured = process.env.SQLITE_DB_PATH;
  if (configured === ":memory:") return ":memory:";

  const path = resolve(configured && configured.length > 0 ? configured : "./data/leads.db");
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return path;
}

// Reused across dev-server hot reloads and warm serverless invocations — a
// fresh connection per request would repeatedly reopen the same file for no
// benefit, and would break the `:memory:` database the test suite relies on.
declare global {
  // eslint-disable-next-line no-var
  var __hlrDb: DatabaseSync | undefined;
}

export function getDb(): DatabaseSync {
  if (globalThis.__hlrDb) return globalThis.__hlrDb;

  const instance = new DatabaseSync(resolveDbPath());
  instance.exec("pragma journal_mode = WAL;");
  instance.exec(SCHEMA);
  globalThis.__hlrDb = instance;
  return instance;
}

function insertRow(db: DatabaseSync, row: LeadRow): void {
  db.prepare(
    `insert into leads (${LEAD_COLUMNS.join(", ")}) values (${LEAD_COLUMNS.map(() => "?").join(", ")})`
  ).run(...LEAD_COLUMNS.map((column) => row[column] as SQLInputValue));
}

export type NewLeadInput = {
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
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landingPage: string;
  referrer: string;
};

// Stores a new lead and returns nothing — callers already generated leadId
// so the API response and the stored row are guaranteed to agree. Throws on
// failure; the caller (the API route) is responsible for turning that into a
// safe 500 response without leaking the underlying error to the client.
export async function insertLead(leadId: string, input: NewLeadInput): Promise<void> {
  const now = new Date().toISOString();
  const row: LeadRow = {
    lead_id: leadId,
    created_at: now,
    updated_at: now,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    zip_code: input.zipCode,
    neighborhood: input.neighborhood,
    project_type: input.projectType,
    budget_range: input.budgetRange,
    timeline: input.timeline,
    design_status: input.designStatus,
    project_description: input.projectDescription,
    lead_score: input.leadScore,
    lead_classification: input.leadClassification,
    source: input.source,
    medium: input.medium,
    campaign: input.campaign,
    content: input.content,
    term: input.term,
    landing_page: input.landingPage,
    referrer: input.referrer,
    status: "NEW",
    assigned_partner: null,
    internal_notes: null,
  };

  if (isTableStorageConfigured()) await insertTableLead(row);
  else insertRow(getDb(), row);
}

// Every lead, newest first.
export async function listLeads(): Promise<LeadRow[]> {
  if (isTableStorageConfigured()) {
    const rows = await listTableLeads();
    return rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }
  return getDb().prepare("select * from leads order by created_at desc").all() as LeadRow[];
}

// The given leads as a standalone SQLite database file (same schema), so
// the owner can download a real `.db` copy whichever backend is live.
export function buildSqliteSnapshot(rows: LeadRow[]): Buffer {
  const dir = mkdtempSync(join(tmpdir(), "hlr-db-"));
  const target = join(dir, "leads.db");
  try {
    const db = new DatabaseSync(target);
    try {
      db.exec(SCHEMA);
      for (const row of rows) insertRow(db, row);
    } finally {
      db.close();
    }
    return readFileSync(target);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
