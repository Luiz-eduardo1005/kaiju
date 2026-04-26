import { notFound } from "next/navigation";
import { KaijuDetail } from "@/components/kaiju-detail";
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
    <PageShell eyebrow="Dossie Kaiju" title={kaiju.name} subtitle={`${kaiju.number} / ${kaiju.title}`}>
      <KaijuDetail kaiju={kaiju} />
    </PageShell>
  );
}
