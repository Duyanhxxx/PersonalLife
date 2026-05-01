"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Search, Sparkles } from "lucide-react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { CreateDocumentButton } from "@/components/sidebar/create-document-button";
import { DocumentTree } from "@/components/sidebar/document-tree";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import type { WorkspaceSection } from "@/lib/workspace/sections";
import type { DocumentTreeNode } from "@/types/document";
import { SectionNav } from "@/components/sidebar/section-nav";

type AppSidebarProps = {
  documentsBySection: Record<string, DocumentTreeNode[]>;
  sections: WorkspaceSection[];
  userEmail: string;
};

export function AppSidebar({
  documentsBySection,
  sections,
  userEmail,
}: AppSidebarProps) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") ?? sections[0]?.slug;
  const activeDocuments = documentsBySection[activeSection ?? "notes"] ?? [];

  return (
    <aside
      className={`hidden border-r border-[#8EE4AF]/40 bg-[linear-gradient(180deg,rgba(237,245,225,0.95),rgba(255,255,255,0.96))] transition-all duration-200 md:flex md:flex-col ${
        isCollapsed ? "md:w-[88px]" : "md:w-[300px]"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-[#8EE4AF]/35 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#05386B] text-sm font-semibold text-[#EDF5E1] shadow-sm">
          PL
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#05386B]">PersonalLife</p>
            <p className="truncate text-xs text-[#379683]">{userEmail}</p>
          </div>
        )}
      </div>

      <div className="border-b border-[#8EE4AF]/35 px-4 py-4">
        <div className="flex items-center gap-2 rounded-2xl border border-[#8EE4AF] bg-white/70 px-3 py-2 text-sm text-[#379683]">
          <Search className="size-4" />
          {!isCollapsed && <span>Search workspace</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {!isCollapsed ? (
          <div className="space-y-6">
            <div>
              <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#379683]">
                Sections
              </p>
              <SectionNav sections={sections} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#379683]">
                  <Sparkles className="size-3.5" />
                  <span>Documents</span>
                </div>
                {activeSection ? <CreateDocumentButton compact sectionSlug={activeSection} /> : null}
              </div>
              {activeSection ? (
                <DocumentTree nodes={activeDocuments} sectionSlug={activeSection} />
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {sections.map((section) => (
              <Link
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#8EE4AF] bg-white/70 text-[#379683] transition hover:border-[#379683] hover:text-[#05386B]"
                href={`/app?section=${section.slug}`}
                key={section.id}
              >
                <ChevronRight className="size-4" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#8EE4AF]/35 p-4">
        <form action={signOut}>
          <Button className="w-full" type="submit" variant="outline">
            {isCollapsed ? "Exit" : "Sign out"}
          </Button>
        </form>
      </div>
    </aside>
  );
}
