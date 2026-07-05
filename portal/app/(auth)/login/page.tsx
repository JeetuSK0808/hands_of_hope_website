import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div>
      <div className="eyebrow">I · Sign in</div>
      <h1 className="mt-4 text-3xl font-light">Welcome back.</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--hoh-ink-muted)" }}>
        Enter the credentials tied to your Hands of Hope chapter.
      </p>
      <div className="mt-10">
        <LoginForm />
      </div>
      <div className="mt-8 text-sm" style={{ color: "var(--hoh-ink-muted)" }}>
        New volunteer?{" "}
        <Link href="/sign-up" className="underline underline-offset-4" style={{ color: "var(--hoh-purple)" }}>
          Create an account
        </Link>
      </div>
    </div>
  );
}
