import { notFound } from "next/navigation";
import { DetailPage } from "@/components/detail-page";
import { JaegerCombatSheet } from "@/components/jaegers/JaegerCombatSheet";
import { JaegerDiagnosticLoader } from "@/components/jaegers/JaegerDiagnosticLoader";
import { PageShell } from "@/components/page-shell";
import { jaegers } from "@/data";
import { getJaegerCombatContent } from "@/lib/jaeger-combat/content";

export async function generateStaticParams() {
  return jaegers.map((jaeger) => ({ id: jaeger.id }));
}

export default async function JaegerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jaeger = jaegers.find((item) => item.id === id);
  if (!jaeger) notFound();
  const combatContent = getJaegerCombatContent(jaeger.id);

  return (
    <PageShell eyebrow="Dossiê Jaeger" title={jaeger.nome} subtitle={jaeger.geracao} showHero={false}>
      <DetailPage
        title={jaeger.nome}
        subtitle={jaeger.funcao}
        tags={jaeger.tags}
        facts={{
          Geração: jaeger.geracao,
          Altura: jaeger.altura,
          "Peso estimado": jaeger.pesoEstimado,
          Pilotos: jaeger.pilotos,
          Status: jaeger.statusPublico,
          Função: jaeger.funcao,
        }}
        publicText={jaeger.descricao}
        secretText={jaeger.statusSecreto}
        sections={[
          { title: "História", content: jaeger.historia },
          ...(jaeger.dossie ?? []),
          { title: "Armamentos", content: jaeger.armamentos },
          { title: "Batalhas famosas", content: jaeger.batalhasFamosas },
          { title: "Segredos", content: jaeger.segredo, classified: true },
          { title: "Transmissão", content: jaeger.transmissao, classified: true },
        ]}
      />
      {combatContent ? (
        <JaegerCombatSheet
          entry={combatContent.entry}
          jaegerName={jaeger.nome}
          jaegerFunction={jaeger.funcao}
          jaegerContent={combatContent.jaegerContent}
          blocks={combatContent.blocks}
        />
      ) : null}
      <JaegerDiagnosticLoader jaegerId={jaeger.id} jaegerName={jaeger.nome} />
    </PageShell>
  );
}
