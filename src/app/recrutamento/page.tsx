"use client";

import { PublicBlock } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";
import { recruitmentSteps } from "@/data";
import { useMode } from "@/context/mode-context";

export default function RecruitmentPage() {
  const { isMaster } = useMode();

  if (!isMaster) {
    return (
      <PageShell
        eyebrow="Acesso restrito"
        title="Testes de Recrutamento"
        subtitle="Acesso negado. Apenas o Mestre pode visualizar os detalhes das etapas de recrutamento."
      >
        <div className="rounded-3xl border border-cyan-300/25 bg-cyan-950/10 p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">Modo Player ativo</p>
          <h2 className="mt-3 text-3xl font-black text-white">Este documento e restrito ao comando militar.</h2>
          <p className="mt-3 text-slate-300">Ative o Modo Mestre para visualizar as cronicas e detalhes operacionais do recrutamento.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Programa integrado"
      title="Testes de Recrutamento"
      subtitle="Da primeira triagem ao pre-Drift: cada etapa mede corpo, medo, impulso, obediencia, compatibilidade e colapso."
    >
      <PublicBlock title="Etapas oficiais">
        <ol className="space-y-4">
          {recruitmentSteps.map((step, index) => (
            <li key={step.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Etapa {index + 1}</p>
              <h3 className="mt-2 text-2xl font-black text-white">{step.title}</h3>
              <p className="mt-2 leading-7 text-slate-300">{step.text}</p>
            </li>
          ))}
        </ol>
      </PublicBlock>
    </PageShell>
  );
}
