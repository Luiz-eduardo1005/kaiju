"use client";

import { useEffect, useMemo, useState } from "react";
import { LoginRequired } from "@/components/game/login-required";
import { JaegerDiagnosticLoader } from "@/components/jaegers/JaegerDiagnosticLoader";
import { MARK_V_NOT_IMPORTED_MESSAGE, type JaegerCombatIndexEntry, type JaegerCombatMark } from "@/content/jaeger-combat/manifests/jaegerCombatIndex";
import { useAuth } from "@/context/auth-context";
import { useMode } from "@/context/mode-context";
import { bootstrapPlayer, getProfile } from "@/lib/game/profile";
import { calculateJaegerIntegrity, JAEGER_STATUS_LABELS, mergeJaegerStatuses, summarizeJaegerReadiness } from "@/lib/game/jaegerDiagnostics";
import {
  filterBlocksForPilot,
  MASTER_ONLY_COMBAT_CATEGORIES,
  type JaegerCombatBlock,
  type JaegerCombatCategory,
} from "@/lib/jaeger-combat/parser";
import { supabase } from "@/lib/supabase";
import type { JaegerPartStatus, JaegerPilotAssignment, Profile } from "@/types/game";

export type MasterJaegerCombatBundle = {
  entry: JaegerCombatIndexEntry;
  jaegerName: string;
  jaegerFunction: string;
  jaegerContent: string;
  blocks: JaegerCombatBlock[];
};

type MasterJaegerCombatCenterProps = {
  bundles: MasterJaegerCombatBundle[];
};

const tabs = [
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

type CombatTab = (typeof tabs)[number];

const tabCategories: Partial<Record<CombatTab, JaegerCombatCategory[]>> = {
  "Ficha rápida": ["FICHA RÁPIDA"],
  Ataques: ["ATAQUE"],
  Manobras: ["MANOBRA"],
  "Dano / Avarias": ["DANO / AVARIA", "DEFESA", "CALOR", "ESTRESSE", "CONDIÇÃO APLICADA", "CONDIÇÃO SOFRIDA"],
  "Fluxo / Sincronia": ["FLUXO / SINCRONIA"],
  "Sistemas Especiais": ["SISTEMA ESPECIAL"],
  "Somente Mestre": ["SOMENTE MESTRE", "SEGREDO / CLASSIFICADO", "BALANCEAMENTO", "DEV / ORGANIZAÇÃO"],
};

const tabSlugs: Record<string, CombatTab> = {
  "texto-integral": "Texto integral",
  cards: "Cards",
  "ficha-rapida": "Ficha rápida",
  ataques: "Ataques",
  manobras: "Manobras",
  "dano-avarias": "Dano / Avarias",
  "fluxo-sincronia": "Fluxo / Sincronia",
  sistemas: "Sistemas Especiais",
  mestre: "Somente Mestre",
  diagnostico: "Diagnóstico Atual",
  pilotos: "Pilotos Vinculados",
};

const assignmentStatuses = ["active", "training", "temporary", "historical", "revoked", "dead_pair", "classified"] as const;
const markFilters: Array<"all" | JaegerCombatMark> = ["all", "mark-1", "mark-2", "mark-3", "mark-4", "mark-5", "mark-6"];

function displayProfileName(profile?: Profile | null) {
  if (!profile) return "Não vinculado";
  return profile.display_name || profile.username;
}

function TextPanel({ text }: { text: string }) {
  return <pre className="whitespace-pre-wrap rounded-3xl border border-white/10 bg-black/50 p-5 text-sm leading-7 text-slate-100">{text}</pre>;
}

function CardsPanel({ blocks }: { blocks: JaegerCombatBlock[] }) {
  if (!blocks.length) return <p className="rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-slate-300">Nenhum bloco encontrado para esta categoria.</p>;

  return (
    <div className="grid gap-4">
      {blocks.map((block) => (
        <article key={block.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
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
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{block.heading}</span>
          </div>
          <div className="mt-4">
            <TextPanel text={block.rawText} />
          </div>
        </article>
      ))}
    </div>
  );
}

function PilotPreview({ bundle }: { bundle: MasterJaegerCombatBundle }) {
  if (!bundle.entry.hasCombatSheet) {
    return <p className="rounded-2xl border border-amber-300/25 bg-amber-500/10 p-4 text-amber-50">{MARK_V_NOT_IMPORTED_MESSAGE}</p>;
  }

  const visibleBlocks = filterBlocksForPilot(bundle.blocks);
  return (
    <div className="rounded-3xl border border-cyan-300/20 bg-cyan-950/10 p-4">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">Prévia do player vinculado</p>
      <p className="mt-2 text-sm text-slate-300">Blocos restritos ficam ocultos. O player não vinculado vê apenas: “Ficha operacional restrita.”</p>
      <div className="mt-4 max-h-[420px] overflow-y-auto pr-2">
        <CardsPanel blocks={visibleBlocks} />
      </div>
    </div>
  );
}

export function MasterJaegerCombatCenter({ bundles }: MasterJaegerCombatCenterProps) {
  const { user } = useAuth();
  const { isMaster } = useMode();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [markFilter, setMarkFilter] = useState<"all" | JaegerCombatMark>("all");
  const [selectedId, setSelectedId] = useState(bundles[0]?.entry.jaegerId ?? "");
  const [activeTab, setActiveTab] = useState<CombatTab>("Texto integral");
  const [assignment, setAssignment] = useState<JaegerPilotAssignment | null>(null);
  const [statuses, setStatuses] = useState<JaegerPartStatus[]>([]);
  const [message, setMessage] = useState("");
  const [pilotLeftId, setPilotLeftId] = useState("");
  const [pilotRightId, setPilotRightId] = useState("");
  const [pilotLeftLabel, setPilotLeftLabel] = useState("");
  const [pilotRightLabel, setPilotRightLabel] = useState("");
  const [visibleToPilots, setVisibleToPilots] = useState(true);
  const [assignmentStatus, setAssignmentStatus] = useState<(typeof assignmentStatuses)[number]>("active");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const jaegerParam = params.get("jaeger");
      const tabParam = params.get("tab");
      if (jaegerParam && bundles.some((bundle) => bundle.entry.jaegerId === jaegerParam)) {
        setSelectedId(jaegerParam);
      }
      if (tabParam && tabSlugs[tabParam]) {
        setActiveTab(tabSlugs[tabParam]);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [bundles]);

  const selectedBundle = bundles.find((bundle) => bundle.entry.jaegerId === selectedId) ?? bundles[0];

  const filteredBundles = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return bundles.filter((bundle) => {
      const matchesMark = markFilter === "all" || bundle.entry.mark === markFilter;
      const matchesSearch = !needle || bundle.jaegerName.toLowerCase().includes(needle) || bundle.entry.jaegerId.includes(needle);
      return matchesMark && matchesSearch;
    });
  }, [bundles, markFilter, search]);

  const selectedBlocks = useMemo(() => {
    if (!selectedBundle) return [];
    if (activeTab === "Cards") return selectedBundle.blocks;
    const categories = tabCategories[activeTab];
    if (!categories) return selectedBundle.blocks;
    return selectedBundle.blocks.filter((block) => categories.includes(block.category));
  }, [activeTab, selectedBundle]);

  const mergedStatuses = useMemo(() => (selectedBundle ? mergeJaegerStatuses(selectedBundle.entry.jaegerId, statuses) : []), [selectedBundle, statuses]);
  const damagedParts = mergedStatuses.filter((part) => part.status !== "operational" || part.integrity < 100);

  useEffect(() => {
    if (!user) return;
    bootstrapPlayer(user)
      .then(async () => {
        const current = await getProfile(user.id);
        setProfile(current);
        if (current.role === "master") {
          const profilesResult = await supabase.from("profiles").select("*").order("username");
          setProfiles((profilesResult.data as Profile[]) ?? []);
        }
      })
      .catch((error) => setMessage(error.message));
  }, [user]);

  useEffect(() => {
    if (!selectedBundle) return;

    supabase
      .from("jaeger_pilot_assignments")
      .select("*")
      .eq("jaeger_id", selectedBundle.entry.jaegerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setMessage("Vínculos ainda não disponíveis. Rode o SQL jaeger-pilot-assignments no Supabase.");
          setAssignment(null);
          return;
        }
        const nextAssignment = (data as JaegerPilotAssignment | null) ?? null;
        setAssignment(nextAssignment);
        setPilotLeftId(nextAssignment?.pilot_left_id ?? "");
        setPilotRightId(nextAssignment?.pilot_right_id ?? "");
        setPilotLeftLabel(nextAssignment?.pilot_left_label ?? "");
        setPilotRightLabel(nextAssignment?.pilot_right_label ?? "");
        setVisibleToPilots(nextAssignment?.visible_to_pilots ?? true);
        setAssignmentStatus(nextAssignment?.assignment_status ?? "active");
        setNotes(nextAssignment?.notes ?? "");
      });

    supabase
      .from("jaeger_part_statuses")
      .select("*")
      .eq("jaeger_id", selectedBundle.entry.jaegerId)
      .then(({ data }) => setStatuses((data as JaegerPartStatus[]) ?? []));
  }, [selectedBundle]);

  async function saveAssignment() {
    if (!user || !selectedBundle) return;
    const leftProfile = profiles.find((item) => item.id === pilotLeftId);
    const rightProfile = profiles.find((item) => item.id === pilotRightId);
    const payload = {
      jaeger_id: selectedBundle.entry.jaegerId,
      pilot_left_id: pilotLeftId || null,
      pilot_right_id: pilotRightId || null,
      pilot_left_label: pilotLeftLabel || displayProfileName(leftProfile),
      pilot_right_label: pilotRightLabel || displayProfileName(rightProfile),
      visible_to_pilots: visibleToPilots,
      assignment_status: assignmentStatus,
      notes: notes || null,
      assigned_by: user.id,
    };

    const result = assignment?.id
      ? await supabase.from("jaeger_pilot_assignments").update(payload).eq("id", assignment.id).select("*").single()
      : await supabase.from("jaeger_pilot_assignments").insert(payload).select("*").single();

    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    setAssignment(result.data as JaegerPilotAssignment);
    setMessage("Vínculo de pilotos salvo.");
  }

  if (!isMaster) {
    return (
      <LoginRequired>
        <div className="rounded-3xl border border-cyan-300/25 bg-cyan-950/10 p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">Modo Player ativo</p>
          <h2 className="mt-3 text-3xl font-black text-white">Ative o Modo Mestre para abrir as fichas de combate.</h2>
        </div>
      </LoginRequired>
    );
  }

  if (!profile) return <p className="text-slate-300">Carregando central de fichas...</p>;
  if (profile.role !== "master") {
    return (
      <div className="rounded-3xl border border-red-400/30 bg-red-950/20 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-300">Acesso negado</p>
        <h2 className="mt-3 text-3xl font-black text-white">Esta central exige role master.</h2>
      </div>
    );
  }

  if (!selectedBundle) return null;

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="h-fit rounded-[2rem] border border-red-400/25 bg-[#100307]/90 p-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.35em] text-red-300">Hangar mecânico</p>
          <h2 className="mt-2 text-2xl font-black uppercase text-white">Fichas importadas</h2>
          <p className="mt-2 text-sm text-slate-300">Busque por Jaeger, filtre por Mark e abra a ficha integral sem resumo.</p>
        </div>
        <div className="mt-4 grid gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar Jaeger..."
            className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-white outline-none focus:border-red-200/60"
          />
          <select
            value={markFilter}
            onChange={(event) => setMarkFilter(event.target.value as "all" | JaegerCombatMark)}
            className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-white outline-none focus:border-red-200/60"
          >
            {markFilters.map((mark) => (
              <option key={mark} value={mark}>
                {mark === "all" ? "Todos os Marks" : mark.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 max-h-[68vh] space-y-2 overflow-y-auto pr-1">
          {filteredBundles.map((bundle) => (
            <button
              key={bundle.entry.jaegerId}
              type="button"
              onClick={() => {
                setSelectedId(bundle.entry.jaegerId);
                setActiveTab("Texto integral");
              }}
              className={`w-full rounded-2xl border p-3 text-left transition ${
                selectedBundle.entry.jaegerId === bundle.entry.jaegerId
                  ? "border-red-200/60 bg-red-500/15 text-white"
                  : "border-white/10 bg-black/30 text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="block text-sm font-black uppercase">{bundle.jaegerName}</span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {bundle.entry.mark.toUpperCase()} • {bundle.entry.hasCombatSheet ? "ficha importada" : "pendente"}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0 rounded-[2rem] border border-red-400/25 bg-slate-950/85 p-5">
        {message ? <p className="mb-4 rounded-xl border border-amber-300/25 bg-amber-500/10 p-3 text-sm text-amber-100">{message}</p> : null}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.35em] text-red-300">Fichas de Combate dos Jaegers</p>
            <h1 className="mt-2 text-4xl font-black uppercase text-white">{selectedBundle.jaegerName}</h1>
            <p className="mt-2 text-sm text-slate-300">
              {selectedBundle.entry.mark.toUpperCase()} • {selectedBundle.jaegerFunction} • {selectedBundle.entry.sourceFile ?? "sem arquivo importado"}
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-4 py-3 text-cyan-50">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Diagnóstico rápido</p>
            <p className="mt-1 text-lg font-black">{calculateJaegerIntegrity(mergedStatuses)}% • {summarizeJaegerReadiness(mergedStatuses)}</p>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                activeTab === tab ? "border-red-200 bg-red-500/15 text-red-50" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {!selectedBundle.entry.hasCombatSheet ? (
            <p className="rounded-3xl border border-amber-300/25 bg-amber-500/10 p-6 text-amber-50">{MARK_V_NOT_IMPORTED_MESSAGE}</p>
          ) : activeTab === "Texto integral" ? (
            <TextPanel text={selectedBundle.jaegerContent} />
          ) : activeTab === "Diagnóstico Atual" ? (
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Integridade atual</p>
                  <p className="mt-1 text-2xl font-black text-white">{calculateJaegerIntegrity(mergedStatuses)}%</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Disponibilidade</p>
                  <p className="mt-1 text-2xl font-black text-white">{summarizeJaegerReadiness(mergedStatuses)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Partes afetadas</p>
                  <p className="mt-1 text-2xl font-black text-white">{damagedParts.length}</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {damagedParts.length ? (
                  damagedParts.map((part) => (
                    <div key={part.part_id} className="rounded-2xl border border-red-300/20 bg-red-950/20 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">{part.part_id}</p>
                      <p className="mt-2 text-sm text-slate-100">
                        {JAEGER_STATUS_LABELS[part.status]} • {part.integrity}% • {part.note || "sem observação"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4 text-emerald-50">Sem avarias registradas na campanha.</p>
                )}
              </div>
              <JaegerDiagnosticLoader jaegerId={selectedBundle.entry.jaegerId} jaegerName={selectedBundle.jaegerName} />
            </div>
          ) : activeTab === "Pilotos Vinculados" ? (
            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-4 rounded-3xl border border-white/10 bg-black/35 p-5">
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-red-200">Piloto esquerdo</span>
                  <select value={pilotLeftId} onChange={(event) => setPilotLeftId(event.target.value)} className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white">
                    <option value="">Sem vínculo</option>
                    {profiles.filter((item) => item.role === "player").map((item) => (
                      <option key={item.id} value={item.id}>{displayProfileName(item)}</option>
                    ))}
                  </select>
                  <input value={pilotLeftLabel} onChange={(event) => setPilotLeftLabel(event.target.value)} placeholder="Rótulo manual do piloto esquerdo" className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white" />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-red-200">Piloto direito</span>
                  <select value={pilotRightId} onChange={(event) => setPilotRightId(event.target.value)} className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white">
                    <option value="">Sem vínculo</option>
                    {profiles.filter((item) => item.role === "player").map((item) => (
                      <option key={item.id} value={item.id}>{displayProfileName(item)}</option>
                    ))}
                  </select>
                  <input value={pilotRightLabel} onChange={(event) => setPilotRightLabel(event.target.value)} placeholder="Rótulo manual do piloto direito" className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white" />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm font-bold text-slate-200">
                  <input type="checkbox" checked={visibleToPilots} onChange={(event) => setVisibleToPilots(event.target.checked)} />
                  Liberar ficha filtrada para pilotos vinculados
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-red-200">Status do vínculo</span>
                  <select value={assignmentStatus} onChange={(event) => setAssignmentStatus(event.target.value as (typeof assignmentStatuses)[number])} className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white">
                    {assignmentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notas internas do vínculo" className="min-h-28 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white" />
                <button type="button" onClick={() => void saveAssignment()} className="rounded-2xl border border-red-200/40 bg-red-500/20 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-red-50">
                  Salvar vínculo
                </button>
              </div>
              <PilotPreview bundle={selectedBundle} />
            </div>
          ) : activeTab === "Cards" ? (
            <CardsPanel blocks={selectedBundle.blocks} />
          ) : (
            <CardsPanel blocks={selectedBlocks} />
          )}
        </div>
      </section>
    </div>
  );
}
