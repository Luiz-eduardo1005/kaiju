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

const accessTone: Record<MasterLoreAccessLayer, string> = {
  mestre_alto_escalao: "border-red-300/45 bg-red-500/15 text-red-100",
  misto_publico_com_classificado: "border-amber-300/45 bg-amber-500/10 text-amber-100",
  historia_principal_ppdc_com_bastidores: "border-cyan-300/35 bg-cyan-500/10 text-cyan-100",
  players_celula_k_com_mestre: "border-emerald-300/35 bg-emerald-500/10 text-emerald-100",
  mesa_jogavel_players: "border-sky-300/35 bg-sky-500/10 text-sky-100",
  mesa_jogavel_com_segredos_de_mestre: "border-fuchsia-300/35 bg-fuchsia-500/10 text-fuchsia-100",
  revisar_manual: "border-slate-300/30 bg-slate-500/10 text-slate-100",
};

const FAVORITES_STORAGE_KEY = "kaiju-master-lore-favorites";

function partCode(part: MasterLorePart) {
  if (part.partLabel) return part.partLabel;
  if (part.partMajor === 0) return `0.${part.partMinor}`;
  if (part.partMinor === 0) return String(part.partMajor);
  return `${part.partMajor}.${part.partMinor}`;
}

function matchesSearch(part: MasterLorePart, query: string) {
  if (!query.trim()) return true;
  const normalizedQuery = query.trim().toLowerCase();
  const searchable = [part.title, part.audience, part.masterUse, ...part.subtitles, ...part.detectedDates, part.content].join("\n").toLowerCase();
  return searchable.includes(normalizedQuery);
}

function getInitialFavoriteIds() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function MasterLoreArchive() {
  const [selectedId, setSelectedId] = useState(masterLoreParts.at(-1)?.id ?? masterLoreParts[0]?.id ?? "");
  const [accessFilter, setAccessFilter] = useState<MasterLoreAccessLayer | "all">("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getInitialFavoriteIds);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredParts = masterLoreParts.filter((part) => (accessFilter === "all" || part.accessLayer === accessFilter) && matchesSearch(part, deferredQuery));
  const selectedPart = filteredParts.find((part) => part.id === selectedId) ?? filteredParts[0] ?? masterLoreParts.find((part) => part.id === selectedId) ?? masterLoreParts[0];
  const favoriteParts = favoriteIds
    .map((id) => (masterLoreParts as readonly MasterLorePart[]).find((part) => part.id === id))
    .filter((part): part is MasterLorePart => part !== undefined);
  const isSelectedFavorite = selectedPart ? favoriteIds.includes(selectedPart.id) : false;

  function updateFavorites(nextFavorites: string[]) {
    setFavoriteIds(nextFavorites);
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
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
    await navigator.clipboard.writeText(selectedPart.content);
  }

  return (
    <main className="min-h-screen bg-[#050006] text-white">
      <section className="sticky top-0 z-40 border-b border-red-300/20 bg-[#070108]/95 px-4 py-4 backdrop-blur-xl">
        <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <Link href="/master" className="font-mono text-[10px] font-black uppercase tracking-[0.35em] text-red-300 transition hover:text-red-100">
              Voltar ao painel mestre
            </Link>
            <h1 className="mt-2 text-3xl font-black uppercase leading-none text-white md:text-5xl">Sala de Leitura da História</h1>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_18rem_auto] xl:min-w-[54rem]">
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-red-200">Buscar</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tressarak, Ronin, Chau, Drift..."
                className="rounded-2xl border border-red-200/25 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-red-200"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-red-200">Camada</span>
              <select
                value={accessFilter}
                onChange={(event) => setAccessFilter(event.target.value as MasterLoreAccessLayer | "all")}
                className="rounded-2xl border border-red-200/25 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-red-200"
              >
                {accessOrder.map((access) => (
                  <option key={access} value={access}>
                    {access === "all" ? "Todas" : masterLoreAccessLabels[access]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => void copySelectedPart()}
              className="self-end rounded-2xl border border-cyan-300/35 bg-cyan-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-50 transition hover:bg-cyan-500/20"
            >
              Copiar
            </button>
          </div>
        </div>
      </section>

      <section className="grid w-full gap-4 px-2 py-4 sm:px-3 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-36 xl:h-[calc(100vh-10rem)]">
          <div className="rounded-[2rem] border border-red-300/20 bg-[#09020a]/95 p-4 shadow-[0_0_60px_rgba(239,68,68,0.1)]">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-red-300">Partes da história</p>
                <h2 className="mt-1 text-2xl font-black uppercase text-white">Índice</h2>
              </div>
              <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-200">
                {filteredParts.length}
              </p>
            </div>

            <div className="mt-4 flex max-h-80 gap-3 overflow-x-auto pb-2 xl:max-h-[calc(100vh-18rem)] xl:flex-col xl:overflow-y-auto xl:overflow-x-hidden xl:pr-1">
              {favoriteParts.length ? (
                <div className="min-w-72 rounded-2xl border border-amber-300/20 bg-amber-500/10 p-3 xl:min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-100">Fixados</p>
                  <div className="mt-3 space-y-2">
                    {favoriteParts.map((part) => (
                      <button
                        key={`fav-${part.id}`}
                        type="button"
                        onClick={() => setSelectedId(part.id)}
                        className="w-full rounded-xl border border-amber-300/20 bg-black/25 px-3 py-2 text-left text-xs font-black uppercase leading-4 text-amber-50 transition hover:bg-amber-500/10"
                      >
                        {partCode(part)} | {part.title.replace(/^PARTE\s+/, "")}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {filteredParts.map((part) => {
                const selected = selectedPart?.id === part.id;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setSelectedId(part.id)}
                    className={`min-w-72 rounded-2xl border p-4 text-left transition xl:min-w-0 ${
                      selected ? "border-red-200 bg-red-500/20 shadow-[0_0_28px_rgba(239,68,68,0.18)]" : "border-white/10 bg-white/[0.03] hover:border-red-300/35 hover:bg-red-500/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-cyan-100">
                        {partCode(part)}
                      </span>
                      <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${accessTone[part.accessLayer]}`}>
                        {masterLoreAccessLabels[part.accessLayer]}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-black uppercase leading-5 text-white">{part.title.replace(/^PARTE\s+/, "")}</h3>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-400">
                      Linhas {part.lineStart}-{part.lineEnd}
                    </p>
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
                <div className="grid gap-2 sm:grid-cols-3 2xl:min-w-[32rem]">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Quem vê</p>
                    <p className="mt-1 text-xs font-black text-white">{selectedPart.audience}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Linhas</p>
                    <p className="mt-1 text-xs font-black text-white">
                      {selectedPart.lineStart}-{selectedPart.lineEnd}
                    </p>
                  </div>
                  <div className={`rounded-2xl border p-3 ${accessTone[selectedPart.accessLayer]}`}>
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-80">Camada</p>
                    <p className="mt-1 text-xs font-black">{masterLoreAccessLabels[selectedPart.accessLayer]}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleSelectedFavorite}
                  className="rounded-2xl border border-amber-300/35 bg-amber-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-amber-50 transition hover:bg-amber-500/20"
                >
                  {isSelectedFavorite ? "Remover dos fixados" : "Fixar para sessão"}
                </button>
              </div>

              {selectedPart.subtitles.length ? (
                <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
                  {selectedPart.subtitles.map((subtitle) => (
                    <span key={subtitle} className="shrink-0 rounded-full border border-cyan-300/15 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-50">
                      {subtitle.replace(/\*\*/g, "")}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <div className="bg-[#02040a] px-3 py-5 md:px-5 lg:px-7 2xl:px-9">
              <div className="mb-5 grid gap-3 lg:grid-cols-5">
                {[
                  ["Cena jogável", "Use o trecho como leitura/narração quando a mesa chegar neste ponto."],
                  ["NPCs citados", "Procure nomes no texto e traga apenas quem já pode aparecer para os players."],
                  ["Segredos", "Tudo que estiver marcado como mestre/alto escalão entra como descoberta futura."],
                  ["Pergunta de mesa", "Transforme a parte em decisão: o que os players fazem com essa informação?"],
                  ["Gancho futuro", "Marque mentalmente qualquer ameaça que ainda não precisa ser revelada."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-200">{title}</p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
              <div className="w-full rounded-[2rem] border border-white/10 bg-[#050813] px-5 py-7 shadow-inner shadow-black/50 md:px-9 md:py-10">
                <pre className="whitespace-pre-wrap font-sans text-lg font-semibold leading-9 text-slate-100 md:text-[1.32rem] md:leading-[2.45rem]">
                  {selectedPart.content}
                </pre>
              </div>
            </div>
          </article>
        ) : (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center text-slate-300">Nenhuma parte encontrada com os filtros atuais.</section>
        )}
      </section>
    </main>
  );
}
