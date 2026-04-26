"use client";

import { Card } from "@/components/card";
import { ClassifiedBlock, PublicBlock, TextContent } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";
import { Timeline } from "@/components/timeline";
import { historyEntries, timelineEvents } from "@/data";

export default function HistoriaPage() {
  const publicHistory = historyEntries.find((item) => item.id === "historia-publica");
  const secretHistory = historyEntries.find((item) => item.id === "historia-secreta");

  return (
    <PageShell
      eyebrow="Departamento historico"
      title="Historia"
      subtitle="A guerra Kaiju tem uma versao ensinada em escolas e uma versao enterrada em arquivos que nunca deveriam existir."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Historia Publica" description="A versao oficial para civis, cadetes e recrutas." tags={["Publico"]} />
        <Card title="Historia Original / Secreta" description="A verdade apagada dos arquivos publicos." tags={["Classificado"]} restricted />
        <Card title="Linha do Tempo" description="Eventos centrais entre 1984 e 2040." tags={["Campanha"]} />
        <Card title="Eventos Importantes" description="Batalhas, descobertas e pontos de virada." tags={["Lendario"]} />
      </div>

      {publicHistory ? (
        <PublicBlock title={publicHistory.title}>
          <p className="text-cyan-100/80">{publicHistory.subtitle}</p>
          <TextContent text={publicHistory.text} />
          {publicHistory.summary ? (
            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-cyan-100">Resumo publico para player</h3>
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
