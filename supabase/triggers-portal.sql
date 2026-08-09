-- Audit + auth triggers. Idempotent — safe to re-run.

create or replace function public.log_hour_status_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    insert into public.audit_log(
      actor_id, action, target_user_id, target_log_id,
      target_branch_id, target_region_id, metadata
    ) values (
      auth.uid(),
      case new.status
        when 'approved' then 'approved_hours'
        when 'rejected' then 'rejected_hours'
        else 'changed_hour_status'
      end,
      new.user_id, new.log_id, new.branch_id, new.region_id,
      jsonb_build_object(
        'from', old.status, 'to', new.status,
        'hours', new.hours, 'reason', new.rejection_reason
      )
    );
  end if;
  return new;
end $$;

drop trigger if exists hour_logs_audit on public.hour_logs;
create trigger hour_logs_audit
  after update on public.hour_logs
  for each row execute function public.log_hour_status_change();

create or replace function public.log_role_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role then
    insert into public.audit_log(actor_id, action, target_user_id, metadata)
    values (
      auth.uid(), 'changed_role', new.user_id,
      jsonb_build_object('from', old.role, 'to', new.role)
    );
  end if;
  return new;
end $$;

drop trigger if exists users_role_audit on public.users;
create trigger users_role_audit
  after update on public.users
  for each row execute function public.log_role_change();

-- New sign-ups: mirror auth.users into public.users as 'member'.
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users(user_id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.email,
    'member'
  )
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
