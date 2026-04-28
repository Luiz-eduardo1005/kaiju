import { notFound } from "next/navigation";
import { DetailPage } from "@/components/detail-page";
import { PageShell } from "@/components/page-shell";
import { jaegers } from "@/data";

export function generateStaticParams() {
  return jaegers.map((jaeger) => ({ id: jaeger.id }));
}

export default async function JaegerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jaeger = jaegers.find((item) => item.id === id);
  if (!jaeger) notFound();

  return (
    <PageShell eyebrow="Dossiê Jaeger" title={jaeger.nome} subtitle={jaeger.geracao}>
      <DetailPage
        title={jaeger.nome}
        subtitle={jaeger.funcao}
        tags={jaeger.tags}
        facts={{
          Geracao: jaeger.geracao,
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
          { title: "Armamentos", content: jaeger.armamentos },
          { title: "Batalhas famosas", content: jaeger.batalhasFamosas },
          { title: "Segredos", content: jaeger.segredo, classified: true },
          { title: "Transmissao", content: jaeger.transmissao, classified: true },
        ]}
      />
    </PageShell>
  );
}
