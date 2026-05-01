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

  perform public.seed_default_workspace_documents(new.id);

  return new;
end;
$$;

select public.seed_default_workspace_documents(id)
from public.profiles;
