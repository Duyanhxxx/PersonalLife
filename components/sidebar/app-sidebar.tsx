"use client";

import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import type { WorkspaceSection } from "@/lib/workspace/sections";
import { SectionNav } from "@/components/sidebar/section-nav";

type AppSidebarProps = {
  sections: WorkspaceSection[];
  userEmail: string;
};

export function AppSidebar({
  sections,
  userEmail,
}: AppSidebarProps) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <aside
      className={`hidden border-r border-border bg-background/95 transition-all duration-200 md:flex md:flex-col ${
        isCollapsed ? "md:w-[88px]" : "md:w-[300px]"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-sm font-semibold text-zinc-50">
          PL
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">PersonalLife</p>
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          </div>
        )}
      </div>

      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          <Search className="size-4" />
          {!isCollapsed && <span>Search workspace</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {!isCollapsed ? (
          <>
            <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Sections
            </p>
            <SectionNav sections={sections} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {sections.map((section) => (
              <Link
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border text-muted-foreground transition hover:text-foreground"
                href={`/app?section=${section.slug}`}
                key={section.id}
              >
                <ChevronRight className="size-4" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <form action={signOut}>
          <Button className="w-full" type="submit" variant="outline">
            {isCollapsed ? "Exit" : "Sign out"}
          </Button>
        </form>
      </div>
    </aside>
  );
}
