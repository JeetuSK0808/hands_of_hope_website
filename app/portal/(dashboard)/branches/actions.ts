"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireRole } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

const CreateSchema = z.object({
  name: z.string().min(2).max(120),
  schoolLocation: z.string().max(200).optional().default(""),
  regionId: z.string().uuid(),
  branchCode: z.string().min(4).max(80),
});

export async function createBranch(formData: FormData): Promise<Result> {
  const actor = await requireRole("region_leader");
  const parsed = CreateSchema.safeParse({
    name: formData.get("name"),
    schoolLocation: formData.get("schoolLocation") ?? "",
    regionId: formData.get("regionId"),
    branchCode: formData.get("branchCode"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  if (actor.role === "region_leader" && parsed.data.regionId !== actor.region_id) {
    return { ok: false, error: "You can only create branches within your region." };
  }

  const supabase = await createSupabaseServerClient();
  const hash = bcrypt.hashSync(parsed.data.branchCode, 10);
  const { error } = await supabase.from("branches").insert({
    name: parsed.data.name,
    school_location: parsed.data.schoolLocation || null,
    region_id: parsed.data.regionId,
    branch_code_hash: hash,
    created_by: actor.user_id,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function rotateBranchCode(branchId: string, newCode: string): Promise<Result> {
  const actor = await requireRole("region_leader");
  if (!z.string().uuid().safeParse(branchId).success) return { ok: false, error: "Invalid branch id." };
  if (newCode.length < 4) return { ok: false, error: "Code must be at least 4 characters." };
  const supabase = await createSupabaseServerClient();
  const { data: branch } = await supabase.from("branches").select("region_id").eq("branch_id", branchId).maybeSingle();
  if (!branch) return { ok: false, error: "Branch not found." };
  if (actor.role === "region_leader" && branch.region_id !== actor.region_id) {
    return { ok: false, error: "Branch is outside your region." };
  }
  const hash = bcrypt.hashSync(newCode, 10);
  const { error } = await supabase.from("branches").update({ branch_code_hash: hash }).eq("branch_id", branchId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteBranch(branchId: string): Promise<Result> {
  const actor = await requireRole("region_leader");
  if (!z.string().uuid().safeParse(branchId).success) return { ok: false, error: "Invalid branch id." };
  const supabase = await createSupabaseServerClient();
  const { data: branch } = await supabase.from("branches").select("region_id").eq("branch_id", branchId).maybeSingle();
  if (!branch) return { ok: false, error: "Branch not found." };
  if (actor.role === "region_leader" && branch.region_id !== actor.region_id) {
    return { ok: false, error: "Branch is outside your region." };
  }
  // Soft delete for audit continuity
  const { error } = await supabase.from("branches").update({ is_active: false }).eq("branch_id", branchId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
