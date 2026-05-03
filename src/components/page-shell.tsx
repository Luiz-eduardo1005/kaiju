export function PageShell({
  eyebrow,
  title,
  subtitle,
  showHero = true,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  showHero?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8">
      {showHero ? (
        <section className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-violet-950/20 p-6 md:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div className="relative max-w-4xl">
            {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">{eyebrow}</p> : null}
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">{title}</h1>
            {subtitle ? <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{subtitle}</p> : null}
          </div>
        </section>
      ) : null}
      {children}
    </main>
  );
}
