"use client";

import { useMode } from "@/context/mode-context";
import type { Kaiju } from "@/data";
import { DetailPage } from "./detail-page";

export function KaijuDetail({ kaiju }: { kaiju: Kaiju }) {
  const { mode } = useMode();
  const data = mode === "master" ? kaiju.master : kaiju.player;

  return (
    <DetailPage
      title={kaiju.name}
      subtitle={`${kaiju.number} - ${kaiju.title}`}
      image={kaiju.image}
      tags={kaiju.tags}
      facts={{
        Numero: kaiju.number,
        "Primeira aparicao": data.firstAppearance,
        Local: data.location,
        Altura: data.height,
        Tipo: data.type,
        "Nivel de ameaca": data.threatLevel,
        Status: data.status,
      }}
      publicText={data.physicalDescription}
      sections={[
        { title: "Comportamento", content: data.behavior },
        { title: "Habilidades", content: data.abilities },
        { title: "Historia", content: data.history },
        { title: "Como foi derrotado", content: data.howDefeated },
        { title: "Relacao com Jaegers", content: data.relationToJaegers },
        { title: "Relacao com Armas Enumeradas", content: data.relationToEnumeratedWeapons },
        { title: mode === "master" ? "Ganchos secretos de campanha" : "Rumores e leitura publica", content: data.hooks },
        { title: "Notas classificadas", content: data.classifiedNotes, classified: true },
      ]}
    />
  );
}
