import { notFound } from "next/navigation";
import { DetailPage } from "@/components/detail-page";
import { PageShell } from "@/components/page-shell";
import { kaijus } from "@/data";

export function generateStaticParams() {
  return kaijus.map((kaiju) => ({ id: kaiju.id }));
}

export default async function KaijuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kaiju = kaijus.find((item) => item.id === id);
  if (!kaiju) notFound();

  return (
    <PageShell eyebrow="Dossie Kaiju" title={kaiju.nome} subtitle={`${kaiju.numero} / ${kaiju.titulo}`}>
      <DetailPage
        title={kaiju.nome}
        subtitle={`${kaiju.numero} - ${kaiju.titulo}`}
        image={kaiju.image}
        tags={kaiju.tags}
        facts={{
          Numero: kaiju.numero,
          "Primeira aparicao": kaiju.primeiraAparicao,
          Local: kaiju.local,
          Altura: kaiju.altura,
          Comprimento: kaiju.comprimento,
          Tipo: kaiju.tipo,
          "Nivel de ameaca": kaiju.nivelAmeaca,
          "Status publico": kaiju.statusPublico,
        }}
        publicText={kaiju.descricaoFisica}
        secretText={kaiju.statusSecreto}
        sections={[
          { title: "Comportamento", content: kaiju.comportamento },
          { title: "Habilidades", content: kaiju.habilidades },
          { title: "Historia publica", content: kaiju.historiaPublica },
          { title: "Historia secreta", content: kaiju.historiaSecreta, classified: true },
          { title: "Como foi derrotado", content: kaiju.comoFoiDerrotado },
          { title: "Relacao com Jaegers", content: kaiju.relacaoComJaegers },
          { title: "Relacao com Armas Enumeradas", content: kaiju.armaRelacionada },
          { title: "Ganchos de campanha", content: kaiju.ganchos, classified: true },
        ]}
      />
    </PageShell>
  );
}
