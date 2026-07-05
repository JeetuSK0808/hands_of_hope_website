import Link from "next/link";
import type { DbUser } from "@/lib/db/types";
import { roleAtLeast } from "@/lib/auth/current-user";

interface NavItem {
  href: string;
  label: string;
  minRole: DbUser["role"];
}

const ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", minRole: "member" },
  { href: "/log-hours", label: "Log hours", minRole: "member" },
  { href: "/events", label: "Events", minRole: "member" },
  { href: "/approvals", label: "Approvals", minRole: "branch_leader" },
  { href: "/reports", label: "Reports", minRole: "region_leader" },
  { href: "/audit", label: "Audit log", minRole: "region_leader" },
];

const ROLE_LABEL: Record<DbUser["role"], string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  region_leader: "Region Leader",
  branch_leader: "Branch Leader",
  member: "Member",
};

export function NavSidebar({ user }: { user: DbUser }) {
  const items = ITEMS.filter((item) => roleAtLeast(user.role, item.minRole));
  return (
    <aside
      className="w-64 shrink-0 border-r"
      style={{ borderColor: "var(--hoh-border)" }}
    >
      <div className="p-6" style={{ borderBottom: "1px solid var(--hoh-border)" }}>
        <div className="eyebrow">Hands of Hope Outreach</div>
        <div className="mt-2 text-lg font-medium">Volunteer Portal</div>
      </div>

      <div className="p-6">
        <div className="text-sm font-medium">{user.name}</div>
        <div className="mt-1 text-xs" style={{ color: "var(--hoh-ink-muted)" }}>
          {ROLE_LABEL[user.role]}
        </div>
      </div>

      <nav className="px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded px-4 py-2 text-sm hover:bg-[var(--hoh-off-white)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <form action="/auth/sign-out" method="post">
          <button
            type="submit"
            className="text-xs underline underline-offset-4"
            style={{ color: "var(--hoh-ink-muted)" }}
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
