import Link from "next/link";
import { SignUpForm } from "./sign-up-form";

export default function PortalSignUpPage() {
  return (
    <div>
      <div className="portal-eyebrow">II · Create account</div>
      <h1 className="portal-display mt-4 text-4xl">Join a chapter.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Members and Branch Leaders create accounts here. Admins and Region Leaders are invited by email.
      </p>
      <div className="mt-10">
        <SignUpForm />
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        Already signed up?{" "}
        <Link href="/portal/login" className="underline underline-offset-4 text-foreground">
          Sign in
        </Link>
      </div>
    </div>
  );
}
