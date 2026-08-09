import "server-only";
import { Resend } from "resend";

export const CONTACT_INBOX = "info@handsofhopeoutreach.org";

const FROM_ADDRESS =
  process.env.CONTACT_EMAIL_FROM ??
  "Hands of Hope Website <website@handsofhopeoutreach.org>";

export type ContactMessage = {
  name: string;
  email: string;
  school: string;
  subject: string;
  message: string;
};

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "provider-error" };

let cached: Resend | null = null;

function client(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml(m: ContactMessage): string {
  const rows: [string, string][] = [
    ["Name", m.name],
    ["Email", m.email],
    ["School / organization", m.school || "—"],
    ["Topic", m.subject],
  ];

  return `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#1a1a1a;max-width:640px">
      <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#777;margin:0 0 18px">
        handsofhopeoutreach.org &middot; contact form
      </p>
      <h1 style="font-size:22px;font-weight:500;margin:0 0 22px">${escapeHtml(m.subject)}</h1>
      <table style="border-collapse:collapse;width:100%;font-size:14px;margin-bottom:26px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <td style="padding:7px 14px 7px 0;color:#777;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td>
              <td style="padding:7px 0;vertical-align:top">${escapeHtml(v)}</td>
            </tr>`,
          )
          .join("")}
      </table>
      <div style="border-top:1px solid #e5e5e5;padding-top:20px;font-size:15px;line-height:1.65;white-space:pre-wrap">${escapeHtml(
        m.message,
      )}</div>
    </div>
  `;
}

function renderText(m: ContactMessage): string {
  return [
    `New message from handsofhopeoutreach.org`,
    ``,
    `Name:    ${m.name}`,
    `Email:   ${m.email}`,
    `School:  ${m.school || "—"}`,
    `Topic:   ${m.subject}`,
    ``,
    m.message,
  ].join("\n");
}

/**
 * Delivers a contact-form submission to the team inbox.
 *
 * Returns a failure result rather than throwing so the API route can tell the
 * visitor the truth: if this cannot send, the UI shows the direct email address
 * instead of a fake confirmation.
 */
export async function sendContactMessage(
  m: ContactMessage,
): Promise<SendResult> {
  const resend = client();
  if (!resend) return { ok: false, reason: "not-configured" };

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: process.env.CONTACT_INBOX ?? CONTACT_INBOX,
      replyTo: m.email,
      subject: `[${m.subject}] ${m.name}`,
      html: renderHtml(m),
      text: renderText(m),
    });
    if (error) return { ok: false, reason: "provider-error" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "provider-error" };
  }
}
