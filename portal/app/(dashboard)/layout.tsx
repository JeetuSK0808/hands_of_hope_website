import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { NavSidebar } from "@/components/nav-sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.branch_id && user.role === "member") redirect("/join-branch");

  return (
    <div className="min-h-screen flex" style={{ background: "var(--hoh-off-white)" }}>
      <NavSidebar user={user} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
}
