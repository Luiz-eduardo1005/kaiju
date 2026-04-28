"use client";

import { Card } from "@/components/card";
import { GlobalSearch } from "@/components/global-search";
import { WorldStatusPanel } from "@/components/world-status-panel";
import { useMode } from "@/context/mode-context";
import { dashboardSections } from "@/data";

export default function Home() {
  const { isMaster } = useMode();
  const visibleSections = dashboardSections.filter((section) => {
    const isRestricted = "restricted" in section && section.restricted;
    const isMasterPanel = section.category === "painel-mestre";

    return !isRestricted || (isMaster && isMasterPanel);
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8">
      <section className="scanline relative overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-slate-950/70 p-6 shadow-[0_0_60px_rgba(6,182,212,0.12)] md:p-10">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.45em] text-cyan-300">ERA ATUAL: 2006 - Início dos Jaegers</p>
          <h1 className="mt-5 text-5xl font-black uppercase leading-none tracking-tight text-white md:text-7xl">
            C&iacute;rculo de Fogo
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-300">Programa Atlas, Drift instável e a primeira fase dos Jaegers.</p>
        </div>
      </section>

      <WorldStatusPanel />
      <GlobalSearch />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleSections.map((section) => (
          <Card
            key={section.href}
            title={section.title}
            description={section.description}
            href={section.href}
            restricted={"restricted" in section ? section.restricted : false}
          />
        ))}
      </section>
    </main>
  );
}
