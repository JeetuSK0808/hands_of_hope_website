"use server";

import { z } from "zod";
import { requireRole } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import type { HourStatus, UserRole } from "@/lib/portal/db/types";

const Schema = z.object({
  regionId: z.string().uuid().nullable(),
  branchId: z.string().uuid().nullable(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  status: z.enum(["all", "approved", "pending", "rejected"]),
});

export interface BulkExportRow {
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: UserRole;
  region_name: string | null;
  branch_name: string | null;
  event_name: string | null;
  location: string | null;
  activity_date: string;
  hours: number;
  description: string;
  status: HourStatus;
  reviewer_name: string | null;
  reviewed_at: string | null;
}

type Result = { ok: true; data: BulkExportRow[] } | { ok: false; error: string };

export async function fetchBulkHours(input: z.infer<typeof Schema>): Promise<Result> {
  const actor = await requireRole("region_leader");
  const parsed = Schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid filters." };

  // Region Leader is region-locked
  const regionId =
    actor.role === "region_leader" ? actor.region_id : parsed.data.regionId;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("hour_logs")
    .select(
      "log_id, user_id, activity_date, hours, description, status, reviewed_at, " +
        "users:users!hour_logs_user_id_fkey(name, email, role), " +
        "branches(name), regions(name), events(event_name, location), " +
        "reviewer:users!hour_logs_reviewed_by_fkey(name)",
    )
    .order("activity_date", { ascending: false })
    .limit(5000);

  if (regionId) query = query.eq("region_id", regionId);
  if (parsed.data.branchId) query = query.eq("branch_id", parsed.data.branchId);
  if (parsed.data.from) query = query.gte("activity_date", parsed.data.from);
  if (parsed.data.to) query = query.lte("activity_date", parsed.data.to);
  if (parsed.data.status !== "all") query = query.eq("status", parsed.data.status);

  const { data, error } = await query;
  if (error) return { ok: false, error: error.message };

  const rows = (data ?? []) as unknown as Array<{
    user_id: string;
    activity_date: string;
    hours: number;
    description: string;
    status: HourStatus;
    reviewed_at: string | null;
    users: { name: string; email: string; role: UserRole } | null;
    branches: { name: string } | null;
    regions: { name: string } | null;
    events: { event_name: string; location: string | null } | null;
    reviewer: { name: string } | null;
  }>;

  return {
    ok: true,
    data: rows.map((r) => ({
      user_id: r.user_id,
      user_name: r.users?.name ?? "Unknown",
      user_email: r.users?.email ?? "",
      user_role: r.users?.role ?? "member",
      region_name: r.regions?.name ?? null,
      branch_name: r.branches?.name ?? null,
      event_name: r.events?.event_name ?? null,
      location: r.events?.location ?? null,
      activity_date: r.activity_date,
      hours: Number(r.hours),
      description: r.description,
      status: r.status,
      reviewer_name: r.reviewer?.name ?? null,
      reviewed_at: r.reviewed_at,
    })),
  };
}
