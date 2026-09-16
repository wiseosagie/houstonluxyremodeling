export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// See docs/ANALYTICS_EVENTS.md for the full event dictionary.
export type AnalyticsEvent =
  | "consultation_started"
  | "consultation_step_completed"
  | "consultation_submitted"
  | "phone_clicked"
  | "primary_cta_clicked";

export function trackEvent(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}
