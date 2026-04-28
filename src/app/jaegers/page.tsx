"use client";

import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { useMode } from "@/context/mode-context";
import { jaegers } from "@/data";

export default function JaegersPage() {
  const { mode } = useMode();
  const publicJaegers = ["atlas-prime", "vanguard-01", "iron-saint"];
  const visibleJaegers = mode === "master" ? jaegers : jaegers.filter((jaeger) => publicJaegers.includes(jaeger.id));

  return (
    <PageShell
      eyebrow="Hangar de guerra"
      title="Jaegers"
      subtitle="Primeira fase do Projeto Atlas: máquinas experimentais, Drift instável e esperança ainda sem garantia."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleJaegers.map((jaeger) => (
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
