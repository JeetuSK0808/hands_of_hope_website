import { MfaChallengeForm } from "./mfa-challenge-form";

export default function PortalMfaChallengePage() {
  return (
    <div>
      <div className="portal-eyebrow">Verification</div>
      <h1 className="portal-display mt-4 text-4xl">Two-factor check.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Open your authenticator app and enter the 6-digit code.
      </p>
      <div className="mt-10">
        <MfaChallengeForm />
      </div>
    </div>
  );
}
