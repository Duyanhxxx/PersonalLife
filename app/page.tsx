import { CheckCircle2, Database, PanelLeft, Shield } from "lucide-react";

const phaseOneItems = [
  {
    title: "App Router foundation",
    description: "Next.js, TypeScript, Tailwind, and the core modular structure are in place.",
    icon: PanelLeft,
  },
  {
    title: "Supabase ready",
    description: "Client and server helpers are prepared for auth, database, and realtime work.",
    icon: Database,
  },
  {
    title: "UI system initialized",
    description: "shadcn/ui is configured so we can build polished primitives without rework.",
    icon: Shield,
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.08),_transparent_42%),linear-gradient(180deg,_rgba(255,255,255,1),_rgba(244,244,245,1))] px-6 py-16">
      <section className="w-full max-w-5xl rounded-3xl border border-border/70 bg-background/95 p-8 shadow-[0_30px_120px_rgba(24,24,27,0.10)] backdrop-blur md:p-12">
        <div className="max-w-2xl space-y-5">
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            Phase 1 setup complete
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            A Notion-style workspace starter is ready for schema design.
          </h1>
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            This project now has the core frontend foundation, shared UI tooling,
            and Supabase wiring we need before building auth, nested documents,
            and the editor experience.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {phaseOneItems.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
            >
              <Icon className="mb-4 size-5 text-foreground" />
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm leading-6">
            Next up is Phase 2: defining the Supabase schema for user profiles,
            infinitely nested documents, and future database-like page properties.
          </p>
        </div>
      </section>
    </main>
  );
}
