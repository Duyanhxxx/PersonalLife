import type { SystemSectionSlug } from "@/types/workspace";

export type SectionTheme = {
  description: string;
  accent: string;
  surface: string;
  pill: string;
};

export const sectionThemes: Record<SystemSectionSlug, SectionTheme> = {
  notes: {
    description: "Capture freeform pages, research, and personal reflections.",
    accent: "from-[#05386B] via-[#379683] to-[#5CDB95]",
    surface: "bg-[#EDF5E1]",
    pill: "bg-[#8EE4AF] text-[#05386B]",
  },
  finance: {
    description: "Track budgets, money notes, recurring expenses, and goals.",
    accent: "from-[#05386B] via-[#2B7A78] to-[#5CDB95]",
    surface: "bg-[#EAF7EE]",
    pill: "bg-[#5CDB95]/20 text-[#05386B]",
  },
  calendar: {
    description: "Plan timelines, events, and milestone pages by date.",
    accent: "from-[#05386B] via-[#379683] to-[#8EE4AF]",
    surface: "bg-[#F2FBF5]",
    pill: "bg-[#8EE4AF]/30 text-[#05386B]",
  },
  tasks: {
    description: "Organize to-dos, project checklists, and execution queues.",
    accent: "from-[#05386B] via-[#1F6E68] to-[#5CDB95]",
    surface: "bg-[#EEF9F2]",
    pill: "bg-[#5CDB95]/25 text-[#05386B]",
  },
  habits: {
    description: "Build routines, streaks, and small daily systems that stick.",
    accent: "from-[#05386B] via-[#2B7A78] to-[#8EE4AF]",
    surface: "bg-[#F3FBF5]",
    pill: "bg-[#8EE4AF]/25 text-[#05386B]",
  },
  missions: {
    description: "Break bigger life goals into focused missions and outcomes.",
    accent: "from-[#05386B] via-[#235E73] to-[#5CDB95]",
    surface: "bg-[#EEF7F1]",
    pill: "bg-[#5CDB95]/20 text-[#05386B]",
  },
  reading: {
    description: "Collect books, reading notes, highlights, and progress logs.",
    accent: "from-[#05386B] via-[#285D79] to-[#8EE4AF]",
    surface: "bg-[#F4FBF7]",
    pill: "bg-[#8EE4AF]/25 text-[#05386B]",
  },
};
