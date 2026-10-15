import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, checkAdminPassword, createAdminSession, isAdminConfigured } from "@/lib/adminAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Relative Location: behind Azure's proxy request.url carries an internal
// host, so an absolute redirect built from it would leave the public site.
function redirectTo(location: string) {
  return new NextResponse(null, { status: 303, headers: { location } });
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) return redirectTo("/admin");

  const form = await request.formData().catch(() => null);
  const password = String(form?.get("password") ?? "");

  if (!checkAdminPassword(password)) {
    // Only failed attempts count, so the owner is never locked out by
    // logging in repeatedly — 5 wrong passwords per IP per hour.
    const allowed = await checkRateLimit(getClientIp(request.headers), "admin-login");
    return redirectTo(allowed ? "/admin?error=invalid" : "/admin?error=locked");
  }

  const session = createAdminSession();
  const response = redirectTo("/admin");
  response.cookies.set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}
