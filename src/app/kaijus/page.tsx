import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { kaijus } from "@/data";

export default function KaijusPage() {
  return (
    <PageShell
      eyebrow="Catalogo de ameacas"
      title="Kaijus"
      subtitle="Dossies de criaturas colossais, titas primordiais e anomalias de fenda registradas desde 1984."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kaijus.map((kaiju) => (
          <Card
            key={kaiju.id}
            title={`${kaiju.numero} - ${kaiju.nome}`}
            subtitle={kaiju.titulo}
            description={kaiju.descricaoFisica}
            href={`/kaijus/${kaiju.id}`}
            tags={kaiju.tags}
            status={kaiju.statusPublico}
          />
        ))}
      </section>
    </PageShell>
  );
}
