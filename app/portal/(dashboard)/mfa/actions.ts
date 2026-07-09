"use server";

import { z } from "zod";
import { requireUser } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function setMfaEnabled(userId: string, enabled: boolean): Promise<Result> {
  const user = await requireUser();
  if (!z.string().uuid().safeParse(userId).success) return { ok: false, error: "Invalid user id." };
  if (userId !== user.user_id) return { ok: false, error: "You can only modify your own MFA state." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("users").update({ mfa_enabled: enabled }).eq("user_id", user.user_id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
