"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, CalendarDays, CircleDollarSign, FileText, ListTodo, Target, Waves } from "lucide-react";
import type { WorkspaceSection } from "@/lib/workspace/sections";

type SectionNavProps = {
  sections: WorkspaceSection[];
};

const iconMap = {
  notes: FileText,
  finance: CircleDollarSign,
  calendar: CalendarDays,
  tasks: ListTodo,
  habits: Waves,
  missions: Target,
  reading: BookOpen,
} as const;

export function SectionNav({ sections }: SectionNavProps) {
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section") ?? sections[0]?.slug;

  return (
    <nav className="space-y-1">
      {sections.map((section) => {
        const Icon =
          iconMap[section.slug as keyof typeof iconMap] ?? FileText;
        const isActive = section.slug === currentSection;

        return (
          <Link
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
              isActive
                ? "bg-zinc-950 text-zinc-50"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            href={`/app?section=${section.slug}`}
            key={section.id}
          >
            <Icon className="size-4" />
            <span>{section.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
