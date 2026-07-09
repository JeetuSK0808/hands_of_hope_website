import "server-only";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { escapeHtml, sendEmail, shell } from "./send";
import { ROLE_LABEL, type UserRole } from "@/lib/portal/db/types";

const PORTAL_URL_BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.handsofhopeoutreach.com";

function link(path: string): string {
  return `${PORTAL_URL_BASE}${path}`;
}

/** Approvers for a submitter role, matching Section 2.2 of the spec. */
function approverRolesFor(submitterRole: UserRole): UserRole[] {
  switch (submitterRole) {
    case "member": return ["branch_leader"];
    case "branch_leader": return ["region_leader", "admin"];
    case "region_leader": return ["admin", "super_admin"];
    case "admin": return ["super_admin"];
    case "super_admin": return ["super_admin"];
  }
}

async function fetchApprovers(
  submitterRole: UserRole,
  branchId: string | null,
  regionId: string | null,
): Promise<{ email: string; name: string }[]> {
  const supabase = await createSupabaseServerClient();
  const roles = approverRolesFor(submitterRole);
  let query = supabase
    .from("users")
    .select("email, name, role, branch_id, region_id")
    .in("role", roles)
    .eq("is_active", true);
  const { data, error } = await query;
  if (error || !data) return [];

  return data
    .filter((u) => {
      if (u.role === "branch_leader") return u.branch_id === branchId;
      if (u.role === "region_leader") return u.region_id === regionId;
      return true;
    })
    .map((u) => ({ email: u.email as string, name: u.name as string }));
}

export async function notifyHoursSubmitted(input: {
  submitterName: string;
  submitterRole: UserRole;
  branchId: string | null;
  regionId: string | null;
  hours: number;
  activityDate: string;
  description: string;
}) {
  const approvers = await fetchApprovers(input.submitterRole, input.branchId, input.regionId);
  if (approvers.length === 0) return;
  const body = `
    <p><strong>${escapeHtml(input.submitterName)}</strong> (${ROLE_LABEL[input.submitterRole]}) submitted hours for review.</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;margin-top:12px;font-size:13px;">
      <tr><td style="color:#666;">Date</td><td>${escapeHtml(input.activityDate)}</td></tr>
      <tr><td style="color:#666;">Hours</td><td style="font-family:monospace;">${input.hours.toFixed(2)}</td></tr>
      <tr><td style="color:#666;vertical-align:top;">Activity</td><td>${escapeHtml(input.description).slice(0, 400)}</td></tr>
    </table>
    <p style="margin-top:20px;"><a href="${link("/portal/approvals")}" style="background:#111;color:#fff;padding:10px 18px;text-decoration:none;display:inline-block;">Review in portal →</a></p>
  `;
  await sendEmail({
    to: approvers.map((a) => a.email),
    subject: `Hours submitted for review — ${input.submitterName}`,
    html: shell("New hours pending review", body),
  });
}

export async function notifyHoursApproved(input: {
  submitterEmail: string;
  submitterName: string;
  reviewerName: string;
  hours: number;
  activityDate: string;
}) {
  const body = `
    <p>Hi ${escapeHtml(input.submitterName)},</p>
    <p>Your submission of <strong>${input.hours.toFixed(2)} hours</strong> on <strong>${escapeHtml(input.activityDate)}</strong> was approved by ${escapeHtml(input.reviewerName)}.</p>
    <p style="margin-top:20px;"><a href="${link("/portal/dashboard")}" style="background:#111;color:#fff;padding:10px 18px;text-decoration:none;display:inline-block;">View dashboard →</a></p>
    <p style="color:#666;margin-top:24px;">Thank you for your service.</p>
  `;
  await sendEmail({
    to: input.submitterEmail,
    subject: "Your volunteer hours were approved",
    html: shell("Hours approved", body),
  });
}

export async function notifyHoursRejected(input: {
  submitterEmail: string;
  submitterName: string;
  reviewerName: string;
  hours: number;
  activityDate: string;
  reason: string;
}) {
  const body = `
    <p>Hi ${escapeHtml(input.submitterName)},</p>
    <p>Your submission of <strong>${input.hours.toFixed(2)} hours</strong> on <strong>${escapeHtml(input.activityDate)}</strong> was rejected by ${escapeHtml(input.reviewerName)}.</p>
    <p><strong>Reason:</strong><br />${escapeHtml(input.reason)}</p>
    <p>You can edit and resubmit once.</p>
    <p style="margin-top:20px;"><a href="${link("/portal/dashboard")}" style="background:#111;color:#fff;padding:10px 18px;text-decoration:none;display:inline-block;">Open portal →</a></p>
  `;
  await sendEmail({
    to: input.submitterEmail,
    subject: "Your volunteer hours were rejected",
    html: shell("Hours rejected", body),
  });
}

export async function notifyRolePromoted(input: {
  targetEmail: string;
  targetName: string;
  fromRole: UserRole;
  toRole: UserRole;
  actorName: string;
}) {
  const body = `
    <p>Hi ${escapeHtml(input.targetName)},</p>
    <p>Your role has changed from <strong>${ROLE_LABEL[input.fromRole]}</strong> to <strong>${ROLE_LABEL[input.toRole]}</strong>, effective immediately.</p>
    <p>Change made by ${escapeHtml(input.actorName)}.</p>
    <p style="margin-top:20px;"><a href="${link("/portal/dashboard")}" style="background:#111;color:#fff;padding:10px 18px;text-decoration:none;display:inline-block;">Open portal →</a></p>
  `;
  await sendEmail({
    to: input.targetEmail,
    subject: `You are now a ${ROLE_LABEL[input.toRole]}`,
    html: shell("Role updated", body),
  });
}

export async function notifyNewMember(input: {
  memberName: string;
  memberEmail: string;
  branchId: string;
  regionId: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: leaders } = await supabase
    .from("users")
    .select("email, role, branch_id, region_id")
    .in("role", ["branch_leader", "region_leader"])
    .eq("is_active", true);
  const recipients = (leaders ?? [])
    .filter((u) => (u.role === "branch_leader" ? u.branch_id === input.branchId : u.region_id === input.regionId))
    .map((u) => u.email as string);
  if (recipients.length === 0) return;

  const body = `
    <p><strong>${escapeHtml(input.memberName)}</strong> (${escapeHtml(input.memberEmail)}) just joined your branch.</p>
    <p style="margin-top:20px;"><a href="${link("/portal/users")}" style="background:#111;color:#fff;padding:10px 18px;text-decoration:none;display:inline-block;">Open portal →</a></p>
  `;
  await sendEmail({
    to: recipients,
    subject: `New member joined — ${input.memberName}`,
    html: shell("New member joined", body),
  });
}

export async function notifyAccountLocked(input: { email: string; ip: string | null }) {
  const body = `
    <p>Someone tried to sign in to your Hands of Hope account 5 times in a row and failed.</p>
    <p>Your account is temporarily locked for <strong>15 minutes</strong> as a safety precaution.</p>
    <p>Origin IP: <code>${escapeHtml(input.ip ?? "unknown")}</code></p>
    <p>If this was not you, change your password once the lock clears.</p>
  `;
  await sendEmail({
    to: input.email,
    subject: "Your Hands of Hope account was locked",
    html: shell("Account locked (15-minute cooldown)", body),
  });
}
