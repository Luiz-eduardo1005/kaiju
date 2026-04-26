"use client";

import { ClassifiedBlock, PublicBlock } from "@/components/blocks";
import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { useMode } from "@/context/mode-context";
import { npcs } from "@/data";

export default function NpcsPage() {
  const { isMaster } = useMode();
  const visibleNpcs = npcs.filter((npc) => isMaster || npc.visibilidade === "public");

  return (
    <PageShell
      eyebrow="Registro de pessoas"
      title="NPCs"
      subtitle="Pilotos, cientistas, herois oficiais, nomes apagados e figuras que podem mover a campanha por baixo da superficie."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleNpcs.map((npc) => (
          <Card
            key={npc.id}
            title={npc.nome}
            subtitle={npc.cargo ?? npc.cargoPublico}
            description={npc.descricao ?? npc.descricaoPublica}
            tags={npc.tags}
            restricted={npc.visibilidade !== "public"}
          />
        ))}
      </section>
      <section className="space-y-6">
        {visibleNpcs.map((npc) =>
          npc.visibilidade === "public" ? (
            <PublicBlock key={npc.id} title={npc.nome}>
              <p>{npc.descricaoPublica ?? npc.descricao}</p>
              {npc.segredo ? (
                <ClassifiedBlock title="Segredo">
                  <p>{npc.segredo}</p>
                </ClassifiedBlock>
              ) : null}
            </PublicBlock>
          ) : (
            <ClassifiedBlock key={npc.id} title={npc.nome} visibility={npc.visibilidade}>
              <p>{npc.descricao}</p>
              <p>{npc.segredo}</p>
              {npc.usoNaCampanha ? <p>{npc.usoNaCampanha}</p> : null}
            </ClassifiedBlock>
          ),
        )}
      </section>
    </PageShell>
  );
}
