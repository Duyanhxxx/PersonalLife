"use client";

import { getFinanceEntries } from "@/lib/workspace/finance";
import { FinanceLedgerPanel } from "@/components/workspace/finance-ledger-panel";
import { FinanceVisualDashboard } from "@/components/workspace/finance-visual-dashboard";
import { FinanceWalletsPanel } from "@/components/workspace/finance-wallets-panel";
import type { AwaitedReturn } from "@/types/utils";
import { useI18n } from "@/lib/i18n/i18n-context";

type FinanceSectionProps = {
  data: AwaitedReturn<typeof getFinanceEntries>;
  stats: [string, { income: number; expense: number }][];
};

export function FinanceSection({ data, stats }: FinanceSectionProps) {
  const { locale } = useI18n();
  const summary = data.entries.reduce(
    (acc, entry) => {
      if (entry.entry_type === "income") acc.income += Number(entry.amount);
      else acc.expense += Number(entry.amount);
      return acc;
    },
    { income: 0, expense: 0 },
  );

  return (
    <section className="space-y-4">
      <FinanceVisualDashboard
        balance={summary.income - summary.expense}
        categoryBreakdown={data.categoryBreakdown}
        expense={summary.expense}
        income={summary.income}
        locale={locale}
        projection={data.projection}
        stats={stats}
      />
      <FinanceWalletsPanel commitments={data.commitments} locale={locale} wallets={data.wallets} />
      <FinanceLedgerPanel entries={data.entries} locale={locale} monthKey={data.monthKey} monthLabel={data.monthLabel} start={data.start} wallets={data.wallets} />
    </section>
  );
}
