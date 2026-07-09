import { requireUser } from "@/lib/portal/auth/current-user";
import { mfaRequired } from "@/lib/portal/auth/mfa";
import { EnrollMfa } from "./enroll-mfa";

export default async function PortalMfaPage() {
  const user = await requireUser();
  const mandatory = mfaRequired(user.role);

  return (
    <div className="max-w-2xl">
      <div className="portal-eyebrow">Security</div>
      <h1 className="portal-display mt-3 text-4xl">Two-factor authentication.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {mandatory
          ? "MFA is required for your role. Scan the QR with any authenticator app (Google Authenticator, 1Password, Authy) and enter the 6-digit code to enroll."
          : "MFA is optional but strongly encouraged. Scan the QR with any authenticator app and enter the 6-digit code to enroll."}
      </p>
      <div className="mt-8">
        <EnrollMfa
          currentlyEnabled={user.mfa_enabled}
          userId={user.user_id}
          mandatory={mandatory}
        />
      </div>
    </div>
  );
}
