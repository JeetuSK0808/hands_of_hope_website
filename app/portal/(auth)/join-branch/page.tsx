import { redirect } from "next/navigation";
import { requireUser, isBranchExempt } from "@/lib/portal/auth/current-user";
import { JoinBranchForm } from "./join-branch-form";

export default async function PortalJoinBranchPage() {
  const user = await requireUser();
  if (isBranchExempt(user.role) || user.branch_id) redirect("/portal/dashboard");

  return (
    <div>
      <div className="portal-eyebrow">IV · Join a branch</div>
      <h1 className="portal-display mt-4 text-4xl">Enter your branch code.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your Branch Leader will have shared a code. It links your account to your chapter.
      </p>
      <div className="mt-10">
        <JoinBranchForm />
      </div>
    </div>
  );
}
