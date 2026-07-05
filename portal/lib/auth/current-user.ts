import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DbUser, UserRole } from "@/lib/db/types";

const ROLE_RANK: Record<UserRole, number> = {
  member: 0,
  branch_leader: 1,
  region_leader: 2,
  admin: 3,
  super_admin: 4,
};

export function roleAtLeast(role: UserRole, min: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

export async function getCurrentUser(): Promise<DbUser | null> {
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
}

export async function requireUser(): Promise<DbUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(min: UserRole): Promise<DbUser> {
  const user = await requireUser();
  if (!roleAtLeast(user.role, min)) redirect("/dashboard");
  return user;
}
