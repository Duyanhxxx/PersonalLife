import type { SystemSectionSlug } from "@/types/workspace";

export type SectionTheme = {
  description: string;
  accent: string;
  surface: string;
  pill: string;
};

export const sectionThemes: Record<SystemSectionSlug, SectionTheme> = {
  notes: {
    description: "Ghi lại trang tự do, nghiên cứu và suy nghĩ cá nhân.",
    accent: "from-gray-900 via-gray-700 to-gray-500",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  finance: {
    description: "Theo dõi ngân sách, chi tiêu và mục tiêu tài chính.",
    accent: "from-gray-900 via-gray-800 to-gray-600",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  calendar: {
    description: "Lên kế hoạch sự kiện, mốc thời gian và lịch hàng ngày.",
    accent: "from-gray-900 via-gray-700 to-gray-400",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  tasks: {
    description: "Quản lý công việc, danh sách dự án và hàng đợi thực thi.",
    accent: "from-gray-900 via-gray-800 to-gray-500",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  habits: {
    description: "Xây dựng thói quen, chuỗi ngày và hệ thống hàng ngày.",
    accent: "from-gray-900 via-gray-700 to-gray-500",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  missions: {
    description: "Chia nhỏ mục tiêu lớn thành các nhiệm vụ tập trung.",
    accent: "from-gray-900 via-gray-800 to-gray-600",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
  reading: {
    description: "Thu thập sách, ghi chú đọc sách và theo dõi tiến độ.",
    accent: "from-gray-900 via-gray-700 to-gray-400",
    surface: "bg-gray-50",
    pill: "bg-gray-100 text-gray-900",
  },
};

