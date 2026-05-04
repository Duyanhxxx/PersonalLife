"use client";

import type { PlannerEvent } from "@/types/section-data";

type CalendarTimelineViewProps = {
  events: PlannerEvent[];
  monthStart: string;
  monthEnd: string;
  locale: "en" | "vi";
};

const contextColors: Record<string, string> = {
  work: "bg-[#05386B]",
  personal: "bg-[#379683]",
  health: "bg-[#5CDB95]",
  study: "bg-[#8EE4AF]",
};

function dateDiff(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00+07:00`).getTime();
  const endDate = new Date(`${end}T00:00:00+07:00`).getTime();
  return Math.max(0, Math.round((endDate - startDate) / 86400000));
}

function formatRange(start: string, end: string, locale: "en" | "vi") {
  const formatter = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
  return `${formatter.format(new Date(`${start}T00:00:00+07:00`))} - ${formatter.format(new Date(`${end}T00:00:00+07:00`))}`;
}

export function CalendarTimelineView({
  events,
  monthStart,
  monthEnd,
  locale,
}: CalendarTimelineViewProps) {
  const totalDays = dateDiff(monthStart, monthEnd) + 1;
  const rangedEvents = events.filter((event) => (event.end_date ?? event.entry_date) !== event.entry_date);

  return (
    <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
      <div className="space-y-4">
        {rangedEvents.length ? (
          rangedEvents.map((event) => {
            const startOffset = dateDiff(monthStart, event.entry_date);
            const span = dateDiff(event.entry_date, event.end_date ?? event.entry_date) + 1;
            return (
              <div className="space-y-2" key={event.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#05386B]">{event.title}</p>
                    <p className="text-xs text-[#379683]">{formatRange(event.entry_date, event.end_date ?? event.entry_date, locale)}</p>
                  </div>
                  <span className="rounded-full bg-[#EDF5E1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#20555F]">
                    {event.context}
                  </span>
                </div>
                <div className="h-4 rounded-full bg-[#EDF5E1]">
                  <div
                    className={`h-full rounded-full ${contextColors[event.context] ?? contextColors.personal}`}
                    style={{
                      marginLeft: `${(startOffset / totalDays) * 100}%`,
                      width: `${Math.max((span / totalDays) * 100, 6)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-[1.5rem] border border-dashed border-[#8EE4AF] bg-[#F7FBF4] p-4 text-sm text-[#20555F]">
            {locale === "vi"
              ? "Chưa có sự kiện nhiều ngày trong khoảng này."
              : "No multi-day events in this range yet."}
          </p>
        )}
      </div>
    </div>
  );
}
