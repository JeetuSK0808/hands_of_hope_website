"use server";

import bcrypt from "bcryptjs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/current-user";

type Result = { ok: true } | { ok: false; error: string };

export async function joinBranch(rawCode: string): Promise<Result> {
  const user = await requireUser();
  if (user.branch_id) return { ok: false, error: "You&apos;re already assigned to a branch." };

  const supabase = await createSupabaseServerClient();

  const { data: branches, error: branchesErr } = await supabase
    .from("branches")
    .select("branch_id, region_id, branch_code_hash, is_active");

  if (branchesErr || !branches) {
    return { ok: false, error: "Could not verify code. Try again." };
  }

  const match = branches.find(
    (b) => b.is_active && bcrypt.compareSync(rawCode, b.branch_code_hash),
  );

  if (!match) {
    return {
      ok: false,
      error: "Code not recognized. Contact your Branch Leader or Regional Leader.",
    };
  }

  const { error: updateErr } = await supabase
    .from("users")
    .update({ branch_id: match.branch_id, region_id: match.region_id })
    .eq("user_id", user.user_id);

  if (updateErr) return { ok: false, error: updateErr.message };
  return { ok: true };
}
