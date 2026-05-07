"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { masterLoreAccessLabels, masterLoreParts, type MasterLoreAccessLayer, type MasterLorePart } from "@/data/master-lore";

const accessOrder: Array<MasterLoreAccessLayer | "all"> = [
  "all",
  "mestre_alto_escalao",
  "misto_publico_com_classificado",
  "historia_principal_ppdc_com_bastidores",
  "players_celula_k_com_mestre",
  "mesa_jogavel_players",
  "mesa_jogavel_com_segredos_de_mestre",
];

const tabs = [
  { id: "integral", label: "Texto integral" },
  { id: "players", label: "Leitura players" },
  { id: "mestre", label: "Mestre completo" },
  { id: "segredos", label: "Segredos" },
  { id: "perguntas", label: "Perguntas" },
  { id: "consequencias", label: "Consequências" },
  { id: "entidades", label: "Entidades" },
  { id: "continuidade", label: "Continuidade" },
] as const;

type LoreTab = (typeof tabs)[number]["id"];

const accessTone: Record<MasterLoreAccessLayer, string> = {
  mestre_alto_escalao: "border-red-300/45 bg-red-500/15 text-red-100",
  misto_publico_com_classificado: "border-amber-300/45 bg-amber-500/10 text-amber-100",
  historia_principal_ppdc_com_bastidores: "border-cyan-300/35 bg-cyan-500/10 text-cyan-100",
  players_celula_k_com_mestre: "border-emerald-300/35 bg-emerald-500/10 text-emerald-100",
  mesa_jogavel_players: "border-sky-300/35 bg-sky-500/10 text-sky-100",
  mesa_jogavel_com_segredos_de_mestre: "border-fuchsia-300/35 bg-fuchsia-500/10 text-fuchsia-100",
  revisar_manual: "border-slate-300/30 bg-slate-500/10 text-slate-100",
};

const badgeTone: Record<string, string> = {
  "LER PARA PLAYERS": "border-sky-300/40 bg-sky-500/15 text-sky-50",
  "NARRÁVEL": "border-sky-300/40 bg-sky-500/15 text-sky-50",
  "PÚBLICO FILTRADO + MESTRE COMPLETO": "border-amber-300/40 bg-amber-500/15 text-amber-50",
  "SOMENTE MESTRE": "border-red-300/40 bg-red-500/15 text-red-50",
  "NÃO REVELAR AINDA": "border-fuchsia-300/45 bg-fuchsia-500/15 text-fuchsia-50",
  "REVELAR SE INVESTIGAREM": "border-emerald-300/40 bg-emerald-500/15 text-emerald-50",
  "PERGUNTA DE MESA": "border-cyan-300/40 bg-cyan-500/15 text-cyan-50",
  "CONSEQUÊNCIA CONDICIONAL": "border-yellow-300/40 bg-yellow-500/15 text-yellow-50",
  "COMBATE JOGÁVEL": "border-orange-300/45 bg-orange-500/15 text-orange-50",
  "CENÁRIO COMO ARSENAL": "border-lime-300/35 bg-lime-500/10 text-lime-50",
  "REVISÃO R": "border-orange-300/45 bg-orange-500/15 text-orange-50",
  FLUXO: "border-cyan-300/40 bg-cyan-500/15 text-cyan-50",
  ORFEU: "border-cyan-300/40 bg-cyan-500/15 text-cyan-50",
  CHAU: "border-amber-300/45 bg-amber-500/15 text-amber-50",
  "TERRA OCA": "border-fuchsia-300/45 bg-fuchsia-500/15 text-fuchsia-50",
  PRECURSORES: "border-fuchsia-300/45 bg-fuchsia-500/15 text-fuchsia-50",
  JAEGER: "border-blue-300/35 bg-blue-500/10 text-blue-50",
  KAIJU: "border-red-300/40 bg-red-500/15 text-red-50",
};

const FAVORITES_STORAGE_KEY = "kaiju-master-lore-favorites";
const PROGRESS_STORAGE_KEY = "kaiju-master-lore-progress";

function partCode(part: MasterLorePart) {
  if (part.partLabel) return part.partLabel;
  if (part.partMajor === 0) return `0.${part.partMinor}`;
  if (part.partMinor === 0) return String(part.partMajor);
  return `${part.partMajor}.${part.partMinor}`;
}

function matchesSearch(part: MasterLorePart, query: string) {
  if (!query.trim()) return true;
  const normalizedQuery = query.trim().toLowerCase();
  const searchable = [
    part.title,
    part.audience,
    part.masterUse,
    part.arc,
    part.status,
    ...part.visibilityBadges,
    ...part.sessionTags,
    ...part.subtitles,
    ...part.detectedDates,
    ...part.visibleNpcs,
    ...part.backstageNpcs,
    ...part.entities,
    ...part.technologies,
    ...part.kaijus,
    ...part.jaegers,
    part.content,
  ]
    .join("\n")
    .toLowerCase();
  return searchable.includes(normalizedQuery);
}

function getStoredStringArray(key: string) {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

function getInitialProgress() {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function paragraphsFrom(content: string) {
  return content
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function publicCandidateBlocks(part: MasterLorePart) {
  if (part.accessLayer === "mestre_alto_escalao") return [];
  return paragraphsFrom(part.content)
    .filter((block) => {
      const lower = block.toLowerCase();
      if (lower.includes("somente mestre") || lower.includes("segredo") || lower.includes("não revelar") || lower.includes("nÃ£o revelar")) return false;
      if (lower.includes("a verdade") && (lower.includes("precursores") || lower.includes("terra oca"))) return false;
      return block.length > 80;
    })
    .slice(0, 12);
}

function Badge({ label }: { label: string }) {
  return <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${badgeTone[label] ?? "border-white/10 bg-white/5 text-slate-200"}`}>{label}</span>;
}

function EmptyState({ children }: { children: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm font-semibold leading-6 text-slate-400">{children}</div>;
}

function TextBlock({ children, tone = "default" }: { children: string; tone?: "default" | "warning" | "question" | "success" }) {
  const toneClass =
    tone === "warning"
      ? "border-fuchsia-300/30 bg-fuchsia-500/10 text-fuchsia-50"
      : tone === "question"
        ? "border-cyan-300/30 bg-cyan-500/10 text-cyan-50"
        : tone === "success"
          ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-50"
          : "border-white/10 bg-white/[0.03] text-slate-100";
  return <pre className={`whitespace-pre-wrap rounded-2xl border p-4 font-sans text-sm font-semibold leading-7 ${toneClass}`}>{children}</pre>;
}

function ListPanel({ title, items, empty, tone = "default" }: { title: string; items: string[]; empty: string; tone?: "default" | "warning" | "question" | "success" }) {
  return (
    <section className="grid gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200">{title}</p>
      {items.length ? items.map((item, index) => <TextBlock key={`${title}-${index}`} tone={tone}>{item}</TextBlock>) : <EmptyState>{empty}</EmptyState>}
    </section>
  );
}

function EntityPills({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <span key={`${title}-${item}`} className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-50">{item}</span>) : <span className="text-sm font-semibold text-slate-500">Nada detectado automaticamente.</span>}
      </div>
    </section>
  );
}

export function MasterLoreArchive() {
  const [selectedId, setSelectedId] = useState(masterLoreParts.at(-1)?.id ?? masterLoreParts[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<LoreTab>("integral");
  const [accessFilter, setAccessFilter] = useState<MasterLoreAccessLayer | "all">("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getStoredStringArray(FAVORITES_STORAGE_KEY));
  const [progressByPart, setProgressByPart] = useState<Record<string, string>>(getInitialProgress);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const availableTags = Array.from(new Set(masterLoreParts.flatMap((part) => part.sessionTags))).sort();
  const filteredParts = masterLoreParts.filter((part) => {
    const matchesAccess = accessFilter === "all" || part.accessLayer === accessFilter;
    const matchesTag = tagFilter === "all" || part.sessionTags.includes(tagFilter) || part.visibilityBadges.includes(tagFilter);
    return matchesAccess && matchesTag && matchesSearch(part, deferredQuery);
  });
  const selectedPart = filteredParts.find((part) => part.id === selectedId) ?? filteredParts[0] ?? masterLoreParts.find((part) => part.id === selectedId) ?? masterLoreParts[0];
  const favoriteParts = favoriteIds
    .map((id) => (masterLoreParts as readonly MasterLorePart[]).find((part) => part.id === id))
    .filter((part): part is MasterLorePart => part !== undefined);
  const isSelectedFavorite = selectedPart ? favoriteIds.includes(selectedPart.id) : false;
  const selectedProgress = selectedPart ? (progressByPart[selectedPart.id] ?? "não iniciado") : "não iniciado";
  const candidateBlocks = selectedPart ? publicCandidateBlocks(selectedPart) : [];

  function updateFavorites(nextFavorites: string[]) {
    setFavoriteIds(nextFavorites);
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
  }

  function updateProgress(partId: string, value: string) {
    const nextProgress = { ...progressByPart, [partId]: value };
    setProgressByPart(nextProgress);
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress));
  }

  function toggleSelectedFavorite() {
    if (!selectedPart) return;
    if (favoriteIds.includes(selectedPart.id)) {
      updateFavorites(favoriteIds.filter((id) => id !== selectedPart.id));
      return;
    }
    updateFavorites([selectedPart.id, ...favoriteIds].slice(0, 8));
  }

  async function copySelectedPart() {
    if (!selectedPart) return;
    const textByTab: Record<LoreTab, string> = {
      integral: selectedPart.content,
      players: candidateBlocks.join("\n\n---\n\n"),
      mestre: [...selectedPart.privateGuidance, ...selectedPart.spoilerWarnings].join("\n"),
      segredos: selectedPart.spoilerWarnings.join("\n"),
      perguntas: selectedPart.questions.join("\n\n"),
      consequencias: selectedPart.conditionalConsequences.join("\n"),
      entidades: selectedPart.entities.join("\n"),
      continuidade: selectedPart.continuityNotes.join("\n"),
    };
    await navigator.clipboard.writeText(textByTab[activeTab] || selectedPart.content);
  }

  return (
    <main className="min-h-screen bg-[#050006] text-white">
      <section className="sticky top-0 z-40 border-b border-red-300/20 bg-[#070108]/95 px-4 py-4 backdrop-blur-xl">
        <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <Link href="/master" className="font-mono text-[10px] font-black uppercase tracking-[0.35em] text-red-300 transition hover:text-red-100">
              Voltar ao painel mestre
            </Link>
            <h1 className="mt-2 text-3xl font-black uppercase leading-none text-white md:text-5xl">Sala de Leitura Segura</h1>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_15rem_15rem_auto] xl:min-w-[66rem]">
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-red-200">Buscar</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tressarak, Orfeu, Chau, pergunta..."
                className="rounded-2xl border border-red-200/25 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-red-200"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-red-200">Camada</span>
              <select value={accessFilter} onChange={(event) => setAccessFilter(event.target.value as MasterLoreAccessLayer | "all")} className="rounded-2xl border border-red-200/25 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-red-200">
                {accessOrder.map((access) => <option key={access} value={access}>{access === "all" ? "Todas" : masterLoreAccessLabels[access]}</option>)}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-red-200">Etiqueta</span>
              <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} className="rounded-2xl border border-red-200/25 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-red-200">
                <option value="all">Todas</option>
                {availableTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => void copySelectedPart()} className="self-end rounded-2xl border border-cyan-300/35 bg-cyan-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-50 transition hover:bg-cyan-500/20">
              Copiar aba
            </button>
          </div>
        </div>
      </section>

      <section className="grid w-full gap-4 px-2 py-4 sm:px-3 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-36 xl:h-[calc(100vh-10rem)]">
          <div className="rounded-[2rem] border border-red-300/20 bg-[#09020a]/95 p-4 shadow-[0_0_60px_rgba(239,68,68,0.1)]">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-red-300">Partes da história</p>
                <h2 className="mt-1 text-2xl font-black uppercase text-white">Índice tático</h2>
              </div>
              <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-200">{filteredParts.length}</p>
            </div>

            <div className="mt-4 flex max-h-80 gap-3 overflow-x-auto pb-2 xl:max-h-[calc(100vh-18rem)] xl:flex-col xl:overflow-y-auto xl:overflow-x-hidden xl:pr-1">
              {favoriteParts.length ? (
                <div className="min-w-72 rounded-2xl border border-amber-300/20 bg-amber-500/10 p-3 xl:min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-100">Fixados</p>
                  <div className="mt-3 space-y-2">
                    {favoriteParts.map((part) => (
                      <button key={`fav-${part.id}`} type="button" onClick={() => setSelectedId(part.id)} className="w-full rounded-xl border border-amber-300/20 bg-black/25 px-3 py-2 text-left text-xs font-black uppercase leading-4 text-amber-50 transition hover:bg-amber-500/10">
                        {partCode(part)} | {part.title.replace(/^PARTE\s+/, "")}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {filteredParts.map((part) => {
                const selected = selectedPart?.id === part.id;
                return (
                  <button key={part.id} type="button" onClick={() => setSelectedId(part.id)} className={`min-w-72 rounded-2xl border p-4 text-left transition xl:min-w-0 ${selected ? "border-red-200 bg-red-500/20 shadow-[0_0_28px_rgba(239,68,68,0.18)]" : "border-white/10 bg-white/[0.03] hover:border-red-300/35 hover:bg-red-500/10"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-cyan-100">{partCode(part)}</span>
                      <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${accessTone[part.accessLayer]}`}>{masterLoreAccessLabels[part.accessLayer]}</span>
                    </div>
                    <h3 className="mt-3 text-base font-black uppercase leading-5 text-white">{part.title.replace(/^PARTE\s+/, "")}</h3>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-400">{part.arc}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {part.sessionTags.slice(0, 4).map((tag) => <Badge key={`${part.id}-${tag}`} label={tag} />)}
                    </div>
                    <p className="mt-3 text-xs font-bold leading-5 text-slate-500">Linhas {part.lineStart}-{part.lineEnd}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {selectedPart ? (
          <article className="min-w-0 overflow-hidden rounded-[2.25rem] border border-red-300/25 bg-[#070a13] shadow-[0_0_80px_rgba(239,68,68,0.13)]">
            <header className="border-b border-white/10 bg-gradient-to-r from-red-950/45 via-slate-950 to-cyan-950/20 p-5 md:p-7">
              <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-red-300">Dossiê aberto</p>
                  <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-white md:text-5xl">{selectedPart.title}</h2>
                  <p className="mt-4 max-w-6xl text-sm font-bold leading-6 text-slate-300">{selectedPart.masterUse}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 2xl:min-w-[36rem]">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Arco</p>
                    <p className="mt-1 text-xs font-black text-white">{selectedPart.arc}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Status</p>
                    <p className="mt-1 text-xs font-black text-white">{selectedPart.status}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Quem vê</p>
                    <p className="mt-1 text-xs font-black text-white">{selectedPart.audience}</p>
                  </div>
                  <div className={`rounded-2xl border p-3 ${accessTone[selectedPart.accessLayer]}`}>
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-80">Camada</p>
                    <p className="mt-1 text-xs font-black">{masterLoreAccessLabels[selectedPart.accessLayer]}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={toggleSelectedFavorite} className="rounded-2xl border border-amber-300/35 bg-amber-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-amber-50 transition hover:bg-amber-500/20">
                  {isSelectedFavorite ? "Remover dos fixados" : "Fixar para sessão"}
                </button>
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Progresso</span>
                  <select value={selectedProgress} onChange={(event) => updateProgress(selectedPart.id, event.target.value)} className="bg-transparent text-xs font-black uppercase text-white outline-none">
                    {["não iniciado", "em leitura", "já narrado", "pergunta feita", "segredo revelado", "consequência aplicada", "parte concluída"].map((status) => <option key={status} value={status} className="bg-slate-950">{status}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selectedPart.visibilityBadges.map((badge) => <Badge key={`${selectedPart.id}-${badge}`} label={badge} />)}
              </div>
            </header>

            <div className="border-b border-white/10 bg-[#03050b] px-3 py-3 md:px-5 lg:px-7">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map((tabItem) => (
                  <button key={tabItem.id} type="button" onClick={() => setActiveTab(tabItem.id)} className={`shrink-0 rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${activeTab === tabItem.id ? "border-cyan-200 bg-cyan-500/20 text-cyan-50" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/30"}`}>
                    {tabItem.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#02040a] px-3 py-5 md:px-5 lg:px-7 2xl:px-9">
              {activeTab === "integral" ? (
                <div className="w-full rounded-[2rem] border border-white/10 bg-[#050813] px-5 py-7 shadow-inner shadow-black/50 md:px-9 md:py-10">
                  <pre className="whitespace-pre-wrap font-sans text-lg font-semibold leading-9 text-slate-100 md:text-[1.32rem] md:leading-[2.45rem]">{selectedPart.content}</pre>
                </div>
              ) : null}

              {activeTab === "players" ? (
                <div className="grid gap-5">
                  <ListPanel title="Orientação de leitura para players" items={selectedPart.publicGuidance} empty="Nenhuma orientação pública foi detectada." tone="success" />
                  <section className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-100">Trechos candidatos automáticos</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-amber-50">Estes blocos são texto original, mas a seleção é automática. Revise antes de ler em voz alta.</p>
                  </section>
                  {candidateBlocks.length ? candidateBlocks.map((block, index) => <TextBlock key={`public-${index}`} tone="success">{block}</TextBlock>) : <EmptyState>Esta parte foi marcada como segredo/alto escalão ou não possui trecho público automático seguro.</EmptyState>}
                </div>
              ) : null}

              {activeTab === "mestre" ? (
                <div className="grid gap-5">
                  <ListPanel title="Notas de mestre" items={selectedPart.privateGuidance} empty="Nenhuma nota de mestre detectada." />
                  <ListPanel title="Alertas de spoiler" items={selectedPart.spoilerWarnings} empty="Sem alerta forte de spoiler detectado." tone="warning" />
                </div>
              ) : null}

              {activeTab === "segredos" ? (
                <div className="grid gap-5">
                  <section className="rounded-2xl border border-fuchsia-300/30 bg-fuchsia-500/10 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-fuchsia-100">Não revelar ainda</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-fuchsia-50">Quando houver dúvida, esconder dos players e marcar para revisão do mestre.</p>
                  </section>
                  <ListPanel title="Spoilers e mistérios" items={selectedPart.spoilerWarnings} empty="Nenhum spoiler automático encontrado, mas revise o texto integral antes da sessão." tone="warning" />
                  <EntityPills title="Tecnologias e mistérios sensíveis" items={selectedPart.technologies} />
                </div>
              ) : null}

              {activeTab === "perguntas" ? <ListPanel title="Perguntas extraídas do texto original" items={selectedPart.questions} empty="Nenhuma pergunta de mesa detectada automaticamente." tone="question" /> : null}

              {activeTab === "consequencias" ? <ListPanel title="Consequências condicionais extraídas" items={selectedPart.conditionalConsequences} empty="Nenhuma consequência condicional detectada automaticamente." tone="warning" /> : null}

              {activeTab === "entidades" ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <EntityPills title="NPCs visíveis ou citados em cena" items={selectedPart.visibleNpcs} />
                  <EntityPills title="NPCs de bastidor" items={selectedPart.backstageNpcs} />
                  <EntityPills title="Jaegers" items={selectedPart.jaegers} />
                  <EntityPills title="Kaijus" items={selectedPart.kaijus} />
                  <EntityPills title="Tecnologias / mistérios" items={selectedPart.technologies} />
                  <EntityPills title="Cenário como arsenal" items={selectedPart.sceneAssets} />
                </div>
              ) : null}

              {activeTab === "continuidade" ? (
                <div className="grid gap-5">
                  <ListPanel title="Continuidade canônica" items={selectedPart.continuityNotes} empty="Nenhuma nota canônica automática detectada." />
                  <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200">Identificação da parte</p>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {[
                        ["Parte", partCode(selectedPart)],
                        ["Linhas", `${selectedPart.lineStart}-${selectedPart.lineEnd}`],
                        ["Fonte", selectedPart.sourceFile],
                        ["Datas", selectedPart.detectedDates.join(", ") || "Não detectada"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
                          <p className="mt-1 text-sm font-black text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : null}
            </div>
          </article>
        ) : (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center text-slate-300">Nenhuma parte encontrada com os filtros atuais.</section>
        )}
      </section>
    </main>
  );
}
