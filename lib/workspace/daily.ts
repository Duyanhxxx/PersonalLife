import { todayIso } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";

type DailyPlannerTemplate = {
  title: string;
  start_time: string | null;
  end_time: string | null;
  tone: string;
  notes: string;
};

type DailyTaskTemplate = {
  title: string;
  priority: "urgent" | "important" | "normal" | "low";
  color: string;
};

const deepWorkDays = new Set([1, 3, 4]);
const studyDays = new Set([2, 5]);

function getVietnamWeekday(dateKey: string) {
  return new Date(`${dateKey}T00:00:00+07:00`).getDay();
}

function plannerTemplatesFor(dayOfWeek: number): DailyPlannerTemplate[] {
  if (deepWorkDays.has(dayOfWeek)) {
    return [
      { title: "Gym nặng", start_time: "06:00", end_time: "07:15", tone: "green", notes: "Push / Pull / Leg" },
      { title: "Routine sáng", start_time: "07:15", end_time: "08:30", tone: "green", notes: "Ăn, tắm, cafe, xem lịch" },
      { title: "Deep Work 1A", start_time: "08:30", end_time: "10:00", tone: "blue", notes: "Feature build / bug fix" },
      { title: "Deep Work 1B", start_time: "10:15", end_time: "11:30", tone: "blue", notes: "Continue dev core" },
      { title: "Ăn + ngủ", start_time: "11:30", end_time: "13:30", tone: "green", notes: "Bắt buộc" },
      { title: "Deep Work 2A", start_time: "13:30", end_time: "15:00", tone: "blue", notes: "Project execution" },
      { title: "Deep Work 2B", start_time: "15:15", end_time: "16:30", tone: "blue", notes: "Second focus block" },
      { title: "Part-time", start_time: "16:30", end_time: "18:00", tone: "purple", notes: "Việc nhẹ / freelance" },
      { title: "Strategic Work", start_time: "19:30", end_time: "21:00", tone: "amber", notes: "Docs, notes, tutorials" },
    ];
  }

  if (studyDays.has(dayOfWeek)) {
    return [
      { title: "Gym nhẹ", start_time: "05:30", end_time: "06:45", tone: "green", notes: "Light morning workout" },
      { title: "Light Work", start_time: "08:30", end_time: "09:30", tone: "amber", notes: "Email / prep / formatting" },
      { title: "Mini Deep Work", start_time: "09:30", end_time: "11:00", tone: "blue", notes: "Focused mini block" },
      { title: "Ôn DNG103", start_time: "13:15", end_time: "13:45", tone: "amber", notes: "Pre-study review" },
      { title: "DNG103", start_time: "14:15", end_time: "17:30", tone: "red", notes: "Class time" },
      { title: "Part-time + Light task", start_time: "20:00", end_time: "21:30", tone: "purple", notes: "Low-cognitive evening work" },
    ];
  }

  if (dayOfWeek === 6) {
    return [
      { title: "Backlog Work", start_time: "08:30", end_time: "11:00", tone: "blue", notes: "2-3h backlog cleanup" },
    ];
  }

  if (dayOfWeek === 0) {
    return [
      { title: "Weekly Reset", start_time: "20:00", end_time: "21:00", tone: "amber", notes: "Review and prepare next week" },
    ];
  }

  return [];
}

function taskTemplatesFor(dayOfWeek: number): DailyTaskTemplate[] {
  if (deepWorkDays.has(dayOfWeek)) {
    return [
      { title: "Feature Build", priority: "urgent", color: "red" },
      { title: "Bug Fix", priority: "important", color: "amber" },
      { title: "Strategic Work", priority: "normal", color: "blue" },
    ];
  }

  if (studyDays.has(dayOfWeek)) {
    return [
      { title: "Light Work", priority: "normal", color: "blue" },
      { title: "Mini Deep Work", priority: "important", color: "amber" },
      { title: "Part-time task", priority: "low", color: "violet" },
    ];
  }

  if (dayOfWeek === 6) {
    return [{ title: "Backlog Work", priority: "important", color: "blue" }];
  }

  if (dayOfWeek === 0) {
    return [{ title: "Weekly Reset", priority: "important", color: "amber" }];
  }

  return [];
}

export async function ensureDailyWorkspaceState(userId: string, dateKey = todayIso()) {
  const supabase = await createClient();
  const dayOfWeek = getVietnamWeekday(dateKey);
  const plannerTemplates = plannerTemplatesFor(dayOfWeek);
  const taskTemplates = taskTemplatesFor(dayOfWeek);

  const { data: bootstrap } = await supabase
    .from("daily_workspace_bootstraps")
    .select("id")
    .eq("user_id", userId)
    .eq("entry_date", dateKey)
    .maybeSingle();

  if (bootstrap) {
    return dateKey;
  }

  const [eventsResult, tasksResult] = await Promise.all([
    supabase
      .from("planner_events")
      .select("title")
      .eq("user_id", userId)
      .eq("entry_date", dateKey),
    supabase
      .from("todo_items")
      .select("title")
      .eq("user_id", userId)
      .eq("entry_date", dateKey),
  ]);

  const existingEventTitles = new Set((eventsResult.data ?? []).map((row) => row.title));
  const existingTaskTitles = new Set((tasksResult.data ?? []).map((row) => row.title));

  const missingEvents = plannerTemplates.filter((item) => !existingEventTitles.has(item.title));
  const missingTasks = taskTemplates.filter((item) => !existingTaskTitles.has(item.title));

  if (missingEvents.length > 0) {
    await supabase.from("planner_events").insert(
      missingEvents.map((item) => ({
        user_id: userId,
        entry_date: dateKey,
        ...item,
      })),
    );
  }

  if (missingTasks.length > 0) {
    await supabase.from("todo_items").insert(
      missingTasks.map((item) => ({
        user_id: userId,
        entry_date: dateKey,
        ...item,
      })),
    );
  }

  await supabase.from("daily_workspace_bootstraps").insert({
    user_id: userId,
    entry_date: dateKey,
  });

  return dateKey;
}
