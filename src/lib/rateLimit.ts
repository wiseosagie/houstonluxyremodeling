import "server-only";
import { createHash } from "crypto";

const WINDOW_MINUTES = 60;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

// In-memory only — no database backing it. Resets on cold start and isn't
// shared across function instances, so it's a soft deterrent rather than a
// hard cap under Azure Static Web Apps' serverless model.
const memoryHits = new Map<string, number[]>();

function checkMemory(ipHash: string): boolean {
  const now = Date.now();
  const windowMs = WINDOW_MINUTES * 60 * 1000;
  const hits = (memoryHits.get(ipHash) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  memoryHits.set(ipHash, hits);
  return hits.length <= MAX_SUBMISSIONS_PER_WINDOW;
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

// Returns true if the request is allowed to proceed.
export async function checkRateLimit(ip: string): Promise<boolean> {
  const ipHash = hashIp(ip);
  return checkMemory(ipHash);
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
