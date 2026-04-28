import { PublicBlock } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";

const futureUses = [
  "Bibliotecas encontradas",
  "Documentos recuperados",
  "Locais desbloqueados",
  "Arquivos de investigação",
  "Pistas sobre Projeto Atlas, Base Nereu e anomalias Kaiju",
];

export default function DiscoveredAreasPage() {
  return (
    <PageShell
      eyebrow="Arquivo de campanha"
      title="Áreas Descobertas"
      subtitle="Espaço preparado para reunir locais, documentos e pistas que os players descobrirem durante a campanha."
    >
      <PublicBlock title="Nenhuma área desbloqueada">
        <p>
          Os players ainda não registraram áreas descobertas. Conforme a campanha avançar, este painel poderá reunir bibliotecas,
          salas secretas, documentos, mapas, gravações e outros arquivos encontrados em jogo.
        </p>
      </PublicBlock>

      <section className="grid gap-4 md:grid-cols-2">
        {futureUses.map((item) => (
          <div key={item} className="rounded-2xl border border-cyan-300/15 bg-slate-950/70 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300">Slot futuro</p>
            <h2 className="mt-2 text-xl font-black uppercase text-white">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Conteúdo ainda bloqueado. O mestre poderá preencher este espaço quando a mesa descobrir essa informação.
            </p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
