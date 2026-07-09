import type { UserRole } from "@/lib/portal/db/types";

export function mfaRequired(role: UserRole): boolean {
  return role === "super_admin" || role === "admin" || role === "region_leader";
}
