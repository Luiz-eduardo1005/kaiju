"use client";

import { PublicBlock } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";
import { useMode } from "@/context/mode-context";
import { cityLocations } from "@/data";

export default function MapPage() {
  const { isMaster } = useMode();
  const visibleLocations = isMaster ? cityLocations : cityLocations.filter((location) => !location.tags.includes("Classificado"));

  return (
    <PageShell
      eyebrow="Mapa regional / 2006"
      title="Nova Aurora e Base Naval Atlas"
      subtitle="Mapa regional da campanha: cidade costeira, rotas de evacuação, regiões civis, zona portuária e instalações militares do Projeto Atlas."
    >
      <PublicBlock title="Região de campanha">
        <p>
          Mapa regional de Nova Aurora e da Base Naval Atlas em 2006. Ele serve para a campanha inteira, não apenas para o teste de
          seleção: mostra costa, cidade, abrigos, estradas militares, hangares e pontos de retorno para cenas civis.
        </p>
      </PublicBlock>
      <PublicBlock title="Pontos principais">
        <div className="grid gap-4 md:grid-cols-2">
          {visibleLocations.map((location, index) => (
            <div key={location.id} className="rounded-2xl border border-cyan-300/15 bg-black/30 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Setor {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-xl font-black text-white">{location.nome}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{location.descricao}</p>
            </div>
          ))}
        </div>
      </PublicBlock>
    </PageShell>
  );
}
