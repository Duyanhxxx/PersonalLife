import { todayIso } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import type { TodoItem } from "@/types/section-data";

export async function getTodoItems(userId: string, date = todayIso()) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("todo_items")
    .select("id, entry_date, title, priority, color, is_done")
    .eq("user_id", userId)
    .eq("entry_date", date)
    .order("created_at", { ascending: true });

  return (data ?? []) as TodoItem[];
}
