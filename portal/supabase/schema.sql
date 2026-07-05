-- Hands of Hope Outreach Volunteer Tracker
-- Postgres schema for Supabase
-- Run in Supabase SQL editor after project creation.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.user_role as enum (
  'super_admin',
  'admin',
  'region_leader',
  'branch_leader',
  'member'
);

create type public.hour_status as enum ('pending', 'approved', 'rejected');

create table public.regions (
  region_id        uuid primary key default gen_random_uuid(),
  name             text not null unique,
  region_leader_id uuid,
  created_by       uuid,
  created_at       timestamptz not null default now(),
  is_active        boolean not null default true
);

create table public.branches (
  branch_id        uuid primary key default gen_random_uuid(),
  name             text not null,
  school_location  text,
  region_id        uuid not null references public.regions(region_id) on delete restrict,
  branch_code_hash text not null,
  branch_leader_id uuid,
  created_by       uuid,
  created_at       timestamptz not null default now(),
  is_active        boolean not null default true,
  unique (region_id, name)
);

create table public.users (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  name         text not null,
  email        citext not null unique,
  role         public.user_role not null default 'member',
  branch_id    uuid references public.branches(branch_id) on delete set null,
  region_id    uuid references public.regions(region_id) on delete set null,
  mfa_enabled  boolean not null default false,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.regions
  add constraint regions_region_leader_fk
  foreign key (region_leader_id) references public.users(user_id) on delete set null;

alter table public.branches
  add constraint branches_branch_leader_fk
  foreign key (branch_leader_id) references public.users(user_id) on delete set null;

create table public.events (
  event_id     uuid primary key default gen_random_uuid(),
  branch_id    uuid not null references public.branches(branch_id) on delete cascade,
  region_id    uuid not null references public.regions(region_id) on delete restrict,
  created_by   uuid not null references public.users(user_id) on delete restrict,
  event_name   text not null,
  event_date   date not null,
  location     text,
  description  text,
  created_at   timestamptz not null default now(),
  is_active    boolean not null default true
);

create table public.hour_logs (
  log_id           uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(user_id) on delete cascade,
  event_id         uuid references public.events(event_id) on delete set null,
  branch_id        uuid references public.branches(branch_id) on delete set null,
  region_id        uuid references public.regions(region_id) on delete set null,
  hours            numeric(4,2) not null check (hours > 0 and hours <= 12),
  activity_date    date not null,
  description      text not null,
  proof_image_url  text,
  status           public.hour_status not null default 'pending',
  rejection_reason text,
  submitted_at     timestamptz not null default now(),
  reviewed_by      uuid references public.users(user_id) on delete set null,
  reviewed_at      timestamptz
);

create index hour_logs_user_idx    on public.hour_logs(user_id);
create index hour_logs_branch_idx  on public.hour_logs(branch_id);
create index hour_logs_region_idx  on public.hour_logs(region_id);
create index hour_logs_status_idx  on public.hour_logs(status);

create table public.event_signups (
  signup_id    uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events(event_id) on delete cascade,
  user_id      uuid not null references public.users(user_id) on delete cascade,
  signed_up_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table public.audit_log (
  audit_id         uuid primary key default gen_random_uuid(),
  actor_id         uuid references public.users(user_id) on delete set null,
  action           text not null,
  target_user_id   uuid references public.users(user_id) on delete set null,
  target_log_id    uuid references public.hour_logs(log_id) on delete set null,
  target_branch_id uuid references public.branches(branch_id) on delete set null,
  target_region_id uuid references public.regions(region_id) on delete set null,
  metadata         jsonb not null default '{}'::jsonb,
  ip_address       inet,
  created_at       timestamptz not null default now()
);

create index audit_log_actor_idx  on public.audit_log(actor_id);
create index audit_log_region_idx on public.audit_log(target_region_id);
create index audit_log_action_idx on public.audit_log(action);

-- Helper: fetch caller's role + scope. SECURITY DEFINER so RLS can call it.
create or replace function public.current_user_row()
returns public.users
language sql
stable
security definer
set search_path = public
as $$
  select * from public.users where user_id = auth.uid()
$$;
