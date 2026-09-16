import "server-only";
import { createHash } from "crypto";
import { getSupabaseServerClient } from "./supabaseServer";

const WINDOW_MINUTES = 60;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

// In-memory first line of defense (cheap, catches rapid-fire bots within a
// single warm serverless instance). The Supabase-backed check below is the
// authoritative layer since serverless instances are not shared/persistent.
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

  if (!checkMemory(ipHash)) {
    return false;
  }

  try {
    const supabase = getSupabaseServerClient();
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from("lead_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", windowStart);

    if (error) {
      // Fail open on infra errors — the in-memory check above still applies,
      // and we do not want a database hiccup to block legitimate leads.
      console.error("[rate-limit] Supabase check failed, failing open", error.message);
      return true;
    }

    if ((count ?? 0) >= MAX_SUBMISSIONS_PER_WINDOW) {
      return false;
    }

    await supabase.from("lead_rate_limits").insert({ ip_hash: ipHash });
    return true;
  } catch (error) {
    console.error("[rate-limit] Unexpected error, failing open", error);
    return true;
  }
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
