import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// next.config.mjs's `redirects()` with a host `has` condition isn't applied by
// the hosting platform's Next.js runtime, so the www -> apex canonicalization
// is enforced here instead, where it's guaranteed to run per-request.
export function middleware(request: NextRequest) {
  // Azure Static Web Apps proxies to the Next.js backend and rewrites `host`
  // to the internal hostname; the public host arrives in `x-forwarded-host`.
  const host = (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ""
  ).toLowerCase();
  if (host.startsWith("www.houstonluxuryremodeling.com")) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = "houstonluxuryremodeling.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
}

export const config = {
  matcher: "/:path*",
};
