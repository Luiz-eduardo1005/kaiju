import { PublicBlock } from "@/components/blocks";
import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { suits } from "@/data";

export default function SuitsPage() {
  return (
    <PageShell
      eyebrow="Unidades anti-Kaiju"
      title="Trajes Anti-Kaiju"
      subtitle="A camada intermediária da guerra: essencial para Yoju, túneis, contaminação, evacuação armada e ameaças urbanas."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {suits.map((suit) => (
          <Card
            key={suit.id}
            title={suit.nome}
            subtitle={suit.funcao}
            description={suit.descricao}
            tags={suit.tags}
            status={suit.status}
          />
        ))}
      </section>
      <section className="space-y-6">
        {suits.map((suit) => (
          <PublicBlock key={suit.id} title={suit.nome}>
            <p>
              <strong>Geração:</strong> {suit.geracao ?? "Não especificada"}
            </p>
            <p>
              <strong>Função:</strong> {suit.funcao}
            </p>
            <p>{suit.descricao}</p>
          </PublicBlock>
        ))}
      </section>
    </PageShell>
  );
}
