"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ResponsiveSectionViewsProps = {
  monthLabel: string;
  listLabel: string;
  monthView: React.ReactNode;
  listView: React.ReactNode;
  desktopClassName?: string;
};

export function ResponsiveSectionViews({
  monthLabel,
  listLabel,
  monthView,
  listView,
  desktopClassName,
}: ResponsiveSectionViewsProps) {
  const [mode, setMode] = useState<"month" | "list">("month");

  return (
    <>
      <div className="space-y-3 md:hidden">
        <div className="inline-flex rounded-2xl border border-[#8EE4AF]/60 bg-white/80 p-1 shadow-sm">
          <button
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium transition",
              mode === "month"
                ? "bg-[#05386B] text-[#EDF5E1]"
                : "text-[#20555F] hover:bg-[#EDF5E1]",
            )}
            onClick={() => setMode("month")}
            type="button"
          >
            {monthLabel}
          </button>
          <button
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium transition",
              mode === "list"
                ? "bg-[#05386B] text-[#EDF5E1]"
                : "text-[#20555F] hover:bg-[#EDF5E1]",
            )}
            onClick={() => setMode("list")}
            type="button"
          >
            {listLabel}
          </button>
        </div>
        {mode === "month" ? monthView : listView}
      </div>

      <div className={cn("hidden md:block", desktopClassName)}>{monthView}</div>
    </>
  );
}
