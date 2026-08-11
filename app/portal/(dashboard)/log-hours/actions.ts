"use server";

import { after } from "next/server";
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
    if (!proof.type.startsWith("image/")) {
      return { ok: false, error: "Photo proof must be an image file." };
    }
    // The original filename is attacker-controlled; keep only a safe extension
    // and let the UUID carry uniqueness.
    const ext = (proof.name.split(".").pop() ?? "jpg")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 5);
    const path = `${user.region_id}/${user.branch_id}/${user.user_id}/${crypto.randomUUID()}.${ext || "jpg"}`;
    const { error: uploadErr } = await supabase.storage
      .from("proof")
      .upload(path, proof, { upsert: false, contentType: proof.type });
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
    // Everyone lands in `pending`, Super Admins included, because the spec requires
    // a co-founder to approve the other co-founder's hours, so nothing here
    // may self-approve.
    status: "pending",
  });

  if (insertErr) return { ok: false, error: insertErr.message };

  after(() =>
    notifyHoursSubmitted({
      submitterName: user.name,
      submitterRole: user.role,
      branchId: user.branch_id,
      regionId: user.region_id,
      hours: parsed.data.hours,
      activityDate: parsed.data.date,
      description: parsed.data.description,
    }).catch(() => { /* email best-effort */ }),
  );

  return { ok: true };
}
