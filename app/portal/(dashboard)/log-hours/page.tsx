import { requireUser } from "@/lib/portal/auth/current-user";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { LogHoursForm } from "./log-hours-form";

export default async function PortalLogHoursPage() {
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
      <div className="portal-eyebrow">Log hours</div>
      <h1 className="portal-display mt-3 text-4xl">New submission.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {user.role === "member"
          ? "Photo proof is required for members. Max 12 hours per entry."
          : "Leaders and above are exempt from photo proof. Max 12 hours per entry."}
      </p>
      <div className="mt-10 portal-card">
        <LogHoursForm role={user.role} events={events ?? []} />
      </div>
    </div>
  );
}
