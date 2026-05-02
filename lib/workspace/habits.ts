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
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoIso = thirtyDaysAgo.toISOString().split("T")[0];

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
      .gte("log_date", thirtyDaysAgoIso)
      .order("log_date", { ascending: false }),
  ]);

  const habits = (habitsResult.data ?? []) as Habit[];
  const allLogs = (logsResult.data ?? []) as HabitLog[];
  const todayLogs = allLogs.filter(log => log.log_date === today);

  // Compute streaks
  const habitsWithStreaks = habits.map(habit => {
    const habitLogs = allLogs.filter(log => log.habit_id === habit.id);
    const logDates = new Set(habitLogs.map(l => l.log_date));
    
    let streak = 0;
    let checkDate = new Date(today);
    
    // If not completed today, check if it was completed yesterday to continue streak
    if (!logDates.has(today)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (logDates.has(checkDate.toISOString().split("T")[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      ...habit,
      streak,
      last30Days: habitLogs
    };
  });

  return {
    habits: habitsWithStreaks,
    todayLogs,
  };
}

