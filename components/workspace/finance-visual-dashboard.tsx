"use client";

import { TrendingUp, WalletCards } from "lucide-react";
import { formatCurrency } from "@/lib/format";

type FinanceVisualDashboardProps = {
  locale: "en" | "vi";
  income: number;
  expense: number;
  balance: number;
  stats: [string, { income: number; expense: number }][];
  projection: {
    currentMonthBalance: number;
    upcomingNet: number;
    endOfMonthEstimate: number;
  };
  categoryBreakdown: [string, number][];
};

export function FinanceVisualDashboard({
  locale,
  income,
  expense,
  balance,
  stats,
  projection,
  categoryBreakdown,
}: FinanceVisualDashboardProps) {
  const maxVal = Math.max(...stats.map(([, series]) => Math.max(series.income, series.expense)), 1);
  const totalCategorySpend = categoryBreakdown.reduce((sum, [, value]) => sum + value, 0);
  const gradient = categoryBreakdown.length
    ? `conic-gradient(${categoryBreakdown
        .map(([, value], index) => {
          const start = categoryBreakdown
            .slice(0, index)
            .reduce((sum, [, inner]) => sum + inner, 0);
          const startPct = (start / totalCategorySpend) * 100;
          const endPct = ((start + value) / totalCategorySpend) * 100;
          const color = ["#05386B", "#379683", "#5CDB95", "#8EE4AF", "#5A8F7B", "#2F5D62"][index % 6];
          return `${color} ${startPct}% ${endPct}%`;
        })
        .join(", ")})`
    : "conic-gradient(#EDF5E1 0 100%)";

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
      <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-[#05386B]" />
          <p className="text-sm font-semibold text-[#05386B]">
            {locale === "vi" ? "Dòng tiền & dự báo" : "Cashflow & projection"}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.5rem] bg-[#F7FBF4] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#379683]">{locale === "vi" ? "Thu" : "Income"}</p>
            <p className="mt-2 text-xl font-semibold text-[#05386B]">{formatCurrency(income)}</p>
          </div>
          <div className="rounded-[1.5rem] bg-[#F7FBF4] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#379683]">{locale === "vi" ? "Chi" : "Expense"}</p>
            <p className="mt-2 text-xl font-semibold text-[#05386B]">{formatCurrency(expense)}</p>
          </div>
          <div className="rounded-[1.5rem] bg-[#F7FBF4] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#379683]">{locale === "vi" ? "Số dư" : "Balance"}</p>
            <p className="mt-2 text-xl font-semibold text-[#05386B]">{formatCurrency(balance)}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-[#8EE4AF]/40 bg-[#F7FBF4] p-4">
          <div className="flex items-center gap-2">
            <WalletCards className="size-4 text-[#05386B]" />
            <p className="text-sm font-semibold text-[#05386B]">
              {locale === "vi" ? "Cuối tháng còn lại" : "End-of-month estimate"}
            </p>
          </div>
          <p className="mt-3 text-3xl font-semibold text-[#05386B]">
            {formatCurrency(projection.endOfMonthEstimate)}
          </p>
          <div className="mt-3 grid gap-2 text-sm text-[#20555F] sm:grid-cols-2">
            <p>{locale === "vi" ? "Thực tế hiện tại" : "Current actual"}: <span className="font-semibold">{formatCurrency(projection.currentMonthBalance)}</span></p>
            <p>{locale === "vi" ? "Cam kết sắp tới" : "Upcoming commitments"}: <span className="font-semibold">{formatCurrency(projection.upcomingNet)}</span></p>
          </div>
        </div>

        {stats.length > 0 ? (
          <div className="mt-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#05386B]">{locale === "vi" ? "So sánh 6 tháng" : "6-month comparison"}</p>
            </div>
            <div className="flex h-52 items-end justify-between gap-2 md:gap-4 px-2">
              {stats.map(([month, series]) => (
                <div key={month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full max-w-[60px] items-end gap-1">
                    <div className="flex-1 rounded-t-lg bg-[#05386B]" style={{ height: `${(series.income / maxVal) * 100}%` }} />
                    <div className="flex-1 rounded-t-lg bg-[#8EE4AF]" style={{ height: `${(series.expense / maxVal) * 100}%` }} />
                  </div>
                  <p className="text-[10px] font-medium text-[#379683]">{month}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#05386B]">
          {locale === "vi" ? "Tỷ trọng chi tiêu theo danh mục" : "Expense category mix"}
        </p>
        <div className="mt-6 flex flex-col items-center gap-6">
          <div
            className="h-48 w-48 rounded-full border border-white/80 shadow-inner"
            style={{ background: gradient }}
          />
          <div className="w-full space-y-2">
            {categoryBreakdown.length ? (
              categoryBreakdown.map(([category, value], index) => {
                const color = ["#05386B", "#379683", "#5CDB95", "#8EE4AF", "#5A8F7B", "#2F5D62"][index % 6];
                const percentage = totalCategorySpend > 0 ? Math.round((value / totalCategorySpend) * 100) : 0;
                return (
                  <div className="flex items-center justify-between gap-3" key={category}>
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-[#20555F]">{category}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#05386B]">
                      {percentage}% · {formatCurrency(value)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="rounded-[1.5rem] border border-dashed border-[#8EE4AF] bg-[#F7FBF4] p-4 text-sm text-[#20555F]">
                {locale === "vi" ? "Chưa có dữ liệu chi tiêu để dựng biểu đồ." : "No expense data yet for the category chart."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
