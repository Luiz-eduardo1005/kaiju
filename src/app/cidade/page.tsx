"use client";

import { ClassifiedBlock, PublicBlock, TextContent } from "@/components/blocks";
import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { useMode } from "@/context/mode-context";
import { cityLocations, cityOverview } from "@/data";

export default function CityPage() {
  const { isMaster } = useMode();
  const visibleLocations = isMaster ? cityLocations : cityLocations.filter((location) => !location.tags.includes("Classificado"));

  return (
    <PageShell
      eyebrow="Arquivo urbano"
      title={cityOverview.nome}
      subtitle={`${cityOverview.tipo} / ${cityOverview.localizacao} / Alerta ${cityOverview.alertaAtual}`}
    >
      <PublicBlock title="Descrição geral">
        <TextContent text={cityOverview.descricao} />
      </PublicBlock>
      {isMaster ? (
        <ClassifiedBlock title="Descrição secreta">
          <TextContent text={cityOverview.descricaoSecreta} />
        </ClassifiedBlock>
      ) : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleLocations.map((location) => (
          <Card key={location.id} title={location.nome} description={location.descricao} tags={location.tags} status={location.status} />
        ))}
      </section>
    </PageShell>
  );
}
