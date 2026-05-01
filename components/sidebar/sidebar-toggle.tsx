"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebarStore } from "@/hooks/use-sidebar-store";

export function SidebarToggle() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggle = useSidebarStore((state) => state.toggle);
  const Icon = isCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <button
      aria-label="Toggle sidebar"
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#8EE4AF] bg-white/75 text-[#379683] transition hover:border-[#379683] hover:text-[#05386B]"
      onClick={toggle}
      type="button"
    >
      <Icon className="size-4" />
    </button>
  );
}
