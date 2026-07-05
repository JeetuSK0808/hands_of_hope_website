import Link from "next/link";
import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <div>
      <div className="eyebrow">II · Create account</div>
      <h1 className="mt-4 text-3xl font-light">Join a chapter.</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--hoh-ink-muted)" }}>
        Members and Branch Leaders create accounts here. Admins are invited by email.
      </p>
      <div className="mt-10">
        <SignUpForm />
      </div>
      <div className="mt-8 text-sm" style={{ color: "var(--hoh-ink-muted)" }}>
        Already signed up?{" "}
        <Link href="/login" className="underline underline-offset-4" style={{ color: "var(--hoh-purple)" }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
