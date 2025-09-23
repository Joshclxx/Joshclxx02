//pag nag ka error sa import, re import mo lang yan
import { localCache } from "@/localCache";
import { isWithinSlidingWindowLog } from "@/utils/cacheUtils";
import { getClientIp, hashDeviceFingerprint } from "@/utils/clientCredentials";
import { sanitizeContactInput } from "@/utils/sanitizer";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  const body = await req.json();
  const url = new URL(req.url);
  const { name, email, subject, message } = body;

  //resent init
  const resend = new Resend(process.env.RESEND_SECRET);

  //rate limits
  const GLOBAL_LIMIT = 10;
  const GLOBAL_WINDOW = 120;

  const SWL_DEVICE_LIMIT = 2;
  const SWL_IP_LIMIT = 4;
  const SWL_WINDOW = 120;

  //user credentials
  const ip = getClientIp(req);
  const deviceHash = hashDeviceFingerprint(req);

  //keys
  const globalKey = `swl:contact:global`;
  const ipKey = `swl:contact:ip:${ip}`;
  const deviceKey = `swl:contact:device:${deviceHash}`;

  try {
    //rate limits
    if (!isWithinSlidingWindowLog(deviceKey, SWL_DEVICE_LIMIT, SWL_WINDOW))
      return new NextResponse(null, { status: 429 });
    if (!isWithinSlidingWindowLog(ipKey, SWL_IP_LIMIT, SWL_WINDOW))
      return new NextResponse(null, { status: 429 });
    if (!isWithinSlidingWindowLog(globalKey, GLOBAL_LIMIT, GLOBAL_WINDOW))
      return new NextResponse(null, { status: 429 });
    console.log(localCache.getStat());

    //invalidate any query and params
    if (url.searchParams.toString())
      return new NextResponse(null, { status: 400 });

    //invalidate any non application/json content-type
    if (!contentType || !contentType.includes("application/json"))
      return new NextResponse(null, { status: 415 });

    //reject invalid body format
    if (!body || Object.keys(body).length < 4)
      return new NextResponse(null, { status: 400 });

    //validate and sanitize contact inputs
    const sanitizedInputs = sanitizeContactInput({
      name,
      email,
      subject,
      message,
    });

    //send email
    await resend.emails.send({
      from: `Portfolio Contact <onboarding@resend.dev>`, //don't modify this
      to: "joshclxx02@gmail.com", //palitan mo ng email mo Josh
      subject,
      text: `Name: ${sanitizedInputs.name}\nEmail: ${sanitizedInputs.email}\nSubject: ${sanitizedInputs.subject}\n\nMessage:\n${sanitizedInputs.message}`,
    });

    //done
    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(null, { status: 500 });
  }
}
