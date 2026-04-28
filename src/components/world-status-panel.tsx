"use client";

import { useEffect, useState } from "react";
import { useMode } from "@/context/mode-context";
import { worldStatus } from "@/data";
import { getWorldAlert, WORLD_ALERT_STORAGE_KEY } from "@/data/alerts";
import { ClassifiedBlock } from "./blocks";

const publicStats = [
  ["Ano atual", worldStatus.anoAtual],
  ["Era atual", worldStatus.eraAtual],
  ["Status do mundo", worldStatus.statusMundo],
  ["Programa Atlas", worldStatus.programaRecrutamento],
  ["Drift", worldStatus.drift],
  ["Jaegers operacionais", worldStatus.statusJaegers],
  ["Armas enumeradas", worldStatus.statusArmas],
  ["Trajes anti-Kaiju", worldStatus.statusTrajes],
  ["Ameaça Kaiju", worldStatus.atividadeKaiju],
];

export function WorldStatusPanel() {
  const { isMaster } = useMode();
  const [alertId, setAlertId] = useState(worldStatus.alertaAtual.toLowerCase());
  const currentAlert = getWorldAlert(alertId);

  useEffect(() => {
    const loadAlert = () => {
      setAlertId(window.localStorage.getItem(WORLD_ALERT_STORAGE_KEY) ?? worldStatus.alertaAtual.toLowerCase());
    };

    loadAlert();
    window.addEventListener("storage", loadAlert);
    window.addEventListener("world-alert-updated", loadAlert);
    return () => {
      window.removeEventListener("storage", loadAlert);
      window.removeEventListener("world-alert-updated", loadAlert);
    };
  }, []);

  return (
    <section className="rounded-3xl border border-cyan-300/20 bg-slate-950/75 p-5 shadow-[0_0_45px_rgba(14,165,233,0.1)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300">Status do Mundo</p>
          <h2 className="mt-1 text-2xl font-black text-white">Painel operacional 2006</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.2em] ${currentAlert.className}`}>
          {currentAlert.label}
        </span>
      </div>
      <div className="mb-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{currentAlert.title}</p>
        <p className="mt-2 text-sm font-bold text-slate-100">{currentAlert.description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
