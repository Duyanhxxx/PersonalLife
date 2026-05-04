"use client";

import { createFinanceEntry, deleteFinanceEntry, updateFinanceEntry } from "@/actions/finance-entries";
import { addMonth } from "@/lib/date";
import { getFinanceEntries } from "@/lib/workspace/finance";
import { MonthGrid } from "@/components/workspace/month-grid";
import type { AwaitedReturn } from "@/types/utils";
import { formatCurrency } from "@/lib/format";
import { useI18n } from "@/lib/i18n/i18n-context";
import Link from "next/link";
import { useState } from "react";
import { Trash2, Edit2, Check, X, TrendingUp } from "lucide-react";
import { ResponsiveSectionViews } from "@/components/workspace/responsive-section-views";

type FinanceSectionProps = {
  data: AwaitedReturn<typeof getFinanceEntries>;
  stats: [string, { income: number; expense: number }][];
};

export function FinanceSection({ data, stats }: FinanceSectionProps) {
  const { dictionary, locale } = useI18n();
  const dict = dictionary.finance;
  const [editingId, setEditingId] = useState<string | null>(null);

  const summary = data.entries.reduce(
    (acc, entry) => {
      if (entry.entry_type === "income") acc.income += Number(entry.amount);
      else acc.expense += Number(entry.amount);
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const maxVal = Math.max(...stats.map(([, series]) => Math.max(series.income, series.expense)), 1);

  const monthView = (
    <MonthGrid
      items={data.entries.map((entry) => ({
        id: entry.id,
        date: entry.entry_date,
        label: entry.title,
        tone: entry.entry_type === "income" ? "green" : "red",
        secondary: formatCurrency(Number(entry.amount)),
      }))}
      month={data.monthKey}
    />
  );

  const mobileLedger = (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {data.entries.length ? (
          data.entries
            .slice()
            .reverse()
            .map((entry) => (
              <div className="rounded-2xl bg-gray-50 px-4 py-3" key={`mobile-${entry.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{entry.title}</p>
                    <p className="text-xs text-gray-500">{entry.entry_date} • {entry.category}</p>
                  </div>
                  <p className={`text-xs font-semibold ${entry.entry_type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                    {entry.entry_type === "income" ? "+" : "-"}{formatCurrency(Number(entry.amount))}
                  </p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-sm text-gray-500">{dict.recent}</p>
        )}
      </div>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">{dict.title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#05386B]">{data.monthLabel}</h3>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/85 px-3 py-2 text-sm text-[#05386B]" href={`/app/finance?month=${addMonth(data.monthKey, -1)}`}>{dict.prev}</Link>
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/85 px-3 py-2 text-sm text-[#05386B]" href={`/app/finance?month=${addMonth(data.monthKey, 1)}`}>{dict.next}</Link>
        </div>
      </div>

      {/* Finance Chart */}
      {stats.length > 0 && (
        <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="size-4 text-[#05386B]" />
            <p className="text-sm font-semibold text-[#05386B]">
              {locale === "vi" ? "Xu hướng 6 tháng" : "6-Month Trend"}
            </p>
          </div>
          <div className="flex items-end justify-between h-48 gap-2 md:gap-4 px-2">
            {stats.map(([month, s]) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end gap-1 h-full max-w-[60px]">
                  {/* Income bar */}
                  <div 
                    className="flex-1 rounded-t-lg bg-[#05386B] transition-all duration-500 group-hover:bg-[#0B477C]" 
                    style={{ height: `${(s.income / maxVal) * 100}%` }}
                    title={`Income: ${formatCurrency(s.income)}`}
                  />
                  {/* Expense bar */}
                  <div 
                    className="flex-1 rounded-t-lg bg-[#8EE4AF] transition-all duration-500 group-hover:bg-[#5CDB95]" 
                    style={{ height: `${(s.expense / maxVal) * 100}%` }}
                    title={`Expense: ${formatCurrency(s.expense)}`}
                  />
                </div>
                <p className="text-[10px] font-medium text-[#379683]">{month}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-6 text-[10px] font-semibold uppercase tracking-wider text-[#379683]">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-[#05386B]" /> {dict.income}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-[#8EE4AF]" /> {dict.expense}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <ResponsiveSectionViews
          listLabel={locale === "vi" ? "Sổ giao dịch" : "Ledger"}
          listView={mobileLedger}
          monthLabel={locale === "vi" ? "Lịch tháng" : "Month"}
          monthView={monthView}
        />
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#05386B]">{dict.snapshot}</p>
            <div className="mt-4 space-y-2 text-sm text-[#20555F]">
              <p>{dict.income}: <span className="font-semibold text-[#05386B]">{formatCurrency(summary.income)}</span></p>
              <p>{dict.expense}: <span className="font-semibold text-[#05386B]">{formatCurrency(summary.expense)}</span></p>
              <p>{dict.balance}: <span className="font-semibold text-[#05386B]">{formatCurrency(summary.income - summary.expense)}</span></p>
            </div>
          </div>

          {/* Create Form */}
          <form action={createFinanceEntry} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#05386B]">{dict.record}</p>
            <div className="mt-4 grid gap-3">
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="title" placeholder={dictionary.common.untitled} required />
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={data.start} name="entryDate" type="date" required />
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" min="0" name="amount" placeholder="0" step="1000" type="number" required />
              <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="entryType">
                <option value="expense">{dict.expense}</option>
                <option value="income">{dict.income}</option>
              </select>
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="category" placeholder={dict.category} />
            </div>
            <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">
              {dictionary.common.save}
            </button>
          </form>

          {/* Recent Entries List */}
          <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#05386B]">{dict.recent}</p>
            <div className="mt-4 space-y-3">
              {data.entries.slice(-8).reverse().map((entry) => {
                const isEditing = editingId === entry.id;

                if (isEditing) {
                  return (
                    <form
                      key={entry.id}
                      action={(fd) => {
                        updateFinanceEntry(fd);
                        setEditingId(null);
                      }}
                      className="space-y-3 rounded-2xl border border-[#05386B] bg-[#F7FBF4] p-4"
                    >
                      <input type="hidden" name="id" value={entry.id} />
                      <div className="grid gap-2">
                        <input className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.title} name="title" required />
                        <div className="grid grid-cols-2 gap-2">
                          <input className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.entry_date} name="entryDate" type="date" required />
                          <input className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.amount} name="amount" type="number" required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.entry_type} name="entryType">
                            <option value="expense">{dict.expense}</option>
                            <option value="income">{dict.income}</option>
                          </select>
                          <input className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.category} name="category" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#05386B] py-2 text-xs font-medium text-[#EDF5E1]">
                          <Check className="size-3" /> {dictionary.common.save}
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="flex items-center justify-center rounded-xl border border-[#8EE4AF] bg-white px-3 py-2 text-xs font-medium text-[#20555F]">
                          <X className="size-3" />
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div className="flex items-center justify-between rounded-2xl bg-[#F7FBF4] px-4 py-3" key={entry.id}>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#05386B]">{entry.title}</p>
                      <p className="text-[10px] text-[#379683]">{entry.entry_date} • {entry.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-semibold ${entry.entry_type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                        {entry.entry_type === "income" ? "+" : "-"}{formatCurrency(Number(entry.amount))}
                      </p>
                      <div className="flex gap-1 border-l border-[#8EE4AF] pl-2">
                        <button onClick={() => setEditingId(entry.id)} className="p-1.5 text-[#379683] transition-colors hover:text-[#05386B]">
                          <Edit2 className="size-3.5" />
                        </button>
                        <form action={deleteFinanceEntry}>
                          <input name="id" type="hidden" value={entry.id} />
                          <button className="p-1.5 text-[#379683] transition-colors hover:text-rose-600" type="submit">
                            <Trash2 className="size-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
