import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser, isBranchExempt } from "@/lib/portal/auth/current-user";
import { NavSidebar } from "@/components/portal/nav-sidebar";

export const dynamic = "force-dynamic";

export default async function PortalDashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/portal/login");
  if (!user.branch_id && !isBranchExempt(user.role)) redirect("/portal/join-branch");

  return (
    <div className="min-h-screen flex bg-background">
      <NavSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8 md:p-10 max-w-[110rem] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
