export type UserRole =
  | "super_admin"
  | "admin"
  | "region_leader"
  | "branch_leader"
  | "member";

export type HourStatus = "pending" | "approved" | "rejected";

export interface DbUser {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  branch_id: string | null;
  region_id: string | null;
  mfa_enabled: boolean;
  is_active: boolean;
  created_at: string;
}

export interface DbRegion {
  region_id: string;
  name: string;
  region_leader_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DbBranch {
  branch_id: string;
  name: string;
  school_location: string | null;
  region_id: string;
  branch_leader_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DbEvent {
  event_id: string;
  branch_id: string;
  region_id: string;
  created_by: string;
  event_name: string;
  event_date: string;
  location: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DbHourLog {
  log_id: string;
  user_id: string;
  event_id: string | null;
  branch_id: string | null;
  region_id: string | null;
  hours: number;
  activity_date: string;
  description: string;
  proof_image_url: string | null;
  status: HourStatus;
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export interface DbAuditLog {
  audit_id: string;
  actor_id: string | null;
  action: string;
  target_user_id: string | null;
  target_log_id: string | null;
  target_branch_id: string | null;
  target_region_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
