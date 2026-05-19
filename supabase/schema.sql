create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  stripe_customer_id text,
  status text not null default 'created',
  email text,
  cart jsonb not null default '[]'::jsonb,
  amount_total integer,
  currency text,
  metadata jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('booking', 'contact', 'newsletter', 'bridal', 'competition', 'mobile', 'gift')),
  status text not null default 'new',
  email text,
  name text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_email_idx on public.orders (email);
create index if not exists submissions_type_idx on public.submissions (type);
create index if not exists submissions_email_idx on public.submissions (email);

alter table public.orders enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "Service role can manage orders" on public.orders;
create policy "Service role can manage orders"
on public.orders
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage submissions" on public.submissions;
create policy "Service role can manage submissions"
on public.submissions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

drop trigger if exists submissions_touch_updated_at on public.submissions;
create trigger submissions_touch_updated_at
before update on public.submissions
for each row execute function public.touch_updated_at();
