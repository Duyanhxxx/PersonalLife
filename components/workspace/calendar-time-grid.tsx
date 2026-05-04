"use client";

import type { PlannerEvent } from "@/types/section-data";

type CalendarTimeGridProps = {
  days: string[];
  events: PlannerEvent[];
  locale: "en" | "vi";
};

const HOURS = Array.from({ length: 17 }, (_, index) => index + 6);

const contextColors: Record<string, string> = {
  work: "bg-[#05386B] text-white",
  personal: "bg-[#379683] text-white",
  health: "bg-[#5CDB95] text-[#05386B]",
  study: "bg-[#8EE4AF] text-[#05386B]",
};

function getMinutes(value: string | null, fallback: number) {
  if (!value) return fallback;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function dayLabel(dateKey: string, locale: "en" | "vi") {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(`${dateKey}T00:00:00+07:00`));
}

export function CalendarTimeGrid({
  days,
  events,
  locale,
}: CalendarTimeGridProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 shadow-sm">
      <div className={`grid border-b border-[#8EE4AF]/40 ${days.length === 1 ? "grid-cols-[72px_1fr]" : "grid-cols-[72px_repeat(7,minmax(0,1fr))]"}`}>
        <div className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">
          {locale === "vi" ? "Giờ" : "Time"}
        </div>
        {days.map((day) => (
          <div className="border-l border-[#8EE4AF]/40 px-4 py-3 text-sm font-semibold text-[#05386B]" key={day}>
            {dayLabel(day, locale)}
          </div>
        ))}
      </div>

      <div className="relative grid max-h-[640px] overflow-auto" style={{ gridTemplateColumns: `72px repeat(${days.length}, minmax(0, 1fr))` }}>
        <div className="contents">
          {HOURS.map((hour) => (
            <div className="contents" key={hour}>
              <div className="h-20 border-b border-[#EDF5E1] px-3 py-2 text-[11px] font-medium text-[#379683]">
                {String(hour).padStart(2, "0")}:00
              </div>
              {days.map((day) => (
                <div className="relative h-20 border-b border-l border-[#EDF5E1]" key={`${day}-${hour}`} />
              ))}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `72px repeat(${days.length}, minmax(0, 1fr))` }}>
          <div />
          {days.map((day, dayIndex) => {
            const timedEvents = events.filter((event) => event.entry_date === day);

            return (
              <div className="relative border-l border-transparent" key={`overlay-${day}`}>
                {timedEvents.map((event) => {
                  const startMinutes = getMinutes(event.start_time, 9 * 60);
                  const endMinutes = getMinutes(event.end_time, startMinutes + 60);
                  const top = ((startMinutes - 6 * 60) / 60) * 80;
                  const height = Math.max(52, ((endMinutes - startMinutes) / 60) * 80);

                  return (
                    <div
                      className={`pointer-events-auto absolute left-2 right-2 overflow-hidden rounded-2xl px-3 py-2 shadow-sm ${contextColors[event.context] ?? contextColors.personal}`}
                      key={`${event.id}-${dayIndex}`}
                      style={{ top: `${top}px`, height: `${height}px` }}
                      title={event.notes ?? event.title}
                    >
                      <p className="line-clamp-2 text-sm font-semibold">{event.title}</p>
                      <p className="mt-1 text-[11px] opacity-85">
                        {[event.start_time, event.end_time].filter(Boolean).join(" - ") ||
                          (locale === "vi" ? "Linh hoạt" : "Flexible")}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
