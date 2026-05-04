"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createPlannerEvent, deletePlannerEvent } from "@/actions/planner-events";
import { MonthGrid } from "@/components/workspace/month-grid";
import { CalendarTimeGrid } from "@/components/workspace/calendar-time-grid";
import { CalendarTimelineView } from "@/components/workspace/calendar-timeline-view";
import { addMonth } from "@/lib/date";
import { useI18n } from "@/lib/i18n/i18n-context";
import type { PlannerEvent } from "@/types/section-data";

type CalendarPlannerProps = {
  monthKey: string;
  monthLabel: string;
  start: string;
  end: string;
  events: PlannerEvent[];
};

type ViewMode = "month" | "week" | "day" | "timeline";

const CONTEXTS = ["work", "personal", "health", "study"] as const;
const toneLabels: Record<string, string> = {
  blue: "Deep work",
  green: "Habits",
  amber: "Strategy",
  purple: "Part-time",
  red: "Urgent",
};

function getWeekDays(anchorDate: string) {
  const date = new Date(`${anchorDate}T00:00:00+07:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(date);
    current.setDate(date.getDate() + index);
    return new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(current);
  });
}

export function CalendarPlanner({
  monthKey,
  monthLabel,
  start,
  end,
  events,
}: CalendarPlannerProps) {
  const { dictionary, locale } = useI18n();
  const [view, setView] = useState<ViewMode>("month");
  const [activeContexts, setActiveContexts] = useState<string[]>([...CONTEXTS]);
  const [focusDate, setFocusDate] = useState(start);

  const filteredEvents = useMemo(
    () => events.filter((event) => activeContexts.includes(event.context)),
    [activeContexts, events],
  );

  const weekDays = useMemo(() => getWeekDays(focusDate), [focusDate]);
  const dayEvents = filteredEvents.filter((event) => event.entry_date === focusDate);

  const monthView = (
    <MonthGrid
      items={filteredEvents.map((event) => ({
        id: event.id,
        date: event.entry_date,
        label: event.title,
        tone: event.tone,
        secondary: [event.start_time, event.end_time].filter(Boolean).join(" - "),
      }))}
      month={monthKey}
    />
  );

  const agendaView = (
    <div className="space-y-3">
      {filteredEvents.length ? (
        filteredEvents.map((event) => (
          <form action={deletePlannerEvent} className="flex items-center justify-between rounded-[1.5rem] border border-[#8EE4AF]/40 bg-[#F7FBF4] px-4 py-3" key={event.id}>
            <input name="id" type="hidden" value={event.id} />
            <div>
              <p className="font-medium text-[#05386B]">{event.title}</p>
              <p className="text-xs text-[#379683]">
                {event.entry_date}
                {event.end_date && event.end_date !== event.entry_date ? ` -> ${event.end_date}` : ""}
                {" · "}
                {event.context}
                {" · "}
                {[event.start_time, event.end_time].filter(Boolean).join(" - ") || toneLabels[event.tone] || event.tone}
              </p>
            </div>
            <button className="text-xs font-medium text-rose-700" type="submit">
              {dictionary.common.delete}
            </button>
          </form>
        ))
      ) : (
        <p className="rounded-[1.5rem] border border-dashed border-[#8EE4AF] bg-[#F7FBF4] p-4 text-sm text-[#20555F]">
          {locale === "vi" ? "Chưa có sự kiện nào trong bộ lọc này." : "No events in this filter yet."}
        </p>
      )}
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">{dictionary.sections.calendar}</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#05386B]">{monthLabel}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/85 px-3 py-2 text-sm text-[#05386B]" href={`/app/calendar?month=${addMonth(monthKey, -1)}`}>{dictionary.finance.prev}</Link>
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/85 px-3 py-2 text-sm text-[#05386B]" href={`/app/calendar?month=${addMonth(monthKey, 1)}`}>{dictionary.finance.next}</Link>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["month", "week", "day", "timeline"] as ViewMode[]).map((mode) => (
              <button
                className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${view === mode ? "bg-[#05386B] text-[#EDF5E1]" : "bg-[#EDF5E1] text-[#20555F]"}`}
                key={mode}
                onClick={() => setView(mode)}
                type="button"
              >
                {mode === "month" ? (locale === "vi" ? "Tháng" : "Month") : null}
                {mode === "week" ? (locale === "vi" ? "Tuần" : "Week") : null}
                {mode === "day" ? (locale === "vi" ? "Ngày" : "Day") : null}
                {mode === "timeline" ? "Timeline" : null}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {CONTEXTS.map((context) => {
              const active = activeContexts.includes(context);
              return (
                <button
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${active ? "border-[#05386B] bg-[#05386B] text-[#EDF5E1]" : "border-[#8EE4AF] bg-white text-[#20555F]"}`}
                  key={context}
                  onClick={() =>
                    setActiveContexts((current) =>
                      current.includes(context)
                        ? current.filter((item) => item !== context)
                        : [...current, context],
                    )
                  }
                  type="button"
                >
                  {context}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.95fr]">
        <div className="space-y-4">
          {view === "month" ? monthView : null}
          {view === "week" ? <CalendarTimeGrid days={weekDays} events={filteredEvents} locale={locale} /> : null}
          {view === "day" ? <CalendarTimeGrid days={[focusDate]} events={dayEvents} locale={locale} /> : null}
          {view === "timeline" ? (
            <CalendarTimelineView events={filteredEvents} locale={locale} monthEnd={end} monthStart={start} />
          ) : null}

          {(view === "week" || view === "day") ? (
            <div className="flex flex-wrap gap-2">
              <button className="rounded-2xl border border-[#8EE4AF] bg-white px-3 py-2 text-sm text-[#05386B]" onClick={() => setFocusDate(weekDays[0] ?? start)} type="button">
                {locale === "vi" ? "Đầu tuần" : "Week start"}
              </button>
              <button className="rounded-2xl border border-[#8EE4AF] bg-white px-3 py-2 text-sm text-[#05386B]" onClick={() => setFocusDate(new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()))} type="button">
                {locale === "vi" ? "Hôm nay" : "Today"}
              </button>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <form action={createPlannerEvent} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#05386B]">{locale === "vi" ? "Sự kiện mới" : "New event"}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="title" placeholder={locale === "vi" ? "Tên khối thời gian" : "Time block title"} required />
              <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="context">
                <option value="work">{locale === "vi" ? "Công việc" : "Work"}</option>
                <option value="personal">{locale === "vi" ? "Cá nhân" : "Personal"}</option>
                <option value="health">{locale === "vi" ? "Sức khoẻ" : "Health"}</option>
                <option value="study">{locale === "vi" ? "Học tập" : "Study"}</option>
              </select>
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={start} name="entryDate" type="date" required />
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue={start} name="endDate" type="date" />
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="startTime" type="time" />
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="endTime" type="time" />
              <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="tone">
                <option value="blue">{locale === "vi" ? "Tập trung" : "Focus"}</option>
                <option value="green">{locale === "vi" ? "Thói quen" : "Habits"}</option>
                <option value="amber">{locale === "vi" ? "Kế hoạch" : "Planning"}</option>
                <option value="purple">{locale === "vi" ? "Di chuyển" : "Travel"}</option>
                <option value="red">{locale === "vi" ? "Khẩn cấp" : "Urgent"}</option>
              </select>
              <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="notes" placeholder={locale === "vi" ? "Ghi chú hoặc mục đích" : "Notes or purpose"} />
            </div>
            <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">
              {dictionary.common.save}
            </button>
          </form>

          <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#05386B]">
              {view === "timeline"
                ? locale === "vi"
                  ? "Các dải nhiều ngày"
                  : "Multi-day strips"
                : dictionary.dashboard.events}
            </p>
            <div className="mt-4">{agendaView}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
