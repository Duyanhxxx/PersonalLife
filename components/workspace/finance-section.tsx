import { createFinanceEntry, deleteFinanceEntry } from "@/actions/finance-entries";
import { addMonth } from "@/lib/date";
import { getFinanceEntries } from "@/lib/workspace/finance";
import { MonthGrid } from "@/components/workspace/month-grid";
import type { AwaitedReturn } from "@/types/utils";
import Link from "next/link";

type FinanceSectionProps = {
  data: AwaitedReturn<typeof getFinanceEntries>;
};

export function FinanceSection({ data }: FinanceSectionProps) {
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Lịch tài chính</p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">{data.monthLabel}</h3>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900" href={`/app/finance?month=${addMonth(data.monthKey, -1)}`}>Trước</Link>
          <Link className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900" href={`/app/finance?month=${addMonth(data.monthKey, 1)}`}>Tiếp</Link>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <MonthGrid
          items={data.entries.map((entry) => ({
            id: entry.id,
            date: entry.entry_date,
            label: entry.title,
            tone: entry.entry_type === "income" ? "green" : "red",
            secondary: `$${Number(entry.amount).toFixed(2)}`,
          }))}
          month={data.monthKey}
        />
        <div className="space-y-4">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Tổng hợp tháng</p>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>Thu nhập: <span className="font-semibold text-gray-900">${summary.income.toFixed(2)}</span></p>
              <p>Chi tiêu: <span className="font-semibold text-gray-900">${summary.expense.toFixed(2)}</span></p>
              <p>Cân bằng: <span className="font-semibold text-gray-900">${(summary.income - summary.expense).toFixed(2)}</span></p>
            </div>
          </div>
          <form action={createFinanceEntry} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Ghi khoản</p>
            <div className="mt-4 grid gap-3">
              <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="title" placeholder="Tên khoản" required />
              <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" defaultValue={data.start} name="entryDate" type="date" required />
              <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" min="0" name="amount" placeholder="0.00" step="0.01" type="number" required />
              <select className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="entryType">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="category" placeholder="Danh mục" />
            </div>
            <button className="mt-4 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white" type="submit">Lưu</button>
          </form>
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Giao dịch gần đây</p>
            <div className="mt-4 space-y-3">
              {data.entries.slice(-6).reverse().map((entry) => (
                <form action={deleteFinanceEntry} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3" key={entry.id}>
                  <input name="id" type="hidden" value={entry.id} />
                  <div>
                    <p className="font-medium text-gray-900">{entry.title}</p>
                    <p className="text-xs text-gray-500">{entry.entry_date} • {entry.category}</p>
                  </div>
                  <button className="text-xs font-medium text-rose-700" type="submit">
                    {entry.entry_type === "income" ? "+" : "-"}${Number(entry.amount).toFixed(2)}
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
