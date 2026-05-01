import { DocumentPanel } from "@/components/workspace/document-panel";
import { SectionManager } from "@/components/workspace/section-manager";
import { SectionHeader } from "@/components/workspace/section-header";
import { requireUser } from "@/lib/auth/session";
import { getSectionDocuments } from "@/lib/workspace/documents";
import { sectionThemes } from "@/lib/workspace/section-theme";
import { getWorkspaceSections } from "@/lib/workspace/sections";
import { restoreDocument } from "@/actions/documents";
import type { SystemSectionSlug } from "@/types/workspace";

type WorkspacePageProps = {
  searchParams: Promise<{
    section?: string;
    document?: string;
  }>;
};

export default async function WorkspacePage({
  searchParams,
}: WorkspacePageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const sections = await getWorkspaceSections(user.id);
  const activeSection =
    sections.find((section) => section.slug === params.section) ?? sections[0];
  const { active, archived } = activeSection
    ? await getSectionDocuments(user.id, activeSection.id)
    : { active: [], archived: [] };
  const activeDocument =
    active.find((document) => document.id === params.document) ?? active[0] ?? null;
  const sectionSlug = (activeSection?.slug ?? "notes") as SystemSectionSlug;
  const theme = sectionThemes[sectionSlug] ?? sectionThemes.notes;

  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionHeader
          sectionName={activeSection?.name ?? "Workspace"}
          sectionSlug={sectionSlug}
        />

        <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          <DocumentPanel document={activeDocument} sectionSlug={sectionSlug} />

          <div className="space-y-4">
            <aside className={`rounded-[2rem] border border-[#8EE4AF]/50 ${theme.surface} p-6 shadow-sm`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#379683]">
                Archive
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#05386B]">
                Keep the section tidy without losing history.
              </h3>
              <div className="mt-5 space-y-3">
                {archived.length ? (
                  archived.map((document) => (
                    <form
                      action={restoreDocument}
                      className="rounded-3xl border border-white/70 bg-white/75 p-4"
                      key={document.id}
                    >
                      <input name="id" type="hidden" value={document.id} />
                      <input name="sectionSlug" type="hidden" value={sectionSlug} />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-[#05386B]">{document.title}</p>
                          <p className="mt-1 text-xs text-[#379683] capitalize">
                            {document.kind}
                          </p>
                        </div>
                        <button
                          className="rounded-2xl bg-[#05386B] px-3 py-2 text-xs font-medium text-[#EDF5E1] transition hover:bg-[#0A4A86]"
                          type="submit"
                        >
                          Restore
                        </button>
                      </div>
                    </form>
                  ))
                ) : (
                  <p className="rounded-3xl border border-dashed border-[#379683]/30 bg-white/60 p-4 text-sm leading-6 text-[#20555F]">
                    Nothing is in the trash for this section yet. Archived pages will show up here for one-click restore.
                  </p>
                )}
              </div>
            </aside>

            {activeSection ? <SectionManager activeSection={activeSection} /> : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <article
              className={`rounded-[1.75rem] border p-5 transition ${
                section.slug === activeSection?.slug
                  ? "border-[#05386B] bg-[#05386B] text-[#EDF5E1] shadow-[0_18px_60px_rgba(5,56,107,0.18)]"
                  : "border-[#8EE4AF]/45 bg-white/70"
              }`}
              key={section.id}
            >
              <h3 className="text-lg font-semibold">{section.name}</h3>
              <p
                className={`mt-2 text-sm leading-6 ${
                  section.slug === activeSection?.slug
                    ? "text-[#CDEED9]"
                    : "text-[#20555F]"
                }`}
              >
                {(sectionThemes[section.slug as SystemSectionSlug] ?? sectionThemes.notes).description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
