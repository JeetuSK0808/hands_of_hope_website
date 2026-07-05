import Link from "next/link";
import { requireUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DbHourLog } from "@/lib/db/types";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: logs } = await supabase
    .from("hour_logs")
    .select("*")
    .eq("user_id", user.user_id)
    .order("activity_date", { ascending: false })
    .limit(20);

  const rows = (logs ?? []) as DbHourLog[];
  const stats = summarize(rows);

  return (
    <div className="space-y-10">
      <header className="flex items-baseline justify-between">
        <div>
          <div className="eyebrow">I · Overview</div>
          <h1 className="mt-3 text-3xl font-light">Your service hours.</h1>
        </div>
        <Link href="/log-hours" className="btn-primary">Log hours</Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Last 7 days" value={stats.week} />
        <StatCard label="Last 30 days" value={stats.month} />
        <StatCard label="All time" value={stats.all} />
      </section>

      <section className="card">
        <div className="flex items-baseline justify-between">
          <div className="eyebrow">II · Recent submissions</div>
          <div className="text-xs" style={{ color: "var(--hoh-ink-muted)" }}>
            Showing latest {rows.length}
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: "var(--hoh-ink-muted)" }}>
                <th className="py-2">Date</th>
                <th className="py-2">Activity</th>
                <th className="py-2">Hours</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center" style={{ color: "var(--hoh-ink-muted)" }}>
                    No submissions yet. Log your first hours to get started.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.log_id} style={{ borderTop: "1px solid var(--hoh-border)" }}>
                    <td className="py-3 font-mono text-xs">{row.activity_date}</td>
                    <td className="py-3">{row.description}</td>
                    <td className="py-3 font-mono">{row.hours.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`badge badge-${row.status}`}>{row.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <div className="eyebrow">{label}</div>
      <div className="mt-3 font-mono text-3xl">{value.toFixed(2)}</div>
      <div className="mt-1 text-xs" style={{ color: "var(--hoh-ink-muted)" }}>hours</div>
    </div>
  );
}

function summarize(rows: DbHourLog[]) {
  const now = new Date();
  const cutoffWeek = new Date(now); cutoffWeek.setDate(now.getDate() - 7);
  const cutoffMonth = new Date(now); cutoffMonth.setDate(now.getDate() - 30);
  let week = 0, month = 0, all = 0;
  for (const r of rows) {
    if (r.status !== "approved") continue;
    all += r.hours;
    const d = new Date(r.activity_date);
    if (d >= cutoffMonth) month += r.hours;
    if (d >= cutoffWeek) week += r.hours;
  }
  return { week, month, all };
}
