import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// next.config.mjs's `redirects()` with a host `has` condition isn't applied by
// the hosting platform's Next.js runtime, so the www -> apex canonicalization
// is enforced here instead, where it's guaranteed to run per-request.
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.houstonluxuryremodeling.com")) {
    const url = new URL(request.url);
    url.hostname = "houstonluxuryremodeling.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
}

export const config = {
  matcher: "/:path*",
};
