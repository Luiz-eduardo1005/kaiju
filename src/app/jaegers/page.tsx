import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { jaegers } from "@/data";

export default function JaegersPage() {
  return (
    <PageShell
      eyebrow="Hangar de guerra"
      title="Jaegers"
      subtitle="Os colossos mecanicos vieram antes das armas enumeradas e foram a primeira resposta tecnologica capaz de lutar no tamanho dos monstros."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jaegers.map((jaeger) => (
          <Card
            key={jaeger.id}
            title={jaeger.nome}
            subtitle={jaeger.geracao}
            description={jaeger.descricao}
            href={`/jaegers/${jaeger.id}`}
            tags={jaeger.tags}
            status={jaeger.statusPublico}
          />
        ))}
      </section>
    </PageShell>
  );
}
