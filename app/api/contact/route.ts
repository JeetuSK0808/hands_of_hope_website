import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactMessage } from "@/lib/contact-email";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  school: z.string().trim().max(160).optional().default(""),
  subject: z.string().trim().min(1).max(120),
  message: z.string().trim().min(10).max(5000),
  // Honeypot: real users never see this field, so a filled value means a bot.
  // Deliberately permissive here — a bot that fills it should be waved through
  // to the silent-accept branch below, not handed a validation error it can
  // learn from.
  company: z.string().max(200).optional().default(""),
});

/**
 * Best-effort per-IP throttle. Serverless instances are not shared, so this
 * bounds a single warm instance rather than the whole deployment — enough to
 * stop a naive flood without pulling in external state.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  // Silently accept honeypot hits so bots do not learn they were caught.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Too many messages from this connection. Try again later." },
      { status: 429 },
    );
  }

  const result = await sendContactMessage(parsed.data);

  if (!result.ok) {
    // Never claim delivery we did not achieve — the form falls back to mailto.
    console.error("[contact] send failed:", result.reason);
    return NextResponse.json(
      { error: "unsent", reason: result.reason },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
