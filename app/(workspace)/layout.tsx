import { requireUser } from "@/lib/auth/session";
import { getTài liệuForSidebar, groupTài liệuBySection } from "@/lib/workspace/documents";
import { getWorkspacePhần } from "@/lib/workspace/sections";
import { WorkspaceShell } from "@/components/sidebar/workspace-shell";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
};

export default async function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  const user = await requireUser();
  const sections = await getWorkspacePhần(user.id);
  const documents = await getTài liệuForSidebar(user.id);
  const documentsBySection = groupTài liệuBySection(documents, sections);

  return (
    <WorkspaceShell
      documentsBySection={documentsBySection}
      sections={sections}
      userEmail={user.email ?? "Signed in user"}
    >
      {children}
    </WorkspaceShell>
  );
}
