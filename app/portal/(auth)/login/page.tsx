import Link from "next/link";
import { LoginForm } from "./login-form";

export default function PortalLoginPage() {
  return (
    <div>
      <div className="portal-eyebrow">I · Sign in</div>
      <h1 className="portal-display mt-4 text-4xl">Welcome back.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Enter the credentials tied to your Hands of Hope chapter.
      </p>
      <div className="mt-10">
        <LoginForm />
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        New volunteer?{" "}
        <Link href="/portal/sign-up" className="underline underline-offset-4 text-foreground">
          Create an account
        </Link>
      </div>
    </div>
  );
}
