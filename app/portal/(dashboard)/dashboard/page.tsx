import Link from "next/link";
import { requireUser } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import type { DbHourLog } from "@/lib/portal/db/types";
import { ExportPdfButton } from "@/components/portal/export-pdf-button";
import type { HoursReportRow } from "@/lib/portal/pdf/hours-report";

interface JoinedLog extends DbHourLog {
  events: { event_name: string; location: string | null } | null;
  branches: { name: string } | null;
  regions: { name: string } | null;
}

export default async function PortalDashboardPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  // Two reads in parallel, each shaped for exactly one job:
  //  - `logs` carries the joins the table and the PDF export need, capped.
  //  - `totals` is two tiny columns with no joins and no cap, because an
  //    all-time figure that silently stops at the cap is worse than no figure
  //    at all; these numbers go on Gold Award and grant applications.
  const [{ data: logs }, { data: totals }] = await Promise.all([
    supabase
      .from("hour_logs")
      .select("*, events(event_name, location), branches(name), regions(name)")
      .eq("user_id", user.user_id)
      .order("activity_date", { ascending: false })
      .limit(500),
    supabase
      .from("hour_logs")
      .select("hours, activity_date")
      .eq("user_id", user.user_id)
      .eq("status", "approved"),
  ]);

  const rows = (logs ?? []) as JoinedLog[];
  const stats = summarize(
    (totals ?? []) as { hours: number; activity_date: string }[],
  );

  const branchName = rows.find((r) => r.branches?.name)?.branches?.name ?? null;
  const regionName = rows.find((r) => r.regions?.name)?.regions?.name ?? null;

  const pdfRows: HoursReportRow[] = rows.map((r) => ({
    activity_date: r.activity_date,
    description: r.description,
    hours: Number(r.hours),
    status: r.status,
    event_name: r.events?.event_name ?? null,
    location: r.events?.location ?? null,
  }));

  return (
    <div className="space-y-10">
      <header className="flex items-baseline justify-between gap-6 flex-wrap">
        <div>
          <div className="portal-eyebrow">I · Overview</div>
          <h1 className="portal-display mt-3 text-5xl">Your service hours.</h1>
        </div>
        <div className="flex items-center gap-3">
          <ExportPdfButton
            subject={{
              name: user.name,
              email: user.email,
              role: user.role,
              branch_name: branchName,
              region_name: regionName,
            }}
            rows={pdfRows}
          />
          <Link href="/portal/log-hours" prefetch className="portal-btn-primary">
            Log hours
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Last 7 days" value={stats.week} />
        <StatCard label="Last 30 days" value={stats.month} />
        <StatCard label="All time" value={stats.all} />
      </section>

      <section className="portal-card">
        <div className="flex items-baseline justify-between mb-4">
          <div className="portal-eyebrow">II · Recent submissions</div>
          <div className="text-xs text-muted-foreground">Showing latest {Math.min(rows.length, 20)}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No submissions yet. Log your first hours to get started.
                  </td>
                </tr>
              ) : (
                rows.slice(0, 20).map((row) => (
                  <tr key={row.log_id}>
                    <td className="font-mono text-xs">{row.activity_date}</td>
                    <td>{row.description}</td>
                    <td className="font-mono">{Number(row.hours).toFixed(2)}</td>
                    <td>
                      <span className={`portal-badge portal-badge-${row.status}`}>{row.status}</span>
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
    <div className="portal-card">
      <div className="portal-eyebrow">{label}</div>
      <div className="mt-3 portal-display text-5xl">{value.toFixed(2)}</div>
      <div className="mt-1 text-xs text-muted-foreground">hours</div>
    </div>
  );
}

/** Callers pass approved rows only; the query already filters on status. */
function summarize(rows: { hours: number; activity_date: string }[]) {
  const now = new Date();
  const cutoffWeek = new Date(now); cutoffWeek.setDate(now.getDate() - 7);
  const cutoffMonth = new Date(now); cutoffMonth.setDate(now.getDate() - 30);
  let week = 0, month = 0, all = 0;
  for (const r of rows) {
    const hours = Number(r.hours);
    all += hours;
    const d = new Date(r.activity_date);
    if (d >= cutoffMonth) month += hours;
    if (d >= cutoffWeek) week += hours;
  }
  return { week, month, all };
}
