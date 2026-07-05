"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/current-user";
import type { UserRole } from "@/lib/db/types";

const CAN_APPROVE_ROLE: Record<UserRole, UserRole[]> = {
  branch_leader: ["member"],
  region_leader: ["member", "branch_leader"],
  admin: ["member", "branch_leader", "region_leader"],
  super_admin: ["member", "branch_leader", "region_leader", "admin", "super_admin"],
  member: [],
};

async function assertCanReview(logId: string, reviewerRole: UserRole) {
  const supabase = await createSupabaseServerClient();
  const { data: log } = await supabase
    .from("hour_logs")
    .select("log_id, user_id, status, users:users!hour_logs_user_id_fkey(role)")
    .eq("log_id", logId)
    .maybeSingle();

  if (!log) throw new Error("Submission not found.");
  if (log.status !== "pending") throw new Error("Already reviewed.");
  const submitterRole = (log.users as unknown as { role: UserRole } | null)?.role;
  if (!submitterRole) throw new Error("Cannot resolve submitter role.");
  if (!CAN_APPROVE_ROLE[reviewerRole].includes(submitterRole)) {
    throw new Error("Not authorized to review this submission.");
  }
  return { supabase };
}

export async function approveLog(logId: string) {
  const reviewer = await requireRole("branch_leader");
  const { supabase } = await assertCanReview(logId, reviewer.role);
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
}

export async function rejectLog(logId: string, reason: string) {
  const reviewer = await requireRole("branch_leader");
  const { supabase } = await assertCanReview(logId, reviewer.role);
  const { error } = await supabase
    .from("hour_logs")
    .update({
      status: "rejected",
      reviewed_by: reviewer.user_id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq("log_id", logId);
  if (error) throw new Error(error.message);
}
