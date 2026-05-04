import { addMissionProgress, createMission, deleteMission } from "@/actions/missions";
import { ResponsiveSectionViews } from "@/components/workspace/responsive-section-views";
import { todayIso } from "@/lib/date";
import type { Mission, MissionEntry } from "@/types/section-data";
import { getDictionary, getLanguage } from "@/lib/i18n/get-dictionary";

type MissionsSectionProps = {
  missions: Mission[];
  todayEntries: MissionEntry[];
};

export async function MissionsSection({ missions, todayEntries }: MissionsSectionProps) {
  const dictionary = await getDictionary();
  const locale = await getLanguage();
  const dict = dictionary.missions;
  const sidebarView = (
    <div className="space-y-4">
      <form action={createMission} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#05386B]">{dict.new}</p>
        <div className="mt-4 grid gap-3">
          <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="title" placeholder="Tên nhiệm vụ" required />
          <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue="100" name="targetValue" type="number" />
          <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" defaultValue="0" name="currentValue" type="number" />
          <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="color">
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="amber">Amber</option>
            <option value="violet">Violet</option>
          </select>
        </div>
        <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">{dictionary.common.create}</button>
      </form>
      <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#05386B]">{dict.log}</p>
          <span className="rounded-full bg-[#EDF5E1] px-3 py-1 text-xs font-semibold text-[#20555F]">
            {todayEntries.length}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {todayEntries.length ? (
            todayEntries.map((entry) => (
              <div className="rounded-2xl bg-[#F7FBF4] px-4 py-3" key={entry.id}>
                <p className="text-sm font-medium text-[#05386B]">+{entry.progress_delta} {dict.progress.toLowerCase()}</p>
                <p className="text-xs text-[#379683]">{entry.note || (locale === "vi" ? "Điểm danh hàng ngày" : "Daily check-in")}</p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-[#8EE4AF] bg-[#F7FBF4] p-4 text-sm text-[#20555F]">
              {locale === "vi" ? "Hôm nay chưa có cập nhật tiến độ nào." : "No progress updates logged yet today."}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const missionsView = (
    <div className="space-y-4">
      {missions.length ? (
        missions.map((mission) => {
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
                  <button className="text-xs font-medium text-rose-700" type="submit">{dictionary.common.delete}</button>
                </form>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#D8E9E0]">
                <div className="h-full rounded-full bg-[#05386B]" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs font-medium text-[#379683]">
                <span>{dict.progress}</span>
                <span>{progress}%</span>
              </div>
              <form action={addMissionProgress} className="mt-4 grid gap-3 md:grid-cols-[120px_1fr_auto]">
                <input name="missionId" type="hidden" value={mission.id} />
                <input name="entryDate" type="hidden" value={todayIso()} />
                <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="progressDelta" placeholder="+5" type="number" required />
                <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm text-[#05386B]" name="note" placeholder={locale === "vi" ? "Hôm nay tiến triển gì?" : "What's the progress?"} />
                <button className="rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">{dictionary.common.save}</button>
              </form>
            </div>
          );
        })
      ) : (
        <div className="rounded-[2rem] border border-dashed border-[#8EE4AF] bg-white/85 p-8 text-center text-sm text-[#20555F]">
          {locale === "vi" ? "Chưa có mission nào. Hãy tạo mục tiêu đầu tiên." : "No missions yet. Create your first goal."}
        </div>
      )}
    </div>
  );

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1.3fr]">
      <div className="md:hidden">
        <ResponsiveSectionViews
          listLabel={dict.log}
          listView={sidebarView}
          monthLabel={dict.progress}
          monthView={missionsView}
        />
      </div>
      <div className="hidden xl:block">{sidebarView}</div>
      <div className="hidden md:block xl:hidden">{missionsView}</div>
      <div className="hidden xl:block">{missionsView}</div>
    </section>
  );
}
