alter table public.planner_events
  add column if not exists context text not null default 'personal',
  add column if not exists end_date date;

update public.planner_events
set end_date = entry_date
where end_date is null;

alter table public.planner_events
  alter column end_date set default null;

create table if not exists public.finance_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  budget_amount numeric(12, 2) not null default 0,
  color text not null default 'blue',
  start_date date,
  end_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint finance_wallets_title_check check (char_length(trim(title)) > 0),
  constraint finance_wallets_budget_check check (budget_amount >= 0)
);

create table if not exists public.finance_commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  wallet_id uuid references public.finance_wallets (id) on delete set null,
  title text not null,
  amount numeric(12, 2) not null default 0,
  commitment_type text not null default 'expense',
  due_date date not null,
  category text not null default 'general',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint finance_commitments_title_check check (char_length(trim(title)) > 0),
  constraint finance_commitments_amount_check check (amount >= 0),
  constraint finance_commitments_type_check check (commitment_type in ('income', 'expense'))
);

alter table public.finance_entries
  add column if not exists wallet_id uuid references public.finance_wallets (id) on delete set null;

create trigger finance_wallets_set_updated_at
before update on public.finance_wallets
for each row execute function public.set_updated_at();

create trigger finance_commitments_set_updated_at
before update on public.finance_commitments
for each row execute function public.set_updated_at();

create index if not exists planner_events_user_context_idx
  on public.planner_events (user_id, context, entry_date);

create index if not exists finance_entries_wallet_idx
  on public.finance_entries (wallet_id, entry_date);

create index if not exists finance_wallets_user_idx
  on public.finance_wallets (user_id, created_at desc);

create index if not exists finance_commitments_user_due_idx
  on public.finance_commitments (user_id, due_date);

alter table public.finance_wallets enable row level security;
alter table public.finance_commitments enable row level security;

create policy "Finance wallets owner access"
on public.finance_wallets
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Finance commitments owner access"
on public.finance_commitments
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
