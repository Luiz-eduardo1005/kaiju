import { notFound } from "next/navigation";
import { KaijuDetail } from "@/components/kaiju-detail";
import { PageShell } from "@/components/page-shell";
import { kaijus } from "@/data";

export async function generateStaticParams() {
  return kaijus.map((kaiju) => ({ id: kaiju.id }));
}

export default async function KaijuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kaiju = kaijus.find((item) => item.id === id);
  if (!kaiju) notFound();

  return (
    <PageShell eyebrow="Dossiê Kaiju" title={kaiju.name} subtitle={`${kaiju.number} / ${kaiju.title}`} showHero={false}>
      <KaijuDetail kaiju={kaiju} />
    </PageShell>
  );
}
