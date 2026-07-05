import { requireRole } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DbAuditLog } from "@/lib/db/types";

export default async function AuditPage() {
  await requireRole("region_leader");
  const supabase = await createSupabaseServerClient();

  const { data: rows } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const entries = (rows ?? []) as DbAuditLog[];

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow">Audit log</div>
        <h1 className="mt-3 text-3xl font-light">Every meaningful action.</h1>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ color: "var(--hoh-ink-muted)" }}>
              <th className="py-2">Timestamp</th>
              <th className="py-2">Action</th>
              <th className="py-2">Actor</th>
              <th className="py-2">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center" style={{ color: "var(--hoh-ink-muted)" }}>
                  Nothing logged yet.
                </td>
              </tr>
            ) : (
              entries.map((row) => (
                <tr key={row.audit_id} style={{ borderTop: "1px solid var(--hoh-border)" }}>
                  <td className="py-3 font-mono text-xs">{row.created_at}</td>
                  <td className="py-3">{row.action}</td>
                  <td className="py-3 font-mono text-xs">{row.actor_id ?? "system"}</td>
                  <td className="py-3 font-mono text-xs">
                    {JSON.stringify(row.metadata)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
