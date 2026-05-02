import { addMissionProgress, createMission, deleteMission } from "@/actions/missions";
import { todayIso } from "@/lib/date";
import type { Mission, MissionEntry } from "@/types/section-data";

type MissionsSectionProps = {
  missions: Mission[];
  todayEntries: MissionEntry[];
};

export function MissionsSection({ missions, todayEntries }: MissionsSectionProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1.3fr]">
      <div className="space-y-4">
        <form action={createMission} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Tạo nhiệm vụ</p>
          <div className="mt-4 grid gap-3">
            <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="title" placeholder="Tên nhiệm vụ" required />
            <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" defaultValue="100" name="targetValue" type="number" />
            <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" defaultValue="0" name="currentValue" type="number" />
            <select className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="color">
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="violet">Violet</option>
            </select>
          </div>
          <button className="mt-4 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white" type="submit">Tạo nhiệm vụ</button>
        </form>
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Nhật ký nhiệm vụ hôm nay</p>
          <div className="mt-4 space-y-3">
            {todayEntries.map((entry) => (
              <div className="rounded-2xl bg-gray-50 px-4 py-3" key={entry.id}>
                <p className="text-sm font-medium text-gray-900">+{entry.progress_delta} progress</p>
                <p className="text-xs text-gray-500">{entry.note || "Điểm danh hàng ngày"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {missions.map((mission) => {
          const progress = Math.min(100, Math.round((mission.current_value / Math.max(mission.target_value, 1)) * 100));
          return (
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm" key={mission.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-gray-900">{mission.title}</p>
                  <p className="mt-2 text-sm text-gray-700">{mission.current_value} / {mission.target_value}</p>
                </div>
                <form action={deleteMission}>
                  <input name="id" type="hidden" value={mission.id} />
                  <button className="text-xs font-medium text-rose-700" type="submit">Xoá</button>
                </form>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-gray-900" style={{ width: `${progress}%` }} />
              </div>
              <form action={addMissionProgress} className="mt-4 grid gap-3 md:grid-cols-[120px_1fr_auto]">
                <input name="missionId" type="hidden" value={mission.id} />
                <input name="entryDate" type="hidden" value={todayIso()} />
                <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="progressDelta" placeholder="+5" type="number" required />
                <input className="h-11 rounded-2xl border border-gray-300 px-3 text-sm" name="note" placeholder="Hôm nay tiến triển gì?" />
                <button className="rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white" type="submit">Ghi lại</button>
              </form>
            </div>
          );
        })}
      </div>
    </section>
  );
}
