"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DbBranch, DbRegion, UserRole } from "@/lib/portal/db/types";
import { createEvent } from "./actions";

export function CreateEventForm({
  userRole,
  userBranchId,
  userRegionId,
  branches,
  regions,
}: {
  userRole: UserRole;
  userBranchId: string | null;
  userRegionId: string | null;
  branches: DbBranch[];
  regions: DbRegion[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Branch Leader locked to their branch; Region Leader locked to their region.
  const visibleBranches = useMemo(() => {
    if (userRole === "branch_leader") return branches.filter((b) => b.branch_id === userBranchId);
    if (userRole === "region_leader") return branches.filter((b) => b.region_id === userRegionId);
    return branches;
  }, [branches, userRole, userBranchId, userRegionId]);

  const [branchId, setBranchId] = useState(userRole === "branch_leader" ? userBranchId ?? "" : visibleBranches[0]?.branch_id ?? "");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const branchesById = useMemo(() => new Map(branches.map((b) => [b.branch_id, b])), [branches]);
  const regionsById = useMemo(() => new Map(regions.map((r) => [r.region_id, r])), [regions]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const branch = branchesById.get(branchId);
    if (!branch) {
      setError("Choose a branch.");
      return;
    }
    const region = regionsById.get(branch.region_id);
    if (!region) {
      setError("Branch is missing a region.");
      return;
    }
    const fd = new FormData();
    fd.set("branchId", branch.branch_id);
    fd.set("regionId", region.region_id);
    fd.set("eventName", eventName);
    fd.set("eventDate", eventDate);
    fd.set("location", location);
    fd.set("description", description);
    const r = await createEvent(fd);
    if (r.ok) {
      setEventName(""); setLocation(""); setDescription("");
      startTransition(() => router.refresh());
    } else {
      setError(r.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="block md:col-span-2">
        <span className="text-sm font-medium">Branch</span>
        <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="portal-input mt-2">
          {visibleBranches.map((b) => (
            <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium">Event name</span>
        <input required value={eventName} onChange={(e) => setEventName(e.target.value)} className="portal-input mt-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Date</span>
        <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="portal-input mt-2" />
      </label>
      <label className="block md:col-span-2">
        <span className="text-sm font-medium">Location</span>
        <input value={location} onChange={(e) => setLocation(e.target.value)} className="portal-input mt-2" />
      </label>
      <label className="block md:col-span-2">
        <span className="text-sm font-medium">Description</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="portal-input mt-2 min-h-20" />
      </label>
      {error ? <p className="md:col-span-2 text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}
      <div className="md:col-span-2">
        <button type="submit" disabled={pending} className="portal-btn-primary disabled:opacity-60">
          {pending ? "Creating…" : "Create event"}
        </button>
      </div>
    </form>
  );
}
