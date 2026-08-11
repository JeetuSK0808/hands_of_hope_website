"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ROLE_LABEL, ROLE_RANK, type DbBranch, type DbUser, type UserRole } from "@/lib/portal/db/types";
import { changeUserRole, setUserBranch, deactivateUser } from "./actions";

interface UserRow extends DbUser {
  branches: { name: string } | null;
  regions: { name: string } | null;
}

const ROLE_ORDER: UserRole[] = ["member", "branch_leader", "region_leader", "admin", "super_admin"];

function canPromote(actor: UserRole, from: UserRole, to: UserRole): boolean {
  if (from === to) return false;
  if (ROLE_RANK[to] >= ROLE_RANK[actor]) return false;
  if (ROLE_RANK[from] >= ROLE_RANK[actor]) return false;
  switch (actor) {
    case "super_admin": return true;
    case "admin": return to !== "super_admin";
    case "region_leader": return to === "branch_leader" && from === "member";
    default: return false;
  }
}

export function UsersTable({
  actor,
  users,
  branches,
}: {
  actor: DbUser;
  users: UserRow[];
  branches: DbBranch[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, query, roleFilter]);

  function handleRoleChange(target: UserRow, next: UserRole) {
    setError(null);
    startTransition(async () => {
      const r = await changeUserRole(target.user_id, next);
      if (!r.ok) setError(r.error);
      else router.refresh();
    });
  }

  function handleBranchChange(target: UserRow, branchId: string) {
    setError(null);
    startTransition(async () => {
      const r = await setUserBranch(target.user_id, branchId || null);
      if (!r.ok) setError(r.error);
      else router.refresh();
    });
  }

  function handleDeactivate(target: UserRow) {
    if (!confirm(`Deactivate ${target.name}? They will lose access.`)) return;
    setError(null);
    startTransition(async () => {
      const r = await deactivateUser(target.user_id);
      if (!r.ok) setError(r.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="portal-input pl-9"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as "all" | UserRole)} className="portal-input max-w-[200px]">
          <option value="all">All roles</option>
          {ROLE_ORDER.map((r) => (
            <option key={r} value={r}>{ROLE_LABEL[r]}</option>
          ))}
        </select>
      </div>

      {error ? <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}

      <div className="overflow-x-auto">
        <table className="portal-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Branch</th>
              <th>Region</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No users match.</td></tr>
            ) : filtered.map((u) => {
              const allowedRoles = ROLE_ORDER.filter((r) => canPromote(actor.role, u.role, r));
              const canEdit = allowedRoles.length > 0 && u.user_id !== actor.user_id;
              const canReassignBranch = actor.role === "super_admin" || actor.role === "admin"
                || (actor.role === "region_leader" && u.region_id === actor.region_id);

              return (
                <tr key={u.user_id}>
                  <td>
                    <div className="font-medium">{u.name}</div>
                    {!u.is_active ? <div className="text-xs text-muted-foreground">inactive</div> : null}
                  </td>
                  <td className="text-xs">{u.email}</td>
                  <td>
                    {canEdit ? (
                      <select
                        className="portal-input text-xs"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                        disabled={pending}
                      >
                        <option value={u.role}>{ROLE_LABEL[u.role]}</option>
                        {allowedRoles.filter((r) => r !== u.role).map((r) => (
                          <option key={r} value={r}>→ {ROLE_LABEL[r]}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="portal-role-pill">{ROLE_LABEL[u.role]}</span>
                    )}
                  </td>
                  <td>
                    {canReassignBranch && u.role !== "super_admin" && u.role !== "admin" ? (
                      <select
                        className="portal-input text-xs"
                        value={u.branch_id ?? ""}
                        onChange={(e) => handleBranchChange(u, e.target.value)}
                        disabled={pending}
                      >
                        <option value="">None</option>
                        {branches
                          .filter((b) => actor.role !== "region_leader" || b.region_id === actor.region_id)
                          .map((b) => (
                          <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs">{u.branches?.name ?? "None"}</span>
                    )}
                  </td>
                  <td className="text-xs">{u.regions?.name ?? "None"}</td>
                  <td>
                    {actor.role === "super_admin" && u.user_id !== actor.user_id && u.is_active ? (
                      <button
                        type="button"
                        className="portal-btn-danger text-xs"
                        onClick={() => handleDeactivate(u)}
                        disabled={pending}
                      >
                        Deactivate
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
