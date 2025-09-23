import { NextRequest } from "next/server";
import crypto from "crypto"
export function getClientIp(req: NextRequest) {
    const forwarded = req.headers.get("x-forwarded-for");
    return Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0].trim() || req.headers.get("x-real-ip") || req.headers.get("x-vercel-forwarded-for") || "";
}

export function hashDeviceFingerprint(req: NextRequest) {
    const deviceFingerprint = {
        userAgent: req.headers.get("user-agent") || "",
        acceptLang: req.headers.get("accept-language") || "",
        accept: req.headers.get("accept") || "",
    }

    const parsedDeviceFingerprint = JSON.stringify(deviceFingerprint);
    return crypto.createHash("sha256").update(parsedDeviceFingerprint).digest("hex")
}