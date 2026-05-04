import { monthBounds } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import { ensureDailyWorkspaceState } from "@/lib/workspace/daily";
import type { PlannerEvent } from "@/types/section-data";

export async function getPlannerEvents(userId: string, month?: string) {
  const supabase = await createClient();
  const bounds = monthBounds(month);

  if (!month || month === bounds.monthKey) {
    await ensureDailyWorkspaceState(userId);
  }

  const { data } = await supabase
    .from("planner_events")
    .select("id, title, entry_date, start_time, end_time, tone, notes")
    .eq("user_id", userId)
    .gte("entry_date", bounds.start)
    .lte("entry_date", bounds.end)
    .order("entry_date", { ascending: true })
    .order("start_time", { ascending: true });

  return {
    ...bounds,
    events: (data ?? []) as PlannerEvent[],
  };
}
