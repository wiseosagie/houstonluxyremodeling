-- Houston Luxury Remodeling — Phase 1 schema
-- Run via Supabase SQL editor or `supabase db push`.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  lead_id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

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
  project_description text default '',

  lead_score integer not null default 0,
  lead_classification text not null default 'NURTURE',

  -- Attribution, captured from UTM parameters and preserved through the funnel.
  source text,
  medium text,
  campaign text,
  content text,
  term text,
  landing_page text,
  referrer text,

  -- Pipeline management (Phase 2 CRM-lite fields, safe to extend further).
  status text not null default 'NEW',
  assigned_partner text,
  internal_notes text,

  constraint leads_status_check check (
    status in (
      'NEW', 'CONTACTED', 'QUALIFIED', 'SENT_TO_PARTNER',
      'APPOINTMENT', 'PROPOSAL', 'WON', 'LOST', 'NURTURE'
    )
  ),
  constraint leads_classification_check check (
    lead_classification in ('PRIORITY', 'QUALIFIED', 'NURTURE')
  )
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_classification_idx on public.leads (lead_classification);
create index if not exists leads_email_idx on public.leads (email);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- Lightweight IP-based rate limiting for the public consultation form.
-- Only IP hashes and timestamps are stored — no PII.
create table if not exists public.lead_rate_limits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_rate_limits_ip_created_idx
  on public.lead_rate_limits (ip_hash, created_at desc);

-- Row Level Security: locked down by default. All reads/writes happen
-- through the server-side API route using the Supabase service role key,
-- which bypasses RLS. No anon-key policies are defined, so the anon key
-- (used only for future read-only, non-PII features) has zero access.
alter table public.leads enable row level security;
alter table public.lead_rate_limits enable row level security;
