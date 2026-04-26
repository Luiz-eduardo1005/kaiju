import { PublicBlock } from "@/components/blocks";
import { PageShell } from "@/components/page-shell";
import { recruitmentSteps } from "@/data";

export default function RecruitmentPage() {
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
