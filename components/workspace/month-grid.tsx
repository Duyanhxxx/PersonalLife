type CalendarItem = {
  id: string;
  date: string;
  label: string;
  tone?: string;
  secondary?: string;
};

type MonthGridProps = {
  month: string;
  items: CalendarItem[];
};

const toneStyles: Record<string, string> = {
  blue: "bg-gray-900 text-white",
  green: "bg-gray-100 text-gray-900",
  amber: "bg-amber-100 text-amber-800",
  purple: "bg-violet-100 text-violet-700",
  red: "bg-rose-100 text-rose-700",
};

function buildDays(month: string) {
  const date = new Date(`${month}-01T00:00:00`);
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()));

  const days: Date[] = [];
  for (const current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    days.push(new Date(current));
  }
  return days;
}

export function MonthGrid({ month, items }: MonthGridProps) {
  const days = buildDays(month);
  const byDate = items.reduce<Record<string, CalendarItem[]>>((acc, item) => {
    acc[item.date] = [...(acc[item.date] ?? []), item];
    return acc;
  }, {});

  return (
    <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500" key={day}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const iso = localDateKey(day);
          const dayItems = byDate[iso] ?? [];
          const inMonth = iso.startsWith(month);

          return (
            <div className="min-h-32 border-b border-r border-gray-200 p-3" key={iso}>
              <p className={`text-sm font-semibold ${inMonth ? "text-gray-900" : "text-[#9ABAA8]"}`}>
                {day.getDate()}
              </p>
              <div className="mt-2 space-y-1.5">
                {dayItems.slice(0, 3).map((item) => (
                  <div
                    className={`rounded-xl px-2 py-1 text-xs font-medium ${toneStyles[item.tone ?? "blue"] ?? toneStyles.blue}`}
                    key={item.id}
                  >
                    <p className="truncate">{item.label}</p>
                    {item.secondary ? <p className="truncate opacity-80">{item.secondary}</p> : null}
                  </div>
                ))}
                {dayItems.length > 3 ? (
                  <p className="text-xs text-gray-500">+{dayItems.length - 3} more</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { localDateKey } from "@/lib/date";
