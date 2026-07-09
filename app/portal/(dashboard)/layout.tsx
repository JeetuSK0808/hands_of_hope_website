import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser, isBranchExempt } from "@/lib/portal/auth/current-user";
import { mfaRequired } from "@/lib/portal/auth/mfa";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { NavSidebar } from "@/components/portal/nav-sidebar";

export const dynamic = "force-dynamic";

const MFA_EXEMPT_PATHS = ["/portal/mfa", "/portal/auth/sign-out"];

export default async function PortalDashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/portal/login");
  if (!user.branch_id && !isBranchExempt(user.role)) redirect("/portal/join-branch");

  const path = (await headers()).get("x-portal-path") ?? "";
  const onExempt = MFA_EXEMPT_PATHS.some((p) => path === p || path.startsWith(p + "/"));

  if (!onExempt) {
    const supabase = await createSupabaseServerClient();
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
      redirect("/portal/mfa/challenge");
    }
    if (mfaRequired(user.role) && !user.mfa_enabled) {
      redirect("/portal/mfa");
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <NavSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8 md:p-10 max-w-[110rem] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
