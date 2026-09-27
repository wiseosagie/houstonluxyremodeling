import "server-only";
import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { LeadClassification } from "./leadScoring";

// SQLite (Node's built-in `node:sqlite`) is the Phase 1 system of record for
// leads — no external database service. A single file on disk, created
// automatically on first use. See "Production deployment" in README.md for
// the one requirement this brings: the host's filesystem must persist that
// file across deploys/restarts, or leads will be lost.

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

  const path = resolve(configured && configured.length > 0 ? configured : "./data/app.db");
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

// Inserts a new lead and returns nothing — callers already generated leadId
// so the API response and the stored row are guaranteed to agree. Throws on
// failure; the caller (the API route) is responsible for turning that into a
// safe 500 response without leaking the underlying error to the client.
export function insertLead(leadId: string, input: NewLeadInput): void {
  const now = new Date().toISOString();

  getDb()
    .prepare(
      `insert into leads (
        lead_id, created_at, updated_at,
        first_name, last_name, email, phone,
        zip_code, neighborhood,
        project_type, budget_range, timeline, design_status, project_description,
        lead_score, lead_classification,
        source, medium, campaign, content, term, landing_page, referrer,
        status
      ) values (
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        'NEW'
      )`
    )
    .run(
      leadId,
      now,
      now,
      input.firstName,
      input.lastName,
      input.email,
      input.phone,
      input.zipCode,
      input.neighborhood,
      input.projectType,
      input.budgetRange,
      input.timeline,
      input.designStatus,
      input.projectDescription,
      input.leadScore,
      input.leadClassification,
      input.source,
      input.medium,
      input.campaign,
      input.content,
      input.term,
      input.landingPage,
      input.referrer
    );
}
