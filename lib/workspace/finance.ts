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

export async function getFinanceStats(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("finance_entries")
    .select("amount, entry_type, entry_date")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .limit(500);

  // Group by month
  const stats: Record<string, { income: number; expense: number }> = {};
  (data ?? []).forEach((entry) => {
    const month = entry.entry_date.substring(0, 7); // YYYY-MM
    if (!stats[month]) stats[month] = { income: 0, expense: 0 };
    if (entry.entry_type === "income") stats[month].income += Number(entry.amount);
    else stats[month].expense += Number(entry.amount);
  });

  return Object.entries(stats)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6); // Last 6 months
}

