"use client";

import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import type { DocumentTreeNode } from "@/types/document";
import type { WorkspaceSection } from "@/lib/workspace/sections";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Dialog } from "@base-ui/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <AppSidebar
        documentsBySection={documentsBySection}
        sections={sections}
        userEmail={userEmail}
      />

      {/* Mobile Sidebar Dialog */}
      <Dialog.Root open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
          <Dialog.Popup className="fixed inset-y-0 left-0 z-50 w-[300px] bg-white shadow-xl transition-all duration-300 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 outline-none">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-900 text-sm font-semibold text-white shadow-sm">
                    PL
                  </div>
                  <h1 className="text-lg font-semibold text-gray-900">PersonalLife</h1>
                </div>
                <Dialog.Close className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 transition-colors">
                  <X className="size-5" />
                </Dialog.Close>
              </div>
              <div className="flex-1 overflow-y-auto">
                {/* We can't easily reuse AppSidebar directly if it's "Client Component" with different props, 
                    so we'll extract a SidebarContent later or just duplicate for now to be quick. */}
                <AppSidebar
                  isMobile
                  onClose={() => setIsMobileOpen(false)}
                  documentsBySection={documentsBySection}
                  sections={sections}
                  userEmail={userEmail}
                />
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            {/* Desktop toggle */}
            <div className="hidden md:block">
              <SidebarToggle />
            </div>
            {/* Mobile trigger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-500 transition hover:border-gray-400 hover:text-gray-900 md:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500">
                Không gian làm việc
              </p>
              <h1 className="text-lg font-semibold text-gray-900">PersonalLife</h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
