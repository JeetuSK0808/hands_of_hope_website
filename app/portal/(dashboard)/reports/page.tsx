import { requireRole } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import type { DbBranch, DbRegion } from "@/lib/portal/db/types";
import { ReportsPanel } from "./reports-panel";

export default async function PortalReportsPage() {
  const user = await requireRole("region_leader");
  const supabase = await createSupabaseServerClient();

  const [{ data: regions }, { data: branches }] = await Promise.all([
    supabase.from("regions").select("*").order("name"),
    supabase.from("branches").select("*").order("name"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="portal-eyebrow">Reports</div>
        <h1 className="portal-display mt-3 text-4xl">Bulk export.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Scope: {user.role === "region_leader" ? "your region only." : "organization-wide."}
        </p>
      </div>
      <ReportsPanel
        actorRole={user.role}
        actorRegionId={user.region_id}
        regions={(regions ?? []) as DbRegion[]}
        branches={(branches ?? []) as DbBranch[]}
      />
    </div>
  );
}
