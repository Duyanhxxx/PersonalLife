create or replace function public.seed_default_workspace_documents(profile_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  notes_section_id uuid;
  finance_section_id uuid;
  calendar_section_id uuid;
  tasks_section_id uuid;
  habits_section_id uuid;
  missions_section_id uuid;
  reading_section_id uuid;
begin
  select id into notes_section_id from public.workspace_sections where user_id = profile_user_id and slug = 'notes';
  select id into finance_section_id from public.workspace_sections where user_id = profile_user_id and slug = 'finance';
  select id into calendar_section_id from public.workspace_sections where user_id = profile_user_id and slug = 'calendar';
  select id into tasks_section_id from public.workspace_sections where user_id = profile_user_id and slug = 'tasks';
  select id into habits_section_id from public.workspace_sections where user_id = profile_user_id and slug = 'habits';
  select id into missions_section_id from public.workspace_sections where user_id = profile_user_id and slug = 'missions';
  select id into reading_section_id from public.workspace_sections where user_id = profile_user_id and slug = 'reading';

  insert into public.documents (user_id, section_id, title, kind, position, metadata)
  select
    profile_user_id,
    notes_section_id,
    'Capture Inbox',
    'page',
    0,
    jsonb_build_object(
      'template', 'notes_inbox',
      'summary', 'Quick place for random ideas, life admin, and unfinished thoughts before they get organized.'
    )
  where notes_section_id is not null
    and not exists (
      select 1 from public.documents
      where user_id = profile_user_id and section_id = notes_section_id and title = 'Capture Inbox'
    );

  insert into public.documents (user_id, section_id, title, kind, position, metadata)
  select
    profile_user_id,
    finance_section_id,
    'Finance Command Center',
    'database',
    0,
    jsonb_build_object(
      'template', 'finance_dashboard',
      'widgets', jsonb_build_array('Monthly budget', 'Recurring bills', 'Savings goals', 'Freelance income')
    )
  where finance_section_id is not null
    and not exists (
      select 1 from public.documents
      where user_id = profile_user_id and section_id = finance_section_id and title = 'Finance Command Center'
    );

  insert into public.documents (user_id, section_id, title, kind, position, metadata)
  select
    profile_user_id,
    calendar_section_id,
    'Weekly Operating Schedule',
    'page',
    0,
    '{
      "template": "weekly_schedule",
      "dayGroups": [
        {
          "label": "Thứ 2 - 4 - 5",
          "theme": "Deep Work Days",
          "blocks": [
            {"time": "06:00 - 07:15", "label": "Gym nặng: push / pull / leg", "tone": "green"},
            {"time": "07:15 - 08:30", "label": "Routine: ăn + tắm + cafe + xem lịch", "tone": "green"},
            {"time": "08:30 - 10:00", "label": "Deep Work 1A", "tone": "blue"},
            {"time": "10:00 - 10:15", "label": "Break", "tone": "green"},
            {"time": "10:15 - 11:30", "label": "Deep Work 1B", "tone": "blue"},
            {"time": "11:30 - 13:30", "label": "Ăn + ngủ", "tone": "green"},
            {"time": "13:30 - 15:00", "label": "Deep Work 2A", "tone": "blue"},
            {"time": "15:00 - 15:15", "label": "Break", "tone": "green"},
            {"time": "15:15 - 16:30", "label": "Deep Work 2B", "tone": "blue"},
            {"time": "16:30 - 18:00", "label": "Part-time nhẹ / freelance", "tone": "purple"},
            {"time": "18:00 - 19:30", "label": "Ăn + sinh hoạt", "tone": "green"},
            {"time": "19:30 - 21:00", "label": "Strategic Work", "tone": "amber"},
            {"time": "21:00 - 22:00", "label": "Wind down", "tone": "green"},
            {"time": "22:30", "label": "Ngủ", "tone": "neutral"}
          ]
        },
        {
          "label": "Thứ 3 - 6",
          "theme": "Ngày đi học",
          "blocks": [
            {"time": "05:30 - 06:45", "label": "Gym nhẹ", "tone": "green"},
            {"time": "06:45 - 07:30", "label": "Ăn + tắm", "tone": "green"},
            {"time": "07:30 - 08:30", "label": "Buffer", "tone": "green"},
            {"time": "08:30 - 09:30", "label": "Light Work", "tone": "amber"},
            {"time": "09:30 - 11:00", "label": "Mini Deep Work", "tone": "blue"},
            {"time": "11:00 - 11:45", "label": "Chill nhẹ", "tone": "green"},
            {"time": "11:45 - 13:15", "label": "Ăn + ngủ", "tone": "green"},
            {"time": "13:15 - 13:45", "label": "Ôn DNG103", "tone": "amber"},
            {"time": "13:45 - 14:15", "label": "Di chuyển", "tone": "green"},
            {"time": "14:15 - 17:30", "label": "Học DNG103", "tone": "red"},
            {"time": "17:30 - 18:00", "label": "Di chuyển về", "tone": "green"},
            {"time": "18:00 - 20:00", "label": "Relax", "tone": "green"},
            {"time": "20:00 - 21:30", "label": "Part-time + Light task", "tone": "purple"},
            {"time": "21:30 - 22:00", "label": "Shutdown", "tone": "green"},
            {"time": "22:00", "label": "Ngủ", "tone": "neutral"}
          ]
        },
        {
          "label": "Thứ 7",
          "theme": "Backlog + OFF",
          "blocks": [
            {"time": "Sáng", "label": "Backlog Work 2-3h", "tone": "blue"},
            {"time": "Chiều", "label": "OFF hoàn toàn", "tone": "green"}
          ]
        },
        {
          "label": "Chủ Nhật",
          "theme": "Recovery + Weekly Reset",
          "blocks": [
            {"time": "Cả ngày", "label": "Nghỉ", "tone": "green"},
            {"time": "20:00 - 21:00", "label": "Weekly Reset", "tone": "amber"}
          ]
        }
      ]
    }'::jsonb
  where calendar_section_id is not null
    and not exists (
      select 1 from public.documents
      where user_id = profile_user_id and section_id = calendar_section_id and title = 'Weekly Operating Schedule'
    );

  insert into public.documents (user_id, section_id, title, kind, position, metadata)
  select
    profile_user_id,
    tasks_section_id,
    'Deep Work Task Bank',
    'database',
    0,
    '{
      "template": "task_bank",
      "groups": [
        {"label": "Deep Work - Dev Core", "tone": "blue", "items": ["Feature Build", "Bug Fix", "System Design nhẹ"]},
        {"label": "Strategic Work", "tone": "amber", "items": ["Đọc tài liệu tech", "Học concept mới", "Viết note", "Xem tutorial"]},
        {"label": "Mini Deep Work", "tone": "blue", "items": ["Fix bug nhỏ", "Viết 1 phần nhỏ đồ án", "Đọc code cũ"]},
        {"label": "Light Work", "tone": "amber", "items": ["Check mail", "Format tài liệu", "Tìm resource"]},
        {"label": "Part-time", "tone": "purple", "items": ["Task lặp lại", "Không cần suy nghĩ sâu"]}
      ]
    }'::jsonb
  where tasks_section_id is not null
    and not exists (
      select 1 from public.documents
      where user_id = profile_user_id and section_id = tasks_section_id and title = 'Deep Work Task Bank'
    );

  insert into public.documents (user_id, section_id, title, kind, position, metadata)
  select
    profile_user_id,
    habits_section_id,
    'Home Workout System',
    'page',
    0,
    '{
      "template": "workout_program",
      "principles": [
        "Khởi động 5-10 phút trước khi tập",
        "Xuống chậm 2-3 giây, lên nhanh 1 giây",
        "Tập nặng vào Thứ 2-4-5, tập nhẹ vào Thứ 3-6"
      ],
      "days": [
        {"label": "Thứ 2", "focus": "Push Day", "items": ["Push-ups 4 hiệp", "Floor Dumbbell Press 4x10-12", "Shoulder Press 3x10-12", "Lateral Raise 3x12-15", "Bench Dips 3x10-12"]},
        {"label": "Thứ 3", "focus": "Core & Mobility", "items": ["Plank 3 hiệp", "Bicycle Crunches 3x20 mỗi bên", "Lying Leg Raises 3x15", "Yoga + giãn cơ 15 phút"]},
        {"label": "Thứ 4", "focus": "Pull Day", "items": ["Single-arm Row 4x10-12", "Bent-over Row 3x10-12", "Superman 3x15", "Bicep Curl 3x10-12"]},
        {"label": "Thứ 5", "focus": "Leg & Glute Day", "items": ["Goblet Squat 4x12-15", "Dumbbell Lunges 3x10-12 mỗi chân", "Glute Bridge 4x15", "Calf Raises 3x15"]},
        {"label": "Thứ 6", "focus": "Full Body HIIT", "items": ["Jumping Jacks 45s", "Mountain Climbers 45s", "Burpees 45s", "Squat Jumps 45s", "Làm 3-4 vòng"]},
        {"label": "Thứ 7 & Chủ Nhật", "focus": "Active Recovery", "items": ["Đi bộ nhanh", "Đạp xe nhẹ", "Ngủ đủ giấc"]}
      ]
    }'::jsonb
  where habits_section_id is not null
    and not exists (
      select 1 from public.documents
      where user_id = profile_user_id and section_id = habits_section_id and title = 'Home Workout System'
    );

  insert into public.documents (user_id, section_id, title, kind, position, metadata)
  select
    profile_user_id,
    missions_section_id,
    'Mission Control',
    'database',
    0,
    jsonb_build_object(
      'template', 'mission_control',
      'focuses', jsonb_build_array('Semester goals', 'Client work', 'Health streaks', 'Learning targets')
    )
  where missions_section_id is not null
    and not exists (
      select 1 from public.documents
      where user_id = profile_user_id and section_id = missions_section_id and title = 'Mission Control'
    );

  insert into public.documents (user_id, section_id, title, kind, position, metadata)
  select
    profile_user_id,
    reading_section_id,
    'Reading Queue',
    'database',
    0,
    jsonb_build_object(
      'template', 'reading_queue',
      'lanes', jsonb_build_array('To read', 'Reading now', 'Finished', 'Highlights to review')
    )
  where reading_section_id is not null
    and not exists (
      select 1 from public.documents
      where user_id = profile_user_id and section_id = reading_section_id and title = 'Reading Queue'
    );
end;
$$;
