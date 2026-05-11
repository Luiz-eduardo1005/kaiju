"use client";

import { useEffect, useMemo, useState } from "react";
import { MARK_V_NOT_IMPORTED_MESSAGE, type JaegerCombatIndexEntry } from "@/content/jaeger-combat/manifests/jaegerCombatIndex";
import { useAuth } from "@/context/auth-context";
import { useMode } from "@/context/mode-context";
import {
  filterBlocksForPilot,
  JAEGER_COMBAT_CATEGORIES,
  MASTER_ONLY_COMBAT_CATEGORIES,
  type JaegerCombatBlock,
  type JaegerCombatCategory,
} from "@/lib/jaeger-combat/parser";
import { supabase } from "@/lib/supabase";
import type { JaegerPilotAssignment } from "@/types/game";
import { JaegerDiagnosticLoader } from "./JaegerDiagnosticLoader";

type JaegerCombatSheetProps = {
  entry: JaegerCombatIndexEntry;
  jaegerName: string;
  jaegerFunction: string;
  jaegerContent: string;
  blocks: JaegerCombatBlock[];
};

const tabLabels = [
  "Texto integral",
  "Cards",
  "Ficha rápida",
  "Ataques",
  "Manobras",
  "Dano / Avarias",
  "Fluxo / Sincronia",
  "Sistemas Especiais",
  "Somente Mestre",
  "Diagnóstico Atual",
  "Pilotos Vinculados",
] as const;

type CombatTab = (typeof tabLabels)[number];

const tabCategories: Partial<Record<CombatTab, JaegerCombatCategory[]>> = {
  "Ficha rápida": ["FICHA RÁPIDA"],
  Ataques: ["ATAQUE"],
  Manobras: ["MANOBRA"],
  "Dano / Avarias": ["DANO / AVARIA", "DEFESA", "CALOR", "ESTRESSE", "CONDIÇÃO SOFRIDA", "CONDIÇÃO APLICADA"],
  "Fluxo / Sincronia": ["FLUXO / SINCRONIA"],
  "Sistemas Especiais": ["SISTEMA ESPECIAL"],
  "Somente Mestre": ["SOMENTE MESTRE", "SEGREDO / CLASSIFICADO", "BALANCEAMENTO", "DEV / ORGANIZAÇÃO"],
};

function TextPanel({ text }: { text: string }) {
  return <pre className="whitespace-pre-wrap rounded-3xl border border-white/10 bg-black/45 p-5 text-sm leading-7 text-slate-100">{text}</pre>;
}

function CombatCards({ blocks }: { blocks: JaegerCombatBlock[] }) {
  if (!blocks.length) {
    return <p className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-slate-300">Nenhum bloco encontrado para esta aba.</p>;
  }

  return (
    <div className="grid gap-4">
      {blocks.map((block) => (
        <article key={block.id} className="rounded-3xl border border-cyan-300/15 bg-slate-950/80 p-5 shadow-[0_0_30px_rgba(34,211,238,0.06)]">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.2em] ${
                MASTER_ONLY_COMBAT_CATEGORIES.has(block.category)
                  ? "border-red-300/35 bg-red-500/10 text-red-100"
                  : "border-cyan-300/25 bg-cyan-500/10 text-cyan-100"
              }`}
            >
              {block.category}
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{block.heading}</span>
          </div>
          <div className="mt-4">
            <TextPanel text={block.rawText} />
          </div>
        </article>
      ))}
    </div>
  );
}

function isPilotLinked(userId: string | undefined, assignment: JaegerPilotAssignment | null) {
  if (!userId || !assignment) return false;
  return assignment.pilot_left_id === userId || assignment.pilot_right_id === userId;
}

export function JaegerCombatSheet({ entry, jaegerName, jaegerFunction, jaegerContent, blocks }: JaegerCombatSheetProps) {
  const { user } = useAuth();
  const { isMaster } = useMode();
  const [activeTab, setActiveTab] = useState<CombatTab>("Texto integral");
  const [assignment, setAssignment] = useState<JaegerPilotAssignment | null>(null);
  const [assignmentMessage, setAssignmentMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    supabase
      .from("jaeger_pilot_assignments")
      .select("*")
      .eq("jaeger_id", entry.jaegerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          setAssignmentMessage("Vínculos ainda não carregados. Rode o SQL jaeger-pilot-assignments no Supabase.");
          return;
        }
        setAssignment((data as JaegerPilotAssignment | null) ?? null);
      });

    return () => {
      mounted = false;
    };
  }, [entry.jaegerId]);

  const linkedPilot = isPilotLinked(user?.id, assignment);
  const canSeeMechanics = isMaster || (linkedPilot && assignment?.visible_to_pilots);
  const visibleBlocks = useMemo(() => (isMaster ? blocks : filterBlocksForPilot(blocks)), [blocks, isMaster]);
  const visibleText = useMemo(() => visibleBlocks.map((block) => block.rawText).join("\n\n").trim(), [visibleBlocks]);

  const currentBlocks = useMemo(() => {
    if (activeTab === "Cards") return visibleBlocks;
    const categories = tabCategories[activeTab];
    if (!categories) return visibleBlocks;
    return visibleBlocks.filter((block) => categories.includes(block.category));
  }, [activeTab, visibleBlocks]);

  if (!entry.hasCombatSheet) {
    return (
      <section className="mt-8 rounded-[2rem] border border-amber-300/25 bg-amber-500/10 p-6 text-amber-50">
        {MARK_V_NOT_IMPORTED_MESSAGE}
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-slate-950/80 p-5 shadow-[0_0_45px_rgba(34,211,238,0.08)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300">Camada mecânica vinculada</p>
          <h2 className="mt-2 text-3xl font-black uppercase text-white">Ficha de Combate</h2>
          <p className="mt-2 text-sm text-slate-300">
            {jaegerName} • {entry.mark.toUpperCase()} • {jaegerFunction}
          </p>
        </div>
        <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-200">
          {entry.sourceFile}
        </p>
      </div>

      {!canSeeMechanics ? (
        <div className="mt-5 rounded-3xl border border-red-300/25 bg-red-950/20 p-6 text-center">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.32em] text-red-300">Acesso operacional</p>
          <h3 className="mt-3 text-2xl font-black text-white">Ficha operacional restrita.</h3>
          {assignmentMessage ? <p className="mt-3 text-sm text-red-100/80">{assignmentMessage}</p> : null}
        </div>
      ) : (
        <>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {tabLabels
              .filter((tab) => isMaster || tab !== "Somente Mestre")
              .map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                    activeTab === tab
                      ? "border-cyan-200 bg-cyan-400/15 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.18)]"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
          </div>

          <div className="mt-5">
            {activeTab === "Texto integral" ? <TextPanel text={isMaster ? jaegerContent : visibleText} /> : null}
            {activeTab === "Diagnóstico Atual" ? <JaegerDiagnosticLoader jaegerId={entry.jaegerId} jaegerName={jaegerName} /> : null}
            {activeTab === "Pilotos Vinculados" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Piloto esquerdo</p>
                  <p className="mt-2 text-lg font-black text-white">{assignment?.pilot_left_label || assignment?.pilot_left_id || "Não vinculado"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Piloto direito</p>
                  <p className="mt-2 text-lg font-black text-white">{assignment?.pilot_right_label || assignment?.pilot_right_id || "Não vinculado"}</p>
                </div>
              </div>
            ) : null}
            {activeTab !== "Texto integral" && activeTab !== "Diagnóstico Atual" && activeTab !== "Pilotos Vinculados" ? <CombatCards blocks={currentBlocks} /> : null}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {JAEGER_COMBAT_CATEGORIES.slice(0, -1).map((category) => (
              <span key={category} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                {category}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
