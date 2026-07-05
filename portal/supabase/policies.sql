-- Row Level Security for Hands of Hope Volunteer Tracker
-- Apply after schema.sql. Every table is default-deny.

alter table public.users        enable row level security;
alter table public.regions      enable row level security;
alter table public.branches     enable row level security;
alter table public.events       enable row level security;
alter table public.hour_logs    enable row level security;
alter table public.event_signups enable row level security;
alter table public.audit_log    enable row level security;

-- Convenience predicates
create or replace function public.is_admin_or_higher()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.users
    where user_id = auth.uid() and role in ('admin','super_admin')
  )
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.users
    where user_id = auth.uid() and role = 'super_admin'
  )
$$;

create or replace function public.same_region_leader(target_region uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.users
    where user_id = auth.uid()
      and role = 'region_leader'
      and region_id = target_region
  )
$$;

create or replace function public.same_branch_leader(target_branch uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.users
    where user_id = auth.uid()
      and role = 'branch_leader'
      and branch_id = target_branch
  )
$$;

-- USERS: everyone reads self; admins see all; region leaders see their region;
-- branch leaders see their branch.
create policy users_self_read on public.users
  for select using (user_id = auth.uid());

create policy users_admin_read on public.users
  for select using (public.is_admin_or_higher());

create policy users_region_read on public.users
  for select using (public.same_region_leader(region_id));

create policy users_branch_read on public.users
  for select using (public.same_branch_leader(branch_id));

create policy users_self_update on public.users
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid() and role = (select role from public.users where user_id = auth.uid()));

create policy users_admin_write on public.users
  for all using (public.is_admin_or_higher()) with check (public.is_admin_or_higher());

-- REGIONS: read for authenticated; write for admin+.
create policy regions_read on public.regions
  for select using (auth.uid() is not null);

create policy regions_admin_write on public.regions
  for all using (public.is_admin_or_higher()) with check (public.is_admin_or_higher());

-- BRANCHES: read scoped by membership; region leaders may write within their region.
create policy branches_read on public.branches
  for select using (
    auth.uid() is not null
    and (
      public.is_admin_or_higher()
      or public.same_region_leader(region_id)
      or branch_id in (select branch_id from public.users where user_id = auth.uid())
    )
  );

create policy branches_region_write on public.branches
  for all using (
    public.is_admin_or_higher() or public.same_region_leader(region_id)
  ) with check (
    public.is_admin_or_higher() or public.same_region_leader(region_id)
  );

-- EVENTS: same-branch or higher may read; branch-leader+ may create.
create policy events_read on public.events
  for select using (
    public.is_admin_or_higher()
    or public.same_region_leader(region_id)
    or branch_id in (select branch_id from public.users where user_id = auth.uid())
  );

create policy events_leader_write on public.events
  for all using (
    public.is_admin_or_higher()
    or public.same_region_leader(region_id)
    or public.same_branch_leader(branch_id)
  ) with check (
    public.is_admin_or_higher()
    or public.same_region_leader(region_id)
    or public.same_branch_leader(branch_id)
  );

-- HOUR LOGS: own always; branch leader sees branch; region leader sees region; admin sees all.
create policy hour_logs_self on public.hour_logs
  for select using (user_id = auth.uid());

create policy hour_logs_branch on public.hour_logs
  for select using (public.same_branch_leader(branch_id));

create policy hour_logs_region on public.hour_logs
  for select using (public.same_region_leader(region_id));

create policy hour_logs_admin on public.hour_logs
  for select using (public.is_admin_or_higher());

create policy hour_logs_insert_self on public.hour_logs
  for insert with check (user_id = auth.uid() and status = 'pending');

create policy hour_logs_update_self_if_pending on public.hour_logs
  for update using (user_id = auth.uid() and status = 'pending')
  with check (user_id = auth.uid() and status = 'pending');

-- Approvers write status. Server enforces role→target-role routing.
create policy hour_logs_approve on public.hour_logs
  for update using (
    public.is_admin_or_higher()
    or public.same_region_leader(region_id)
    or public.same_branch_leader(branch_id)
  ) with check (
    public.is_admin_or_higher()
    or public.same_region_leader(region_id)
    or public.same_branch_leader(branch_id)
  );

-- EVENT SIGNUPS: user manages own; leaders read scope.
create policy event_signups_self on public.event_signups
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy event_signups_leader_read on public.event_signups
  for select using (
    public.is_admin_or_higher()
    or exists (
      select 1 from public.events e
      where e.event_id = event_signups.event_id
        and (public.same_region_leader(e.region_id) or public.same_branch_leader(e.branch_id))
    )
  );

-- AUDIT LOG: admins full; region leaders their region only.
create policy audit_read_admin on public.audit_log
  for select using (public.is_admin_or_higher());

create policy audit_read_region on public.audit_log
  for select using (public.same_region_leader(target_region_id));

-- Nobody writes audit rows through the API. Triggers write via SECURITY DEFINER.
