"use client";

import { ClassifiedBlock } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";
import { useMode } from "@/context/mode-context";
import { campaign, historyEntries, jaegers, npcs } from "@/data";

export default function SecretFilesPage() {
  const { isMaster } = useMode();
  const secretHistory = historyEntries.find((item) => item.id === "historia-secreta");

  return (
    <PageShell
      eyebrow="Nivel omega"
      title="Arquivos Secretos"
      subtitle="Este setor fica vazio no Modo Player. No Modo Mestre, ele consolida conspirações, verdades ocultas e ganchos futuros."
    >
      {!isMaster ? (
        <div className="rounded-3xl border border-cyan-300/20 bg-slate-950/80 p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">Acesso civil detectado</p>
          <h2 className="mt-3 text-3xl font-black text-white">Nenhum arquivo disponivel no Modo Player.</h2>
          <p className="mt-3 text-slate-300">Alterne para Modo Mestre no topo para liberar o arquivo classificado.</p>
        </div>
      ) : (
        <section className="space-y-6">
          <ClassifiedBlock title="Verdade central">
            <p>
              Helena Sato foi apagada da historia publica; Viktor Leonov e o heroi oficial falso; as armas enumeradas nasceram
              apenas depois de decadas de pesquisa, falhas e mortes; e o fragmento do Atlas-Prime em 2040 e a abertura real da
              campanha.
            </p>
          </ClassifiedBlock>
          <ClassifiedBlock title="Notas secretas da historia">
            <ul>
              {secretHistory?.notes?.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </ClassifiedBlock>
          <ClassifiedBlock title="Atlas-Prime / transmissao de 2006">
            <p>{jaegers.find((jaeger) => jaeger.id === "atlas-prime")?.transmissao}</p>
            <p>{campaign.eventoFuturo}</p>
          </ClassifiedBlock>
          <ClassifiedBlock title="NPCs ocultos">
            <ul>
              {npcs
                .filter((npc) => npc.visibilidade !== "public" || npc.segredo)
                .map((npc) => (
                  <li key={npc.id}>
                    <strong>{npc.nome}:</strong> {npc.segredo}
                  </li>
                ))}
            </ul>
          </ClassifiedBlock>
        </section>
      )}
    </PageShell>
  );
}
