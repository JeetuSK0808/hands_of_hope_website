// Simple shared-password admin session for /admin/merch routes.
// Uses HMAC-SHA256 over Web Crypto so this file is edge-compatible
// (middleware) and Node-compatible (server actions / route handlers).

export const ADMIN_COOKIE = "hoh_admin";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = typeof btoa === "function"
    ? btoa(bin)
    : Buffer.from(bin, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function hmac(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toBase64Url(new Uint8Array(sig));
}

function sessionSecret(): string {
  const s = process.env.MERCH_ADMIN_SESSION_SECRET;
  if (!s) throw new Error("MERCH_ADMIN_SESSION_SECRET not configured");
  return s;
}

export async function signAdminSession(expiresAt: number): Promise<string> {
  const payload = String(expiresAt);
  const mac = await hmac(sessionSecret(), payload);
  return `${payload}.${mac}`;
}

export async function verifyAdminSession(
  cookieValue: string | undefined | null
): Promise<boolean> {
  if (!cookieValue) return false;
  const dot = cookieValue.indexOf(".");
  if (dot <= 0) return false;
  const payload = cookieValue.slice(0, dot);
  const mac = cookieValue.slice(dot + 1);
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;
  const expected = await hmac(sessionSecret(), payload);
  return timingSafeEqual(expected, mac);
}

export function checkAdminPassword(input: string): boolean {
  const expected = process.env.MERCH_ADMIN_PASSWORD;
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  let out = 0;
  for (let i = 0; i < input.length; i++) {
    out |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return out === 0;
}
