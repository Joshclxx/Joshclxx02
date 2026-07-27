import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest, TESTIMONIAL_ADMIN_SESSION_COOKIE } from "@/lib/testimonial-admin-auth";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(TESTIMONIAL_ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
