"use client";
import { getTodayDashboard } from "@/lib/workspace/dashboard";
import { useI18n } from "@/lib/i18n/i18n-context";
import { formatCurrency } from "@/lib/format";
import type { AwaitedReturn } from "@/types/utils";
import Link from "next/link";

type TodayDashboardProps = {
  data: AwaitedReturn<typeof getTodayDashboard>;
};

export function TodayDashboard({ data }: TodayDashboardProps) {
  const { locale, dictionary } = useI18n();
  const dict = dictionary.dashboard;
  return (
    <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
      <div className="rounded-[2rem] border border-gray-200 bg-gray-900 shadow-sm">
        <div className="rounded-[2rem] bg-gray-900 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            {locale === "vi" ? "Hôm nay" : "Today"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{dict.events}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {data.events.slice(0, 4).map((event) => (
              <div className="rounded-xl bg-white/10 px-4 py-3" key={event.id}>
                <p className="text-sm font-medium">{event.title}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {[event.start_time, event.end_time].filter(Boolean).join(" - ") || (locale === "vi" ? "Bất kỳ giờ nào" : "Any time")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          {dict.snapshot}
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm text-gray-700">{dict.income}</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(data.finance.income)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">{dict.expense}</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(data.finance.expense)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">{dict.balance}</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(data.finance.balance)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          {locale === "vi" ? "Tập trung" : "Focus"}
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{dict.tasks}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{data.tasks.length}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{dict.missions}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{data.missions.length}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{dict.reading}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{data.reading.length}</p>
          </div>
          <Link className="inline-flex text-sm font-medium text-gray-900 underline" href="/app/calendar">
            {locale === "vi" ? "Mở lịch đầy đủ" : "Open full calendar"}
          </Link>
        </div>
      </div>
    </section>
  );
}
