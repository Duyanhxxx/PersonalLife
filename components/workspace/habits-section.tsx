"use client";

import { createHabit, deleteHabit, toggleHabitLog } from "@/actions/habits";
import type { Habit, HabitLog } from "@/lib/workspace/habits";
import { useI18n } from "@/lib/i18n/i18n-context";
import { Trash2, Flame } from "lucide-react";

type HabitsSectionProps = {
  habits: (Habit & { streak: number; last90Days: HabitLog[] })[];
  todayLogs: HabitLog[];
  allLogs: HabitLog[];
};

const colorMap: Record<string, { bg: string; ring: string; check: string; dot: string }> = {
  blue: { bg: "bg-sky-100", ring: "ring-sky-300", check: "bg-sky-500", dot: "bg-sky-400" },
  green: { bg: "bg-emerald-100", ring: "ring-emerald-300", check: "bg-emerald-500", dot: "bg-emerald-400" },
  amber: { bg: "bg-amber-100", ring: "ring-amber-300", check: "bg-amber-500", dot: "bg-amber-400" },
  violet: { bg: "bg-violet-100", ring: "ring-violet-300", check: "bg-violet-500", dot: "bg-violet-400" },
  red: { bg: "bg-rose-100", ring: "ring-rose-300", check: "bg-rose-500", dot: "bg-rose-400" },
};

export function HabitsSection({ habits, todayLogs, allLogs }: HabitsSectionProps) {
  const { dictionary, locale } = useI18n();
  const dict = dictionary.habits;
  const logMap = new Map(todayLogs.map((l) => [l.habit_id, l.id]));

  // Heatmap logic: last 14 weeks (98 days)
  const days = Array.from({ length: 91 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (90 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <section className="space-y-6">
      {/* Overview Heatmap */}
      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm overflow-hidden">
        <p className="text-sm font-semibold text-gray-900 mb-4">
          {locale === "vi" ? "Hoạt động 90 ngày" : "90-Day Activity"}
        </p>
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 13 }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1 shrink-0">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const date = days[weekIndex * 7 + dayIndex];
                if (!date) return <div key={dayIndex} className="size-3 rounded-sm bg-transparent" />;
                const count = allLogs.filter(l => l.log_date === date).length;
                const opacity = count === 0 ? "bg-gray-100" : count === 1 ? "bg-gray-300" : count === 2 ? "bg-gray-500" : "bg-gray-900";
                return (
                  <div 
                    key={dayIndex} 
                    className={`size-3 rounded-sm transition-colors ${opacity}`} 
                    title={`${date}: ${count} completed`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        {/* Create form */}
        <form
          action={createHabit}
          className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm h-fit"
        >
          <p className="text-sm font-semibold text-gray-900">{dict.new}</p>
          <div className="mt-4 grid gap-3">
            <input
              className="h-11 rounded-2xl border border-gray-300 px-3 text-sm"
              name="title"
              placeholder="e.g. Morning meditation"
              required
            />
            <select className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="color">
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="violet">Violet</option>
              <option value="red">Red</option>
            </select>
          </div>
          <button
            className="mt-4 w-full rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            type="submit"
          >
            {dictionary.common.create}
          </button>
        </form>

        {/* Habit list */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            {locale === "vi" ? "Hôm nay — đánh dấu những gì bạn đã làm" : "Today — mark what you've done"}
          </p>
          {habits.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-700">
              {locale === "vi" ? "Chưa có thói quen nào. Tạo thói quen đầu tiên của bạn." : "No habits yet. Create your first habit."}
            </div>
          ) : (
            habits.map((habit) => {
              const logId = logMap.get(habit.id);
              const isXong = !!logId;
              const colors = colorMap[habit.color] ?? colorMap.blue;

              return (
                <div
                  className={`flex items-center justify-between rounded-[2rem] border p-5 transition ${
                    isXong
                      ? "border-gray-900 bg-gray-50 shadow-sm"
                      : "border-gray-200 bg-white"
                  }`}
                  key={habit.id}
                >
                  <div className="flex items-center gap-4">
                    {/* Toggle button */}
                    <form action={toggleHabitLog}>
                      <input name="habitId" type="hidden" value={habit.id} />
                      <input name="isDone" type="hidden" value={String(isXong)} />
                      <input name="logId" type="hidden" value={logId ?? ""} />
                      <button
                        className={`flex h-8 w-8 items-center justify-center rounded-full ring-2 transition ${colors.ring} ${
                          isXong ? "bg-gray-900" : "bg-white"
                        }`}
                        type="submit"
                        aria-label={isXong ? "Mark unhoàn thành" : "Mark hoàn thành"}
                      >
                        {isXong && (
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </form>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${isXong ? "text-gray-500 line-through" : "text-gray-900"}`}>
                          {habit.title}
                        </p>
                        {habit.streak > 0 && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                            <Flame className="size-3 fill-orange-500 text-orange-500" /> {habit.streak} {dict.streak}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className={`size-2 rounded-full ${colors.dot}`} />
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                          {habit.color}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Xoá */}
                  <form action={deleteHabit}>
                    <input name="id" type="hidden" value={habit.id} />
                    <button className="p-2 text-gray-400 hover:text-rose-600 transition-colors" type="submit">
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </div>
              );
            })
          )}
          {habits.length > 0 && (
            <p className="pt-1 text-right text-xs font-medium text-gray-500 uppercase tracking-widest">
              {logMap.size} / {habits.length} {dict.completed}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
