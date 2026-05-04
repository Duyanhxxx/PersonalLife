import { monthBounds } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import type { FinanceCommitment, FinanceEntry, FinanceWallet } from "@/types/section-data";

type FinanceEntryRow = FinanceEntry & {
  finance_wallets?: Array<{ title: string | null }> | null;
};

export async function getFinanceEntries(userId: string, month?: string) {
  const supabase = await createClient();
  const bounds = monthBounds(month);
  const [entriesResult, walletsResult, commitmentsResult] = await Promise.all([
    supabase
      .from("finance_entries")
      .select("id, entry_date, title, amount, entry_type, category, wallet_id, finance_wallets(title)")
      .eq("user_id", userId)
      .gte("entry_date", bounds.start)
      .lte("entry_date", bounds.end)
      .order("entry_date", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("finance_wallets")
      .select("id, title, description, budget_amount, color, start_date, end_date")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("finance_commitments")
      .select("id, wallet_id, title, amount, commitment_type, due_date, category")
      .eq("user_id", userId)
      .gte("due_date", bounds.start)
      .lte("due_date", bounds.end)
      .order("due_date", { ascending: true }),
  ]);

  const entries = ((entriesResult.data ?? []) as unknown as FinanceEntryRow[]).map((entry) => ({
    ...entry,
    wallet_name: Array.isArray(entry.finance_wallets)
      ? entry.finance_wallets[0]?.title ?? null
      : null,
  }));

  const wallets = (walletsResult.data ?? []) as FinanceWallet[];
  const commitments = (commitmentsResult.data ?? []) as FinanceCommitment[];

  const todayKey = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());
  const actualBalance = entries.reduce(
    (total, entry) =>
      total + (entry.entry_type === "income" ? Number(entry.amount) : -Number(entry.amount)),
    0,
  );
  const projectedDelta = commitments.reduce(
    (total, item) =>
      total + (item.commitment_type === "income" ? Number(item.amount) : -Number(item.amount)),
    0,
  );

  const walletSummaries = wallets.map((wallet) => {
    const walletEntries = entries.filter((entry) => entry.wallet_id === wallet.id);
    const spent = walletEntries
      .filter((entry) => entry.entry_type === "expense")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    const funded = walletEntries
      .filter((entry) => entry.entry_type === "income")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    const available = Number(wallet.budget_amount) + funded - spent;

    return {
      ...wallet,
      spent,
      funded,
      available,
      progress: wallet.budget_amount > 0 ? Math.min(100, Math.round((spent / Number(wallet.budget_amount)) * 100)) : 0,
    };
  });

  const categoryMap = new Map<string, number>();
  entries
    .filter((entry) => entry.entry_type === "expense")
    .forEach((entry) => {
      categoryMap.set(entry.category, (categoryMap.get(entry.category) ?? 0) + Number(entry.amount));
    });

  return {
    ...bounds,
    entries,
    wallets: walletSummaries,
    commitments,
    projection: {
      currentMonthBalance: actualBalance,
      upcomingNet: projectedDelta,
      endOfMonthEstimate: actualBalance + projectedDelta,
      todayKey,
    },
    categoryBreakdown: Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6),
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
