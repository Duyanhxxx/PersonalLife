insert into public.planner_events (user_id, title, entry_date, start_time, end_time, tone, notes)
select
  p.id,
  event.title,
  event.entry_date,
  event.start_time::time,
  event.end_time::time,
  event.tone,
  event.notes
from public.profiles p
cross join (
  values
    ('Gym nặng', (now() at time zone 'Asia/Ho_Chi_Minh')::date, '06:00', '07:15', 'green', 'Push / pull / leg'),
    ('Deep Work 1A', (now() at time zone 'Asia/Ho_Chi_Minh')::date, '08:30', '10:00', 'blue', 'Feature build or bug fixing'),
    ('Deep Work 1B', (now() at time zone 'Asia/Ho_Chi_Minh')::date, '10:15', '11:30', 'blue', 'Continue dev core'),
    ('Strategic Work', (now() at time zone 'Asia/Ho_Chi_Minh')::date, '19:30', '21:00', 'amber', 'Tech docs, note writing, tutorial')
) as event(title, entry_date, start_time, end_time, tone, notes)
where not exists (
  select 1
  from public.planner_events existing
  where existing.user_id = p.id
    and existing.entry_date = event.entry_date
    and existing.title = event.title
);

insert into public.todo_items (user_id, entry_date, title, priority, color)
select
  p.id,
  (now() at time zone 'Asia/Ho_Chi_Minh')::date,
  item.title,
  item.priority::public.todo_priority,
  item.color
from public.profiles p
cross join (
  values
    ('Feature Build', 'urgent', 'red'),
    ('Check mail', 'normal', 'blue'),
    ('Part-time task', 'important', 'violet')
) as item(title, priority, color)
where not exists (
  select 1
  from public.todo_items existing
  where existing.user_id = p.id
    and existing.entry_date = (now() at time zone 'Asia/Ho_Chi_Minh')::date
    and existing.title = item.title
);

insert into public.missions (user_id, title, color, target_value, current_value)
select p.id, mission.title, mission.color, mission.target_value, mission.current_value
from public.profiles p
cross join (
  values
    ('Finish main project milestone', 'blue', 100, 35),
    ('Build health consistency streak', 'green', 30, 8)
) as mission(title, color, target_value, current_value)
where not exists (
  select 1
  from public.missions existing
  where existing.user_id = p.id
    and existing.title = mission.title
);
