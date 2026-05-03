"use client";

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

function partCode(part: MasterLorePart) {
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

export function MasterLorePanel() {
  const [selectedId, setSelectedId] = useState(masterLoreParts.at(-1)?.id ?? masterLoreParts[0]?.id ?? "");
  const [accessFilter, setAccessFilter] = useState<MasterLoreAccessLayer | "all">("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredParts = masterLoreParts.filter((part) => (accessFilter === "all" || part.accessLayer === accessFilter) && matchesSearch(part, deferredQuery));
  const selectedPart = filteredParts.find((part) => part.id === selectedId) ?? filteredParts[0] ?? masterLoreParts.find((part) => part.id === selectedId) ?? masterLoreParts[0];
  const totalLines = masterLoreParts.at(-1)?.lineEnd ?? 0;
  const firstPart = masterLoreParts[0];
  const lastPart = masterLoreParts.at(-1);

  async function copySelectedPart() {
    if (!selectedPart) return;
    await navigator.clipboard.writeText(selectedPart.content);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-red-300/25 bg-black/35 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-200">Fonte integrada</p>
          <p className="mt-2 text-3xl font-black text-white">{masterLoreParts.length}</p>
          <p className="text-sm text-slate-300">partes no painel</p>
        </div>
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-950/10 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200">Intervalo</p>
          <p className="mt-2 text-3xl font-black text-white">
            {firstPart ? partCode(firstPart) : "0"} - {lastPart ? partCode(lastPart) : "0"}
          </p>
          <p className="text-sm text-slate-300">lore carregada</p>
        </div>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-950/10 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-200">Linhas fonte</p>
          <p className="mt-2 text-3xl font-black text-white">{totalLines.toLocaleString("pt-BR")}</p>
          <p className="text-sm text-slate-300">texto para mestrar</p>
        </div>
        <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-950/10 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-fuchsia-200">Política</p>
          <p className="mt-2 text-lg font-black uppercase text-white">Sem resumo</p>
          <p className="text-sm text-slate-300">o card lê o original</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-black/30 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_0.6fr]">
          <label className="grid gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-200">Buscar na lore inteira</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: Tressarak, Tacit Ronin, Hannibal Chau, Ressonância..."
              className="rounded-2xl border border-red-200/25 bg-slate-950/80 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-red-200 focus:shadow-[0_0_28px_rgba(248,113,113,0.18)]"
            />
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-200">Camada de acesso</span>
            <select
              value={accessFilter}
              onChange={(event) => setAccessFilter(event.target.value as MasterLoreAccessLayer | "all")}
              className="rounded-2xl border border-red-200/25 bg-slate-950/80 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-red-200"
            >
              {accessOrder.map((access) => (
                <option key={access} value={access}>
                  {access === "all" ? "Todas as camadas" : masterLoreAccessLabels[access]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-[2rem] border border-red-300/20 bg-[#080208]/90 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-red-300">Mesa de controle</p>
              <h3 className="mt-1 text-2xl font-black uppercase text-white">Partes</h3>
            </div>
            <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-200">
              {filteredParts.length} visíveis
            </p>
          </div>

          <div className="mt-4 max-h-[42rem] space-y-3 overflow-y-auto pr-1">
            {filteredParts.map((part) => {
              const selected = selectedPart?.id === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => setSelectedId(part.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected ? "border-red-200 bg-red-500/15 shadow-[0_0_32px_rgba(239,68,68,0.18)]" : "border-white/10 bg-white/[0.03] hover:border-red-300/35 hover:bg-red-500/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-cyan-100">
                      {partCode(part)}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${accessTone[part.accessLayer]}`}>
                      {masterLoreAccessLabels[part.accessLayer]}
                    </span>
                  </div>
                  <h4 className="mt-3 text-lg font-black uppercase leading-6 text-white">{part.title.replace(/^PARTE\s+/, "")}</h4>
                  <p className="mt-2 text-xs font-bold leading-5 text-slate-400">
                    Linhas {part.lineStart}-{part.lineEnd} | {part.subtitles.length} blocos internos
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        {selectedPart ? (
          <section className="overflow-hidden rounded-[2rem] border border-red-300/25 bg-[#09020a]/90 shadow-[0_0_60px_rgba(239,68,68,0.12)]">
            <div className="border-b border-white/10 bg-gradient-to-r from-red-950/45 via-slate-950 to-cyan-950/25 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-red-300">Dossiê de mestragem</p>
                  <h3 className="mt-2 text-3xl font-black uppercase leading-tight text-white">{selectedPart.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{selectedPart.masterUse}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void copySelectedPart()}
                  className="rounded-2xl border border-cyan-300/35 bg-cyan-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-50 transition hover:bg-cyan-500/20"
                >
                  Copiar parte
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Quem vê</p>
                  <p className="mt-1 text-sm font-black text-white">{selectedPart.audience}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Linhas</p>
                  <p className="mt-1 text-sm font-black text-white">
                    {selectedPart.lineStart} - {selectedPart.lineEnd}
                  </p>
                </div>
                <div className={`rounded-2xl border p-4 ${accessTone[selectedPart.accessLayer]}`}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] opacity-80">Camada</p>
                  <p className="mt-1 text-sm font-black">{masterLoreAccessLabels[selectedPart.accessLayer]}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedPart.detectedDates.slice(0, 12).map((date) => (
                  <span key={date} className="rounded-full border border-amber-300/25 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
                    {date}
                  </span>
                ))}
                {selectedPart.detectedDates.length > 12 ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">
                    +{selectedPart.detectedDates.length - 12} datas
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.52fr_1.48fr]">
              <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-200">Mapa interno</p>
                <div className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                  {selectedPart.subtitles.length ? (
                    selectedPart.subtitles.map((subtitle) => (
                      <div key={subtitle} className="rounded-xl border border-cyan-300/15 bg-cyan-950/10 p-3">
                        <p className="text-sm font-bold leading-5 text-cyan-50">{subtitle.replace(/\*\*/g, "")}</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">Sem subtítulos detectados nesta parte.</p>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-red-200">Texto original</p>
                    <h4 className="mt-1 text-xl font-black uppercase text-white">Leitura para sessão</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-400">Preservado sem resumo ou reescrita</p>
                </div>
                <pre className="max-h-[58rem] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#03050b] p-5 font-sans text-base font-semibold leading-8 text-slate-100 shadow-inner shadow-black/40">
                  {selectedPart.content}
                </pre>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center text-slate-300">Nenhuma parte encontrada com os filtros atuais.</section>
        )}
      </div>
    </div>
  );
}
