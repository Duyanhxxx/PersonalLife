import { requireUser } from "@/lib/auth/session";
import { getWorkspaceSections } from "@/lib/workspace/sections";
import { WorkspaceShell } from "@/components/sidebar/workspace-shell";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
};

export default async function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  const user = await requireUser();
  const sections = await getWorkspaceSections(user.id);

  return (
    <WorkspaceShell
      sections={sections}
      userEmail={user.email ?? "Signed in user"}
    >
      {children}
    </WorkspaceShell>
  );
}
