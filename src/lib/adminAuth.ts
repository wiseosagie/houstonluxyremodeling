import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Password login for /admin. ADMIN_PASSWORD (an Azure app setting) is the only
// credential; a successful login sets a cookie holding an expiry time and an
// HMAC of it keyed by that password — so nothing is stored server-side, and
// changing the password signs every existing session out.

export const ADMIN_COOKIE = "hlr_admin";
const SESSION_SECONDS = 12 * 60 * 60;

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function sign(expires: string, password: string): string {
  return createHmac("sha256", `hlr-admin-session:${password}`).update(expires).digest("hex");
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !candidate) return false;
  return timingSafeEqual(digest(candidate), digest(expected));
}

export function createAdminSession(): { value: string; maxAge: number } {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return { value: `${expires}.${sign(expires, process.env.ADMIN_PASSWORD!)}`, maxAge: SESSION_SECONDS };
}

export function isValidAdminSession(value: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !value) return false;

  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) * 1000 < Date.now()) return false;
  return timingSafeEqual(digest(signature), digest(sign(expires, password)));
}
