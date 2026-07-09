"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveLog, rejectLog } from "./actions";
import type { DbHourLog } from "@/lib/portal/db/types";

type Row = DbHourLog & { users: { name: string; role: string } | null };

export function ApprovalsTable({ logs }: { logs: Row[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  if (logs.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">Nothing waiting on you. Good work.</p>;
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
    <table className="portal-table">
      <thead>
        <tr>
          <th>Submitter</th>
          <th>Date</th>
          <th>Activity</th>
          <th>Hours</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.log_id}>
            <td>
              <div className="font-medium">{log.users?.name ?? "Unknown"}</div>
              <div className="text-xs text-muted-foreground">{log.users?.role}</div>
            </td>
            <td className="font-mono text-xs">{log.activity_date}</td>
            <td>{log.description}</td>
            <td className="font-mono">{Number(log.hours).toFixed(2)}</td>
            <td>
              {rejectingId === log.log_id ? (
                <div className="space-y-2 min-w-[200px]">
                  <input
                    className="portal-input"
                    placeholder="Reason for rejection"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(log.log_id)}
                      disabled={pending}
                      className="portal-btn-primary text-xs"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRejectingId(null); setReason(""); }}
                      className="portal-btn-secondary text-xs"
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
                    className="portal-btn-primary text-xs"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectingId(log.log_id)}
                    className="portal-btn-secondary text-xs"
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
