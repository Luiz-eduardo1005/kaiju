"use client";

import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { useMode } from "@/context/mode-context";
import { kaijus } from "@/data";

export default function KaijusPage() {
  const { mode } = useMode();
  const visibleKaijus = mode === "master" ? kaijus : kaijus.filter((kaiju) => ["tressarak", "gorath", "mirekai"].includes(kaiju.id));

  return (
    <PageShell
      eyebrow="Catalogo de ameacas"
      title="Kaijus"
      subtitle="Dossies de criaturas colossais, titas primordiais e anomalias de fenda registradas desde 1984."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleKaijus.map((kaiju) => {
          const data = mode === "master" ? kaiju.master : kaiju.player;
          return (
            <Card
              key={kaiju.id}
              title={`${kaiju.number} - ${kaiju.name}`}
              subtitle={kaiju.title}
              description={data.physicalDescription}
              href={`/kaijus/${kaiju.id}`}
              tags={kaiju.tags}
              status={data.status}
            />
          );
        })}
      </section>
    </PageShell>
  );
}
