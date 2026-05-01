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
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(92,219,149,0.30),transparent_28%),linear-gradient(180deg,rgba(237,245,225,1),rgba(248,252,246,1))]">
      <AppSidebar
        documentsBySection={documentsBySection}
        sections={sections}
        userEmail={userEmail}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[#8EE4AF]/35 bg-[rgba(237,245,225,0.82)] px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#379683]">
                Workspace
              </p>
              <h1 className="text-lg font-semibold text-[#05386B]">PersonalLife</h1>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
