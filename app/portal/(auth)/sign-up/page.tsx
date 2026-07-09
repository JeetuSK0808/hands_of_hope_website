import Link from "next/link";

export default function PortalSignUpPage() {
  return (
    <div>
      <div className="portal-eyebrow">II · Invite only</div>
      <h1 className="portal-display mt-4 text-4xl">Ask a chapter lead.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Hands of Hope accounts are provisioned by Super Admins, Admins, Region Leaders,
        and Branch Leaders from inside the portal. If you volunteer with a chapter, ask
        your Branch Leader to add you.
      </p>
      <div className="mt-10">
        <Link href="/portal/login" className="portal-btn-primary">
          Sign in
        </Link>
      </div>
    </div>
  );
}
