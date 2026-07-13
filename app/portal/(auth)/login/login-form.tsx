"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/portal/supabase/client";
import { preCheckLogin, recordLoginResult } from "./actions";

export function LoginForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      // Run lockout precheck and auth in parallel — precheck is advisory,
      // so we don't want it adding a serial round-trip on the happy path.
      const [pre, signIn] = await Promise.all([
        preCheckLogin(email),
        supabase.auth.signInWithPassword({ email, password }),
      ]);

      if (!pre.ok) {
        setError(pre.error);
        return;
      }

      if (signIn.error) {
        const status = await recordLoginResult(email, false);
        if (status.locked) {
          setError("Account locked for 15 minutes. A security notice was emailed to you.");
        } else {
          setError(
            `${mapAuthError(signIn.error.message)} · ${status.remaining} attempt${status.remaining === 1 ? "" : "s"} left before lockout.`,
          );
        }
        return;
      }

      // Fire-and-forget the success record — server-side `after()` finishes it.
      void recordLoginResult(email, true);
      startTransition(() => {
        router.replace("/portal/dashboard");
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="portal-input mt-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="portal-input mt-2"
        />
      </label>
      {error ? <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}
      <button
        type="submit"
        disabled={pending || busy}
        className="portal-btn-primary w-full justify-center disabled:opacity-60"
      >
        {pending || busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function mapAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return "Incorrect email or password.";
  if (/email not confirmed/i.test(message)) return "Verify your email first — check your inbox.";
  return message;
}
