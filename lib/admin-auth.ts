import crypto from "crypto";
import type { NextRequest } from "next/server";

export const PORTFOLIO_ADMIN_SESSION_COOKIE = "portfolio_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function getConfiguredValue(primary: string, legacy: string): string | null {
  return process.env[primary] ?? process.env[legacy] ?? null;
}

function safeEqual(left: string, right: string): boolean {
  const leftHash = crypto.createHash("sha256").update(left).digest();
  const rightHash = crypto.createHash("sha256").update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

export function isValidAdminPassword(password: string): boolean {
  const configuredPassword = getConfiguredValue("PORTFOLIO_ADMIN_PASSWORD", "TESTIMONIAL_ADMIN_PASSWORD");
  return Boolean(configuredPassword && safeEqual(password, configuredPassword));
}

export function createAdminSession(): string | null {
  const secret = getConfiguredValue("PORTFOLIO_ADMIN_SESSION_SECRET", "TESTIMONIAL_ADMIN_SESSION_SECRET");
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify({ expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function isValidAdminSession(session: string | undefined): boolean {
  const secret = getConfiguredValue("PORTFOLIO_ADMIN_SESSION_SECRET", "TESTIMONIAL_ADMIN_SESSION_SECRET");
  if (!session || !secret) return false;
  const [payload, signature, ...extra] = session.split(".");
  if (!payload || !signature || extra.length > 0) return false;
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(signature, expectedSignature)) return false;
  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof parsed === "object" && parsed !== null && "expiresAt" in parsed && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function isAdminRequest(request: NextRequest): boolean {
  return isValidAdminSession(request.cookies.get(PORTFOLIO_ADMIN_SESSION_COOKIE)?.value);
}

export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

export const adminSessionCookie = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
