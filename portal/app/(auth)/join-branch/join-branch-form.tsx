"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinBranch } from "./actions";

export function JoinBranchForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    const result = await joinBranch(code.trim());
    if (result.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setStatus("idle");
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
          className="input mt-2 font-mono uppercase tracking-widest"
          placeholder="e.g. INN-ATL-2026"
        />
      </label>
      {error ? (
        <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full disabled:opacity-60"
      >
        {status === "submitting" ? "Joining…" : "Join branch"}
      </button>
    </form>
  );
}
