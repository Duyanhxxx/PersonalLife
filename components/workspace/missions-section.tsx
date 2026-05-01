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
        <form action={createMission} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#05386B]">Create mission</p>
          <div className="mt-4 grid gap-3">
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="title" placeholder="Mission title" required />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" defaultValue="100" name="targetValue" type="number" />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" defaultValue="0" name="currentValue" type="number" />
            <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="color">
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="violet">Violet</option>
            </select>
          </div>
          <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">Create mission</button>
        </form>
        <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#05386B]">Today mission entries</p>
          <div className="mt-4 space-y-3">
            {todayEntries.map((entry) => (
              <div className="rounded-2xl bg-[#F7FBF4] px-4 py-3" key={entry.id}>
                <p className="text-sm font-medium text-[#05386B]">+{entry.progress_delta} progress</p>
                <p className="text-xs text-[#379683]">{entry.note || "Daily check-in"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {missions.map((mission) => {
          const progress = Math.min(100, Math.round((mission.current_value / Math.max(mission.target_value, 1)) * 100));
          return (
            <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm" key={mission.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-[#05386B]">{mission.title}</p>
                  <p className="mt-2 text-sm text-[#20555F]">{mission.current_value} / {mission.target_value}</p>
                </div>
                <form action={deleteMission}>
                  <input name="id" type="hidden" value={mission.id} />
                  <button className="text-xs font-medium text-rose-700" type="submit">Delete</button>
                </form>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#D8F1E1]">
                <div className="h-full rounded-full bg-[#05386B]" style={{ width: `${progress}%` }} />
              </div>
              <form action={addMissionProgress} className="mt-4 grid gap-3 md:grid-cols-[120px_1fr_auto]">
                <input name="missionId" type="hidden" value={mission.id} />
                <input name="entryDate" type="hidden" value={todayIso()} />
                <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="progressDelta" placeholder="+5" type="number" required />
                <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="note" placeholder="What moved forward today?" />
                <button className="rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">Log</button>
              </form>
            </div>
          );
        })}
      </div>
    </section>
  );
}
