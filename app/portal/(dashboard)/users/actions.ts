"use server";

import { z } from "zod";
import { requireRole, canPromote } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notifyRolePromoted } from "@/lib/portal/email/notify";
import type { UserRole } from "@/lib/portal/db/types";

type Result = { ok: true } | { ok: false; error: string };

const RoleSchema = z.enum(["super_admin", "admin", "region_leader", "branch_leader", "member"]);

function canCreate(actor: UserRole, target: UserRole): boolean {
  switch (actor) {
    case "super_admin":
      return true;
    case "admin":
      return target !== "super_admin";
    case "region_leader":
      return target === "branch_leader" || target === "member";
    case "branch_leader":
      return target === "member";
    default:
      return false;
  }
}

const CreateUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email."),
  password: z.string().min(10, "Password must be at least 10 characters."),
  role: RoleSchema,
  branch_id: z.string().uuid().nullable().optional(),
});

export async function createUser(input: unknown): Promise<Result> {
  const actor = await requireRole("branch_leader");
  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { name, email, password, role } = parsed.data;
  let branch_id = parsed.data.branch_id ?? null;

  if (!canCreate(actor.role, role)) {
    return { ok: false, error: "You do not have permission to create a user with that role." };
  }

  const needsBranch = role === "branch_leader" || role === "member";
  if (needsBranch && !branch_id) {
    return { ok: false, error: "Choose a branch for this user." };
  }
  if (role === "admin" || role === "super_admin") {
    branch_id = null;
  }

  let region_id: string | null = null;
  if (branch_id) {
    const supabase = await createSupabaseServerClient();
    const { data: branch } = await supabase
      .from("branches")
      .select("region_id")
      .eq("branch_id", branch_id)
      .maybeSingle();
    if (!branch) return { ok: false, error: "Branch not found." };
    region_id = branch.region_id as string;

    if (actor.role === "region_leader" && region_id !== actor.region_id) {
      return { ok: false, error: "That branch is outside your region." };
    }
    if (actor.role === "branch_leader" && branch_id !== actor.branch_id) {
      return { ok: false, error: "You can only add users to your own branch." };
    }
  }

  if (role === "region_leader") {
    region_id = actor.role === "region_leader" ? actor.region_id : region_id;
  }

  let admin;
  try {
    admin = supabaseAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (createError || !created.user) {
    return { ok: false, error: createError?.message ?? "Failed to create auth user." };
  }

  const { error: upsertError } = await admin
    .from("users")
    .upsert(
      {
        user_id: created.user.id,
        name,
        email: email.toLowerCase(),
        role,
        branch_id,
        region_id,
        is_active: true,
      },
      { onConflict: "user_id" },
    );

  if (upsertError) {
    // Roll back the auth user so we don't leave an orphan.
    await admin.auth.admin.deleteUser(created.user.id).catch(() => { /* best-effort */ });
    return { ok: false, error: upsertError.message };
  }

  return { ok: true };
}

export async function changeUserRole(userId: string, next: UserRole): Promise<Result> {
  const actor = await requireRole("branch_leader");
  const parsedRole = RoleSchema.safeParse(next);
  if (!parsedRole.success) return { ok: false, error: "Invalid role." };
  if (!z.string().uuid().safeParse(userId).success) return { ok: false, error: "Invalid user id." };
  if (userId === actor.user_id) return { ok: false, error: "You cannot change your own role." };

  const supabase = await createSupabaseServerClient();
  const { data: target } = await supabase
    .from("users")
    .select("name, email, role, region_id, branch_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!target) return { ok: false, error: "User not found." };

  if (!canPromote(actor.role, target.role as UserRole, parsedRole.data)) {
    return { ok: false, error: "You do not have permission to change this user to that role." };
  }

  // Region-scoped promotion: Region Leader can only touch users in their region
  if (actor.role === "region_leader" && target.region_id !== actor.region_id) {
    return { ok: false, error: "That user is outside your region." };
  }

  // Clearing branch/region for admin+
  const patch: Record<string, string | null> = { role: parsedRole.data };
  if (parsedRole.data === "admin" || parsedRole.data === "super_admin") {
    patch.branch_id = null;
  }

  const { error } = await supabase.from("users").update(patch).eq("user_id", userId);
  if (error) return { ok: false, error: error.message };

  await notifyRolePromoted({
    targetEmail: target.email as string,
    targetName: target.name as string,
    fromRole: target.role as UserRole,
    toRole: parsedRole.data,
    actorName: actor.name,
  }).catch(() => { /* best-effort */ });

  return { ok: true };
}

export async function setUserBranch(userId: string, branchId: string | null): Promise<Result> {
  const actor = await requireRole("region_leader");
  if (!z.string().uuid().safeParse(userId).success) return { ok: false, error: "Invalid user id." };
  const supabase = await createSupabaseServerClient();

  let regionId: string | null = null;
  if (branchId) {
    if (!z.string().uuid().safeParse(branchId).success) return { ok: false, error: "Invalid branch id." };
    const { data: branch } = await supabase.from("branches").select("region_id").eq("branch_id", branchId).maybeSingle();
    if (!branch) return { ok: false, error: "Branch not found." };
    regionId = branch.region_id;
    if (actor.role === "region_leader" && regionId !== actor.region_id) {
      return { ok: false, error: "Branch is outside your region." };
    }
  }

  const { error } = await supabase.from("users").update({ branch_id: branchId, region_id: regionId }).eq("user_id", userId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deactivateUser(userId: string): Promise<Result> {
  const actor = await requireRole("super_admin");
  if (userId === actor.user_id) return { ok: false, error: "Cannot deactivate yourself." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("users").update({ is_active: false }).eq("user_id", userId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
