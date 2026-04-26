"use client";

import { useMode } from "@/context/mode-context";
import { worldStatus } from "@/data";
import { ClassifiedBlock } from "./blocks";

const publicStats = [
  ["Ano atual", worldStatus.anoAtual],
  ["Cidade inicial", worldStatus.cidadeInicial],
  ["Alerta atual", worldStatus.alertaAtual],
  ["Recrutamento", worldStatus.programaRecrutamento],
  ["Atividade Kaiju", worldStatus.atividadeKaiju],
  ["Jaegers", worldStatus.statusJaegers],
  ["Trajes", worldStatus.statusTrajes],
  ["Armas", worldStatus.statusArmas],
];

export function WorldStatusPanel() {
  const { isMaster } = useMode();

  return (
    <section className="rounded-3xl border border-cyan-300/20 bg-slate-950/75 p-5 shadow-[0_0_45px_rgba(14,165,233,0.1)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300">Status do mundo</p>
          <h2 className="mt-1 text-2xl font-black text-white">Painel operacional 2040</h2>
        </div>
        <span className="rounded-full border border-emerald-300/50 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-100">
          Alerta Verde
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {publicStats.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-bold text-slate-100">{value}</p>
          </div>
        ))}
      </div>
      {isMaster ? (
        <div className="mt-4">
          <ClassifiedBlock title="Evento secreto de abertura">
            <p>{worldStatus.eventoSecreto}</p>
          </ClassifiedBlock>
        </div>
      ) : null}
    </section>
  );
}
