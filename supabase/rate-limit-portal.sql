-- Failed-login rate limiter for the Volunteer Portal.
-- 5 failed attempts in a rolling 15-minute window locks the account for 15 minutes.

create table if not exists public.login_attempts (
  attempt_id  uuid primary key default gen_random_uuid(),
  email       citext not null,
  ip_address  inet,
  succeeded   boolean not null,
  created_at  timestamptz not null default now()
);

create index if not exists login_attempts_email_idx on public.login_attempts(email, created_at desc);

alter table public.login_attempts enable row level security;

-- No client reads; server actions use service-role or unauthenticated inserts via SECURITY DEFINER function.
drop policy if exists login_attempts_admin_read on public.login_attempts;
create policy login_attempts_admin_read on public.login_attempts
  for select using (public.is_admin_or_higher());

-- Purge > 24h old attempts periodically (optional pg_cron job).
create or replace function public.purge_login_attempts()
returns void language sql security definer set search_path = public as $$
  delete from public.login_attempts where created_at < now() - interval '24 hours'
$$;

-- Log an attempt without requiring auth. SECURITY DEFINER so anon can call it.
create or replace function public.log_login_attempt(
  p_email text,
  p_ip inet,
  p_succeeded boolean
) returns void language sql security definer set search_path = public as $$
  insert into public.login_attempts(email, ip_address, succeeded)
  values (lower(p_email), p_ip, p_succeeded);
$$;

grant execute on function public.log_login_attempt(text, inet, boolean) to anon, authenticated;

-- Count of recent failed attempts for an email.
create or replace function public.recent_failed_attempts(p_email text)
returns integer language sql security definer set search_path = public as $$
  select count(*)::int from public.login_attempts
   where email = lower(p_email)
     and succeeded = false
     and created_at > now() - interval '15 minutes'
$$;

grant execute on function public.recent_failed_attempts(text) to anon, authenticated;

-- Is the account locked right now?
create or replace function public.is_login_locked(p_email text)
returns boolean language sql security definer set search_path = public as $$
  select public.recent_failed_attempts(p_email) >= 5
$$;

grant execute on function public.is_login_locked(text) to anon, authenticated;

-- Clear failed-attempt records after a successful login.
create or replace function public.clear_failed_attempts(p_email text)
returns void language sql security definer set search_path = public as $$
  delete from public.login_attempts
   where email = lower(p_email) and succeeded = false;
$$;

grant execute on function public.clear_failed_attempts(text) to anon, authenticated;
