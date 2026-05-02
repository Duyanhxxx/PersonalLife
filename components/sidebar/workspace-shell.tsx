import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import type { DocumentTreeNode } from "@/types/document";
import type { WorkspaceSection } from "@/lib/workspace/sections";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

type WorkspaceShellProps = {
  children: React.ReactNode;
  documentsBySection: Record<string, DocumentTreeNode[]>;
  sections: WorkspaceSection[];
  userEmail: string;
};

export function WorkspaceShell({
  children,
  documentsBySection,
  sections,
  userEmail,
}: WorkspaceShellProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar
        documentsBySection={documentsBySection}
        sections={sections}
        userEmail={userEmail}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500">
                Không gian làm việc
              </p>
              <h1 className="text-lg font-semibold text-gray-900">PersonalLife</h1>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
