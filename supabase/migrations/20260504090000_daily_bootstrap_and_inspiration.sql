create table if not exists public.daily_workspace_bootstraps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, entry_date)
);

create table if not exists public.inspiration_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  quote text not null,
  author text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  constraint inspiration_quotes_quote_check check (char_length(trim(quote)) > 0)
);

create index if not exists daily_workspace_bootstraps_user_date_idx
  on public.daily_workspace_bootstraps (user_id, entry_date);

create index if not exists inspiration_quotes_user_idx
  on public.inspiration_quotes (user_id, is_active);

alter table public.daily_workspace_bootstraps enable row level security;
alter table public.inspiration_quotes enable row level security;

create policy "Daily workspace bootstraps owner access"
on public.daily_workspace_bootstraps
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Inspiration quotes readable"
on public.inspiration_quotes
for select
to authenticated
using (user_id is null or (select auth.uid()) = user_id);

create policy "Inspiration quotes insertable"
on public.inspiration_quotes
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Inspiration quotes updatable"
on public.inspiration_quotes
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Inspiration quotes deletable"
on public.inspiration_quotes
for delete
to authenticated
using ((select auth.uid()) = user_id);

insert into public.inspiration_quotes (user_id, quote, author)
values
  (null, 'Small steps, repeated with discipline, become the life you wanted.', 'Life OS'),
  (null, 'Focus on the next right thing, not the entire mountain.', 'Life OS'),
  (null, 'Consistency feels quiet while it is building something loud.', 'Life OS'),
  (null, 'Your future is shaped more by routines than by rare bursts of effort.', 'Life OS'),
  (null, 'Protect your energy, then point it at what matters most.', 'Life OS'),
  (null, 'A calm system can carry an ambitious life.', 'Life OS'),
  (null, 'Done today is stronger than perfect someday.', 'Life OS'),
  (null, 'Rest is not a detour from progress. It is part of the route.', 'Life OS')
on conflict do nothing;
