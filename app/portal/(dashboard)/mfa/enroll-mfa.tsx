"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { createSupabaseBrowserClient } from "@/lib/portal/supabase/client";
import { setMfaEnabled } from "./actions";

type EnrollState =
  | { phase: "idle" }
  | { phase: "enrolling"; factorId: string; secret: string; qrDataUrl: string; uri: string }
  | { phase: "done" };

export function EnrollMfa({
  currentlyEnabled,
  userId,
  mandatory,
}: {
  currentlyEnabled: boolean;
  userId: string;
  mandatory: boolean;
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [state, setState] = useState<EnrollState>({ phase: currentlyEnabled ? "done" : "idle" });
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (currentlyEnabled) setState({ phase: "done" });
  }, [currentlyEnabled]);

  async function startEnrollment() {
    setError(null);
    const { data, error: enrollErr } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    if (enrollErr || !data) {
      setError(enrollErr?.message ?? "Could not start enrollment.");
      return;
    }
    const qrDataUrl = await QRCode.toDataURL(data.totp.uri, { margin: 1, width: 220 });
    setState({
      phase: "enrolling",
      factorId: data.id,
      secret: data.totp.secret,
      qrDataUrl,
      uri: data.totp.uri,
    });
  }

  async function verifyEnrollment() {
    if (state.phase !== "enrolling") return;
    setError(null);
    const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({ factorId: state.factorId });
    if (cErr || !challenge) { setError(cErr?.message ?? "Could not create challenge."); return; }
    const { error: vErr } = await supabase.auth.mfa.verify({
      factorId: state.factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });
    if (vErr) { setError(vErr.message); return; }

    await setMfaEnabled(userId, true);
    setState({ phase: "done" });
    startTransition(() => router.refresh());
  }

  async function unenroll() {
    if (!confirm("Remove MFA? You will not be prompted for a code on next login.")) return;
    setError(null);
    const { data: factors, error: fErr } = await supabase.auth.mfa.listFactors();
    if (fErr) { setError(fErr.message); return; }
    for (const f of factors?.totp ?? []) {
      await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    await setMfaEnabled(userId, false);
    setState({ phase: "idle" });
    startTransition(() => router.refresh());
  }

  if (state.phase === "done") {
    return (
      <div className="portal-card space-y-4">
        <div className="portal-eyebrow">Status</div>
        <p className="text-sm">
          MFA is <strong style={{ color: "var(--status-approved)" }}>enabled</strong> on this account.
        </p>
        <p className="text-xs text-muted-foreground">
          You will be prompted for a 6-digit code at every future login.
        </p>
        {!mandatory ? (
          <button type="button" onClick={unenroll} disabled={pending} className="portal-btn-danger text-xs">
            Remove MFA
          </button>
        ) : (
          <p className="text-xs text-muted-foreground">MFA is required for your role and cannot be disabled here.</p>
        )}
      </div>
    );
  }

  if (state.phase === "enrolling") {
    return (
      <div className="portal-card space-y-6">
        <div>
          <div className="portal-eyebrow mb-2">Step 1 · Scan the QR</div>
          <img src={state.qrDataUrl} alt="TOTP QR" width={220} height={220} style={{ borderRadius: "4px" }} />
        </div>
        <div>
          <div className="portal-eyebrow mb-2">Can&apos;t scan? Enter manually</div>
          <code className="block text-xs font-mono bg-muted px-3 py-2 rounded break-all">{state.secret}</code>
        </div>
        <div>
          <div className="portal-eyebrow mb-2">Step 2 · Enter the 6-digit code</div>
          <input
            className="portal-input font-mono tracking-widest text-center max-w-[200px]"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </div>
        {error ? <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}
        <div className="flex gap-3">
          <button type="button" onClick={verifyEnrollment} disabled={pending || code.length !== 6} className="portal-btn-primary disabled:opacity-60">
            Verify & enable
          </button>
          <button type="button" onClick={() => setState({ phase: "idle" })} className="portal-btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-card space-y-4">
      {mandatory ? (
        <p className="text-sm" style={{ color: "var(--status-pending)" }}>
          Your role requires MFA. You cannot access the portal until you enroll.
        </p>
      ) : null}
      {error ? <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}
      <button type="button" onClick={startEnrollment} className="portal-btn-primary">
        Start enrollment
      </button>
    </div>
  );
}
