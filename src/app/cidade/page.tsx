import { PublicBlock, TextContent } from "@/components/blocks";
import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { cityLocations, cityOverview } from "@/data";

export default function CityPage() {
  return (
    <PageShell
      eyebrow="Arquivo urbano"
      title={cityOverview.nome}
      subtitle={`${cityOverview.tipo} / ${cityOverview.localizacao} / Alerta ${cityOverview.alertaAtual}`}
    >
      <PublicBlock title="Descricao geral">
        <TextContent text={cityOverview.descricao} />
      </PublicBlock>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cityLocations.map((location) => (
          <Card
            key={location.id}
            title={location.nome}
            description={location.descricao}
            tags={location.tags}
            status={location.status}
          />
        ))}
      </section>
    </PageShell>
  );
}
