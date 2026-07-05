# Hands of Hope Outreach — Volunteer Portal

Next.js 16 (App Router) + Supabase (Auth, Postgres, Storage) scaffold implementing the spec in `../HOH_Volunteer_Tracker_Spec (1).md`.

This is a **separate deployment** from the main marketing site. Intended for `portal.handsofhopeoutreach.com`.

---

## What's built

- **Schema, RLS, and audit triggers** — production-ready SQL in `supabase/`
- **Auth flow** — sign-up, email verification (via Supabase), login, sign-out
- **Onboarding** — post-verification branch-code join page (bcrypt-hashed codes)
- **Role-gated app shell** — sidebar hides sections above the user's role
- **Member dashboard** — 7/30/all-time stats, recent submissions
- **Log hours** — with photo upload (members only), 12-hour cap, event dropdown (past 60 days)
- **Approvals queue** — Branch Leader+ approve/reject with reason, role-routed authorization
- **Events page** — read-only listing (create UI stubbed)
- **Reports/Audit pages** — role-gated shells (bulk export/log wiring stubbed)
- **Session refresh middleware** — handles Supabase cookie rotation

## What still needs your hands

These require **your accounts/credentials** or product decisions:

1. **Create the Supabase project.** Run the SQL in this order:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
   - `supabase/triggers.sql`
2. **Create a `proof` storage bucket** (private) in Supabase. Add a policy so authenticated users can upload to their own `{region_id}/{branch_id}/{user_id}/*` prefix.
3. **Fill `.env.local`** from `.env.example` with the Supabase URL, anon key, and service-role key.
4. **Provision Super Admins** manually via the Supabase dashboard: after creating auth users, `UPDATE public.users SET role = 'super_admin' WHERE email = '…'`.
5. **Seed regions and branches.** Branch codes are stored as bcrypt hashes — hash with a cost of 10 before insert. Example SQL:
   ```sql
   insert into regions (name) values ('US Southeast');
   insert into branches (name, region_id, branch_code_hash) values (
     'Innovation Academy',
     (select region_id from regions where name = 'US Southeast'),
     crypt('INN-ATL-2026', gen_salt('bf'))
   );
   ```
   (Requires `pgcrypto`, already enabled by schema.)
6. **DNS + Vercel custom domain** for `portal.handsofhopeoutreach.com`. Add a CNAME to `cname.vercel-dns.com`.
7. **Add the "Volunteer Portal" link** to the main marketing site's `NavBar` once the portal domain is live.

## Still to implement (spec items with clear TODOs in code)

- MFA enrollment + prompt UI (Supabase Auth supports TOTP via `supabase.auth.mfa.*`)
- Event creation UI for Branch Leader+
- Photo compression client-side (target < 2MB)
- 60-day proof-photo auto-deletion (Supabase scheduled function)
- Individual PDF export button (`jsPDF` + `jspdf-autotable` — deps installed)
- Bulk CSV / compiled PDF export (Region Leader+ / Admin+)
- In-app notification bell + feed
- Rate limiting on `/login` (5 fails → 15-min lockout)
- Super Admin mutual-approval flow for their own hours

## Local dev

```bash
cd portal
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

## Model note

Spec references "claude-opus-4-8" — that model does not exist. Built with claude-opus-4-7 (1M context).
