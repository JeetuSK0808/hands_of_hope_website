"use client";

import { useMemo, useState, useTransition } from "react";
import { Download, FileText } from "lucide-react";
import type { DbBranch, DbRegion, UserRole } from "@/lib/portal/db/types";
import { downloadCsv } from "@/lib/portal/csv/export";
import { generateBulkHoursPdf, type HoursReportRow } from "@/lib/portal/pdf/hours-report";
import { fetchBulkHours } from "./actions";

export function ReportsPanel({
  actorRole,
  actorRegionId,
  regions,
  branches,
}: {
  actorRole: UserRole;
  actorRegionId: string | null;
  regions: DbRegion[];
  branches: DbBranch[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const scopedRegions = useMemo(
    () => (actorRole === "region_leader" ? regions.filter((r) => r.region_id === actorRegionId) : regions),
    [regions, actorRole, actorRegionId],
  );

  const [regionId, setRegionId] = useState<string>(actorRole === "region_leader" ? actorRegionId ?? "" : "");
  const scopedBranches = useMemo(
    () => branches.filter((b) => (regionId ? b.region_id === regionId : true)),
    [branches, regionId],
  );
  const [branchId, setBranchId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<"all" | "approved" | "pending" | "rejected">("approved");

  function runExport(mode: "csv" | "pdf") {
    setError(null);
    startTransition(async () => {
      const r = await fetchBulkHours({ regionId: regionId || null, branchId: branchId || null, from: from || null, to: to || null, status });
      if (!r.ok) { setError(r.error); return; }

      if (mode === "csv") {
        const rows = r.data.map((row) => ({
          name: row.user_name,
          email: row.user_email,
          region: row.region_name ?? "",
          branch: row.branch_name ?? "",
          event: row.event_name ?? "",
          date: row.activity_date,
          hours: row.hours,
          status: row.status,
          approved_by: row.reviewer_name ?? "",
          approved_at: row.reviewed_at ?? "",
        }));
        downloadCsv(rows, `HOH-Bulk-Hours-${new Date().toISOString().slice(0, 10)}.csv`);
        return;
      }

      // PDF — group by user
      const grouped = new Map<string, { subject: {
        name: string; email: string; role: UserRole; branch_name: string | null; region_name: string | null;
      }; rows: HoursReportRow[] }>();
      for (const row of r.data) {
        const key = row.user_id;
        if (!grouped.has(key)) {
          grouped.set(key, {
            subject: {
              name: row.user_name,
              email: row.user_email,
              role: row.user_role,
              branch_name: row.branch_name ?? null,
              region_name: row.region_name ?? null,
            },
            rows: [],
          });
        }
        grouped.get(key)!.rows.push({
          activity_date: row.activity_date,
          description: row.description,
          hours: Number(row.hours),
          status: row.status,
          event_name: row.event_name ?? null,
          location: row.location ?? null,
        });
      }
      generateBulkHoursPdf([...grouped.values()]);
    });
  }

  return (
    <div className="portal-card space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Region</span>
          <select value={regionId} onChange={(e) => { setRegionId(e.target.value); setBranchId(""); }} disabled={actorRole === "region_leader"} className="portal-input mt-2">
            {actorRole !== "region_leader" ? <option value="">All regions</option> : null}
            {scopedRegions.map((r) => <option key={r.region_id} value={r.region_id}>{r.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Branch</span>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="portal-input mt-2">
            <option value="">All branches</option>
            {scopedBranches.map((b) => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">From</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="portal-input mt-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">To</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="portal-input mt-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="portal-input mt-2">
            <option value="approved">Approved only</option>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>

      {error ? <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}

      <div className="flex gap-3 flex-wrap">
        <button type="button" onClick={() => runExport("csv")} disabled={pending} className="portal-btn-primary disabled:opacity-60">
          <Download className="h-4 w-4" /> {pending ? "Working…" : "Download CSV"}
        </button>
        <button type="button" onClick={() => runExport("pdf")} disabled={pending} className="portal-btn-secondary disabled:opacity-60">
          <FileText className="h-4 w-4" /> {pending ? "Working…" : "Compiled PDF"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        CSV: one row per hour log · PDF: one page per volunteer, includes signature block.
      </p>
    </div>
  );
}
