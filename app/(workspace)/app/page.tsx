import { restoreDocument } from "@/actions/documents";
import { CalendarSection } from "@/components/workspace/calendar-section";
import { DocumentPanel } from "@/components/workspace/document-panel";
import { FinanceSection } from "@/components/workspace/finance-section";
import { MissionsSection } from "@/components/workspace/missions-section";
import { ReadingSection } from "@/components/workspace/reading-section";
import { SectionHeader } from "@/components/workspace/section-header";
import { SectionManager } from "@/components/workspace/section-manager";
import { TodayDashboard } from "@/components/workspace/today-dashboard";
import { TodoSection } from "@/components/workspace/todo-section";
import { requireUser } from "@/lib/auth/session";
import { getTodayDashboard } from "@/lib/workspace/dashboard";
import { getFinanceEntries } from "@/lib/workspace/finance";
import { getMissions } from "@/lib/workspace/missions";
import { getPlannerEvents } from "@/lib/workspace/planner";
import { getReadingBooks } from "@/lib/workspace/reading";
import { getSectionDocuments } from "@/lib/workspace/documents";
import { sectionThemes } from "@/lib/workspace/section-theme";
import { getWorkspaceSections } from "@/lib/workspace/sections";
import { getTodoItems } from "@/lib/workspace/todos";
import type { SystemSectionSlug } from "@/types/workspace";

type WorkspacePageProps = {
  searchParams: Promise<{
    section?: string;
    document?: string;
    month?: string;
  }>;
};

function ArchivePanel({
  archived,
  sectionSlug,
  surface,
}: {
  archived: Awaited<ReturnType<typeof getSectionDocuments>>["archived"];
  sectionSlug: string;
  surface: string;
}) {
  return (
    <aside className={`rounded-[2rem] border border-[#8EE4AF]/50 ${surface} p-6 shadow-sm`}>
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
  );
}

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const sections = await getWorkspaceSections(user.id);
  const dashboard = await getTodayDashboard(user.id);
  const activeSection =
    sections.find((section) => section.slug === params.section) ?? sections[0];
  const { active, archived } = activeSection
    ? await getSectionDocuments(user.id, activeSection.id)
    : { active: [], archived: [] };
  const activeDocument =
    active.find((document) => document.id === params.document) ?? active[0] ?? null;
  const sectionSlug = (activeSection?.slug ?? "notes") as SystemSectionSlug;
  const theme = sectionThemes[sectionSlug] ?? sectionThemes.notes;

  const [plannerData, financeData, todoItems, missionsData, readingBooks] =
    await Promise.all([
      sectionSlug === "calendar" ? getPlannerEvents(user.id, params.month) : null,
      sectionSlug === "finance" ? getFinanceEntries(user.id, params.month) : null,
      sectionSlug === "tasks" ? getTodoItems(user.id) : null,
      sectionSlug === "missions" ? getMissions(user.id) : null,
      sectionSlug === "reading" ? getReadingBooks(user.id) : null,
    ]);

  const sectionContent =
    sectionSlug === "calendar" && plannerData ? (
      <CalendarSection data={plannerData} />
    ) : sectionSlug === "finance" && financeData ? (
      <FinanceSection data={financeData} />
    ) : sectionSlug === "tasks" && todoItems ? (
      <TodoSection items={todoItems} />
    ) : sectionSlug === "missions" && missionsData ? (
      <MissionsSection
        missions={missionsData.missions}
        todayEntries={missionsData.todayEntries}
      />
    ) : sectionSlug === "reading" && readingBooks ? (
      <ReadingSection books={readingBooks} />
    ) : (
      <DocumentPanel document={activeDocument} sectionSlug={sectionSlug} />
    );

  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <TodayDashboard data={dashboard} />
        <SectionHeader
          sectionName={activeSection?.name ?? "Workspace"}
          sectionSlug={sectionSlug}
        />

        <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          {sectionContent}

          <div className="space-y-4">
            <ArchivePanel
              archived={archived}
              sectionSlug={sectionSlug}
              surface={theme.surface}
            />
          </div>
        </div>

        </div>
      </div>
    </section>
  );
}
