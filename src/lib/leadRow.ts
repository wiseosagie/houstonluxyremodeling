// The flat shape of a stored lead, shared by both storage backends (see
// ./db.ts). Column names match the SQLite `leads` table.
export const LEAD_COLUMNS = [
  "lead_id", "created_at", "updated_at",
  "first_name", "last_name", "email", "phone",
  "zip_code", "neighborhood",
  "project_type", "budget_range", "timeline", "design_status", "project_description",
  "lead_score", "lead_classification",
  "source", "medium", "campaign", "content", "term", "landing_page", "referrer",
  "status", "assigned_partner", "internal_notes",
] as const;

export type LeadRow = Record<(typeof LEAD_COLUMNS)[number], string | number | null>;
