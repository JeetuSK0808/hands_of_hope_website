import { requireRole } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import type { DbRegion } from "@/lib/portal/db/types";
import { RegionsPanel } from "./regions-panel";

interface RegionRow extends DbRegion {
  region_leader: { name: string; email: string } | null;
  branches: { count: number }[] | null;
}

export default async function PortalRegionsPage() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("regions")
    .select("*, region_leader:users!regions_region_leader_fk(name, email), branches(count)")
    .order("name");

  const regions = (data ?? []) as RegionRow[];

  return (
    <div className="space-y-8">
      <div>
        <div className="portal-eyebrow">Structure</div>
        <h1 className="portal-display mt-3 text-4xl">Regions.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Geographic scopes for branches. Only Admins and Super Admins may create regions.
        </p>
      </div>
      <RegionsPanel regions={regions} />
    </div>
  );
}
