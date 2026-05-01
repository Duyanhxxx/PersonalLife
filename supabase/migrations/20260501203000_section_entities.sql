create type public.finance_entry_type as enum (
  'income',
  'expense'
);

create type public.todo_priority as enum (
  'urgent',
  'important',
  'normal',
  'low'
);

create type public.book_status as enum (
  'to_read',
  'reading',
  'finished'
);

create table if not exists public.planner_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  entry_date date not null,
  start_time time,
  end_time time,
  tone text not null default 'blue',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint planner_events_title_check check (char_length(trim(title)) > 0)
);

create table if not exists public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null,
  title text not null,
  amount numeric(12, 2) not null,
  entry_type public.finance_entry_type not null,
  category text not null default 'general',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint finance_entries_title_check check (char_length(trim(title)) > 0)
);

create table if not exists public.todo_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null,
  title text not null,
  priority public.todo_priority not null default 'normal',
  color text not null default 'blue',
  is_done boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint todo_items_title_check check (char_length(trim(title)) > 0)
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  color text not null default 'blue',
  target_value integer not null default 100,
  current_value integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint missions_title_check check (char_length(trim(title)) > 0)
);

create table if not exists public.mission_entries (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null,
  progress_delta integer not null default 0,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reading_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  author text,
  cover_path text,
  cover_url text,
  status public.book_status not null default 'to_read',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint reading_books_title_check check (char_length(trim(title)) > 0)
);

create trigger planner_events_set_updated_at before update on public.planner_events for each row execute function public.set_updated_at();
create trigger finance_entries_set_updated_at before update on public.finance_entries for each row execute function public.set_updated_at();
create trigger todo_items_set_updated_at before update on public.todo_items for each row execute function public.set_updated_at();
create trigger missions_set_updated_at before update on public.missions for each row execute function public.set_updated_at();
create trigger reading_books_set_updated_at before update on public.reading_books for each row execute function public.set_updated_at();

create index planner_events_user_date_idx on public.planner_events (user_id, entry_date);
create index finance_entries_user_date_idx on public.finance_entries (user_id, entry_date);
create index todo_items_user_date_idx on public.todo_items (user_id, entry_date);
create index missions_user_idx on public.missions (user_id);
create index mission_entries_user_date_idx on public.mission_entries (user_id, entry_date);
create index reading_books_user_status_idx on public.reading_books (user_id, status);

alter table public.planner_events enable row level security;
alter table public.finance_entries enable row level security;
alter table public.todo_items enable row level security;
alter table public.missions enable row level security;
alter table public.mission_entries enable row level security;
alter table public.reading_books enable row level security;

create policy "Planner events owner access" on public.planner_events for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Finance entries owner access" on public.finance_entries for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Todo items owner access" on public.todo_items for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Missions owner access" on public.missions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Mission entries owner access" on public.mission_entries for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Reading books owner access" on public.reading_books for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
