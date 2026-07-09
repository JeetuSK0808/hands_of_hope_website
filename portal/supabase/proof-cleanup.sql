-- Proof-photo lifecycle policy for the Volunteer Portal.
-- Spec: photos auto-deleted 60 days post-approval; rejected photos deleted immediately.
--
-- Implementation: a SECURITY DEFINER function walks hour_logs, deletes the
-- underlying storage.objects rows, and clears the proof_image_url pointer.
-- Call it hourly via pg_cron (dashboard: Database → Extensions → pg_cron).

create or replace function public.expire_proof_photos()
returns table (deleted_count integer, cleared_count integer)
language plpgsql
security definer
set search_path = public, storage
as $$
declare
  del_count int := 0;
  clr_count int := 0;
begin
  -- 1) Rejected photos: delete immediately.
  with victims as (
    select log_id, proof_image_url
      from public.hour_logs
     where status = 'rejected'
       and proof_image_url is not null
  ),
  removed as (
    delete from storage.objects o
     using victims v
     where o.bucket_id = 'proof' and o.name = v.proof_image_url
     returning v.log_id
  )
  update public.hour_logs h
     set proof_image_url = null
    from removed r
   where h.log_id = r.log_id;
  get diagnostics clr_count = row_count;

  -- 2) Approved > 60 days: delete photo.
  with victims as (
    select log_id, proof_image_url
      from public.hour_logs
     where status = 'approved'
       and proof_image_url is not null
       and reviewed_at is not null
       and reviewed_at < now() - interval '60 days'
  ),
  removed as (
    delete from storage.objects o
     using victims v
     where o.bucket_id = 'proof' and o.name = v.proof_image_url
     returning v.log_id
  )
  update public.hour_logs h
     set proof_image_url = null
    from removed r
   where h.log_id = r.log_id;
  get diagnostics del_count = row_count;

  return query select del_count, clr_count;
end $$;

grant execute on function public.expire_proof_photos() to service_role;

-- Optional: schedule hourly via pg_cron. Uncomment after enabling pg_cron.
--
-- select cron.schedule(
--   'hoh-proof-cleanup-hourly',
--   '17 * * * *',
--   $$ select public.expire_proof_photos(); $$
-- );

-- Also purge stale login-attempt rows daily.
-- select cron.schedule(
--   'hoh-purge-login-attempts',
--   '5 3 * * *',
--   $$ select public.purge_login_attempts(); $$
-- );
