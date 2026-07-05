import { requireRole } from "@/lib/auth/current-user";

export default async function ReportsPage() {
  const user = await requireRole("region_leader");
  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow">Reports</div>
        <h1 className="mt-3 text-3xl font-light">Bulk export.</h1>
      </div>
      <div className="card space-y-4">
        <p className="text-sm">
          Signed in as <strong>{user.name}</strong> · {user.role.replace("_", " ")}.
        </p>
        <p className="text-sm" style={{ color: "var(--hoh-ink-muted)" }}>
          Scope: {user.role === "region_leader" ? "your region only." : "organization-wide."}
        </p>
        <p className="text-xs" style={{ color: "var(--hoh-ink-muted)" }}>
          TODO — CSV + compiled PDF export (jsPDF/PapaParse). Schema is in place.
        </p>
      </div>
    </div>
  );
}
