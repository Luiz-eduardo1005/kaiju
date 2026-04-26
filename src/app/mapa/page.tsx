import { PublicBlock } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";
import { cityLocations } from "@/data";

export default function MapPage() {
  return (
    <PageShell
      eyebrow="Mapa operacional"
      title="Mapa de Nova Aurora"
      subtitle="Representacao textual inicial para organizar rotas de cena, zonas civis, locais militares e pontos de campanha."
    >
      <PublicBlock title="Rotas principais">
        <div className="grid gap-4 md:grid-cols-2">
          {cityLocations.map((location, index) => (
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
