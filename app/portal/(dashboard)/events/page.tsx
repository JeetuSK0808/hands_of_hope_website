import { requireUser, roleAtLeast } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import type { DbBranch, DbEvent, DbRegion } from "@/lib/portal/db/types";
import { CreateEventForm } from "./create-event-form";
import { SignupButton } from "./signup-button";

interface EventRow extends DbEvent {
  branches: { name: string } | null;
  regions: { name: string } | null;
  event_signups: { count: number }[] | null;
}

export default async function PortalEventsPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const canCreate = roleAtLeast(user.role, "branch_leader");

  const { data: events } = await supabase
    .from("events")
    .select("*, branches(name), regions(name), event_signups(count)")
    .order("event_date", { ascending: false })
    .limit(200);

  const rows = (events ?? []) as EventRow[];

  const { data: mySignups } = await supabase
    .from("event_signups")
    .select("event_id")
    .eq("user_id", user.user_id);
  const signedSet = new Set((mySignups ?? []).map((s) => s.event_id as string));

  let branches: DbBranch[] = [];
  let regions: DbRegion[] = [];
  if (canCreate) {
    const { data: brs } = await supabase.from("branches").select("*").eq("is_active", true);
    branches = (brs ?? []) as DbBranch[];
    const { data: rgs } = await supabase.from("regions").select("*").eq("is_active", true);
    regions = (rgs ?? []) as DbRegion[];
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <div className="portal-eyebrow">Events</div>
        <h1 className="portal-display mt-3 text-4xl">
          {user.role === "member" ? "Upcoming and recent events." : "All events in scope."}
        </h1>
      </div>

      {canCreate ? (
        <div className="portal-card">
          <div className="portal-eyebrow mb-4">Create event</div>
          <CreateEventForm
            userRole={user.role}
            userBranchId={user.branch_id}
            userRegionId={user.region_id}
            branches={branches}
            regions={regions}
          />
        </div>
      ) : null}

      <div className="portal-card">
        <div className="portal-eyebrow mb-4">Upcoming & recent</div>
        {rows.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">No events yet.</p>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Branch</th>
                <th>Region</th>
                <th>Location</th>
                <th>Signup</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((event) => {
                const upcoming = event.event_date >= today;
                const count = event.event_signups?.[0]?.count ?? 0;
                return (
                  <tr key={event.event_id}>
                    <td className="font-mono text-xs">{event.event_date}</td>
                    <td>{event.event_name}</td>
                    <td>{event.branches?.name ?? "—"}</td>
                    <td>{event.regions?.name ?? "—"}</td>
                    <td>{event.location ?? "—"}</td>
                    <td>
                      {upcoming ? (
                        <SignupButton
                          eventId={event.event_id}
                          signedUp={signedSet.has(event.event_id)}
                          count={count}
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">{count} attended</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
