type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen bg-[linear-gradient(180deg,_rgba(255,255,255,1),_rgba(244,244,245,1))]">
      <section className="hidden flex-1 border-r border-border/60 bg-zinc-950 px-10 py-12 text-zinc-50 lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-4">
          <span className="text-sm uppercase tracking-[0.24em] text-zinc-400">
            PersonalLife
          </span>
          <h1 className="max-w-md text-4xl font-semibold tracking-tight">
            Build one workspace for notes, money, plans, habits, and reading.
          </h1>
          <p className="max-w-lg text-base leading-7 text-zinc-300">
            Your app shell is ready for a section-aware experience, so each part
            of life can live in one organized system instead of scattered tools.
          </p>
        </div>
        <p className="max-w-sm text-sm leading-6 text-zinc-400">
          Phase 3 focuses on authentication and the main workspace layout so the
          deployed Vercel app is ready for real user sessions.
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border/70 bg-background p-8 shadow-[0_24px_80px_rgba(24,24,27,0.10)]">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
