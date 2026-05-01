import { requireUser } from "@/lib/auth/session";
import { getWorkspaceSections } from "@/lib/workspace/sections";
import { SectionManager } from "@/components/workspace/section-manager";

type SettingsPageProps = {
  searchParams: Promise<{
    section?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const sections = await getWorkspaceSections(user.id);
  const activeSection =
    sections.find((section) => section.slug === params.section) ?? sections[0];

  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="border-b border-[#8EE4AF]/30 pb-6">
          <h1 className="text-3xl font-semibold text-[#05386B]">Settings & Studio</h1>
          <p className="mt-2 text-[#379683]">
            Manage your workspace sections.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <nav className="space-y-2">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-[#379683]">
              Select Section
            </h2>
            {sections.map((section) => (
              <a
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  section.slug === activeSection?.slug
                    ? "bg-[#05386B] text-[#EDF5E1] shadow-sm"
                    : "text-[#20555F] hover:bg-white/70 hover:text-[#05386B]"
                }`}
                href={`/app/settings?section=${section.slug}`}
                key={section.id}
              >
                {section.name}
              </a>
            ))}
          </nav>
          
          <div>
            {activeSection ? <SectionManager activeSection={activeSection} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
