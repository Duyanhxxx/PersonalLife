import { monthBounds } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import type { FinanceEntry } from "@/types/section-data";

export async function getFinanceEntries(userId: string, month?: string) {
  const supabase = await createClient();
  const bounds = monthBounds(month);
  const { data } = await supabase
    .from("finance_entries")
    .select("id, entry_date, title, amount, entry_type, category")
    .eq("user_id", userId)
    .gte("entry_date", bounds.start)
    .lte("entry_date", bounds.end)
    .order("entry_date", { ascending: true })
    .order("created_at", { ascending: true });

  return {
    ...bounds,
    entries: (data ?? []) as FinanceEntry[],
  };
}
