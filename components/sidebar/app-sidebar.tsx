"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Sparkles, Settings } from "lucide-react";
import { SearchCommand } from "@/components/sidebar/search-command";
import { signOut } from "@/actions/auth";
import { useI18n } from "@/lib/i18n/i18n-context";
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
  isMobile?: boolean;
  onClose?: () => void;
};

export function AppSidebar({
  documentsBySection,
  sections,
  userEmail,
  isMobile = false,
  onClose,
}: AppSidebarProps) {
  const { dictionary } = useI18n();
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const pathname = usePathname();
  const activeSection = pathname.split("/")[2] ?? sections[0]?.slug;
  const activeDocuments = documentsBySection[activeSection ?? "notes"] ?? [];

  return (
    <aside
      className={`${isMobile ? "flex w-full flex-col h-full" : "hidden md:flex md:flex-col md:w-[280px] border-r border-gray-200"} bg-white transition-all duration-200 ${
        !isMobile && isCollapsed ? "md:w-[72px]" : ""
      }`}
    >
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-900 text-sm font-semibold text-white shadow-sm">
          PL
        </div>
        {(!isCollapsed || isMobile) && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">PersonalLife</p>
            <p className="truncate text-xs text-gray-500">{userEmail}</p>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 px-4 py-4">
        <SearchCommand />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {(!isCollapsed || isMobile) ? (
          <div className="space-y-6">
            <div>
              <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                {dictionary.common.sections}
              </p>
              <SectionNav onClose={onClose} sections={sections} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                  <Sparkles className="size-3.5" />
                  <span>{dictionary.common.documents}</span>
                </div>
                {activeSection ? <CreateDocumentButton compact sectionSlug={activeSection} /> : null}
              </div>
              {activeSection ? (
                <DocumentTree nodes={activeDocuments} onClose={onClose} sectionSlug={activeSection} />
              ) : null}
            </div>

            <div className="px-3 pt-4 border-t border-gray-200">
              <Link
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                href="/app/settings"
                onClick={onClose}
              >
                <Settings className="size-4" />
                <span>{dictionary.common.settings}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {sections.map((section) => (
              <Link
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-300 bg-white text-gray-500 transition hover:border-gray-400 hover:text-gray-900"
                href={`/app/${section.slug}`}
                key={section.id}
                onClick={onClose}
              >
                <ChevronRight className="size-4" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4">
        <form action={signOut}>
          <Button className="w-full" type="submit" variant="outline">
            {isCollapsed ? "→" : dictionary.common.signOut}
          </Button>
        </form>
      </div>
    </aside>
  );
}
