import { TodayTrang chủ } from "@/components/workspace/today-dashboard";
import { requireUser } from "@/lib/auth/session";
import { getTodayTrang chủ } from "@/lib/workspace/dashboard";
import { getWorkspacePhần } from "@/lib/workspace/sections";
import Link from "next/link";
import { sectionThemes } from "@/lib/workspace/section-theme";
import type { SystemSectionSlug } from "@/types/workspace";

export default async function WorkspaceHomePage() {
  const user = await requireUser();
  const [dashboard, sections] = await Promise.all([
    getTodayTrang chủ(user.id),
    getWorkspacePhần(user.id),
  ]);

  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            {new Intl.DateTimeFormat("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Ho_Chi_Minh",
            }).format(new Date())}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
            Chào ngày mới — here&apos;s your overview.
          </h1>
        </div>

        <TodayTrang chủ data={dashboard} />

        {/* Quick-nav section cards */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Đến phần
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sections.map((section) => {
              const theme =
                sectionThemes[section.slug as SystemSectionSlug] ??
                sectionThemes.notes;
              return (
                <Link
                  className="rounded-[1.75rem] border border-gray-200 bg-white p-5 transition hover:border-gray-400 hover:shadow-md"
                  href={`/app/${section.slug}`}
                  key={section.id}
                >
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${theme.pill}`}>
                    {section.name}
                  </span>
                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    {theme.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

