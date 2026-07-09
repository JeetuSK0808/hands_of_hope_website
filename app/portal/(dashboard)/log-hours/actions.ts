"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { requireUser, isBranchExempt } from "@/lib/portal/auth/current-user";
import { notifyHoursSubmitted } from "@/lib/portal/email/notify";

const InputSchema = z.object({
  eventId: z.string().uuid().optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hours: z.coerce.number().gt(0).lte(12),
  description: z.string().min(3).max(1000),
});

type Result = { ok: true } | { ok: false; error: string };

export async function submitHours(formData: FormData): Promise<Result> {
  const user = await requireUser();
  // Superadmin / Admin / Region Leader do not require a branch to log hours.
  if (!user.branch_id && !isBranchExempt(user.role)) {
    return { ok: false, error: "Join a branch before logging hours." };
  }

  const parsed = InputSchema.safeParse({
    eventId: formData.get("eventId") ?? "",
    date: formData.get("date"),
    hours: formData.get("hours"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createSupabaseServerClient();

  let proofUrl: string | null = null;
  const proof = formData.get("proof");
  if (user.role === "member") {
    if (!(proof instanceof File) || proof.size === 0) {
      return { ok: false, error: "Photo proof is required for members." };
    }
    if (proof.size > 2 * 1024 * 1024) {
      return { ok: false, error: "Photo must be under 2MB." };
    }
    const path = `${user.region_id}/${user.branch_id}/${user.user_id}/${crypto.randomUUID()}-${proof.name}`;
    const { error: uploadErr } = await supabase.storage
      .from("proof")
      .upload(path, proof, { upsert: false });
    if (uploadErr) return { ok: false, error: uploadErr.message };
    proofUrl = path;
  }

  const { error: insertErr } = await supabase.from("hour_logs").insert({
    user_id: user.user_id,
    event_id: parsed.data.eventId ? parsed.data.eventId : null,
    branch_id: user.branch_id,
    region_id: user.region_id,
    hours: parsed.data.hours,
    activity_date: parsed.data.date,
    description: parsed.data.description,
    proof_image_url: proofUrl,
    // Super Admin hours auto-approved pending mutual co-founder review flow.
    status: user.role === "super_admin" ? "pending" : "pending",
  });

  if (insertErr) return { ok: false, error: insertErr.message };

  await notifyHoursSubmitted({
    submitterName: user.name,
    submitterRole: user.role,
    branchId: user.branch_id,
    regionId: user.region_id,
    hours: parsed.data.hours,
    activityDate: parsed.data.date,
    description: parsed.data.description,
  }).catch(() => { /* email best-effort */ });

  return { ok: true };
}
