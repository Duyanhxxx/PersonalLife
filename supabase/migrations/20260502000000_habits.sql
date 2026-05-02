-- Habits table
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  color text not null default 'blue',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Habit daily logs
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null default (now() at time zone 'Asia/Ho_Chi_Minh')::date,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

create policy "habits_owner" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "habit_logs_owner" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger set_habits_updated_at
  before update on public.habits
  for each row execute function public.set_updated_at();
