import { TodayDashboard } from "@/components/workspace/today-dashboard";
import { requireUser } from "@/lib/auth/session";
import { getTodayDashboard } from "@/lib/workspace/dashboard";
import { getWorkspaceSections } from "@/lib/workspace/sections";
import Link from "next/link";
import { sectionThemes } from "@/lib/workspace/section-theme";
import type { SystemSectionSlug } from "@/types/workspace";
import { getDictionary, getLanguage } from "@/lib/i18n/get-dictionary";

export default async function WorkspaceHomePage() {
  const user = await requireUser();
  const [dashboard, sections, dict, locale] = await Promise.all([
    getTodayDashboard(user.id),
    getWorkspaceSections(user.id),
    getDictionary(),
    getLanguage(),
  ]);

  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            {new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Ho_Chi_Minh",
            }).format(new Date())}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
            {dict.dashboard.welcome} — {locale === "vi" ? "đây là tổng quan của bạn." : "here's your overview."}
          </h1>
        </div>

        <TodayDashboard data={dashboard} />

        {/* Quick-nav section cards */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            {locale === "vi" ? "Đến phần" : "Go to section"}
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
                    {dict.sections[section.slug as keyof typeof dict.sections] ?? section.name}
                  </span>
                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    {dict.descriptions[section.slug as keyof typeof dict.descriptions] ?? ""}
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

