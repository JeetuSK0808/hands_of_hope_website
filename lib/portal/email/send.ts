import "server-only";
import { Resend } from "resend";

const FROM =
  process.env.PORTAL_EMAIL_FROM ??
  "Hands of Hope <notifications@handsofhopeoutreach.org>";

let cached: Resend | null = null;
function client(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const r = client();
  if (!r) {
    // In dev / when key not set, silently no-op so business logic still works.
    return;
  }
  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  const dedup = [...new Set(recipients.filter(Boolean))];
  if (dedup.length === 0) return;
  await r.emails.send({
    from: FROM,
    to: dedup,
    subject: input.subject,
    html: input.html,
    text: input.text ?? stripHtml(input.html),
    replyTo: input.replyTo,
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function shell(title: string, body: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f7f5ef;font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#111;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f5ef;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#fff;border:1px solid #e0dcd3;">
        <tr><td style="padding:32px 40px 8px;">
          <div style="font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#7a746b;">Hands of Hope · Volunteer Portal</div>
          <h1 style="margin:12px 0 0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:26px;line-height:1.15;">${escapeHtml(title)}</h1>
        </td></tr>
        <tr><td style="padding:16px 40px 32px;font-size:14px;line-height:1.55;color:#222;">
          ${body}
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #e0dcd3;font-size:11px;color:#7a746b;letter-spacing:.06em;">
          Hands of Hope Outreach · handsofhopeoutreach.org
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
