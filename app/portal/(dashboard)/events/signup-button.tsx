"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { signUpForEvent, withdrawFromEvent } from "./signup-actions";

export function SignupButton({
  eventId,
  signedUp,
  count,
}: {
  eventId: string;
  signedUp: boolean;
  count: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startTransition(async () => {
      const r = signedUp ? await withdrawFromEvent(eventId) : await signUpForEvent(eventId);
      if (!r.ok) setError(r.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={signedUp ? "portal-btn-secondary text-xs" : "portal-btn-primary text-xs"}
      >
        {signedUp ? <><Check className="h-3 w-3" /> Going ({count})</> : <>Sign up ({count})</>}
      </button>
      {error ? <span className="text-xs" style={{ color: "var(--status-rejected)" }}>{error}</span> : null}
    </div>
  );
}
