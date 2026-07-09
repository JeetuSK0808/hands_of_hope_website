"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinBranch } from "./actions";

export function JoinBranchForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await joinBranch(code.trim());
    if (result.ok) {
      startTransition(() => {
        router.push("/portal/dashboard");
        router.refresh();
      });
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Branch code</span>
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="portal-input mt-2 font-mono uppercase tracking-widest"
          placeholder="e.g. INN-ATL-2026"
        />
      </label>
      {error ? <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="portal-btn-primary w-full justify-center disabled:opacity-60"
      >
        {pending ? "Joining…" : "Join branch"}
      </button>
    </form>
  );
}
