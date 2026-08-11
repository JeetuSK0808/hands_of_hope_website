"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ROLE_LABEL, type DbBranch, type DbUser, type UserRole } from "@/lib/portal/db/types";
import { createUser } from "./actions";

function rolesActorCanCreate(actor: UserRole): UserRole[] {
  switch (actor) {
    case "super_admin":
      return ["super_admin", "admin", "region_leader", "branch_leader", "member"];
    case "admin":
      return ["admin", "region_leader", "branch_leader", "member"];
    case "region_leader":
      return ["branch_leader", "member"];
    case "branch_leader":
      return ["member"];
    default:
      return [];
  }
}

export function CreateUserForm({ actor, branches }: { actor: DbUser; branches: DbBranch[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("member");
  const [branchId, setBranchId] = useState<string>(actor.branch_id ?? "");

  const allowedRoles = rolesActorCanCreate(actor.role);
  const needsBranch = role === "branch_leader" || role === "member";
  const scopedBranches = branches.filter((b) => {
    if (actor.role === "super_admin" || actor.role === "admin") return true;
    if (actor.role === "region_leader") return b.region_id === actor.region_id;
    if (actor.role === "branch_leader") return b.branch_id === actor.branch_id;
    return false;
  });

  if (allowedRoles.length === 0) return null;

  function reset() {
    setName("");
    setEmail("");
    setPassword("");
    setRole("member");
    setBranchId(actor.branch_id ?? "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await createUser({
        name,
        email,
        password,
        role,
        branch_id: needsBranch ? branchId || null : null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(`Created ${email} as ${ROLE_LABEL[role]}.`);
      reset();
      router.refresh();
    });
  }

  return (
    <div className="portal-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="portal-eyebrow">Add account</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Only {allowedRoles.map((r) => ROLE_LABEL[r]).join(", ")} can be created by you.
          </p>
        </div>
        <button
          type="button"
          className="portal-btn-secondary text-xs"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Cancel" : "New user"}
        </button>
      </div>

      {open ? (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Full name</span>
            <input
              className="portal-input mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="portal-input mt-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Temporary password</span>
            <input
              className="portal-input mt-2"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={10}
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              10+ characters. Share it securely with the new user.
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Role</span>
            <select
              className="portal-input mt-2"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {allowedRoles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </label>
          {needsBranch ? (
            <label className="block md:col-span-2">
              <span className="text-sm font-medium">Branch</span>
              <select
                className="portal-input mt-2"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                required
              >
                <option value="">Select a branch</option>
                {scopedBranches.map((b) => (
                  <option key={b.branch_id} value={b.branch_id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {error ? (
            <p className="md:col-span-2 text-sm" style={{ color: "var(--status-rejected)" }}>
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="md:col-span-2 text-sm" style={{ color: "var(--status-approved)" }}>
              {success}
            </p>
          ) : null}

          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <button
              type="button"
              className="portal-btn-secondary text-xs"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              disabled={pending}
            >
              Cancel
            </button>
            <button type="submit" className="portal-btn-primary text-xs" disabled={pending}>
              {pending ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
