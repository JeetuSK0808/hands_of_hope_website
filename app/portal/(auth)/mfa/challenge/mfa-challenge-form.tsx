"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/portal/supabase/client";

export function MfaChallengeForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const { data, error: fErr } = await supabase.auth.mfa.listFactors();
      if (fErr) { setError(fErr.message); return; }
      const totp = data?.totp?.[0];
      if (!totp) { setError("No TOTP factor found. Enroll first."); return; }
      setFactorId(totp.id);
    })();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setError(null);
    const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({ factorId });
    if (cErr || !challenge) { setError(cErr?.message ?? "Challenge failed."); return; }
    const { error: vErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });
    if (vErr) { setError(vErr.message); return; }
    startTransition(() => {
      router.push("/portal/dashboard");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="portal-input font-mono tracking-widest text-center"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
      />
      {error ? <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}
      <button type="submit" disabled={pending || code.length !== 6 || !factorId} className="portal-btn-primary w-full justify-center disabled:opacity-60">
        {pending ? "Verifying…" : "Verify"}
      </button>
    </form>
  );
}
