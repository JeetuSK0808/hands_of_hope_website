"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/portal/db/types";
import { compressImage } from "@/lib/portal/image/compress";
import { submitHours } from "./actions";

interface EventOption {
  event_id: string;
  event_name: string;
  event_date: string;
  location: string | null;
}

export function LogHoursForm({ role, events }: { role: UserRole; events: EventOption[] }) {
  const router = useRouter();
  const requiresProof = role === "member";
  const [eventId, setEventId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [proofNote, setProofNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [compressing, setCompressing] = useState(false);
  // `pending` only covers the post-success navigation. The submit itself,
  // which uploads a photo, needs its own flag, or the button stays live
  // through the whole upload and a double-click files the hours twice.
  const [submitting, setSubmitting] = useState(false);

  async function handleFile(file: File | null) {
    if (!file) { setProof(null); setProofNote(null); return; }
    setCompressing(true);
    setProofNote(null);
    try {
      const compressed = await compressImage(file);
      setProof(compressed);
      const kb = Math.round(compressed.size / 1024);
      if (compressed !== file) {
        const origKb = Math.round(file.size / 1024);
        setProofNote(`Compressed ${origKb}KB → ${kb}KB.`);
      } else {
        setProofNote(`${kb}KB, ready.`);
      }
    } catch {
      setProof(file);
      setProofNote(`Could not compress; using original (${Math.round(file.size / 1024)}KB).`);
    } finally {
      setCompressing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || pending) return;
    setError(null);

    const hoursNum = parseFloat(hours);
    if (!Number.isFinite(hoursNum) || hoursNum <= 0 || hoursNum > 12) {
      setError("Hours must be greater than 0 and at most 12.");
      return;
    }
    if (requiresProof && !proof) {
      setError("Photo proof is required for members.");
      return;
    }

    const formData = new FormData();
    formData.set("eventId", eventId);
    formData.set("date", date);
    formData.set("hours", String(hoursNum));
    formData.set("description", description);
    if (proof) formData.set("proof", proof);

    setSubmitting(true);
    try {
      const result = await submitHours(formData);
      if (result.ok) {
        // Stay disabled through the navigation; re-enabling here would let a
        // second click fire while the route transition is still in flight.
        startTransition(() => {
          router.replace("/portal/dashboard");
        });
        return;
      }
      setError(result.error);
      setSubmitting(false);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {events.length > 0 ? (
        <label className="block">
          <span className="text-sm font-medium">Event (optional)</span>
          <select className="portal-input mt-2" value={eventId} onChange={(e) => setEventId(e.target.value)}>
            <option value="">Manual entry (no linked event)</option>
            {events.map((ev) => (
              <option key={ev.event_id} value={ev.event_id}>
                {ev.event_date} · {ev.event_name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Date</span>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="portal-input mt-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Hours</span>
          <input
            type="number"
            step="0.25"
            min="0.25"
            max="12"
            required
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="portal-input mt-2 font-mono"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Description of activity</span>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="portal-input mt-2 min-h-24"
        />
      </label>

      {requiresProof ? (
        <label className="block">
          <span className="text-sm font-medium">Photo proof</span>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="portal-input mt-2"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            {compressing ? "Compressing…" : proofNote ?? "Compressed automatically to under 2MB before upload."}
          </span>
        </label>
      ) : null}

      {error ? <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p> : null}

      <button
        type="submit"
        disabled={submitting || pending || compressing}
        className="portal-btn-primary w-full justify-center disabled:opacity-60"
      >
        {compressing
          ? "Preparing photo…"
          : submitting || pending
            ? "Submitting…"
            : "Submit for approval"}
      </button>
    </form>
  );
}
