import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isWithinSlidingWindowLog } from "@/utils/cacheUtils";
import { getClientIp } from "@/utils/clientCredentials";
import {
  adminSessionCookie,
  createAdminSession,
  isSameOriginRequest,
  isValidAdminPassword,
  TESTIMONIAL_ADMIN_SESSION_COOKIE,
} from "@/lib/testimonial-admin-auth";

const loginSchema = z.object({ password: z.string().min(1).max(256) });

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request format." }, { status: 415 });
  }

  const ip = getClientIp(request);
  if (!isWithinSlidingWindowLog(`swl:testimonial-admin:login:${ip}`, 5, 900)) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success || !isValidAdminPassword(parsed.data.password)) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const session = createAdminSession();
    if (!session) {
      console.error("[testimonial-admin] Missing session secret");
      return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(TESTIMONIAL_ADMIN_SESSION_COOKIE, session, adminSessionCookie);
    return response;
  } catch (err: unknown) {
    console.error(
      "[testimonial-admin] Login failed",
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 503 });
  }
}
