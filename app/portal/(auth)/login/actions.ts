"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { notifyAccountLocked } from "@/lib/portal/email/notify";

const LOCK_THRESHOLD = 5;

type PreCheck =
  | { ok: true }
  | { ok: false; error: string; locked: boolean };

async function requestIp(): Promise<string | null> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = h.get("x-real-ip");
  return real ?? null;
}

const EmailSchema = z.string().email().transform((s) => s.toLowerCase());

export async function preCheckLogin(email: string): Promise<PreCheck> {
  const parsed = EmailSchema.safeParse(email);
  if (!parsed.success) return { ok: false, error: "Invalid email.", locked: false };
  const supabase = await createSupabaseServerClient();
  try {
    const { data: locked } = await supabase.rpc("is_login_locked", { p_email: parsed.data });
    if (locked === true) {
      return {
        ok: false,
        locked: true,
        error:
          "Account locked — 5 failed attempts in the last 15 minutes. Try again shortly; a security notice was emailed to the account owner.",
      };
    }
  } catch {
    // Rate-limit RPCs not installed on this Supabase project yet — skip precheck.
  }
  return { ok: true };
}

/**
 * Records a login attempt and returns lockout status. Runs synchronously on
 * failure (so the client can surface remaining-attempts text) and is fire-and-
 * forget-safe on success (the caller can wrap it in `after()`).
 */
export async function recordLoginResult(
  email: string,
  succeeded: boolean,
): Promise<{ locked: boolean; remaining: number }> {
  const parsed = EmailSchema.safeParse(email);
  if (!parsed.success) return { locked: false, remaining: LOCK_THRESHOLD };

  const ip = await requestIp();
  const supabase = await createSupabaseServerClient();
  try {
    await supabase.rpc("log_login_attempt", { p_email: parsed.data, p_ip: ip, p_succeeded: succeeded });
    if (succeeded) {
      after(() => supabase.rpc("clear_failed_attempts", { p_email: parsed.data }));
      return { locked: false, remaining: LOCK_THRESHOLD };
    }
    const { data: count } = await supabase.rpc("recent_failed_attempts", { p_email: parsed.data });
    const attempts = typeof count === "number" ? count : 0;
    const locked = attempts >= LOCK_THRESHOLD;
    if (locked) {
      after(() =>
        notifyAccountLocked({ email: parsed.data, ip }).catch(() => { /* best-effort */ }),
      );
    }
    return { locked, remaining: Math.max(0, LOCK_THRESHOLD - attempts) };
  } catch {
    return { locked: false, remaining: LOCK_THRESHOLD };
  }
}
