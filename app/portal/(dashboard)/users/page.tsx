import { requireRole } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import type { DbBranch, DbUser } from "@/lib/portal/db/types";
import { UsersTable } from "./users-table";

interface UserRow extends DbUser {
  branches: { name: string } | null;
  regions: { name: string } | null;
}

export default async function PortalUsersPage() {
  const actor = await requireRole("branch_leader");
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("users")
    .select("*, branches(name), regions(name)")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as UserRow[];

  const { data: branches } = await supabase.from("branches").select("*");

  return (
    <div className="space-y-8">
      <div>
        <div className="portal-eyebrow">People</div>
        <h1 className="portal-display mt-3 text-4xl">Users.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Promote, demote, or reassign volunteers you have authority over.
        </p>
      </div>
      <div className="portal-card">
        <UsersTable
          actor={actor}
          users={users}
          branches={(branches ?? []) as DbBranch[]}
        />
      </div>
    </div>
  );
}
