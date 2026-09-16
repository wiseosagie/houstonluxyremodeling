// -----------------------------------------------------------------------------
// Lead scoring
//
// Centralized, server-side only. Score and classification are never sent to
// the client. See docs/LEAD_SCORING.md for the full rationale and the
// 90-day review process for adjusting these rules.
// -----------------------------------------------------------------------------

import { NEIGHBORHOODS } from "./constants";

const BUDGET_SCORES: Record<string, number> = {
  "1m_plus": 30,
  "500k_1m": 25,
  "250k_500k": 20,
  "100k_250k": 15,
  "50k_100k": 5,
  under_50k: 0,
  not_sure: 5,
};

const TIMELINE_SCORES: Record<string, number> = {
  immediately: 15,
  "1_3_months": 15,
  "3_6_months": 10,
  "6_12_months": 5,
  researching: 0,
};

const PROJECT_TYPE_SCORES: Record<string, number> = {
  "whole-home": 15,
  "home-addition": 12,
  kitchen: 10,
  "primary-suite": 8,
  "outdoor-living": 8,
  other: 5,
};

const FOCUS_NEIGHBORHOOD_SCORE = 15;
const OTHER_HOUSTON_AREA_SCORE = 5;

export const LEAD_CLASSIFICATION = {
  PRIORITY: "PRIORITY",
  QUALIFIED: "QUALIFIED",
  NURTURE: "NURTURE",
} as const;

export type LeadClassification =
  (typeof LEAD_CLASSIFICATION)[keyof typeof LEAD_CLASSIFICATION];

// Thresholds, out of a maximum possible score of 75 (30 + 15 + 15 + 15).
// Documented in docs/LEAD_SCORING.md.
const PRIORITY_THRESHOLD = 45;
const QUALIFIED_THRESHOLD = 25;

export function scoreNeighborhood(neighborhoodSlug: string | null): number {
  if (!neighborhoodSlug) return OTHER_HOUSTON_AREA_SCORE;
  const isFocusArea = NEIGHBORHOODS.some((n) => n.slug === neighborhoodSlug);
  return isFocusArea ? FOCUS_NEIGHBORHOOD_SCORE : OTHER_HOUSTON_AREA_SCORE;
}

export function calculateLeadScore(input: {
  budgetRange: string;
  timeline: string;
  projectType: string;
  neighborhoodSlug: string | null;
}): number {
  const budgetScore = BUDGET_SCORES[input.budgetRange] ?? 0;
  const timelineScore = TIMELINE_SCORES[input.timeline] ?? 0;
  const projectScore = PROJECT_TYPE_SCORES[input.projectType] ?? 5;
  const locationScore = scoreNeighborhood(input.neighborhoodSlug);

  return budgetScore + timelineScore + projectScore + locationScore;
}

export function classifyLead(score: number): LeadClassification {
  if (score >= PRIORITY_THRESHOLD) return LEAD_CLASSIFICATION.PRIORITY;
  if (score >= QUALIFIED_THRESHOLD) return LEAD_CLASSIFICATION.QUALIFIED;
  return LEAD_CLASSIFICATION.NURTURE;
}
