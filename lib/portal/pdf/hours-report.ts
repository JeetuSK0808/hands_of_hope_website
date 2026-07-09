"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { DbHourLog } from "@/lib/portal/db/types";
import { ROLE_LABEL, type UserRole } from "@/lib/portal/db/types";

export interface HoursReportSubject {
  name: string;
  email: string;
  role: UserRole;
  branch_name: string | null;
  region_name: string | null;
}

export interface HoursReportRow extends Pick<DbHourLog, "activity_date" | "description" | "hours" | "status"> {
  event_name: string | null;
  location: string | null;
}

function summarize(rows: HoursReportRow[]) {
  const now = new Date();
  const week = new Date(now); week.setDate(now.getDate() - 7);
  const month = new Date(now); month.setDate(now.getDate() - 30);
  let w = 0, m = 0, a = 0;
  for (const r of rows) {
    if (r.status !== "approved") continue;
    a += r.hours;
    const d = new Date(r.activity_date);
    if (d >= month) m += r.hours;
    if (d >= week) w += r.hours;
  }
  return { week: w, month: m, all: a };
}

export function generateHoursPdf(subject: HoursReportSubject, rows: HoursReportRow[]) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 54;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Hands of Hope Outreach", margin, 72);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(85, 85, 85);
  doc.text("Volunteer Hours Report", margin, 90);

  doc.setDrawColor(224, 224, 224);
  doc.line(margin, 102, pageW - margin, 102);

  doc.setFontSize(10);
  doc.setTextColor(17, 17, 17);
  const infoY = 124;
  doc.text(`Name:   ${subject.name}`, margin, infoY);
  doc.text(`Email:  ${subject.email}`, margin, infoY + 14);
  doc.text(`Role:   ${ROLE_LABEL[subject.role]}`, margin, infoY + 28);
  doc.text(`Branch: ${subject.branch_name ?? "—"}`, margin, infoY + 42);
  doc.text(`Region: ${subject.region_name ?? "—"}`, margin, infoY + 56);
  doc.text(`Report date: ${new Date().toISOString().slice(0, 10)}`, pageW - margin - 180, infoY);

  const body = rows.map((r) => [
    r.activity_date,
    r.event_name ? `${r.event_name} · ${r.description}` : r.description,
    r.location ?? "—",
    r.hours.toFixed(2),
    r.status,
  ]);

  autoTable(doc, {
    startY: infoY + 78,
    head: [["Date", "Event / Activity", "Location", "Hours", "Status"]],
    body,
    styles: { fontSize: 9, cellPadding: 6, textColor: [17, 17, 17], lineColor: [224, 224, 224], lineWidth: 0.4 },
    headStyles: { fillColor: [247, 247, 247], textColor: [17, 17, 17], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [252, 252, 252] },
    columnStyles: {
      0: { cellWidth: 70 },
      3: { halign: "right", cellWidth: 50, font: "courier" },
      4: { cellWidth: 60 },
    },
  });

  // Summary
  const s = summarize(rows);
  const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? infoY + 200;
  const summaryY = finalY + 30;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Summary (approved hours only)", margin, summaryY);
  doc.setFont("helvetica", "normal");
  doc.text(`Last 7 days: ${s.week.toFixed(2)}`, margin, summaryY + 16);
  doc.text(`Last 30 days: ${s.month.toFixed(2)}`, margin, summaryY + 30);
  doc.text(`All time: ${s.all.toFixed(2)}`, margin, summaryY + 44);

  // Signature block
  const sigY = summaryY + 90;
  doc.setFont("helvetica", "bold");
  doc.text("Co-Founder Approval", margin, sigY);
  doc.setFont("helvetica", "normal");
  doc.text("Daksh Kaushal", margin, sigY + 34);
  doc.line(margin + 90, sigY + 36, margin + 300, sigY + 36);
  doc.text("Date", margin + 310, sigY + 34);
  doc.line(margin + 340, sigY + 36, margin + 440, sigY + 36);

  doc.text("Shubham Trivedi", margin, sigY + 62);
  doc.line(margin + 90, sigY + 64, margin + 300, sigY + 64);
  doc.text("Date", margin + 310, sigY + 62);
  doc.line(margin + 340, sigY + 64, margin + 440, sigY + 64);

  const filename = `HOH-Hours-${subject.name.replace(/\s+/g, "_")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

export function generateBulkHoursPdf(
  subjects: Array<{ subject: HoursReportSubject; rows: HoursReportRow[] }>,
) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 54;
  let first = true;

  for (const { subject, rows } of subjects) {
    if (!first) doc.addPage();
    first = false;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Hands of Hope Outreach", margin, 72);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(85, 85, 85);
    doc.text("Volunteer Hours Report", margin, 90);
    doc.setDrawColor(224, 224, 224);
    doc.line(margin, 102, pageW - margin, 102);

    doc.setFontSize(10);
    doc.setTextColor(17, 17, 17);
    const infoY = 124;
    doc.text(`Name:   ${subject.name}`, margin, infoY);
    doc.text(`Email:  ${subject.email}`, margin, infoY + 14);
    doc.text(`Role:   ${ROLE_LABEL[subject.role]}`, margin, infoY + 28);
    doc.text(`Branch: ${subject.branch_name ?? "—"}`, margin, infoY + 42);
    doc.text(`Region: ${subject.region_name ?? "—"}`, margin, infoY + 56);

    autoTable(doc, {
      startY: infoY + 78,
      head: [["Date", "Event / Activity", "Location", "Hours", "Status"]],
      body: rows.map((r) => [
        r.activity_date,
        r.event_name ? `${r.event_name} · ${r.description}` : r.description,
        r.location ?? "—",
        r.hours.toFixed(2),
        r.status,
      ]),
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [247, 247, 247], textColor: [17, 17, 17], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [252, 252, 252] },
    });

    const s = summarize(rows);
    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? infoY + 200;
    doc.text(
      `Approved · 7d ${s.week.toFixed(2)} · 30d ${s.month.toFixed(2)} · all ${s.all.toFixed(2)}`,
      margin,
      finalY + 24,
    );
  }

  doc.save(`HOH-Bulk-Hours-${new Date().toISOString().slice(0, 10)}.pdf`);
}
