import { todayIso } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";

export async function getTodayDashboard(userId: string) {
  const supabase = await createClient();
  const today = todayIso();

  const [eventsResult, tasksResult, financeResult, missionsResult, readingResult] =
    await Promise.all([
      supabase
        .from("planner_events")
        .select("id, title, entry_date, start_time, end_time, tone")
        .eq("user_id", userId)
        .eq("entry_date", today)
        .order("start_time", { ascending: true }),
      supabase
        .from("todo_items")
        .select("id, title, priority, color, is_done")
        .eq("user_id", userId)
        .eq("entry_date", today)
        .order("created_at", { ascending: true }),
      supabase
        .from("finance_entries")
        .select("amount, entry_type")
        .eq("user_id", userId)
        .eq("entry_date", today),
      supabase
        .from("missions")
        .select("id, title, color, target_value, current_value")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(4),
      supabase
        .from("reading_books")
        .select("id, title, status, cover_url")
        .eq("user_id", userId)
        .in("status", ["reading", "to_read"])
        .order("updated_at", { ascending: false })
        .limit(4),
    ]);

  const finance = (financeResult.data ?? []).reduce(
    (acc, entry) => {
      if (entry.entry_type === "income") {
        acc.income += Number(entry.amount);
      } else {
        acc.expense += Number(entry.amount);
      }
      return acc;
    },
    { income: 0, expense: 0 },
  );

  return {
    today,
    events: eventsResult.data ?? [],
    tasks: tasksResult.data ?? [],
    finance: {
      income: finance.income,
      expense: finance.expense,
      balance: finance.income - finance.expense,
    },
    missions: missionsResult.data ?? [],
    reading: readingResult.data ?? [],
  };
}
