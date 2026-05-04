"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Edit2, Trash2, X } from "lucide-react";
import { createFinanceEntry, deleteFinanceEntry, updateFinanceEntry } from "@/actions/finance-entries";
import { MonthGrid } from "@/components/workspace/month-grid";
import { ResponsiveSectionViews } from "@/components/workspace/responsive-section-views";
import { addMonth } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import type { FinanceEntry, FinanceWallet } from "@/types/section-data";

type FinanceLedgerPanelProps = {
  locale: "en" | "vi";
  monthKey: string;
  monthLabel: string;
  start: string;
  entries: FinanceEntry[];
  wallets: FinanceWallet[];
};

export function FinanceLedgerPanel({
  locale,
  monthKey,
  monthLabel,
  start,
  entries,
  wallets,
}: FinanceLedgerPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const monthView = useMemo(
    () => (
      <MonthGrid
        items={entries.map((entry) => ({
          id: entry.id,
          date: entry.entry_date,
          label: entry.title,
          tone: entry.entry_type === "income" ? "green" : "red",
          secondary: `${formatCurrency(Number(entry.amount))}${entry.wallet_name ? ` · ${entry.wallet_name}` : ""}`,
        }))}
        month={monthKey}
      />
    ),
    [entries, monthKey],
  );

  const mobileLedger = (
    <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-4 shadow-sm">
      <div className="space-y-3">
        {entries.length ? (
          entries
            .slice()
            .reverse()
            .map((entry) => (
              <div className="rounded-[1.5rem] bg-[#F7FBF4] px-4 py-3" key={`mobile-${entry.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#05386B]">{entry.title}</p>
                    <p className="text-xs text-[#379683]">
                      {entry.entry_date} · {entry.category}
                      {entry.wallet_name ? ` · ${entry.wallet_name}` : ""}
                    </p>
                  </div>
                  <p className={`text-xs font-semibold ${entry.entry_type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                    {entry.entry_type === "income" ? "+" : "-"}{formatCurrency(Number(entry.amount))}
                  </p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-sm text-[#20555F]">{locale === "vi" ? "Chưa có giao dịch." : "No entries yet."}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">{locale === "vi" ? "Lịch tài chính" : "Finance calendar"}</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#05386B]">{monthLabel}</h3>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/85 px-3 py-2 text-sm text-[#05386B]" href={`/app/finance?month=${addMonth(monthKey, -1)}`}>{locale === "vi" ? "Trước" : "Prev"}</Link>
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/85 px-3 py-2 text-sm text-[#05386B]" href={`/app/finance?month=${addMonth(monthKey, 1)}`}>{locale === "vi" ? "Tiếp" : "Next"}</Link>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <ResponsiveSectionViews
          listLabel={locale === "vi" ? "Sổ giao dịch" : "Ledger"}
          listView={mobileLedger}
          monthLabel={locale === "vi" ? "Lịch tháng" : "Month"}
          monthView={monthView}
        />

        <div className="space-y-4">
          <form action={createFinanceEntry} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#05386B]">{locale === "vi" ? "Ghi giao dịch" : "Record entry"}</p>
            <div className="mt-4 grid gap-3">
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="title" placeholder={locale === "vi" ? "Tên giao dịch" : "Entry title"} required />
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={start} name="entryDate" type="date" required />
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" min="0" name="amount" placeholder="0" step="1000" type="number" required />
              <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="entryType">
                <option value="expense">{locale === "vi" ? "Khoản chi" : "Expense"}</option>
                <option value="income">{locale === "vi" ? "Khoản thu" : "Income"}</option>
              </select>
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="category" placeholder={locale === "vi" ? "Danh mục" : "Category"} />
              <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="walletId">
                <option value="">{locale === "vi" ? "Không gắn ví" : "No wallet"}</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.title}
                  </option>
                ))}
              </select>
            </div>
            <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">
              {locale === "vi" ? "Lưu" : "Save"}
            </button>
          </form>

          <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#05386B]">{locale === "vi" ? "Giao dịch gần đây" : "Recent entries"}</p>
            <div className="mt-4 space-y-3">
              {entries.slice(-8).reverse().map((entry) => {
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
                      <input name="id" type="hidden" value={entry.id} />
                      <div className="grid gap-2">
                        <input className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.title} name="title" required />
                        <div className="grid grid-cols-2 gap-2">
                          <input className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.entry_date} name="entryDate" type="date" required />
                          <input className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.amount} name="amount" type="number" required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.entry_type} name="entryType">
                            <option value="expense">{locale === "vi" ? "Khoản chi" : "Expense"}</option>
                            <option value="income">{locale === "vi" ? "Khoản thu" : "Income"}</option>
                          </select>
                          <input className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.category} name="category" />
                        </div>
                        <select className="h-9 rounded-xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={entry.wallet_id ?? ""} name="walletId">
                          <option value="">{locale === "vi" ? "Không gắn ví" : "No wallet"}</option>
                          {wallets.map((wallet) => (
                            <option key={wallet.id} value={wallet.id}>
                              {wallet.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#05386B] py-2 text-xs font-medium text-[#EDF5E1]">
                          <Check className="size-3" /> {locale === "vi" ? "Lưu" : "Save"}
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
                      <p className="text-[10px] text-[#379683]">
                        {entry.entry_date} · {entry.category}
                        {entry.wallet_name ? ` · ${entry.wallet_name}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-semibold ${entry.entry_type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                        {entry.entry_type === "income" ? "+" : "-"}{formatCurrency(Number(entry.amount))}
                      </p>
                      <div className="flex gap-1 border-l border-[#8EE4AF] pl-2">
                        <button className="p-1.5 text-[#379683] transition-colors hover:text-[#05386B]" onClick={() => setEditingId(entry.id)} type="button">
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
    </div>
  );
}
