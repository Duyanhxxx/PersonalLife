import { getWorkspaceSections } from "@/lib/workspace/sections";
import { requireUser } from "@/lib/auth/session";

type WorkspacePageProps = {
  searchParams: Promise<{
    section?: string;
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

  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
            {activeSection?.name ?? "Workspace"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Your {activeSection?.name?.toLowerCase() ?? "workspace"} hub is ready.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Phase 3 is in place: authentication works, the workspace is protected,
            and the section-aware sidebar is ready. Next we can populate this area
            with nested documents, actions, and realtime updates.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <article
              className={`rounded-2xl border p-5 ${
                section.slug === activeSection?.slug
                  ? "border-zinc-950 bg-zinc-950 text-zinc-50"
                  : "border-border bg-background"
              }`}
              key={section.id}
            >
              <h3 className="text-lg font-semibold">{section.name}</h3>
              <p
                className={`mt-2 text-sm leading-6 ${
                  section.slug === activeSection?.slug
                    ? "text-zinc-300"
                    : "text-muted-foreground"
                }`}
              >
                This section will get its own focused document views and actions
                while staying inside the same workspace tree.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
