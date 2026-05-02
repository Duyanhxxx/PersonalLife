import type { SystemSectionSlug } from "@/types/workspace";

export type SectionTheme = {
  accent: string;
  surface: string;
  pill: string;
};

export const sectionThemes: Record<SystemSectionSlug, SectionTheme> = {
  notes: {
    accent: "from-gray-900 via-gray-700 to-gray-500",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  finance: {
    accent: "from-gray-900 via-gray-800 to-gray-600",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  calendar: {
    accent: "from-gray-900 via-gray-700 to-gray-400",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  tasks: {
    accent: "from-gray-900 via-gray-800 to-gray-500",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  habits: {
    accent: "from-gray-900 via-gray-700 to-gray-500",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  missions: {
    accent: "from-gray-900 via-gray-800 to-gray-600",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  reading: {
    accent: "from-gray-900 via-gray-700 to-gray-400",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
};

