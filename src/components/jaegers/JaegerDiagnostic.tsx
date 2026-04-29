"use client";

import {
  calculateJaegerIntegrity,
  JAEGER_BLUEPRINTS,
  JAEGER_PARTS,
  JAEGER_STATUS_LABELS,
  jaegerStatusTone,
  mergeJaegerStatuses,
  summarizeJaegerReadiness,
} from "@/lib/game/jaegerDiagnostics";
import type { JaegerPartStatus } from "@/types/game";

type JaegerDiagnosticProps = {
  jaegerId: string;
  jaegerName: string;
  statuses?: JaegerPartStatus[];
  selectedPartId?: string;
  onSelectPart?: (partId: string) => void;
  interactive?: boolean;
};

const leftColumnParts = ["head", "left_arm", "left_leg"];
const rightColumnParts = ["chest", "core", "right_arm", "right_leg"];

function getPartStatus(statuses: JaegerPartStatus[], partId: string) {
  return statuses.find((item) => item.part_id === partId)!;
}

export function JaegerDiagnostic({ jaegerId, jaegerName, statuses = [], selectedPartId, onSelectPart, interactive = false }: JaegerDiagnosticProps) {
  const mergedStatuses = mergeJaegerStatuses(jaegerId, statuses);
  const readiness = summarizeJaegerReadiness(mergedStatuses);
  const integrity = calculateJaegerIntegrity(mergedStatuses);
  const blueprint = JAEGER_BLUEPRINTS[jaegerId];
  const selectedPart = selectedPartId ? JAEGER_PARTS.find((part) => part.id === selectedPartId) : null;
  const selectedStatus = selectedPart ? getPartStatus(mergedStatuses, selectedPart.id) : null;

  function partCard(partId: string) {
    const part = JAEGER_PARTS.find((item) => item.id === partId)!;
    const status = getPartStatus(mergedStatuses, part.id);
    const tone = jaegerStatusTone(status.status);
    const selected = selectedPartId === part.id;

    return (
      <button
        key={`${part.id}-card`}
        type="button"
        disabled={!interactive}
        onClick={() => onSelectPart?.(part.id)}
        className={`group rounded-2xl border p-3 text-left transition duration-200 ${tone.border} ${
          selected ? "ring-2 ring-white/80 ring-offset-2 ring-offset-slate-950" : ""
        } ${interactive ? "hover:-translate-y-0.5 hover:border-cyan-200/70" : "cursor-default"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/55">{part.shortLabel}</p>
            <p className={`mt-1 text-sm font-black uppercase leading-4 ${tone.label}`}>{JAEGER_STATUS_LABELS[status.status]}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 font-mono text-[10px] text-white">{status.integrity}%</span>
        </div>
        {status.note ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-300">{status.note}</p> : null}
        {status.equipment_note ? <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-cyan-100/75">{status.equipment_note}</p> : null}
      </button>
    );
  }

  return (
    <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/80 p-5 shadow-[0_0_55px_rgba(6,182,212,0.12)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-300">Diagnóstico estrutural</p>
          <h2 className="mt-2 text-2xl font-black uppercase text-white">{jaegerName}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Blueprint técnico com áreas monitoradas. Quando você trouxer a arte final de cada Jaeger, ela pode entrar aqui como base do mesmo painel.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200">Integridade</p>
            <p className="mt-1 text-2xl font-black text-white">{integrity}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Status</p>
            <p className="mt-1 text-sm font-black uppercase text-white">{readiness}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[12.5rem_minmax(22rem,1fr)_12.5rem]">
        <div className="order-2 grid content-center gap-3 xl:order-1">{leftColumnParts.map(partCard)}</div>

        <div className="order-1 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),rgba(2,6,23,0.88)_54%,rgba(0,0,0,0.96))] p-4 xl:order-2">
          {selectedPart && selectedStatus ? (
            <div className={`mb-3 rounded-2xl border px-4 py-3 ${jaegerStatusTone(selectedStatus.status).border}`}>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/55">Parte selecionada</p>
              <p className="mt-1 text-sm font-black uppercase text-white">
                {selectedPart.label} · {JAEGER_STATUS_LABELS[selectedStatus.status]} · {selectedStatus.integrity}%
              </p>
            </div>
          ) : (
            <div className="mb-3 rounded-2xl border border-cyan-300/15 bg-black/25 px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-cyan-200/80">Clique no blueprint</p>
              <p className="mt-1 text-sm text-slate-300">Selecione cabeça, peitoral, torso, braços ou pernas para ver o status.</p>
            </div>
          )}
          <div className="relative mx-auto aspect-[9/13] max-h-[46rem] max-w-[33rem] overflow-hidden rounded-[1.6rem] border border-cyan-100/10 bg-black/30">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.055)_1px,transparent_1px)] bg-[size:28px_28px]" />
            {blueprint ? (
              <>
                <img src={blueprint} alt={`Blueprint técnico de ${jaegerName}`} className="absolute inset-0 h-full w-full object-contain opacity-85 mix-blend-screen" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.08)_55%,rgba(2,6,23,0.72)_100%)]" />
              </>
            ) : null}

            {JAEGER_PARTS.map((part) => {
              const status = getPartStatus(mergedStatuses, part.id);
              const tone = jaegerStatusTone(status.status);
              const selected = selectedPartId === part.id;

              return (
                <button
                  key={part.id}
                  type="button"
                  disabled={!interactive}
                  onClick={() => onSelectPart?.(part.id)}
                  style={{ clipPath: part.clipPath }}
                  className={`absolute z-20 border ${part.positionClass} ${
                    selected ? tone.part : "border-transparent bg-transparent shadow-none"
                  } ${
                    status.status === "detached" ? part.detachedClass : ""
                  } ${selected ? "opacity-90 ring-2 ring-white ring-offset-2 ring-offset-slate-950" : "opacity-100"} transition duration-300 ${
                    interactive ? "cursor-pointer hover:scale-[1.025] hover:border-cyan-100/40 hover:bg-cyan-300/10" : "cursor-default"
                  }`}
                  title={`${part.label}: ${JAEGER_STATUS_LABELS[status.status]} (${status.integrity}%)`}
                >
                  <span className="sr-only">{part.label}</span>
                  <span
                    className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border shadow-[0_0_18px_rgba(255,255,255,0.45)] ${
                      selected ? "border-white bg-white" : "border-cyan-100/50 bg-cyan-100/55"
                    }`}
                  />
                </button>
              );
            })}

            <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border border-cyan-200/15 bg-black/55 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/80">
              Mapa estrutural ativo
            </div>
          </div>
        </div>

        <div className="order-3 grid content-center gap-3">{rightColumnParts.map(partCard)}</div>
      </div>
    </section>
  );
}
