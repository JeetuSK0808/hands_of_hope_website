import { requireUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DbEvent } from "@/lib/db/types";

export default async function EventsPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false })
    .limit(50);

  const rows = (events ?? []) as DbEvent[];

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow">Events</div>
        <h1 className="mt-3 text-3xl font-light">
          {user.role === "member" ? "Upcoming and recent events." : "All events in scope."}
        </h1>
      </div>
      <div className="card">
        {rows.length === 0 ? (
          <p className="py-6 text-center" style={{ color: "var(--hoh-ink-muted)" }}>
            No events yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: "var(--hoh-ink-muted)" }}>
                <th className="py-2">Date</th>
                <th className="py-2">Event</th>
                <th className="py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((event) => (
                <tr key={event.event_id} style={{ borderTop: "1px solid var(--hoh-border)" }}>
                  <td className="py-3 font-mono text-xs">{event.event_date}</td>
                  <td className="py-3">{event.event_name}</td>
                  <td className="py-3">{event.location ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="text-xs" style={{ color: "var(--hoh-ink-muted)" }}>
        TODO — Branch Leader+ event creation UI.
      </p>
    </div>
  );
}
