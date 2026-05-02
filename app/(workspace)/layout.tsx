import { requireUser } from "@/lib/auth/session";
import { getDocumentsForSidebar, groupDocumentsBySection } from "@/lib/workspace/documents";
import { getWorkspaceSections } from "@/lib/workspace/sections";
import { WorkspaceShell } from "@/components/sidebar/workspace-shell";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { getDictionary, getLanguage } from "@/lib/i18n/get-dictionary";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
};

export default async function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  const user = await requireUser();
  const sections = await getWorkspaceSections(user.id);
  const documents = await getDocumentsForSidebar(user.id);
  const documentsBySection = groupDocumentsBySection(documents, sections);
  const locale = await getLanguage();
  const dictionary = await getDictionary();

  return (
    <I18nProvider dictionary={dictionary} locale={locale}>
      <WorkspaceShell
        documentsBySection={documentsBySection}
        sections={sections}
        userEmail={user.email ?? "Signed in user"}
      >
        {children}
      </WorkspaceShell>
    </I18nProvider>
  );
}
