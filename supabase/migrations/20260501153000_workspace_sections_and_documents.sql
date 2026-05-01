create type public.document_kind as enum (
  'page',
  'database',
  'view',
  'template'
);

create type public.editor_kind as enum (
  'tiptap',
  'novel'
);

create table if not exists public.workspace_sections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  slug text not null,
  icon text,
  color text,
  sort_order integer not null default 0,
  is_system boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint workspace_sections_name_check check (char_length(trim(name)) > 0),
  constraint workspace_sections_slug_check check (slug ~ '^[a-z0-9-]+$'),
  constraint workspace_sections_user_slug_key unique (user_id, slug)
);

create trigger workspace_sections_set_updated_at
before update on public.workspace_sections
for each row
execute function public.set_updated_at();

alter table public.workspace_sections enable row level security;

create policy "Sections are viewable by their owner"
on public.workspace_sections
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Sections are insertable by their owner"
on public.workspace_sections
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Sections are updatable by their owner"
on public.workspace_sections
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Sections are deletable by their owner"
on public.workspace_sections
for delete
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.create_default_workspace_sections()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_sections (user_id, name, slug, icon, color, sort_order, is_system)
  values
    (new.id, 'Notes', 'notes', 'FileText', 'zinc', 0, true),
    (new.id, 'Finance', 'finance', 'Wallet', 'emerald', 1, true),
    (new.id, 'Calendar', 'calendar', 'CalendarDays', 'sky', 2, true),
    (new.id, 'To-do', 'tasks', 'ListTodo', 'amber', 3, true),
    (new.id, 'Habits', 'habits', 'Activity', 'violet', 4, true),
    (new.id, 'Missions', 'missions', 'Target', 'rose', 5, true),
    (new.id, 'Reading', 'reading', 'BookOpen', 'indigo', 6, true)
  on conflict (user_id, slug) do nothing;

  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;

create trigger on_profile_created
after insert on public.profiles
for each row
execute function public.create_default_workspace_sections();

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  section_id uuid references public.workspace_sections (id) on delete set null,
  parent_id uuid references public.documents (id) on delete cascade,
  title text not null default 'Untitled',
  icon text,
  cover_image text,
  kind public.document_kind not null default 'page',
  editor public.editor_kind not null default 'tiptap',
  content jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  properties_schema jsonb not null default '[]'::jsonb,
  properties_data jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  depth integer not null default 0,
  is_archived boolean not null default false,
  archived_at timestamptz,
  last_edited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint documents_title_check check (char_length(trim(title)) > 0),
  constraint documents_depth_check check (depth >= 0 and depth <= 32)
);

create index documents_user_id_idx on public.documents (user_id);
create index documents_parent_id_idx on public.documents (parent_id);
create index documents_section_id_idx on public.documents (section_id);
create index documents_archived_idx on public.documents (user_id, is_archived);
create index documents_updated_at_idx on public.documents (user_id, updated_at desc);

create or replace function public.manage_document_hierarchy()
returns trigger
language plpgsql
as $$
declare
  parent_document public.documents%rowtype;
begin
  if new.parent_id is not null then
    select *
    into parent_document
    from public.documents
    where id = new.parent_id;

    if not found then
      raise exception 'Parent document does not exist';
    end if;

    if parent_document.user_id <> new.user_id then
      raise exception 'Parent document must belong to the same user';
    end if;

    new.depth = parent_document.depth + 1;

    if new.section_id is null then
      new.section_id = parent_document.section_id;
    end if;
  else
    new.depth = 0;
  end if;

  if new.is_archived and new.archived_at is null then
    new.archived_at = timezone('utc', now());
  end if;

  if not new.is_archived then
    new.archived_at = null;
  end if;

  return new;
end;
$$;

create trigger documents_manage_hierarchy
before insert or update on public.documents
for each row
execute function public.manage_document_hierarchy();

create trigger documents_set_updated_at
before update on public.documents
for each row
execute function public.set_updated_at();

alter table public.documents enable row level security;

create policy "Documents are viewable by their owner"
on public.documents
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Documents are insertable by their owner"
on public.documents
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Documents are updatable by their owner"
on public.documents
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Documents are deletable by their owner"
on public.documents
for delete
to authenticated
using ((select auth.uid()) = user_id);
