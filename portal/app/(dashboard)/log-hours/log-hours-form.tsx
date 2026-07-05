"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/db/types";
import { submitHours } from "./actions";

interface EventOption {
  event_id: string;
  event_name: string;
  event_date: string;
  location: string | null;
}

export function LogHoursForm({
  role,
  events,
}: {
  role: UserRole;
  events: EventOption[];
}) {
  const router = useRouter();
  const requiresProof = role === "member";
  const [eventId, setEventId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

    setStatus("submitting");
    const formData = new FormData();
    formData.set("eventId", eventId);
    formData.set("date", date);
    formData.set("hours", String(hoursNum));
    formData.set("description", description);
    if (proof) formData.set("proof", proof);

    const result = await submitHours(formData);
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
        <span className="text-sm font-medium">Event (optional)</span>
        <select
          className="input mt-2"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="">Manual entry (no linked event)</option>
          {events.map((ev) => (
            <option key={ev.event_id} value={ev.event_id}>
              {ev.event_date} · {ev.event_name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Date</span>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input mt-2"
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
            className="input mt-2 font-mono"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Description of activity</span>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input mt-2 min-h-24"
        />
      </label>

      {requiresProof ? (
        <label className="block">
          <span className="text-sm font-medium">Photo proof</span>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setProof(e.target.files?.[0] ?? null)}
            className="input mt-2"
          />
          <span className="mt-1 block text-xs" style={{ color: "var(--hoh-ink-muted)" }}>
            Compressed automatically to under 2MB.
          </span>
        </label>
      ) : null}

      {error ? (
        <p className="text-sm" style={{ color: "var(--status-rejected)" }}>{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit for approval"}
      </button>
    </form>
  );
}
