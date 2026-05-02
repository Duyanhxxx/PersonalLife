import { createHabit, deleteHabit, toggleHabitGhi lại } from "@/actions/habits";
import type { Habit, HabitGhi lại } from "@/lib/workspace/habits";

type HabitsSectionProps = {
  habits: Habit[];
  todayGhi lạis: HabitGhi lại[];
};

const colorMap: Record<string, { bg: string; ring: string; check: string }> = {
  blue: { bg: "bg-sky-100", ring: "ring-sky-300", check: "bg-sky-500" },
  green: { bg: "bg-emerald-100", ring: "ring-emerald-300", check: "bg-emerald-500" },
  amber: { bg: "bg-amber-100", ring: "ring-amber-300", check: "bg-amber-500" },
  violet: { bg: "bg-violet-100", ring: "ring-violet-300", check: "bg-violet-500" },
  red: { bg: "bg-rose-100", ring: "ring-rose-300", check: "bg-rose-500" },
};

export function HabitsSection({ habits, todayGhi lạis }: HabitsSectionProps) {
  const logMap = new Map(todayGhi lạis.map((l) => [l.habit_id, l.id]));

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
      {/* Create form */}
      <form
        action={createHabit}
        className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm"
      >
        <p className="text-sm font-semibold text-gray-900">Thêm thói quen mới</p>
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
          className="mt-4 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          type="submit"
        >
          Tạo thói quen
        </button>
      </form>

      {/* Habit list */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Hôm nay — đánh dấu những gì bạn đã làm
        </p>
        {habits.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-700">
            Chưa có thói quen nào. Tạo thói quen đầu tiên của bạn.
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
                    ? "border-[#5CDB95]/40 bg-gray-100"
                    : "border-gray-200 bg-white"
                }`}
                key={habit.id}
              >
                <div className="flex items-center gap-4">
                  {/* Toggle button */}
                  <form action={toggleHabitGhi lại}>
                    <input name="habitId" type="hidden" value={habit.id} />
                    <input name="isXong" type="hidden" value={String(isXong)} />
                    <input name="logId" type="hidden" value={logId ?? ""} />
                    <button
                      className={`flex h-8 w-8 items-center justify-center rounded-full ring-2 transition ${colors.ring} ${
                        isXong ? colors.check : "bg-white"
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
                    <p className={`font-medium ${isXong ? "text-gray-500 line-through" : "text-gray-900"}`}>
                      {habit.title}
                    </p>
                    <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs ${colors.bg} text-gray-900`}>
                      {habit.color}
                    </span>
                  </div>
                </div>

                {/* Xoá */}
                <form action={deleteHabit}>
                  <input name="id" type="hidden" value={habit.id} />
                  <button className="text-xs font-medium text-rose-600" type="submit">
                    Xoá
                  </button>
                </form>
              </div>
            );
          })
        )}
        {habits.length > 0 && (
          <p className="pt-1 text-right text-xs text-gray-500">
            {logMap.size} / {habits.length} hoàn thành today
          </p>
        )}
      </div>
    </section>
  );
}
