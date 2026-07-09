import { requireRole } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import type { DbAuditLog } from "@/lib/portal/db/types";
import { AuditTable } from "./audit-table";

interface AuditRow extends DbAuditLog {
  actor: { name: string; role: string } | null;
}

export default async function PortalAuditPage() {
  await requireRole("region_leader");
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("audit_log")
    .select("*, actor:users!audit_log_actor_id_fkey(name, role)")
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = (data ?? []) as AuditRow[];

  return (
    <div className="space-y-8">
      <div>
        <div className="portal-eyebrow">Audit log</div>
        <h1 className="portal-display mt-3 text-4xl">Every meaningful action.</h1>
      </div>
      <div className="portal-card">
        <AuditTable rows={rows} />
      </div>
    </div>
  );
}
