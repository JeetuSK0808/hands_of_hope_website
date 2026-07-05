# Hands of Hope — Volunteer Hour Tracker
## Full Technical Specification
**Version 2.1 | Prepared for HOH Leadership**

---

## 1. System Overview

The HOH Volunteer Hour Tracker is a secure, role-gated web application that manages volunteer hour submission, approval, and reporting across all HOH branches internationally. It is designed for long-term sustainability, professional presentation, and organizational compliance with award and grant requirements.

It will be built by **Claude Code using the claude-opus-4-8 model**, and deployed as a subdomain of the existing HOH website (`portal.handsofhope.org` or `volunteer.handsofhope.org`), accessible via a "Volunteer Portal" button added to the existing site's navigation.

**Core goals:**
- Accurate, verifiable hour tracking across all branches and members worldwide
- Role-based access that mirrors HOH's real org structure including regional leadership
- Professional PDF exports usable for the Gold Award and grant applications
- Audit integrity: every approval is logged and traceable

---

## 2. Role Hierarchy & Permissions Matrix

### 2.1 Roles (Highest → Lowest)

| Role | Who It Covers |
|---|---|
| **Super Admin** | Co-Founders (Daksh, Shubham) |
| **Admin** | CDOs, CMO, CTO, senior org leadership |
| **Region Leader** | Leads for geographic regions (US, Canada, Chile, East US, etc.) |
| **Branch Leader** | Individual branch leads (per school/chapter within a region) |
| **Member** | General volunteers |

### 2.2 Permissions Matrix

| Capability | Super Admin | Admin | Region Leader | Branch Leader | Member |
|---|---|---|---|---|---|
| Add / manage Admins | ✅ | ❌ | ❌ | ❌ | ❌ |
| Add / manage Region Leaders | ✅ | ✅ | ❌ | ❌ | ❌ |
| Add Branches (within region) | ✅ | ✅ | ✅ (own region) | ❌ | ❌ |
| Delete Branches (within region) | ✅ | ✅ | ✅ (own region) | ❌ | ❌ |
| Add Branch Leaders (within region) | ✅ | ✅ | ✅ (own region) | ❌ | ❌ |
| Promote users | ✅ | ✅ | ✅ (up to Branch Leader, own region) | ❌ | ❌ |
| Create Events | ✅ | ✅ | ✅ | ✅ | ❌ |
| See all events (org-wide) | ✅ | ✅ | Own region only | Own branch only | Own branch only |
| Log Hours | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit Photo Proof | ❌ exempt | ❌ exempt | ❌ exempt | ❌ exempt | ✅ Required |
| Approve Member Hours | ✅ | ✅ | ✅ (own region) | ✅ (own branch) | ❌ |
| Approve Branch Leader Hours | ✅ | ✅ | ✅ (own region) | ❌ | ❌ |
| Approve Region Leader Hours | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve Admin Hours | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Super Admin Hours | Mutual Approval* | ❌ | ❌ | ❌ | ❌ |
| Export own PDF | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bulk CSV/PDF Export | ✅ | ✅ | ✅ (own region) | ❌ | ❌ |
| View Audit Log | ✅ | ✅ | Own region actions only | ❌ | ❌ |

> *Super Admin hour approval: Each co-founder's hours must be approved by the other co-founder. If only one Super Admin exists, hours are flagged for senior admin review. This prevents self-approval conflicts in formal documentation.

### 2.3 Promotion Paths

```
Member → Branch Leader (within same branch/region)
Member → Region Leader (Admin or Super Admin only)
Branch Leader → Region Leader (Admin or Super Admin only)
Region Leader → Admin (Super Admin only)
Admin → Super Admin (Super Admin only)
```

- A Region Leader can promote Members to Branch Leader within their own region only.
- A Region Leader cannot promote to Region Leader or Admin — that requires Admin+.
- You cannot promote someone to a role equal to or above your own.
- Demotions follow the same permission rules.

### 2.4 Region Scope

Each Region Leader is scoped to exactly one region. Regions are created and assigned by Admins or Super Admins. Example regions:
- `US Southeast`
- `US Northeast`
- `Canada`
- `Chile`
- `Denmark`

A branch belongs to exactly one region. A Region Leader sees only data from branches within their region.

---

## 3. Authentication & Security

### 3.1 Sign Up Flow (Members and Branch Leaders)

```
[Enter name, email, password]
  → Email verification link sent
  → Verified → Prompted to enter Branch Code
  → Code validated → Assigned to branch as Member
  → Branch Leader + Region Leader notified of new member
```

### 3.2 Provisioned Accounts (Admin, Region Leader, Super Admin)

These roles are **never** created via public sign-up. They are provisioned from the admin panel via an email invite link (token-based, expires in 48 hours). The invited user sets their password and MFA on first login. Branch code flow is skipped entirely.

**Branch Code behavior:**
- Entered once during onboarding only.
- Stored on the user's account permanently after first entry.
- Not re-entered on future logins.
- Codes set per-branch by Region Leaders, Admins, or Super Admins. Can be rotated any time.

### 3.3 Login Flow

```
[Email + Password]
  → MFA prompt (TOTP via authenticator app OR email OTP)
  → Session created
  → Role badge displayed on landing screen
  → Redirected to role-specific dashboard
```

### 3.4 Account Protection Rules

- **No direct URL access to another user's data.** All data fetches are enforced by Supabase Row Level Security (RLS) at the database level — unauthorized queries are rejected by the DB itself, regardless of URL manipulation.
- **Session tokens** are HTTP-only cookies. Never exposed in the URL or localStorage.
- **Rate limiting:** 5 failed login attempts → 15-minute lockout + email alert to the account owner.
- **MFA is mandatory** for Admin, Region Leader, and Super Admin. Optional but encouraged for Branch Leaders and Members.
- Password minimum: 8+ characters, 1 uppercase, 1 number, 1 special character.
- Email change requires re-verification of the new address.
- Account deletion: Super Admin only — soft delete (all data retained for audit history).
- HTTPS enforced on all routes. No HTTP fallback.

---

## 4. Data Models

### 4.1 Users
```
user_id         (uuid, PK)
name            (text)
email           (text, unique)
role            (enum: super_admin | admin | region_leader | branch_leader | member)
branch_id       (FK → branches, nullable — null for admin+ and region leaders)
region_id       (FK → regions, nullable — set for region_leaders, null for branch-level and below)
created_at      (timestamp)
is_active       (boolean)
mfa_enabled     (boolean)
```

### 4.2 Regions
```
region_id          (uuid, PK)
name               (text)           -- e.g., "Canada", "US Southeast"
region_leader_id   (FK → users, nullable)
created_by         (FK → users)
created_at         (timestamp)
is_active          (boolean)
```

### 4.3 Branches
```
branch_id          (uuid, PK)
name               (text)
school_location    (text)
region_id          (FK → regions)
branch_code        (text, hashed)
branch_leader_id   (FK → users)
created_by         (FK → users)
created_at         (timestamp)
is_active          (boolean)
```

### 4.4 Events
```
event_id        (uuid, PK)
branch_id       (FK → branches)
region_id       (FK → regions)    -- denormalized for fast filtering
created_by      (FK → users)
event_name      (text)
event_date      (date)
location        (text)
description     (text)
created_at      (timestamp)
is_active       (boolean)
```

### 4.5 Hour Logs
```
log_id              (uuid, PK)
user_id             (FK → users)
event_id            (FK → events, nullable — null for manual entries)
branch_id           (FK → branches)
region_id           (FK → regions)     -- denormalized for fast filtering
hours               (decimal)
date                (date)
description         (text)
proof_image_url     (text, nullable)   -- null for branch leader and above
status              (enum: pending | approved | rejected)
rejection_reason    (text, nullable)
submitted_at        (timestamp)
reviewed_by         (FK → users, nullable)
reviewed_at         (timestamp, nullable)
```

### 4.6 Audit Log
```
audit_id            (uuid, PK)
actor_id            (FK → users)
action              (text)     -- e.g., "approved_hours", "promoted_user", "created_branch"
target_user_id      (FK → users, nullable)
target_log_id       (FK → hour_logs, nullable)
target_branch_id    (FK → branches, nullable)
target_region_id    (FK → regions, nullable)
metadata            (jsonb)    -- extra context, previous values, etc.
timestamp           (timestamp)
ip_address          (text)
```

### 4.7 Event Signups
```
signup_id       (uuid, PK)
event_id        (FK → events)
user_id         (FK → users)
signed_up_at    (timestamp)
```

---

## 5. Feature Specifications

### Feature 1 — Role-Specific Dashboards

**Member Dashboard:**
- Stats bar: Last Week | Last Month | All Time total hours
- Hour log feed with status badges (Pending / Approved / Rejected)
- Upcoming events in their branch
- "Log Hours" button (primary CTA)
- "Export My Hours (PDF)" button

**Branch Leader Dashboard:**
- Everything in Member view, plus:
- Pending approvals queue (members awaiting review)
- "Create Event" button
- Branch roster summary with total member count
- Branch total hours this month

**Region Leader Dashboard:**
- Regional stats panel (total hours across all branches in their region)
- Branch-by-branch breakdown table (within region)
- All pending Branch Leader hour submissions (within region)
- Create Branch / Add Branch Leader tools (scoped to own region)
- Regional bulk export panel
- Regional audit log (their region only)

**Admin Dashboard:**
- Org-wide stats panel (all regions, all branches)
- Region-by-region breakdown table
- All pending Region Leader hour submissions
- Create Region / Add Region Leader tools
- Full bulk export panel
- Full audit log viewer

**Super Admin Dashboard:**
- Everything in Admin view, plus:
- Add/manage Admins
- Promote/demote any user at any level
- System health overview (total users, branches, regions, hours all time)
- Unfiltered full audit log

---

### Feature 2 — Hour Logging

**Submission flow:**
1. User clicks **Log Hours**
2. Form appears:
   - Event dropdown (events from their branch in the past 60 days) OR Manual Entry toggle
   - Date
   - Hours (decimal: 1.5, 2.5, etc.)
   - Description of activity
   - Photo upload (required for Members only — compressed client-side to ≤2MB)
3. Submitted → status: **Pending**
4. Approver notified via in-app + email

**Approval routing:**
- Member's hours → Branch Leader approves
- Branch Leader's hours → Region Leader OR Admin approves
- Region Leader's hours → Admin or Super Admin approves
- Admin's hours → Super Admin approves
- Super Admin's hours → mutual approval (other co-founder)

**Approval actions:**
- Approve → status: Approved, submitter notified
- Reject → must enter rejection reason → status: Rejected, submitter notified with reason
- Rejected submissions can be edited and resubmitted once

**Hour caps per submission:**
- Max 12 hours per entry
- Members needing to log more split into two entries (prevents unchecked bulk entries)

**Photo storage policy:**
- Compressed client-side before upload (≤2MB)
- Stored at: `/proof/{region_id}/{branch_id}/{user_id}/{log_id}`
- Auto-deleted 60 days post-approval
- Rejected photos deleted immediately when window closes
- This keeps Supabase Storage usage well within free tier permanently

---

### Feature 3 — Event System

**Creating events:**
- Branch Leaders (and above) can create events for their branch
- Fields: event name, date, location, description
- Visible to all members in that branch immediately

**Member interaction:**
- Members see upcoming events in their branch
- Can sign up (optional, tracked)
- When logging hours: dropdown shows events from their branch (past 60 days)
- Selecting an event pre-fills location and date
- "Manual entry" option always available

**Admin / Region Leader event visibility:**
- Region Leaders: see all events across their region in a filterable table
- Admins / Super Admins: see all events org-wide, filterable by region and branch

---

### Feature 4 — PDF Export (Individual)

Available to every role via the **"Export My Hours"** button.

**PDF layout:**
- Header: HOH logo + "Volunteer Hours Report"
- Member name, branch, region, role, report date
- Hours table:

| Date | Event / Activity | Location | Hours |
|------|-----------------|----------|-------|
| ...  | ...             | ...      | ...   |

- Summary block:
  - Hours Last 7 Days
  - Hours Last 30 Days
  - Total Hours (All Time)
- Signature block at bottom:
  > **Co-Founder Approval**
  > Daksh Kaushal _________________ Date _______
  > Shubham Trivedi ________________ Date _______

**Format:** Letter (8.5 × 11"), HOH brand colors, clean sans-serif, print-ready.
**Tech:** Client-side via `jsPDF` + `jspdf-autotable` — zero server cost.

---

### Feature 5 — Bulk Export (Admin, Region Leader, Super Admin)

Located in the **Reports** panel.

**Scope:**
- Region Leaders export their region only
- Admins and Super Admins export any/all regions

**Options:**
- Filter by region, branch, date range
- Format: CSV or compiled multi-page PDF

**CSV columns:** Name, Email, Region, Branch, Event, Date, Hours, Status, Approved By, Approval Date

**PDF:** Same template as individual exports, one member per page, compiled into one document.

**Use case:** Grant applications, award submissions, board reports.

---

### Feature 6 — Audit Log

**Who sees what:**
- Region Leaders: see actions taken within their region only
- Admins + Super Admins: full unfiltered log

**Logged automatically:**
- Hour submitted / approved / rejected (actor, target, reason)
- User promoted / demoted (actor, user, from role, to role)
- Branch created / deleted (actor, branch, region)
- Region created (actor)
- Event created (actor, branch)
- Branch code rotated (actor, branch)
- User account created / deactivated (actor)
- Bulk export downloaded (actor, scope, date range)
- Failed login attempts (email, IP, timestamp)

**Display:** Filterable table by actor, action type, region, branch, date range. Exportable as CSV.

---

### Feature 7 — Notifications

**Email (via Resend — 3,000/month free):**

| Trigger | Recipient |
|---|---|
| Member submits hours | Branch Leader |
| Branch Leader submits hours | Region Leader + Admin |
| Region Leader submits hours | Admin + Super Admin |
| Hours approved | Submitter |
| Hours rejected (with reason) | Submitter |
| User promoted | Promoted user |
| New member joins branch | Branch Leader + Region Leader |
| Account created (invite accepted) | New user (welcome email) |
| Login attempt locked | Account owner |

**In-app:** Bell icon in nav — unread count badge, dismissable notification feed.

---

### Feature 8 — Sign Up / Login Pages

**Login page:**
- Split layout: HOH branding/mission statement on left, form on right
- Email + password fields with "Forgot password?" link
- MFA step loads inline after credentials verify (no full page reload)
- Specific error messages: "Incorrect password", "Email not found", "Account locked — check your email"

**Sign Up page (Members / Branch Leaders):**
- Name, email, password + confirm, branch code
- "What is a branch code?" tooltip with explanation
- Password strength indicator (live)
- Submit → email verification sent → in-page banner: "Check your inbox"
- Invalid branch code → inline error: "Code not recognized. Contact your Branch Leader or Regional Leader."

**Admin / Region Leader / Super Admin:** Provisioned via secure email invite only. No public-facing sign-up path exists for these roles.

---

## 6. Website Integration

### How the Portal Connects to the Existing HOH Website

The volunteer tracker is deployed as a separate Next.js app on Vercel, served from a subdomain of the existing HOH domain. Since HOH already owns the domain, this requires only a DNS update — no domain purchase needed.

**Recommended subdomain:** `portal.handsofhope.org`

**DNS setup (one-time, ~5 minutes):**
- Add a CNAME record in Cloudflare/domain registrar:
  - Name: `portal`
  - Target: `cname.vercel-dns.com`
- Add the custom domain in Vercel project settings

**"Volunteer Portal" button on main website:**
- Placed in the top navigation bar (top-right is standard, matches your instinct)
- Styled to match the existing site's nav — can be a filled gold button to stand out from plain nav links
- On click: navigates to `portal.handsofhope.org` (full redirect, not an iframe)
- Button label: **"Volunteer Portal"** or **"Member Portal"** — your call
- Button style: white text on `#B5478A` (HOH purple) fill — matches the "Get involved" CTA already on the site. Do not invent a new style; match what's already there.

**Design continuity:**
- The portal login page should echo HOH's website branding (same logo, same color palette) so the transition feels seamless rather than landing on a foreign-looking app
- The footer of the portal can include "Back to handsofhope.org" link

**Implementation note for Claude Code:** The main HOH website and the portal are two separate codebases/deployments. The website just needs a `<a href="https://portal.handsofhope.org">Volunteer Portal</a>` link in its nav — no shared backend or auth context between the two.

---

## 7. UI / UX Design Spec

### 7.1 Brand Source

Colors and visual language are derived directly from the HOH logo and handsofhopeoutreach.org. The website is editorial, white-space-forward, typographically precise, and minimal in color use — not dark, not gold-accented, not navy. The portal must feel like it belongs to the same visual family as the main site.

### 7.2 Color Palette (from logo + website)

| Token | Hex | Source & Use |
|---|---|---|
| `--hoh-purple` | `#B5478A` | Logo flower — primary brand accent. CTAs, active states, role badges, links |
| `--hoh-blue` | `#7DC8E3` | Logo stem/leaf — secondary accent. Info badges, highlights, hover states |
| `--hoh-gray-hand` | `#C8C8C8` | Logo hand — subtle borders, dividers, inactive elements |
| `--hoh-white` | `#FFFFFF` | Page and card backgrounds |
| `--hoh-off-white` | `#F7F7F7` | Page surface behind cards, alternating table rows |
| `--hoh-ink` | `#111111` | Primary text — near-black, not pure black (matches website body text) |
| `--hoh-ink-muted` | `#555555` | Secondary/supporting text, captions, metadata |
| `--hoh-border` | `#E0E0E0` | Card borders, table lines, input outlines |
| `--status-approved` | `#2A9D5C` | Approved status badge — green, not neon |
| `--status-rejected` | `#C0392B` | Rejected status badge |
| `--status-pending` | `#E08A00` | Pending amber |

> **Do not use navy, gold, or dark backgrounds as primary surfaces.** The HOH brand is clean and light. Dark panels are permitted only as small accents (e.g., footer, sidebar bottom section), never as full-page backgrounds.

### 7.3 Typography (matching website language)

The HOH website uses a refined, editorial typographic approach with large display text and small supporting metadata. Mirror this:

- **Display / Hero headings:** Serif or high-weight sans — large, confident. Website uses something like `Playfair Display` or `Cormorant` for editorial feel, or a heavy `Inter`. Match whichever font the main site uses (inspect `handsofhopeoutreach.org` to confirm and use the same).
- **Body:** Clean sans-serif, weight 400/500. `Inter` or equivalent.
- **Data / tables / numbers:** `JetBrains Mono` or `Geist Mono` — for hours, totals, IDs, timestamps.
- **Labels / eyebrows:** All-caps small text with letter-spacing, like the website's `"Atlanta · 501(c)(3)"` and `"01 · of 03"` patterns. Use `·` as a separator, not `|` or `/`.

### 7.4 Layout & Component Rules

- **White background, dark ink, purple accent.** That is the hierarchy. Nothing else.
- Sidebar navigation: white background with `--hoh-border` right border. Active nav item gets `--hoh-purple` left bar + purple text.
- Cards: white background, `--hoh-border` border, `4px` border radius (tighter than typical dashboards — matches the site's precise aesthetic), very subtle box shadow.
- Tables: white background, `--hoh-border` row dividers, `--hoh-off-white` alternating rows.
- Primary buttons: `--hoh-purple` fill, white text. Hover: darken 10%.
- Secondary buttons: white fill, `--hoh-purple` border + text.
- All tables paginated at 20 rows.
- Mobile-responsive down to 375px.
- Use Roman numeral section labels (I., II., III.) and dot-notation metadata (`"Last 7 days · 4.5 hrs"`) to echo the editorial style of the main site.

### 7.5 Role UI Differentiation

Every role shares the same core white/ink/purple palette. Differentiation comes from content and layout, not color swaps:

- **Member:** Minimal. Personal stats bar at top, hour log feed below. No approval tools visible anywhere in the DOM.
- **Branch Leader:** Same layout + approval queue card below stats. Small `·` labeled role badge in sidebar: `"Branch Leader · Innovation Academy"`.
- **Region Leader:** Stats panel shows region-wide totals. Branch selector dropdown in top bar scoped to their region. Regional events table visible.
- **Admin:** Org-wide view. Region selector unrestricted. Sidebar has "Reports" and "Audit Log" sections.
- **Super Admin:** Admin layout + "System" section at the very bottom of the sidebar (below a subtle horizontal rule). Slightly bolder role badge. Access to user management and full audit log.

### 7.6 Login & Sign-Up Visual Design

- Split-screen layout: **left panel** is `--hoh-purple` with white HOH logo + tagline ("Compassion, in action."). **Right panel** is white with the form.
- This is the one place the purple fills a full panel — makes the portal's entry point feel branded without being heavy throughout the app.
- Form inputs: white background, `--hoh-border` outline, `--hoh-purple` focus ring.
- "Volunteer Portal" button on main site nav: white text on `--hoh-purple` fill, matching the site's "Get involved" CTA button style exactly.

---

## 8. Tech Stack

| Layer | Tool | Reason |
|---|---|---|
| Builder | Claude Code (claude-opus-4-8) | Primary build tool |
| Frontend | Next.js (React) | SSR, fast page loads, great auth integration |
| Styling | Tailwind CSS | Consistent, rapid UI development |
| Auth | Supabase Auth | MFA built-in, RLS, invite links, magic links |
| Database | Supabase Postgres | Relational, RLS for role security at DB level |
| File Storage | Supabase Storage | Proof photo uploads with auto-delete policy |
| Email | Resend | 3,000 emails/month free |
| PDF Generation | jsPDF + jspdf-autotable | Client-side, zero server cost |
| CSV Export | PapaParse | Client-side, zero cost |
| Hosting | Vercel | Free tier for Next.js, custom domain support |

---

## 9. Cost Analysis

### Free Tier Assessment for 200+ International Users

| Service | Free Limit | Expected Usage (200 users, 3 years) |
|---|---|---|
| Supabase DB | 500MB | ~15–25MB (text data only — tiny) |
| Supabase Storage | 1GB | ~150–300MB (with 60-day photo deletion policy) |
| Supabase Auth | 50,000 MAU | 200–400 users ✅ |
| Vercel Hosting | Unlimited hobby | ✅ |
| Resend Email | 3,000/month | ~600–1,200/month ✅ |

**Conclusion: The free stack fully supports 200 international users with years of headroom.** 200 users generating volunteer hour log entries produces a negligible amount of database storage — we're talking kilobytes per user per year for text records. The photo deletion policy keeps storage in check.

### When You'd Actually Need to Pay

Only two scenarios trigger cost:
1. HOH grows past ~800–1,000 active monthly users (Supabase free caps at 50K MAU — you'd need 25× current scale to hit it)
2. You disable the 60-day photo deletion policy AND have very high submission volume

If either happens, Supabase Pro is $25/month — but that's a recurring cost, not a one-time cost, and it's a problem for a much larger HOH than exists today.

### On the "One-Time Cost" Request

Managed database services (Supabase, PlanetScale, Railway, etc.) are all subscription-based by nature — there is no truly "one-time" managed DB. The only genuinely one-time database option would be self-hosting a Postgres instance on a VPS (e.g., a DigitalOcean Droplet), but that trades the cost for ongoing technical maintenance, which isn't worth it at HOH's scale.

**Recommendation: Stay on free tier. It comfortably handles your use case for years.**

### Domain

Already owned. No action needed — just add a CNAME DNS record for `portal.handsofhope.org` pointing to Vercel.

### Projected Cost: **$0/month indefinitely for current and near-future scale**

---

## 10. Build Roadmap (for Claude Code)

### Phase 1 — Auth & Core Structure (Days 1–5)
- Supabase project setup (DB schema, RLS policies, regions/branches/users)
- Sign up, login, MFA, email verification
- Branch code onboarding flow
- Invite-based provisioning for Admin+ roles
- Session handling + role-gated route protection

### Phase 2 — Role Dashboards (Days 6–10)
- Member dashboard
- Branch Leader dashboard + approvals queue
- Region Leader dashboard + regional views
- Admin + Super Admin dashboards
- Promotion / demotion system

### Phase 3 — Hour Logging & Events (Days 11–15)
- Hour submission form with photo upload
- Approval workflow (Pending → Approved/Rejected with notifications)
- Event creation + branch event feed
- Event-linked hour logging (dropdown)

### Phase 4 — Exports & Reports (Days 16–19)
- Individual PDF export (jsPDF)
- Bulk CSV export
- Bulk PDF export (compiled)
- Regional audit log
- Full audit log

### Phase 5 — Polish & Launch (Days 20–22)
- Mobile responsiveness pass
- Error states + empty states
- Email notification setup (Resend)
- Portal subdomain DNS + Vercel custom domain
- "Volunteer Portal" button added to HOH main website nav
- Final UI polish to HOH branding

---

## 11. Open Questions (Decide Before Build Starts)

1. **Super Admin mutual approval:** Should co-founders mutually approve each other's hours, or are Super Admin hours auto-approved? *Recommendation: mutual approval — cleaner for formal documentation.*
2. **Branch code rotation:** Who rotates branch codes, and how often? *Recommendation: Region Leaders rotate theirs per semester.*
3. **Multi-branch membership:** Can a member belong to branches in multiple regions (e.g., a student who relocated)? Or are they locked to one branch?
4. **Minimum hours per submission:** Is there a floor (e.g., 0.25 or 0.5 hours minimum)?
5. **System email sender:** What address sends notification emails? `noreply@handsofhope.org` requires a DNS TXT record (SPF/DKIM) via Resend — straightforward but needs to be done.
6. **Region Leader scope:** Can a Region Leader exist without being assigned to a region yet (pending assignment), or does the role require a region at creation?
7. **Portal subdomain preference:** `portal.handsofhope.org` vs `volunteer.handsofhope.org` vs something else?

---

*Document prepared for Hands of Hope internal use. Version 2.0.*
*Changes from v2.0: Section 7 (UI/UX Design Spec) completely replaced with accurate colors from HOH logo (#B5478A purple, #7DC8E3 blue, white/off-white backgrounds, near-black ink) and editorial design language derived from handsofhopeoutreach.org. Previous navy/gold palette removed entirely.*
