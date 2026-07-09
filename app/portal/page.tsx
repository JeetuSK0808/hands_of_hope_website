import { redirect } from "next/navigation";
import { getCurrentUser, isBranchExempt } from "@/lib/portal/auth/current-user";

export const dynamic = "force-dynamic";

export default async function PortalHomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/portal/login");
  if (!user.branch_id && !isBranchExempt(user.role)) redirect("/portal/join-branch");
  redirect("/portal/dashboard");
}
