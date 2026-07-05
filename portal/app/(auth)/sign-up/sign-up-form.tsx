"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignUpForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!passwordMeetsPolicy(password)) {
      setError("Password must be 8+ chars, include an uppercase letter, a number, and a special character.");
      return;
    }

    setStatus("submitting");

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signUpError) {
      setStatus("idle");
      setError(signUpError.message);
      return;
    }

    setStatus("sent");
    router.push("/verify-email");
  }

  if (status === "sent") {
    return (
      <div className="card">
        <div className="eyebrow">Check your inbox</div>
        <p className="mt-4 text-sm">
          A confirmation link is on its way. Once you verify, you&apos;ll be asked to enter your branch code.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Full name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input mt-2"
          autoComplete="name"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mt-2"
          autoComplete="email"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mt-2"
          autoComplete="new-password"
        />
        <span className="mt-1 block text-xs" style={{ color: "var(--hoh-ink-muted)" }}>
          8+ characters, one uppercase, one number, one special character.
        </span>
      </label>
      {error ? (
        <p className="text-sm" style={{ color: "var(--status-rejected)" }}>
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full disabled:opacity-60"
      >
        {status === "submitting" ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

function passwordMeetsPolicy(pw: string): boolean {
  return (
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw)
  );
}
