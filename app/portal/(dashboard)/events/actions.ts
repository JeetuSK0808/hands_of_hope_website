"use server";

import { z } from "zod";
import { requireRole } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";

const Schema = z.object({
  branchId: z.string().uuid(),
  regionId: z.string().uuid(),
  eventName: z.string().min(2).max(160),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().max(200).optional().default(""),
  description: z.string().max(2000).optional().default(""),
});

type Result = { ok: true } | { ok: false; error: string };

export async function createEvent(formData: FormData): Promise<Result> {
  const user = await requireRole("branch_leader");

  const parsed = Schema.safeParse({
    branchId: formData.get("branchId"),
    regionId: formData.get("regionId"),
    eventName: formData.get("eventName"),
    eventDate: formData.get("eventDate"),
    location: formData.get("location") ?? "",
    description: formData.get("description") ?? "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  // Scope enforcement
  if (user.role === "branch_leader" && parsed.data.branchId !== user.branch_id) {
    return { ok: false, error: "Branch Leaders may only create events for their own branch." };
  }
  if (user.role === "region_leader" && parsed.data.regionId !== user.region_id) {
    return { ok: false, error: "Region Leaders may only create events within their region." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("events").insert({
    branch_id: parsed.data.branchId,
    region_id: parsed.data.regionId,
    created_by: user.user_id,
    event_name: parsed.data.eventName,
    event_date: parsed.data.eventDate,
    location: parsed.data.location || null,
    description: parsed.data.description || null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
