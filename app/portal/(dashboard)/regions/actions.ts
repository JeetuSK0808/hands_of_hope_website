"use server";

import { z } from "zod";
import { requireRole } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function createRegion(name: string): Promise<Result> {
  const actor = await requireRole("admin");
  const parsed = z.string().min(2).max(120).safeParse(name);
  if (!parsed.success) return { ok: false, error: "Region name must be 2–120 characters." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("regions").insert({ name: parsed.data, created_by: actor.user_id });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteRegion(regionId: string): Promise<Result> {
  await requireRole("admin");
  if (!z.string().uuid().safeParse(regionId).success) return { ok: false, error: "Invalid region id." };
  const supabase = await createSupabaseServerClient();
  const { data: refs } = await supabase.from("branches").select("branch_id", { count: "exact", head: true }).eq("region_id", regionId);
  if (refs && Array.isArray(refs) && refs.length > 0) return { ok: false, error: "Region still has branches." };
  const { error } = await supabase.from("regions").update({ is_active: false }).eq("region_id", regionId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
