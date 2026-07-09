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
        Need an account? Accounts are provisioned by your chapter&rsquo;s Branch Leader.
      </div>
    </div>
  );
}
