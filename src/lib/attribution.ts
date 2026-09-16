"use client";

// Captures UTM parameters on first landing and preserves them in
// sessionStorage so they survive client-side navigation through the
// consultation funnel, then are submitted with the lead.

const STORAGE_KEY = "hlr_attribution";

export type Attribution = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landingPage: string;
  referrer: string;
};

const UTM_KEYS: Array<[keyof Attribution, string]> = [
  ["source", "utm_source"],
  ["medium", "utm_medium"],
  ["campaign", "utm_campaign"],
  ["content", "utm_content"],
  ["term", "utm_term"],
];

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") {
    return { source: "", medium: "", campaign: "", content: "", term: "", landingPage: "", referrer: "" };
  }

  const existingRaw = sessionStorage.getItem(STORAGE_KEY);
  const existing: Attribution | null = existingRaw ? JSON.parse(existingRaw) : null;

  const params = new URLSearchParams(window.location.search);
  const hasNewUtm = UTM_KEYS.some(([, param]) => params.get(param));

  if (existing && !hasNewUtm) {
    return existing;
  }

  const attribution: Attribution = {
    source: params.get("utm_source") || existing?.source || "",
    medium: params.get("utm_medium") || existing?.medium || "",
    campaign: params.get("utm_campaign") || existing?.campaign || "",
    content: params.get("utm_content") || existing?.content || "",
    term: params.get("utm_term") || existing?.term || "",
    landingPage: existing?.landingPage || window.location.pathname,
    referrer: existing?.referrer ?? document.referrer ?? "",
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}

export function getStoredAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}
