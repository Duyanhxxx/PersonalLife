import Link from "next/link";
import type { AwaitedReturn } from "@/types/utils";
import { getTodayDashboard } from "@/lib/workspace/dashboard";

type TodayDashboardProps = {
  data: AwaitedReturn<typeof getTodayDashboard>;
};

export function TodayDashboard({ data }: TodayDashboardProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
      <div className="rounded-[2rem] bg-gradient-to-br from-[#05386B] via-[#1E5C7A] to-[#379683] p-[1px] shadow-[0_24px_90px_rgba(5,56,107,0.2)]">
        <div className="rounded-[calc(2rem-1px)] bg-[linear-gradient(180deg,rgba(8,51,98,0.96),rgba(21,99,112,0.96))] p-6 text-[#EDF5E1]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8EE4AF]">Today dashboard</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">What matters today</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {data.events.slice(0, 4).map((event) => (
              <div className="rounded-2xl bg-white/10 px-4 py-3" key={event.id}>
                <p className="text-sm font-medium">{event.title}</p>
                <p className="mt-1 text-xs text-[#CBEAD8]">
                  {[event.start_time, event.end_time].filter(Boolean).join(" - ") || "Any time"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">Today money</p>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm text-[#20555F]">Income</p>
            <p className="text-2xl font-semibold text-[#05386B]">${data.finance.income.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-[#20555F]">Expense</p>
            <p className="text-2xl font-semibold text-[#05386B]">${data.finance.expense.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-[#20555F]">Balance</p>
            <p className="text-2xl font-semibold text-[#05386B]">${data.finance.balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">Focus stack</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-[#F6FBF4] px-4 py-3">
            <p className="text-sm font-medium text-[#05386B]">Tasks today</p>
            <p className="mt-1 text-2xl font-semibold text-[#05386B]">{data.tasks.length}</p>
          </div>
          <div className="rounded-2xl bg-[#F6FBF4] px-4 py-3">
            <p className="text-sm font-medium text-[#05386B]">Active missions</p>
            <p className="mt-1 text-2xl font-semibold text-[#05386B]">{data.missions.length}</p>
          </div>
          <div className="rounded-2xl bg-[#F6FBF4] px-4 py-3">
            <p className="text-sm font-medium text-[#05386B]">Reading queue</p>
            <p className="mt-1 text-2xl font-semibold text-[#05386B]">{data.reading.length}</p>
          </div>
          <Link className="inline-flex text-sm font-medium text-[#05386B]" href="/app?section=calendar">
            Open full planner
          </Link>
        </div>
      </div>
    </section>
  );
}
