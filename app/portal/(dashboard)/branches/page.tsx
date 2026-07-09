import { requireRole } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import type { DbBranch, DbRegion } from "@/lib/portal/db/types";
import { BranchesPanel } from "./branches-panel";

interface BranchRow extends DbBranch {
  regions: { name: string } | null;
  branch_leader: { name: string; email: string } | null;
}

export default async function PortalBranchesPage() {
  const actor = await requireRole("region_leader");
  const supabase = await createSupabaseServerClient();

  const { data: branches } = await supabase
    .from("branches")
    .select("*, regions(name), branch_leader:users!branches_branch_leader_fk(name, email)")
    .order("created_at", { ascending: false });

  const { data: regions } = await supabase.from("regions").select("*").order("name");

  return (
    <div className="space-y-8">
      <div>
        <div className="portal-eyebrow">Structure</div>
        <h1 className="portal-display mt-3 text-4xl">Branches.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Create, rotate codes for, and manage branches you have authority over.
        </p>
      </div>
      <BranchesPanel
        actorRole={actor.role}
        actorRegionId={actor.region_id}
        branches={(branches ?? []) as BranchRow[]}
        regions={(regions ?? []) as DbRegion[]}
      />
    </div>
  );
}
