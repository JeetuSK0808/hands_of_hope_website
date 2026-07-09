"use server";

import bcrypt from "bcryptjs";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { requireUser } from "@/lib/portal/auth/current-user";
import { notifyNewMember } from "@/lib/portal/email/notify";

type Result = { ok: true } | { ok: false; error: string };

export async function joinBranch(rawCode: string): Promise<Result> {
  const user = await requireUser();
  if (user.branch_id) return { ok: false, error: "You're already assigned to a branch." };

  const supabase = await createSupabaseServerClient();

  const { data: branches, error: branchesErr } = await supabase
    .from("branches")
    .select("branch_id, region_id, branch_code_hash, is_active");

  if (branchesErr || !branches) return { ok: false, error: "Could not verify code. Try again." };

  const match = branches.find(
    (b) => b.is_active && bcrypt.compareSync(rawCode, b.branch_code_hash),
  );

  if (!match) {
    return { ok: false, error: "Code not recognized. Contact your Branch Leader or Regional Leader." };
  }

  const { error: updateErr } = await supabase
    .from("users")
    .update({ branch_id: match.branch_id, region_id: match.region_id })
    .eq("user_id", user.user_id);

  if (updateErr) return { ok: false, error: updateErr.message };

  await notifyNewMember({
    memberName: user.name,
    memberEmail: user.email,
    branchId: match.branch_id,
    regionId: match.region_id,
  }).catch(() => { /* best-effort */ });

  return { ok: true };
}
