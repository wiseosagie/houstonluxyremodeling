import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/adminAuth";

export async function POST() {
  const response = new NextResponse(null, { status: 303, headers: { location: "/admin" } });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
