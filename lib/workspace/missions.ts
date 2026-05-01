import { todayIso } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import type { Mission, MissionEntry } from "@/types/section-data";

export async function getMissions(userId: string) {
  const supabase = await createClient();
  const today = todayIso();
  const [missionsResult, entriesResult] = await Promise.all([
    supabase
      .from("missions")
      .select("id, title, color, target_value, current_value")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("mission_entries")
      .select("id, mission_id, entry_date, progress_delta, note")
      .eq("user_id", userId)
      .eq("entry_date", today)
      .order("created_at", { ascending: false }),
  ]);

  return {
    missions: (missionsResult.data ?? []) as Mission[],
    todayEntries: (entriesResult.data ?? []) as MissionEntry[],
  };
}
