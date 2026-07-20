import { isWithinSlidingWindowLog } from "@/utils/cacheUtils";
import { getClientIp, hashDeviceFingerprint } from "@/utils/clientCredentials";
import { escapeHtml, sanitizeContactInput } from "@/utils/sanitizer";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(125),
  message: z.string().trim().min(1).max(5000),
});

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
let resend: Resend | undefined;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  resend ??= new Resend(apiKey);
  return resend;
}

function createContactEmailHtml({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const receivedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#f6f8fa;color:#1f2328;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f8fa;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #d0d7de;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;background:#0d1117;color:#ffffff;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#8b949e;">Joshclxx Portfolio</p>
                <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;">New contact message</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 12px;">
                <p style="margin:0;font-size:16px;line-height:1.6;color:#57606a;">You received a new message from your portfolio contact form.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #d0d7de;border-radius:8px;">
                  <tr>
                    <td style="width:110px;padding:14px 16px;border-bottom:1px solid #d8dee4;font-size:13px;font-weight:700;color:#57606a;">From</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #d8dee4;font-size:15px;color:#1f2328;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="width:110px;padding:14px 16px;font-size:13px;font-weight:700;color:#57606a;">Email</td>
                    <td style="padding:14px 16px;font-size:15px;"><a href="mailto:${safeEmail}" style="color:#0969da;text-decoration:none;">${safeEmail}</a></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 32px;">
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#57606a;">MESSAGE</p>
                <div style="padding:18px;background:#f6f8fa;border-left:4px solid #2f81f7;border-radius:6px;font-size:15px;line-height:1.65;color:#1f2328;">${safeMessage}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:#f6f8fa;border-top:1px solid #d8dee4;font-size:12px;line-height:1.5;color:#57606a;">Received ${receivedAt} · Reply directly to this email to respond.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Invalid request format." }, { status: 415 });
  }

  const ip = getClientIp(req);
  const deviceHash = hashDeviceFingerprint(req);

  if (
    !isWithinSlidingWindowLog(`swl:contact:device:${deviceHash}`, 2, 120) ||
    !isWithinSlidingWindowLog(`swl:contact:ip:${ip}`, 4, 120) ||
    !isWithinSlidingWindowLog("swl:contact:global", 10, 120)
  ) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const parsed = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete the form correctly." }, { status: 400 });
    }

    const attachment = formData.get("attachment");
    if (attachment instanceof File && attachment.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json(
        { error: "Attachments must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    const { name, email, message } = sanitizeContactInput({
      ...parsed.data,
      subject: "New message from portfolio",
    });
    const attachments =
      attachment instanceof File && attachment.size > 0
        ? [
            {
              content: Buffer.from(await attachment.arrayBuffer()),
              filename: attachment.name.replace(/[\\/:*?"<>|]/g, "_") || "attachment",
              contentType: attachment.type || undefined,
            },
          ]
        : undefined;

    const { error } = await getResend().emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ??
        "Portfolio Contact <onboarding@resend.dev>",
      to: "joshclxx02@gmail.com",
      replyTo: email,
      subject: "New message from portfolio",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: createContactEmailHtml({ name, email, message }),
      attachments,
    });

    if (error) {
      console.error("Resend failed to send contact email", error.name);
      return NextResponse.json({ error: "Unable to send the message." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Contact email request failed", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Unable to send the message." }, { status: 500 });
  }
}
