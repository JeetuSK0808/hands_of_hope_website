import type { DbUser } from "@/lib/portal/db/types";

export const GUEST_COOKIE = "portal_guest";

export const GUEST_USER: DbUser = {
  user_id: "00000000-0000-0000-0000-000000000000",
  name: "Guest Volunteer",
  email: "guest@handsofhopeoutreach.com",
  role: "super_admin",
  branch_id: null,
  region_id: null,
  mfa_enabled: false,
  is_active: true,
  created_at: new Date(0).toISOString(),
};
