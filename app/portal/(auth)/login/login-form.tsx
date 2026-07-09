"use client";

import { useState } from "react";
import { signInAsGuest } from "./actions";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async () => {
        setPending(true);
        await signInAsGuest();
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="portal-input mt-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="portal-btn-primary w-full justify-center disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-xs text-muted-foreground">
        Demo mode — any credentials sign you in as a guest volunteer.
      </p>
    </form>
  );
}
