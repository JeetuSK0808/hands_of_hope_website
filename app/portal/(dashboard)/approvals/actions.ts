"use server";

import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { requireRole } from "@/lib/portal/auth/current-user";
import { notifyHoursApproved, notifyHoursRejected } from "@/lib/portal/email/notify";
import type { UserRole } from "@/lib/portal/db/types";

const CAN_APPROVE_ROLE: Record<UserRole, UserRole[]> = {
  branch_leader: ["member"],
  region_leader: ["member", "branch_leader"],
  admin: ["member", "branch_leader", "region_leader"],
  super_admin: ["member", "branch_leader", "region_leader", "admin", "super_admin"],
  member: [],
};

interface LogSubmitter {
  email: string;
  name: string;
  role: UserRole;
}

interface LogSnapshot {
  hours: number;
  activity_date: string;
  proof_image_url: string | null;
  submitter: LogSubmitter | null;
}

async function assertCanReview(logId: string, reviewerRole: UserRole) {
  const supabase = await createSupabaseServerClient();
  const { data: log } = await supabase
    .from("hour_logs")
    .select(
      "log_id, user_id, status, hours, activity_date, proof_image_url, users:users!hour_logs_user_id_fkey(name, email, role)",
    )
    .eq("log_id", logId)
    .maybeSingle();

  if (!log) throw new Error("Submission not found.");
  if (log.status !== "pending") throw new Error("Already reviewed.");
  const submitter = (log.users as unknown as LogSubmitter | null) ?? null;
  if (!submitter) throw new Error("Cannot resolve submitter.");
  if (!CAN_APPROVE_ROLE[reviewerRole].includes(submitter.role)) {
    throw new Error("Not authorized to review this submission.");
  }
  const snapshot: LogSnapshot = {
    hours: Number(log.hours),
    activity_date: log.activity_date as string,
    proof_image_url: (log.proof_image_url as string | null) ?? null,
    submitter,
  };
  return { supabase, snapshot };
}

export async function approveLog(logId: string) {
  const reviewer = await requireRole("branch_leader");
  const { supabase, snapshot } = await assertCanReview(logId, reviewer.role);
  const { error } = await supabase
    .from("hour_logs")
    .update({
      status: "approved",
      reviewed_by: reviewer.user_id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("log_id", logId);
  if (error) throw new Error(error.message);

  if (snapshot.submitter) {
    await notifyHoursApproved({
      submitterEmail: snapshot.submitter.email,
      submitterName: snapshot.submitter.name,
      reviewerName: reviewer.name,
      hours: snapshot.hours,
      activityDate: snapshot.activity_date,
    }).catch(() => { /* best-effort */ });
  }
}

export async function rejectLog(logId: string, reason: string) {
  const reviewer = await requireRole("branch_leader");
  const { supabase, snapshot } = await assertCanReview(logId, reviewer.role);
  const { error } = await supabase
    .from("hour_logs")
    .update({
      status: "rejected",
      reviewed_by: reviewer.user_id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason,
      proof_image_url: null,
    })
    .eq("log_id", logId);
  if (error) throw new Error(error.message);

  // Spec: rejected photos deleted immediately.
  if (snapshot.proof_image_url) {
    await supabase.storage.from("proof").remove([snapshot.proof_image_url]).catch(() => { /* best-effort */ });
  }

  if (snapshot.submitter) {
    await notifyHoursRejected({
      submitterEmail: snapshot.submitter.email,
      submitterName: snapshot.submitter.name,
      reviewerName: reviewer.name,
      hours: snapshot.hours,
      activityDate: snapshot.activity_date,
      reason,
    }).catch(() => { /* best-effort */ });
  }
}
