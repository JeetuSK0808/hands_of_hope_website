"use server";

import { z } from "zod";
import { requireUser } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function signUpForEvent(eventId: string): Promise<Result> {
  const user = await requireUser();
  if (!z.string().uuid().safeParse(eventId).success) return { ok: false, error: "Invalid event id." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("event_signups")
    .insert({ event_id: eventId, user_id: user.user_id });
  if (error) {
    if (/duplicate/i.test(error.message)) return { ok: false, error: "Already signed up." };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function withdrawFromEvent(eventId: string): Promise<Result> {
  const user = await requireUser();
  if (!z.string().uuid().safeParse(eventId).success) return { ok: false, error: "Invalid event id." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("event_signups")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.user_id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
