"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, CircleDollarSign, FileText, ListTodo, Target, Waves, LayoutDashboard } from "lucide-react";
import type { WorkspaceSection } from "@/lib/workspace/sections";

type SectionNavProps = {
  sections: WorkspaceSection[];
  onClose?: () => void;
};

const iconMap: Record<string, React.ElementType> = {
  notes: FileText,
  finance: CircleDollarSign,
  calendar: CalendarDays,
  tasks: ListTodo,
  habits: Waves,
  missions: Target,
  reading: BookOpen,
};

export function SectionNav({ sections, onClose }: SectionNavProps) {
  const pathname = usePathname();
  // /app → home, /app/calendar → "calendar"
  const activeSlug = pathname.split("/")[2] ?? "";

  return (
    <nav className="space-y-1">
      {/* Home dashboard link */}
      <Link
        className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
          pathname === "/app"
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
        href="/app"
        onClick={onClose}
      >
        <LayoutDashboard className="size-4" />
        <span>Trang chủ</span>
      </Link>

      {sections.map((section) => {
        const Icon = iconMap[section.slug] ?? FileText;
        const isActive = section.slug === activeSlug;

        return (
          <Link
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
              isActive
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
            href={`/app/${section.slug}`}
            key={section.id}
            onClick={onClose}
          >
            <Icon className="size-4" />
            <span>{section.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
