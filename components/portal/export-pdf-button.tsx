"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { generateHoursPdf, type HoursReportRow, type HoursReportSubject } from "@/lib/portal/pdf/hours-report";

export function ExportPdfButton({
  subject,
  rows,
  label = "Export my hours (PDF)",
  className,
}: {
  subject: HoursReportSubject;
  rows: HoursReportRow[];
  label?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className={className ?? "portal-btn-secondary"}
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          generateHoursPdf(subject, rows);
        })
      }
    >
      <Download className="h-3.5 w-3.5" />
      {pending ? "Preparing…" : label}
    </button>
  );
}
