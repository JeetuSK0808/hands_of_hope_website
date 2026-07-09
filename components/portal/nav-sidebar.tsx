"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { ROLE_LABEL, ROLE_RANK, type DbUser, type UserRole } from "@/lib/portal/db/types";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  minRole: UserRole;
  section?: "main" | "admin" | "system";
}

const ITEMS: NavItem[] = [
  { href: "/portal/dashboard", label: "Dashboard", minRole: "member", section: "main" },
  { href: "/portal/log-hours", label: "Log hours", minRole: "member", section: "main" },
  { href: "/portal/events", label: "Events", minRole: "member", section: "main" },
  { href: "/portal/approvals", label: "Approvals", minRole: "branch_leader", section: "main" },
  { href: "/portal/reports", label: "Reports", minRole: "region_leader", section: "admin" },
  { href: "/portal/audit", label: "Audit log", minRole: "region_leader", section: "admin" },
  { href: "/portal/users", label: "Users", minRole: "branch_leader", section: "admin" },
  { href: "/portal/branches", label: "Branches", minRole: "region_leader", section: "admin" },
  { href: "/portal/regions", label: "Regions", minRole: "admin", section: "system" },
  { href: "/portal/mfa", label: "Two-factor auth", minRole: "member", section: "system" },
];

function roleAtLeast(role: UserRole, min: UserRole) {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

export function NavSidebar({ user }: { user: DbUser }) {
  const pathname = usePathname();
  const items = ITEMS.filter((i) => roleAtLeast(user.role, i.minRole));
  const main = items.filter((i) => i.section === "main");
  const admin = items.filter((i) => i.section === "admin");
  const system = items.filter((i) => i.section === "system");

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
      <Link href="/" className="p-6 border-b border-border block">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt="Hands of Hope"
            width={40}
            height={40}
            className="rounded-sm"
          />
          <div>
            <div className="portal-eyebrow text-[10px]">Hands of Hope</div>
            <div className="portal-display text-lg italic leading-none mt-1">Volunteer&nbsp;Portal</div>
          </div>
        </div>
      </Link>

      <div className="px-6 py-4 border-b border-border">
        <div className="text-sm font-medium">{user.name}</div>
        <div className="mt-1 portal-role-pill">{ROLE_LABEL[user.role]}</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <NavGroup title="Main" items={main} pathname={pathname} />
        {admin.length ? <NavGroup title="Administration" items={admin} pathname={pathname} /> : null}
        {system.length ? <NavGroup title="System" items={system} pathname={pathname} /> : null}
      </nav>

      <div className="p-4 border-t border-border">
        <form action="/portal/auth/sign-out" method="post">
          <button
            type="submit"
            className="portal-btn-secondary w-full justify-center text-xs"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

function NavGroup({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string | null;
}) {
  return (
    <div>
      <div className="portal-eyebrow px-3 mb-2 text-[10px]">{title}</div>
      <ul className="space-y-0.5">
        {items.map((i) => {
          const active = pathname === i.href || pathname?.startsWith(i.href + "/");
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                prefetch
                className={cn(
                  "flex items-center px-3 py-2 text-sm transition-colors rounded-sm",
                  active
                    ? "text-foreground font-medium bg-muted border-l-2 border-[var(--brand-rose)] -ml-[1px]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                )}
              >
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
