import { ClassifiedBlock, PublicBlock } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";
import { campaign } from "@/data";

export default function CampaignPage() {
  return (
    <PageShell
      eyebrow={`Campanha inicial / ${campaign.ano}`}
      title={campaign.titulo}
      subtitle="Area para registrar premissa, abertura, ganchos e futuras sessoes da mesa."
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
