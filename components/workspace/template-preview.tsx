import type { MetadataValue } from "@/types/document";

type TemplatePreviewProps = {
  metadata?: { [key: string]: MetadataValue } | null;
};

type ScheduleBlock = {
  time: string;
  label: string;
  tone: string;
};

type ScheduleGroup = {
  label: string;
  theme: string;
  blocks: ScheduleBlock[];
};

type TaskGroup = {
  label: string;
  tone: string;
  items: string[];
};

type WorkoutDay = {
  label: string;
  focus: string;
  items: string[];
};

const toneMap: Record<string, string> = {
  blue: "bg-[#05386B] text-[#EDF5E1]",
  green: "bg-[#8EE4AF]/40 text-[#05386B]",
  amber: "bg-amber-100 text-amber-800",
  purple: "bg-violet-100 text-violet-700",
  red: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-700",
};

function isRecord(value: MetadataValue | undefined | null): value is Record<string, MetadataValue> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isStringArray(value: MetadataValue | undefined): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function TemplatePreview({ metadata }: TemplatePreviewProps) {
  const template = metadata?.template;

  if (!metadata || typeof template !== "string") {
    return null;
  }

  if (template === "weekly_schedule" && Array.isArray(metadata.dayGroups)) {
    const groups = metadata.dayGroups.filter(isRecord) as ScheduleGroup[];

    return (
      <div className="mt-8 grid gap-4">
        {groups.map((group) => (
          <div className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5" key={group.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">
              {group.label}
            </p>
            <h4 className="mt-2 text-lg font-semibold text-[#05386B]">{group.theme}</h4>
            <div className="mt-4 grid gap-2">
              {group.blocks.map((block) => (
                <div className="flex flex-col gap-2 rounded-2xl bg-white/80 px-4 py-3 md:flex-row md:items-center md:justify-between" key={`${group.label}-${block.time}-${block.label}`}>
                  <span className="text-sm font-medium text-[#05386B]">{block.time}</span>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneMap[block.tone] ?? toneMap.neutral}`}>
                      {block.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (template === "task_bank" && Array.isArray(metadata.groups)) {
    const groups = metadata.groups.filter(isRecord) as TaskGroup[];

    return (
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <div className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5" key={group.label}>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneMap[group.tone] ?? toneMap.neutral}`}>
              {group.label}
            </span>
            <div className="mt-4 space-y-2">
              {group.items.map((item) => (
                <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-[#20555F]" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (template === "workout_program") {
    const principles = isStringArray(metadata.principles) ? metadata.principles : [];
    const days = Array.isArray(metadata.days)
      ? (metadata.days.filter(isRecord) as WorkoutDay[])
      : [];

    return (
      <div className="mt-8 space-y-4">
        <div className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5">
          <p className="text-sm font-medium text-[#05386B]">Core principles</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {principles.map((principle) => (
              <span className="rounded-full bg-[#8EE4AF]/35 px-3 py-2 text-sm text-[#05386B]" key={principle}>
                {principle}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {days.map((day) => (
            <div className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5" key={day.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">
                {day.label}
              </p>
              <h4 className="mt-2 text-lg font-semibold text-[#05386B]">{day.focus}</h4>
              <div className="mt-4 space-y-2">
                {day.items.map((item) => (
                  <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-[#20555F]" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (template === "finance_dashboard" && isStringArray(metadata.widgets)) {
    return (
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {metadata.widgets.map((widget) => (
          <div className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5 text-sm text-[#20555F]" key={widget}>
            {widget}
          </div>
        ))}
      </div>
    );
  }

  if (template === "mission_control" && isStringArray(metadata.focuses)) {
    return (
      <div className="mt-8 flex flex-wrap gap-3">
        {metadata.focuses.map((focus) => (
          <span className="rounded-full bg-[#8EE4AF]/35 px-3 py-2 text-sm text-[#05386B]" key={focus}>
            {focus}
          </span>
        ))}
      </div>
    );
  }

  if (template === "reading_queue" && isStringArray(metadata.lanes)) {
    return (
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {metadata.lanes.map((lane) => (
          <div className="rounded-3xl border border-[#8EE4AF]/45 bg-[#F8FCF6] p-5 text-sm text-[#20555F]" key={lane}>
            {lane}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
