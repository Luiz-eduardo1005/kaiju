"use client";

import { ClassifiedBlock, PublicBlock } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";
import { useMode } from "@/context/mode-context";
import { campaign } from "@/data";

export default function CampaignPage() {
  const { isMaster } = useMode();

  if (!isMaster) {
    return (
      <PageShell
        eyebrow="Área de mestre"
        title="Campanha / Sessões"
        subtitle="Planejamento narrativo, anotações de sessão e consequências futuras ficam ocultos para players."
      >
        <PublicBlock title="Acesso restrito">
          <p>Este card aparece apenas no Modo Mestre para proteger preparação, segredos e controle narrativo da campanha.</p>
        </PublicBlock>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow={`Campanha inicial / ${campaign.ano}`}
      title={campaign.titulo}
      subtitle="Área para registrar premissa, abertura, ganchos e futuras sessões da mesa."
    >
      <PublicBlock title="Premissa">
        <p>{campaign.premissa}</p>
      </PublicBlock>
      <PublicBlock title="Abertura">
        <p>{campaign.abertura}</p>
      </PublicBlock>
      <ClassifiedBlock title="Evento futuro">
        <p>{campaign.eventoFuturo}</p>
      </ClassifiedBlock>
      <ClassifiedBlock title="Ganchos">
        <ul>
          {campaign.ganchos.map((hook) => (
            <li key={hook}>{hook}</li>
          ))}
        </ul>
      </ClassifiedBlock>
      <PublicBlock title="Registro de sessoes">
        {campaign.sessions.map((session) => (
          <div key={session.id} className="rounded-2xl border border-cyan-300/15 bg-black/30 p-4">
            <h3>{session.title}</h3>
            <p>
              <strong>Status:</strong> {session.status}
            </p>
            <p>{session.notes}</p>
          </div>
        ))}
      </PublicBlock>
    </PageShell>
  );
}
