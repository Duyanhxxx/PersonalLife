import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import type { WorkspaceSection } from "@/lib/workspace/sections";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

type WorkspaceShellProps = {
  children: React.ReactNode;
  sections: WorkspaceSection[];
  userEmail: string;
};

export function WorkspaceShell({
  children,
  sections,
  userEmail,
}: WorkspaceShellProps) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AppSidebar
        sections={sections}
        userEmail={userEmail}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Workspace
              </p>
              <h1 className="text-lg font-semibold">PersonalLife</h1>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
