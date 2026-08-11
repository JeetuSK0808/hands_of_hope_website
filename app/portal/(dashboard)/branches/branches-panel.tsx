"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DbBranch, DbRegion, UserRole } from "@/lib/portal/db/types";
import { createBranch, deleteBranch, rotateBranchCode } from "./actions";

interface BranchRow extends DbBranch {
  regions: { name: string } | null;
  branch_leader: { name: string; email: string } | null;
}

export function BranchesPanel({
  actorRole,
  actorRegionId,
  branches,
  regions,
}: {
  actorRole: UserRole;
  actorRegionId: string | null;
  branches: BranchRow[];
  regions: DbRegion[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const scopedRegions = useMemo(() => {
    if (actorRole === "region_leader") return regions.filter((r) => r.region_id === actorRegionId);
    return regions;
  }, [regions, actorRole, actorRegionId]);

  const scopedBranches = useMemo(() => {
    if (actorRole === "region_leader") return branches.filter((b) => b.region_id === actorRegionId);
    return branches;
  }, [branches, actorRole, actorRegionId]);

  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [regionId, setRegionId] = useState(scopedRegions[0]?.region_id ?? "");
  const [code, setCode] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setFlash(null);
    const fd = new FormData();
    fd.set("name", name); fd.set("schoolLocation", school); fd.set("regionId", regionId); fd.set("branchCode", code);
    const r = await createBranch(fd);
    if (r.ok) {
      setName(""); setSchool(""); setCode("");
      setFlash("Branch created.");
      startTransition(() => router.refresh());
    } else setError(r.error);
  }

  function handleRotate(branchId: string) {
    const next = prompt("Enter a new branch code (share it with members):");
    if (!next) return;
    startTransition(async () => {
      const r = await rotateBranchCode(branchId, next);
      if (!r.ok) setError(r.error);
      else { setFlash("Branch code rotated."); router.refresh(); }
    });
  }

  function handleDelete(branch: BranchRow) {
    if (!confirm(`Delete branch "${branch.name}"? Members will be unlinked.`)) return;
    startTransition(async () => {
      const r = await deleteBranch(branch.branch_id);
      if (!r.ok) setError(r.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="portal-card">
        <div className="portal-eyebrow mb-4">Create branch</div>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Branch name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="portal-input mt-2" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">School / location</span>
            <input value={school} onChange={(e) => setSchool(e.target.value)} className="portal-input mt-2" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Region</span>
            <select required value={regionId} onChange={(e) => setRegionId(e.target.value)} className="portal-input mt-2">
              <option value="">Select a region</option>
              {scopedRegions.map((r) => (
                <option key={r.region_id} value={r.region_id}>{r.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Initial branch code</span>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="portal-input mt-2 font-mono uppercase tracking-widest"
              placeholder="e.g. INN-ATL-2026"
            />
          </label>
          {error ? <p className="md:col-span-2 text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}
          {flash ? <p className="md:col-span-2 text-sm" style={{ color: "var(--status-approved)" }}>{flash}</p> : null}
          <div className="md:col-span-2">
            <button type="submit" disabled={pending} className="portal-btn-primary disabled:opacity-60">
              {pending ? "Working…" : "Create branch"}
            </button>
          </div>
        </form>
      </div>

      <div className="portal-card">
        <div className="portal-eyebrow mb-4">Existing branches</div>
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr><th>Name</th><th>School</th><th>Region</th><th>Leader</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {scopedBranches.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No branches yet.</td></tr>
              ) : scopedBranches.map((b) => (
                <tr key={b.branch_id}>
                  <td className="font-medium">{b.name}</td>
                  <td className="text-xs">{b.school_location ?? "None"}</td>
                  <td className="text-xs">{b.regions?.name ?? "None"}</td>
                  <td className="text-xs">
                    {b.branch_leader ? (<><div>{b.branch_leader.name}</div><div className="text-muted-foreground">{b.branch_leader.email}</div></>) : "None"}
                  </td>
                  <td>
                    <span className={`portal-badge ${b.is_active ? "portal-badge-approved" : "portal-badge-rejected"}`}>
                      {b.is_active ? "active" : "inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleRotate(b.branch_id)} disabled={pending} className="portal-btn-secondary text-xs">
                        Rotate code
                      </button>
                      <button type="button" onClick={() => handleDelete(b)} disabled={pending} className="portal-btn-danger text-xs">
                        Delete
                      </button>
                    </div>
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
