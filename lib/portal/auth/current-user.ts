import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { ROLE_RANK, type DbUser, type UserRole } from "@/lib/portal/db/types";

export function roleAtLeast(role: UserRole, min: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

/**
 * Resolves the signed-in user once per request.
 *
 * Every dashboard route asks for this at least twice, once in the layout to
 * gate the shell, once in the page to gate the data, and each call costs an
 * `auth.getUser()` plus a `users` row read. `cache()` makes the second and
 * third callers free.
 */
export const getCurrentUser = cache(async function getCurrentUser(): Promise<DbUser | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (error || !data) return null;
    return data as DbUser;
  } catch {
    return null;
  }
});

export async function requireUser(): Promise<DbUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/portal/login");
  return user;
}

export async function requireRole(min: UserRole): Promise<DbUser> {
  const user = await requireUser();
  if (!roleAtLeast(user.role, min)) redirect("/portal/dashboard");
  return user;
}

/** Roles exempt from the branch-code onboarding step. */
export function isBranchExempt(role: UserRole): boolean {
  return role === "super_admin" || role === "admin" || role === "region_leader";
}

/** Whom `role` may promote a user *from* → *to*. */
export function canPromote(actor: UserRole, from: UserRole, to: UserRole): boolean {
  if (ROLE_RANK[to] >= ROLE_RANK[actor]) return false;
  if (ROLE_RANK[from] >= ROLE_RANK[actor]) return false;
  switch (actor) {
    case "super_admin":
      return true;
    case "admin":
      return to !== "super_admin";
    case "region_leader":
      return to === "branch_leader" && from === "member";
    default:
      return false;
  }
}
