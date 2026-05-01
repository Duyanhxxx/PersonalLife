import Link from "next/link";
import { createPlannerEvent, deletePlannerEvent } from "@/actions/planner-events";
import { addMonth } from "@/lib/date";
import { getPlannerEvents } from "@/lib/workspace/planner";
import { MonthGrid } from "@/components/workspace/month-grid";
import type { AwaitedReturn } from "@/types/utils";

type CalendarSectionProps = {
  data: AwaitedReturn<typeof getPlannerEvents>;
};

export function CalendarSection({ data }: CalendarSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">Planner calendar</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#05386B]">{data.monthLabel}</h3>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/80 px-3 py-2 text-sm text-[#05386B]" href={`/app?section=calendar&month=${addMonth(data.monthKey, -1)}`}>Prev</Link>
          <Link className="rounded-2xl border border-[#8EE4AF] bg-white/80 px-3 py-2 text-sm text-[#05386B]" href={`/app?section=calendar&month=${addMonth(data.monthKey, 1)}`}>Next</Link>
        </div>
      </div>
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
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <form action={createPlannerEvent} className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#05386B]">Add event</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="title" placeholder="Event title" required />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" defaultValue={data.start} name="entryDate" type="date" required />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="startTime" type="time" />
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="endTime" type="time" />
            <select className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="tone">
              <option value="blue">Deep work</option>
              <option value="green">Routine</option>
              <option value="amber">Strategic</option>
              <option value="purple">Part-time</option>
              <option value="red">Urgent</option>
            </select>
            <input className="h-11 rounded-2xl border border-[#8EE4AF] px-3 text-sm" name="notes" placeholder="Short note" />
          </div>
          <button className="mt-4 rounded-2xl bg-[#05386B] px-4 py-2 text-sm font-medium text-[#EDF5E1]" type="submit">Save event</button>
        </form>
        <div className="rounded-[2rem] border border-[#8EE4AF]/50 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#05386B]">Upcoming list</p>
          <div className="mt-4 space-y-3">
            {data.events.slice(0, 8).map((event) => (
              <form action={deletePlannerEvent} className="flex items-center justify-between rounded-2xl bg-[#F7FBF4] px-4 py-3" key={event.id}>
                <input name="id" type="hidden" value={event.id} />
                <div>
                  <p className="font-medium text-[#05386B]">{event.title}</p>
                  <p className="text-xs text-[#379683]">{event.entry_date} {[event.start_time, event.end_time].filter(Boolean).join(" - ")}</p>
                </div>
                <button className="text-xs font-medium text-rose-700" type="submit">Delete</button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
