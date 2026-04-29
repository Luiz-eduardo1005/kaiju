"use client";

import { Card } from "@/components/card";
import { ClassifiedBlock, PublicBlock, TextContent } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";
import { Timeline } from "@/components/timeline";
import { useMode } from "@/context/mode-context";
import { historyEntries, timelineEvents } from "@/data";

export default function HistoriaPage() {
  const { isMaster } = useMode();
  const publicHistory = historyEntries.find((item) => item.id === "historia-publica");
  const secretHistory = historyEntries.find((item) => item.id === "historia-secreta");

  return (
    <PageShell
      eyebrow="Departamento histórico"
      title="História"
      subtitle="A linha jogável começa em 2006, com os registros conhecidos de 1984 até o Programa Atlas."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Registro Histórico" description="Linha conhecida por civis, cadetes e recrutas." tags={["Público"]} />
        {isMaster ? (
          <Card title="História Original / Secreta" description="A verdade apagada dos arquivos públicos." tags={["Classificado"]} restricted />
        ) : null}
        <Card title="Linha do Tempo" description="Eventos centrais entre 1984 e o início de 2006." tags={["Campanha"]} />
        <Card title="Eventos Importantes" description="Batalhas, descobertas e pontos de virada." tags={["Lendário"]} />
      </div>

      {publicHistory ? (
        <PublicBlock title={publicHistory.title}>
          <p className="text-cyan-100/80">{publicHistory.subtitle}</p>
          <TextContent text={publicHistory.text} />
          {publicHistory.summary ? (
            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-cyan-100">Resumo para recrutas</h3>
              <p>{publicHistory.summary}</p>
            </div>
          ) : null}
        </PublicBlock>
      ) : null}

      {secretHistory ? (
        <ClassifiedBlock title={secretHistory.title} visibility={secretHistory.visibility}>
          <p className="text-red-100/80">{secretHistory.subtitle}</p>
          <TextContent text={secretHistory.text} />
          {secretHistory.notes ? (
            <div className="mt-6 rounded-2xl border border-red-300/30 bg-red-500/10 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-red-100">Notas secretas do mestre</h3>
              <ul>
                {secretHistory.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </ClassifiedBlock>
      ) : null}

      <PublicBlock title="Linha do Tempo">
        <Timeline events={timelineEvents} />
      </PublicBlock>
    </PageShell>
  );
}
