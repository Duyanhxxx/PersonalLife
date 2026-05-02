import Link from "next/link";
import type { AwaitedReturn } from "@/types/utils";
import { getTodayDashboard } from "@/lib/workspace/dashboard";

type TodayDashboardProps = {
  data: AwaitedReturn<typeof getTodayDashboard>;
};

export function TodayDashboard({ data }: TodayDashboardProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
      <div className="rounded-[2rem] border border-gray-200 bg-gray-900 shadow-sm">
        <div className="rounded-[2rem] bg-gray-900 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Hôm nay</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Lịch trong ngày</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {data.events.slice(0, 4).map((event) => (
              <div className="rounded-xl bg-white/10 px-4 py-3" key={event.id}>
                <p className="text-sm font-medium">{event.title}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {[event.start_time, event.end_time].filter(Boolean).join(" - ") || "Bất kỳ giờ nào"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Tiền hôm nay</p>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm text-gray-700">Thu nhập</p>
            <p className="text-2xl font-semibold text-gray-900">{data.finance.income.toFixed(2)} ₫</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">Chi tiêu</p>
            <p className="text-2xl font-semibold text-gray-900">{data.finance.expense.toFixed(2)} ₫</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">Cân bằng</p>
            <p className="text-2xl font-semibold text-gray-900">{data.finance.balance.toFixed(2)} ₫</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Tập trung</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">Công việc hôm nay</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{data.tasks.length}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">Nhiệm vụ đang thực hiện</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{data.missions.length}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">Hàng đợi đọc sách</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{data.reading.length}</p>
          </div>
          <Link className="inline-flex text-sm font-medium text-gray-900 underline" href="/app/calendar">
            Mở lịch đầy đủ
          </Link>
        </div>
      </div>
    </section>
  );
}
