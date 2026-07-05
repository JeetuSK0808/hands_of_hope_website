import { requireUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LogHoursForm } from "./log-hours-form";

export default async function LogHoursPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const { data: events } = user.branch_id
    ? await supabase
        .from("events")
        .select("event_id, event_name, event_date, location")
        .eq("branch_id", user.branch_id)
        .gte("event_date", sixtyDaysAgo.toISOString().slice(0, 10))
        .order("event_date", { ascending: false })
    : { data: [] };

  return (
    <div className="max-w-2xl">
      <div className="eyebrow">Log hours</div>
      <h1 className="mt-3 text-3xl font-light">New submission.</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--hoh-ink-muted)" }}>
        Photo proof is required for members. Max 12 hours per entry.
      </p>
      <div className="mt-10 card">
        <LogHoursForm role={user.role} events={events ?? []} />
      </div>
    </div>
  );
}
