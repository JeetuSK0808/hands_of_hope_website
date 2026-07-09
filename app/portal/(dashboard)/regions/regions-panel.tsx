"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DbRegion } from "@/lib/portal/db/types";
import { createRegion, deleteRegion } from "./actions";

interface RegionRow extends DbRegion {
  region_leader: { name: string; email: string } | null;
  branches: { count: number }[] | null;
}

export function RegionsPanel({ regions }: { regions: RegionRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await createRegion(name);
    if (r.ok) { setName(""); startTransition(() => router.refresh()); }
    else setError(r.error);
  }

  function handleDelete(region: RegionRow) {
    if ((region.branches?.[0]?.count ?? 0) > 0) {
      alert("Cannot delete: this region still has branches.");
      return;
    }
    if (!confirm(`Delete region "${region.name}"?`)) return;
    startTransition(async () => {
      const r = await deleteRegion(region.region_id);
      if (!r.ok) setError(r.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="portal-card">
        <div className="portal-eyebrow mb-4">Create region</div>
        <form onSubmit={handleCreate} className="flex gap-3 flex-wrap">
          <input required value={name} onChange={(e) => setName(e.target.value)} className="portal-input flex-1 min-w-[240px]" placeholder="US Southeast" />
          <button type="submit" disabled={pending} className="portal-btn-primary disabled:opacity-60">Create</button>
        </form>
        {error ? <p className="mt-3 text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}
      </div>

      <div className="portal-card">
        <div className="portal-eyebrow mb-4">All regions</div>
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead><tr><th>Name</th><th>Leader</th><th>Branches</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {regions.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No regions yet.</td></tr>
              ) : regions.map((r) => (
                <tr key={r.region_id}>
                  <td className="font-medium">{r.name}</td>
                  <td className="text-xs">
                    {r.region_leader ? <><div>{r.region_leader.name}</div><div className="text-muted-foreground">{r.region_leader.email}</div></> : "—"}
                  </td>
                  <td className="font-mono text-xs">{r.branches?.[0]?.count ?? 0}</td>
                  <td>
                    <span className={`portal-badge ${r.is_active ? "portal-badge-approved" : "portal-badge-rejected"}`}>
                      {r.is_active ? "active" : "inactive"}
                    </span>
                  </td>
                  <td>
                    <button type="button" onClick={() => handleDelete(r)} disabled={pending} className="portal-btn-danger text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
