import Link from "next/link";
import { createPlannerEvent, deletePlannerEvent } from "@/actions/planner-events";
import { addMonth } from "@/lib/date";
import { MonthGrid } from "@/components/workspace/month-grid";
import type { AwaitedReturn } from "@/types/utils";
import { getDictionary, getLanguage } from "@/lib/i18n/get-dictionary";

type CalendarSectionProps = {
  data: AwaitedReturn<typeof getPlannerEvents>;
};

export async function CalendarSection({ data }: CalendarSectionProps) {
  const dictionary = await getDictionary();
  const locale = await getLanguage();
  const dict = dictionary.calendar;
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{dict.title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">{data.monthLabel}</h3>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900" href={`/app/calendar?month=${addMonth(data.monthKey, -1)}`}>{dictionary.finance.prev}</Link>
          <Link className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900" href={`/app/calendar?month=${addMonth(data.monthKey, 1)}`}>{dictionary.finance.next}</Link>
        </div>
      </div>
      <MonthGrid
        items={data.events.map((event) => ({
          id: event.id,
          date: event.entry_date,
          label: event.title,
          tone: event.tone,
          secondary: [event.start_time, event.end_time].filter(Boolean).join(" - "),
        }))}
        month={data.monthKey}
      />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <form action={createPlannerEvent} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">{dict.new}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="title" placeholder="Tên sự kiện" required />
            <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" defaultValue={data.start} name="entryDate" type="date" required />
            <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="startTime" type="time" />
            <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="endTime" type="time" />
            <select className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="tone">
              <option value="blue">{locale === "vi" ? "Làm việc sâu" : "Deep work"}</option>
              <option value="green">{locale === "vi" ? "Thói quen" : "Habits"}</option>
              <option value="amber">{locale === "vi" ? "Chiến lược" : "Strategy"}</option>
              <option value="purple">{locale === "vi" ? "Bán thời gian" : "Part-time"}</option>
              <option value="red">{locale === "vi" ? "Khẩn cấp" : "Urgent"}</option>
            </select>
            <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="notes" placeholder={dictionary.dashboard.events} />
          </div>
          <button className="mt-4 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white" type="submit">{dictionary.common.save}</button>
        </form>
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">{dictionary.dashboard.events}</p>
          <div className="mt-4 space-y-3">
            {data.events.slice(0, 8).map((event) => (
              <form action={deletePlannerEvent} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3" key={event.id}>
                <input name="id" type="hidden" value={event.id} />
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.entry_date} {[event.start_time, event.end_time].filter(Boolean).join(" - ")}</p>
                </div>
                <button className="text-xs font-medium text-rose-700" type="submit">{dictionary.common.delete}</button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
