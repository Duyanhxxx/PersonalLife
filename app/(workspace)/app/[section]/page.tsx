import { notFound } from "next/navigation";
import { CalendarSection } from "@/components/workspace/calendar-section";
import { DocumentPanel } from "@/components/workspace/document-panel";
import { FinanceSection } from "@/components/workspace/finance-section";
import { HabitsSection } from "@/components/workspace/habits-section";
import { MissionsSection } from "@/components/workspace/missions-section";
import { ReadingSection } from "@/components/workspace/reading-section";
import { SectionHeader } from "@/components/workspace/section-header";
import { TodoSection } from "@/components/workspace/todo-section";
import { restoreDocument } from "@/actions/documents";
import { requireUser } from "@/lib/auth/session";
import { getFinanceEntries } from "@/lib/workspace/finance";
import { getHabits } from "@/lib/workspace/habits";
import { getMissions } from "@/lib/workspace/missions";
import { getPlannerEvents } from "@/lib/workspace/planner";
import { getReadingBooks } from "@/lib/workspace/reading";
import { getSectionDocuments } from "@/lib/workspace/documents";
import { sectionThemes } from "@/lib/workspace/section-theme";
import { getWorkspaceSections } from "@/lib/workspace/sections";
import { getTodoItems } from "@/lib/workspace/todos";
import type { SystemSectionSlug } from "@/types/workspace";

const DATA_SECTIONS = new Set(["calendar", "finance", "tasks", "missions", "reading", "habits"]);

type SectionPageProps = {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ document?: string; month?: string }>;
};

export default async function SectionPage({ params, searchParams }: SectionPageProps) {
  const user = await requireUser();
  const { section: sectionSlug } = await params;
  const { document: documentParam, month } = await searchParams;

  const sections = await getWorkspaceSections(user.id);
  const activeSection = sections.find((s) => s.slug === sectionSlug);
  if (!activeSection) notFound();

  const theme =
    sectionThemes[sectionSlug as SystemSectionSlug] ?? sectionThemes.notes;
  const isDataSection = DATA_SECTIONS.has(sectionSlug);

  // Load only what this section needs
  const [plannerData, financeData, todoItems, missionsData, readingBooks, habitsData, sectionDocs] =
    await Promise.all([
      sectionSlug === "calendar" ? getPlannerEvents(user.id, month) : null,
      sectionSlug === "finance" ? getFinanceEntries(user.id, month) : null,
      sectionSlug === "tasks" ? getTodoItems(user.id) : null,
      sectionSlug === "missions" ? getMissions(user.id) : null,
      sectionSlug === "reading" ? getReadingBooks(user.id) : null,
      sectionSlug === "habits" ? getHabits(user.id) : null,
      !isDataSection ? getSectionDocuments(user.id, activeSection.id) : null,
    ]);

  const activeDocument =
    sectionDocs?.active.find((d) => d.id === documentParam) ??
    sectionDocs?.active[0] ??
    null;

  let content;
  if (sectionSlug === "calendar" && plannerData) {
    content = <CalendarSection data={plannerData} />;
  } else if (sectionSlug === "finance" && financeData) {
    content = <FinanceSection data={financeData} />;
  } else if (sectionSlug === "tasks" && todoItems) {
    content = <TodoSection items={todoItems} />;
  } else if (sectionSlug === "missions" && missionsData) {
    content = <MissionsSection missions={missionsData.missions} todayEntries={missionsData.todayEntries} />;
  } else if (sectionSlug === "reading" && readingBooks) {
    content = <ReadingSection books={readingBooks} />;
  } else if (sectionSlug === "habits" && habitsData) {
    content = <HabitsSection habits={habitsData.habits} todayLogs={habitsData.todayLogs} />;
  } else {
    content = <DocumentPanel document={activeDocument} sectionSlug={sectionSlug} />;
  }

  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionHeader sectionName={activeSection.name} sectionSlug={sectionSlug} />

        {isDataSection ? (
          <div>{content}</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
            {content}
            {/* Lưu trữ panel — only for document sections */}
            <aside className={`rounded-[2rem] border border-gray-200 ${theme.surface} p-6 shadow-sm`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Lưu trữ</p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">Trang đã lưu trữ</h3>
              <div className="mt-4 space-y-3">
                {sectionDocs?.archived.length ? (
                  sectionDocs.archived.map((doc) => (
                    <form action={restoreDocument} className="rounded-3xl border border-white/70 bg-white p-4" key={doc.id}>
                      <input name="id" type="hidden" value={doc.id} />
                      <input name="sectionSlug" type="hidden" value={sectionSlug} />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">{doc.title}</p>
                          <p className="mt-1 text-xs capitalize text-gray-500">{doc.kind}</p>
                        </div>
                        <button className="rounded-2xl bg-gray-900 px-3 py-2 text-xs font-medium text-white" type="submit">
                          Khôi phục
                        </button>
                      </div>
                    </form>
                  ))
                ) : (
                  <p className="rounded-3xl border border-dashed border-gray-400 bg-white p-4 text-sm text-gray-700">
                    Chưa có trang nào lưu trữ.
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
