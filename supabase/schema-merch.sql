-- Hands of Hope Merch Store
-- Postgres schema for Supabase (products, orders)
-- Run in the Supabase SQL editor for the merch project.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'merch_model_status') then
    create type public.merch_model_status as enum (
      'pending',
      'processing',
      'ready',
      'failed'
    );
  end if;
end$$;

create table if not exists public.merch_products (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  description         text not null default '',
  price_cents         integer not null check (price_cents >= 0),
  shipping_fee_cents  integer not null default 0 check (shipping_fee_cents >= 0),
  sizes               text[] not null default array['S','M','L','XL']::text[],
  front_image_url     text,
  back_image_url      text,
  glb_model_url       text,
  model_status        public.merch_model_status not null default 'pending',
  meshy_task_id       text,
  active              boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists merch_products_active_idx on public.merch_products(active);
create index if not exists merch_products_status_idx on public.merch_products(model_status);

create table if not exists public.merch_orders (
  id                   uuid primary key default gen_random_uuid(),
  order_number         text not null unique,
  stripe_session_id    text not null unique,
  customer_name        text not null,
  customer_email       text not null,
  customer_phone       text not null,
  shipping_address     jsonb not null,
  line_items           jsonb not null,
  total_charged_cents  integer not null check (total_charged_cents >= 0),
  tigerhill_notified   boolean not null default false,
  created_at           timestamptz not null default now()
);

create index if not exists merch_orders_created_idx on public.merch_orders(created_at desc);

-- Sequence-backed order number generator: HOH-0001, HOH-0002, ...
create sequence if not exists public.merch_order_number_seq start 1;

create or replace function public.next_merch_order_number()
returns text
language sql
volatile
as $$
  select 'HOH-' || lpad(nextval('public.merch_order_number_seq')::text, 4, '0');
$$;

-- Row-level security: storefront reads active products only.
-- Everything else goes through the service role (server-only) so RLS blocks anon.
alter table public.merch_products enable row level security;
alter table public.merch_orders   enable row level security;

drop policy if exists "storefront reads active products" on public.merch_products;
create policy "storefront reads active products"
  on public.merch_products
  for select
  to anon, authenticated
  using (active = true);

-- Storage buckets: create in the Supabase dashboard (or via CLI):
--   merch-images   (public read)
--   merch-models   (public read)
