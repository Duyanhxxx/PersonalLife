import Link from "next/link";
import { createPlannerEvent, deletePlannerEvent } from "@/actions/planner-events";
import { addMonth } from "@/lib/date";
import { MonthGrid } from "@/components/workspace/month-grid";
import { ResponsiveSectionViews } from "@/components/workspace/responsive-section-views";
import { getPlannerEvents } from "@/lib/workspace/planner";
import type { AwaitedReturn } from "@/types/utils";
import { getDictionary, getLanguage } from "@/lib/i18n/get-dictionary";

type CalendarSectionProps = {
  data: AwaitedReturn<typeof getPlannerEvents>;
};

export async function CalendarSection({ data }: CalendarSectionProps) {
  const dictionary = await getDictionary();
  const locale = await getLanguage();
  const title = dictionary.sections.calendar;
  const eventsLabel = dictionary.dashboard.events;
  const createLabel = locale === "vi" ? "Sự kiện mới" : "New event";
  const monthView = (
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
  );

  const agendaView = (
    <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-4 shadow-sm">
      <div className="space-y-3">
        {data.events.length ? (
          data.events.map((event) => (
            <div className="rounded-2xl bg-[#F7FBF4] px-4 py-3" key={`agenda-${event.id}`}>
              <p className="font-medium text-[#05386B]">{event.title}</p>
              <p className="text-xs text-[#379683]">
                {event.entry_date} {[event.start_time, event.end_time].filter(Boolean).join(" - ")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#20555F]">{eventsLabel}</p>
        )}
      </div>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#05386B]">{data.monthLabel}</h3>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/85 px-3 py-2 text-sm text-[#05386B]" href={`/app/calendar?month=${addMonth(data.monthKey, -1)}`}>{dictionary.finance.prev}</Link>
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/85 px-3 py-2 text-sm text-[#05386B]" href={`/app/calendar?month=${addMonth(data.monthKey, 1)}`}>{dictionary.finance.next}</Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <ResponsiveSectionViews
          listLabel={locale === "vi" ? "Danh sách" : "Agenda"}
          monthLabel={locale === "vi" ? "Tháng" : "Month"}
          monthView={monthView}
          listView={agendaView}
        />

        <div className="space-y-4">
        <form action={createPlannerEvent} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#05386B]">{createLabel}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="title" placeholder="Tên sự kiện" required />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={data.start} name="entryDate" type="date" required />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="startTime" type="time" />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="endTime" type="time" />
            <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="tone">
              <option value="blue">{locale === "vi" ? "Làm việc sâu" : "Deep work"}</option>
              <option value="green">{locale === "vi" ? "Thói quen" : "Habits"}</option>
              <option value="amber">{locale === "vi" ? "Chiến lược" : "Strategy"}</option>
              <option value="purple">{locale === "vi" ? "Bán thời gian" : "Part-time"}</option>
              <option value="red">{locale === "vi" ? "Khẩn cấp" : "Urgent"}</option>
            </select>
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="notes" placeholder={dictionary.dashboard.events} />
          </div>
          <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">{dictionary.common.save}</button>
        </form>
        <div className="hidden rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm md:block">
          <p className="text-sm font-semibold text-[#05386B]">{eventsLabel}</p>
          <div className="mt-4 space-y-3">
            {data.events.slice(0, 8).map((event) => (
              <form action={deletePlannerEvent} className="flex items-center justify-between rounded-2xl bg-[#F7FBF4] px-4 py-3" key={event.id}>
                <input name="id" type="hidden" value={event.id} />
                <div>
                  <p className="font-medium text-[#05386B]">{event.title}</p>
                  <p className="text-xs text-[#379683]">{event.entry_date} {[event.start_time, event.end_time].filter(Boolean).join(" - ")}</p>
                </div>
                <button className="text-xs font-medium text-rose-700" type="submit">{dictionary.common.delete}</button>
              </form>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
