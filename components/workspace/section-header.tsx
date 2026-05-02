import { CreateDocumentButton } from "@/components/sidebar/create-document-button";
import { sectionThemes } from "@/lib/workspace/section-theme";
import type { SystemSectionSlug } from "@/types/workspace";
import { useI18n } from "@/lib/i18n/i18n-context";

const DATA_SECTIONS = new Set(["calendar", "finance", "tasks", "missions", "reading", "habits"]);

type SectionHeaderProps = {
  sectionSlug: string;
  sectionName: string;
};

export function SectionHeader({
  sectionSlug,
  sectionName,
}: SectionHeaderProps) {
  const { dictionary } = useI18n();
  const theme =
    sectionThemes[sectionSlug as SystemSectionSlug] ?? sectionThemes.notes;
  const showDocButtons = !DATA_SECTIONS.has(sectionSlug);

  const localizedName = dictionary.sections[sectionSlug as keyof typeof dictionary.sections] ?? sectionName;
  const localizedDesc = dictionary.descriptions[sectionSlug as keyof typeof dictionary.descriptions] ?? "";

  return (
    <section className={`overflow-hidden rounded-[2rem] bg-gradient-to-br ${theme.accent} p-[1px] shadow-md`}>
      <div className="rounded-[calc(2rem-1px)] bg-[linear-gradient(180deg,rgba(237,245,225,0.98),rgba(255,255,255,0.96))] p-8 md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${theme.pill}`}>
              {localizedName}
            </span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              {localizedName}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-700">
              {localizedDesc}
            </p>
          </div>

          {showDocButtons && (
            <div className="flex flex-wrap gap-3">
              <CreateDocumentButton sectionSlug={sectionSlug} />
              <CreateDocumentButton kind="database" sectionSlug={sectionSlug} title={`${localizedName} Database`} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
