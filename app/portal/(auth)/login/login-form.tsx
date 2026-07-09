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
      const pre = await preCheckLogin(email);
      if (!pre.ok) {
        setError(pre.error);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        const status = await recordLoginResult(email, false);
        if (status.locked) {
          setError("Account locked for 15 minutes. A security notice was emailed to you.");
        } else {
          setError(
            `${mapAuthError(signInError.message)} · ${status.remaining} attempt${status.remaining === 1 ? "" : "s"} left before lockout.`,
          );
        }
        return;
      }

      await recordLoginResult(email, true);
      startTransition(() => {
        router.push("/portal/dashboard");
        router.refresh();
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
