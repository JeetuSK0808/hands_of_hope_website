import { requireRole } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DbHourLog } from "@/lib/db/types";
import { ApprovalsTable } from "./approvals-table";

export default async function ApprovalsPage() {
  const user = await requireRole("branch_leader");
  const supabase = await createSupabaseServerClient();

  const { data: logs } = await supabase
    .from("hour_logs")
    .select("*, users!hour_logs_user_id_fkey(name, role)")
    .eq("status", "pending")
    .order("submitted_at", { ascending: true });

  const rows = (logs ?? []) as Array<
    DbHourLog & { users: { name: string; role: string } | null }
  >;

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow">Approvals · {user.role.replace("_", " ")}</div>
        <h1 className="mt-3 text-3xl font-light">Pending submissions.</h1>
      </div>
      <div className="card">
        <ApprovalsTable logs={rows} />
      </div>
    </div>
  );
}
