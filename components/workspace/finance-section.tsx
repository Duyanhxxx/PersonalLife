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
import { Trash2, Edit2, Check, X } from "lucide-react";

type FinanceSectionProps = {
  data: AwaitedReturn<typeof getFinanceEntries>;
};

export function FinanceSection({ data }: FinanceSectionProps) {
  const { dictionary } = useI18n();
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

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{dict.title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">{data.monthLabel}</h3>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900" href={`/app/finance?month=${addMonth(data.monthKey, -1)}`}>{dict.prev}</Link>
          <Link className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900" href={`/app/finance?month=${addMonth(data.monthKey, 1)}`}>{dict.next}</Link>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
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
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{dict.snapshot}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>{dict.income}: <span className="font-semibold text-gray-900">{formatCurrency(summary.income)}</span></p>
              <p>{dict.expense}: <span className="font-semibold text-gray-900">{formatCurrency(summary.expense)}</span></p>
              <p>{dict.balance}: <span className="font-semibold text-gray-900">{formatCurrency(summary.income - summary.expense)}</span></p>
            </div>
          </div>

          {/* Create Form */}
          <form action={createFinanceEntry} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{dict.record}</p>
            <div className="mt-4 grid gap-3">
              <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="title" placeholder={dictionary.common.untitled} required />
              <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" defaultValue={data.start} name="entryDate" type="date" required />
              <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" min="0" name="amount" placeholder="0" step="1000" type="number" required />
              <select className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="entryType">
                <option value="expense">{dict.expense}</option>
                <option value="income">{dict.income}</option>
              </select>
              <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="category" placeholder={dict.category} />
            </div>
            <button className="mt-4 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white" type="submit">
              {dictionary.common.save}
            </button>
          </form>

          {/* Recent Entries List */}
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{dict.recent}</p>
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
                      className="rounded-2xl border border-gray-900 bg-gray-50 p-4 space-y-3"
                    >
                      <input type="hidden" name="id" value={entry.id} />
                      <div className="grid gap-2">
                        <input className="h-9 rounded-xl border border-gray-300 px-3 text-sm" defaultValue={entry.title} name="title" required />
                        <div className="grid grid-cols-2 gap-2">
                          <input className="h-9 rounded-xl border border-gray-300 px-3 text-sm" defaultValue={entry.entry_date} name="entryDate" type="date" required />
                          <input className="h-9 rounded-xl border border-gray-300 px-3 text-sm" defaultValue={entry.amount} name="amount" type="number" required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select className="h-9 rounded-xl border border-gray-300 px-3 text-sm" defaultValue={entry.entry_type} name="entryType">
                            <option value="expense">{dict.expense}</option>
                            <option value="income">{dict.income}</option>
                          </select>
                          <input className="h-9 rounded-xl border border-gray-300 px-3 text-sm" defaultValue={entry.category} name="category" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-gray-900 py-2 text-xs font-medium text-white">
                          <Check className="size-3" /> {dictionary.common.save}
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700">
                          <X className="size-3" />
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3" key={entry.id}>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">{entry.title}</p>
                      <p className="text-[10px] text-gray-500">{entry.entry_date} • {entry.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-semibold ${entry.entry_type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                        {entry.entry_type === "income" ? "+" : "-"}{formatCurrency(Number(entry.amount))}
                      </p>
                      <div className="flex gap-1 border-l border-gray-200 pl-2">
                        <button onClick={() => setEditingId(entry.id)} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
                          <Edit2 className="size-3.5" />
                        </button>
                        <form action={deleteFinanceEntry}>
                          <input name="id" type="hidden" value={entry.id} />
                          <button className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors" type="submit">
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
