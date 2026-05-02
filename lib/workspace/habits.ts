import { createClient } from "@/lib/supabase/server";
import { todayIso } from "@/lib/date";

export type Habit = {
  id: string;
  title: string;
  color: string;
  created_at: string;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  log_date: string;
};

export async function getHabits(userId: string) {
  const supabase = await createClient();
  const today = todayIso();

  const [habitsResult, logsResult] = await Promise.all([
    supabase
      .from("habits")
      .select("id, title, color, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("habit_logs")
      .select("id, habit_id, log_date")
      .eq("user_id", userId)
      .eq("log_date", today),
  ]);

  return {
    habits: (habitsResult.data ?? []) as Habit[],
    todayLogs: (logsResult.data ?? []) as HabitLog[],
  };
}
