"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { downloadCsv } from "@/lib/portal/csv/export";
import type { DbAuditLog } from "@/lib/portal/db/types";

interface AuditRow extends DbAuditLog {
  actor: { name: string; role: string } | null;
}

export function AuditTable({ rows }: { rows: AuditRow[] }) {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<"all" | string>("all");

  const actions = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => s.add(r.action));
    return [...s].sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (action !== "all" && r.action !== action) return false;
      if (!q) return true;
      const hay = [r.action, r.actor?.name ?? "", r.actor?.role ?? "", JSON.stringify(r.metadata)].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query, action]);

  function handleExport() {
    downloadCsv(
      filtered.map((r) => ({
        timestamp: r.created_at,
        action: r.action,
        actor: r.actor?.name ?? "",
        actor_role: r.actor?.role ?? "",
        metadata: JSON.stringify(r.metadata),
      })),
      `HOH-Audit-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="portal-input pl-9" placeholder="Search actions, actors, metadata" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="portal-input max-w-[240px]" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="all">All actions</option>
          {actions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <button type="button" onClick={handleExport} className="portal-btn-secondary">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="portal-table">
          <thead>
            <tr><th>Timestamp</th><th>Action</th><th>Actor</th><th>Metadata</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">Nothing to show.</td></tr>
            ) : filtered.map((row) => (
              <tr key={row.audit_id}>
                <td className="font-mono text-xs">{new Date(row.created_at).toLocaleString()}</td>
                <td>{row.action}</td>
                <td className="text-xs">{row.actor?.name ?? "system"}<br /><span className="text-muted-foreground">{row.actor?.role ?? ""}</span></td>
                <td className="font-mono text-xs max-w-[400px] truncate">{JSON.stringify(row.metadata)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
