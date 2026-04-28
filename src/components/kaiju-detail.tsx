"use client";

import { useMode } from "@/context/mode-context";
import type { Kaiju } from "@/data";
import { DetailPage } from "./detail-page";

export function KaijuDetail({ kaiju }: { kaiju: Kaiju }) {
  const { mode } = useMode();
  const isFutureLocked = mode !== "master" && !["tressarak", "gorath", "mirekai"].includes(kaiju.id);
  const data = mode === "master" ? kaiju.master : kaiju.player;
  const researchTitle = mode === "master" ? "Relação com Pesquisas Kaiju / futuro tecnológico" : "Relação com Projeto Atlas";

  if (isFutureLocked) {
    return (
      <DetailPage
        title="Arquivo não desbloqueado"
        subtitle="Conteúdo futuro oculto na linha jogável de 2006"
        image={kaiju.image}
        tags={["Classificado"]}
        facts={{
          Status: "Oculto para players",
          "Ano ativo": "2006",
        }}
        publicText="Este dossiê pertence a eventos que ainda não aconteceram na campanha jogável. Ative o Modo Mestre para acessar o arquivo completo."
        sections={[]}
      />
    );
  }

  return (
    <DetailPage
      title={kaiju.name}
      subtitle={`${kaiju.number} - ${kaiju.title}`}
      image={kaiju.image}
      tags={kaiju.tags}
      facts={{
        Número: kaiju.number,
        "Primeira aparição": data.firstAppearance,
        Local: data.location,
        Altura: data.height,
        Tipo: data.type,
        "Nível de ameaça": data.threatLevel,
        Status: data.status,
      }}
      publicText={data.physicalDescription}
      sections={[
        { title: "Comportamento", content: data.behavior },
        { title: "Habilidades", content: data.abilities },
        { title: "História", content: data.history },
        { title: "Como foi derrotado", content: data.howDefeated },
        { title: "Relação com Jaegers", content: data.relationToJaegers },
        { title: researchTitle, content: data.relationToEnumeratedWeapons },
        { title: mode === "master" ? "Ganchos secretos de campanha" : "Rumores e impacto cultural", content: data.hooks },
        { title: "Notas classificadas", content: data.classifiedNotes, classified: true },
      ]}
    />
  );
}
