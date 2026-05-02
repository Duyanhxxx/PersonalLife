"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";

export async function getUpcomingEvents() {
  const user = await requireUser();
  const supabase = await createClient();
  const now = new Date();
  const isoNow = now.toISOString().split("T")[0];
  const timeNow = now.toTimeString().split(" ")[0];

  const { data } = await supabase
    .from("planner_events")
    .select("id, title, start_time")
    .eq("user_id", user.id)
    .eq("entry_date", isoNow)
    .gte("start_time", timeNow)
    .order("start_time", { ascending: true })
    .limit(5);

  return data ?? [];
}
