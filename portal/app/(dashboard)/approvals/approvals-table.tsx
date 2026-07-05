"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveLog, rejectLog } from "./actions";
import type { DbHourLog } from "@/lib/db/types";

type Row = DbHourLog & { users: { name: string; role: string } | null };

export function ApprovalsTable({ logs }: { logs: Row[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  if (logs.length === 0) {
    return (
      <p className="py-8 text-center" style={{ color: "var(--hoh-ink-muted)" }}>
        Nothing waiting on you. Good work.
      </p>
    );
  }

  function handleApprove(id: string) {
    startTransition(async () => {
      await approveLog(id);
      router.refresh();
    });
  }

  function handleReject(id: string) {
    if (!reason.trim()) return;
    startTransition(async () => {
      await rejectLog(id, reason.trim());
      setRejectingId(null);
      setReason("");
      router.refresh();
    });
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left" style={{ color: "var(--hoh-ink-muted)" }}>
          <th className="py-2">Submitter</th>
          <th className="py-2">Date</th>
          <th className="py-2">Activity</th>
          <th className="py-2">Hours</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.log_id} style={{ borderTop: "1px solid var(--hoh-border)" }}>
            <td className="py-3">
              <div>{log.users?.name ?? "Unknown"}</div>
              <div className="text-xs" style={{ color: "var(--hoh-ink-muted)" }}>
                {log.users?.role}
              </div>
            </td>
            <td className="py-3 font-mono text-xs">{log.activity_date}</td>
            <td className="py-3">{log.description}</td>
            <td className="py-3 font-mono">{log.hours.toFixed(2)}</td>
            <td className="py-3">
              {rejectingId === log.log_id ? (
                <div className="space-y-2">
                  <input
                    className="input"
                    placeholder="Reason for rejection"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(log.log_id)}
                      disabled={pending}
                      className="btn-primary text-xs"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRejectingId(null); setReason(""); }}
                      className="btn-secondary text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(log.log_id)}
                    disabled={pending}
                    className="btn-primary text-xs"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectingId(log.log_id)}
                    className="btn-secondary text-xs"
                  >
                    Reject
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
