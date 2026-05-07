"use client";

import Link from "next/link";
import { masterLoreParts } from "@/data/master-lore";

function partCode(part: (typeof masterLoreParts)[number]) {
  if (part.partLabel) return part.partLabel;
  if (part.partMajor === 0) return `0.${part.partMinor}`;
  if (part.partMinor === 0) return String(part.partMajor);
  return `${part.partMajor}.${part.partMinor}`;
}

export function MasterLorePanel() {
  const firstPart = masterLoreParts[0];
  const lastPart = masterLoreParts.at(-1);
  const totalLines = lastPart?.lineEnd ?? 0;

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="relative overflow-hidden rounded-[2rem] border border-red-300/25 bg-[#09020a] p-6 shadow-[0_0_60px_rgba(239,68,68,0.12)]">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-red-300">Arquivo de mestragem</p>
          <h3 className="mt-3 text-4xl font-black uppercase leading-none text-white">História da Campanha</h3>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-300">
            Abra uma sala de leitura dedicada para narrar a lore completa. O painel aqui fica limpo; a leitura longa acontece em tela própria,
            com busca, filtros, navegação por partes e texto original preservado.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Partes</p>
              <p className="mt-2 text-3xl font-black text-white">{masterLoreParts.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Intervalo</p>
              <p className="mt-2 text-3xl font-black text-white">
                {firstPart ? partCode(firstPart) : "0"}-{lastPart ? partCode(lastPart) : "0"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Linhas</p>
              <p className="mt-2 text-3xl font-black text-white">{totalLines.toLocaleString("pt-BR")}</p>
            </div>
          </div>

          <Link
            href="/master/lore"
            className="mt-7 inline-flex w-full items-center justify-center rounded-2xl border border-red-200/50 bg-red-500/20 px-6 py-5 text-sm font-black uppercase tracking-[0.25em] text-red-50 shadow-[0_0_36px_rgba(239,68,68,0.22)] transition hover:bg-red-500/30 sm:w-auto"
          >
            Abrir sala de leitura
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-cyan-300/15 bg-cyan-950/10 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-200">Como usar na mesa</p>
        <div className="mt-4 space-y-3 text-sm font-semibold leading-7 text-slate-300">
          <p>
            Use esta entrada como um fichário de mestre: primeiro escolha a parte da campanha, depois abra a leitura em página própria para narrar sem
            ficar preso em um card pequeno.
          </p>
          <p>
            As categorias antigas, como armas enumeradas e arquivos secretos, ficam fora do caminho por enquanto. Quando você trouxer esses blocos
            futuros, eles podem voltar como novas portas do fichário.
          </p>
          <p className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-4 text-amber-50">
            Regra mantida: o texto da lore aparece sem resumo, sem reescrita e sem adaptação. A interface só organiza a leitura.
          </p>
        </div>
      </section>
    </div>
  );
}
