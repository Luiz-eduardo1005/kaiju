import type { TagName } from "@/data";

const tagTone: Partial<Record<TagName, string>> = {
  Público: "border-cyan-300/40 bg-cyan-300/10 text-cyan-100",
  Confidencial: "border-blue-300/40 bg-blue-400/10 text-blue-100",
  Restrito: "border-amber-300/50 bg-amber-300/10 text-amber-100",
  "Nível Omega": "border-red-400/60 bg-red-500/15 text-red-100",
  Morto: "border-slate-400/40 bg-slate-400/10 text-slate-200",
  Ativo: "border-emerald-300/50 bg-emerald-400/10 text-emerald-100",
  Desaparecido: "border-violet-300/50 bg-violet-400/10 text-violet-100",
  Experimental: "border-fuchsia-300/50 bg-fuchsia-400/10 text-fuchsia-100",
  Lendário: "border-sky-200/60 bg-sky-300/10 text-sky-100",
  "Mark-1": "border-indigo-300/50 bg-indigo-400/10 text-indigo-100",
  Canadá: "border-red-200/50 bg-red-300/10 text-red-100",
  "Estados Unidos": "border-blue-200/50 bg-blue-300/10 text-blue-100",
  Japão: "border-rose-200/50 bg-rose-300/10 text-rose-100",
  Rússia: "border-stone-200/50 bg-stone-300/10 text-stone-100",
  Alasca: "border-cyan-100/50 bg-cyan-200/10 text-cyan-100",
  Contenção: "border-orange-200/50 bg-orange-300/10 text-orange-100",
  Artilharia: "border-amber-200/50 bg-amber-300/10 text-amber-100",
  Mobilidade: "border-emerald-200/50 bg-emerald-300/10 text-emerald-100",
  Fortaleza: "border-zinc-200/50 bg-zinc-300/10 text-zinc-100",
  "Linha de frente": "border-sky-200/50 bg-sky-300/10 text-sky-100",
  Ofensiva: "border-red-300/60 bg-red-400/10 text-red-100",
  Interceptação: "border-orange-300/60 bg-orange-400/10 text-orange-100",
  "Mark-2": "border-fuchsia-300/50 bg-fuchsia-400/10 text-fuchsia-100",
  Modular: "border-teal-200/50 bg-teal-300/10 text-teal-100",
  Treinamento: "border-violet-200/50 bg-violet-300/10 text-violet-100",
  Sustentável: "border-lime-200/50 bg-lime-300/10 text-lime-100",
  Energia: "border-yellow-200/60 bg-yellow-300/10 text-yellow-100",
  Caça: "border-emerald-300/60 bg-emerald-400/10 text-emerald-100",
  Precisão: "border-cyan-200/60 bg-cyan-300/10 text-cyan-100",
  Urbano: "border-slate-200/50 bg-slate-300/10 text-slate-100",
  "Mark-3": "border-blue-300/60 bg-blue-400/10 text-blue-100",
  Equilíbrio: "border-sky-200/60 bg-sky-300/10 text-sky-100",
  Controle: "border-teal-200/60 bg-teal-300/10 text-teal-100",
  "Corpo a corpo": "border-orange-200/60 bg-orange-300/10 text-orange-100",
  Térmico: "border-amber-300/70 bg-amber-400/10 text-amber-100",
  Brutalidade: "border-red-300/70 bg-red-500/10 text-red-100",
  Sustentação: "border-lime-200/60 bg-lime-300/10 text-lime-100",
  "Mark-4": "border-cyan-300/70 bg-cyan-400/10 text-cyan-100",
  Multivetorial: "border-rose-300/70 bg-rose-400/10 text-rose-100",
  Redundância: "border-emerald-300/70 bg-emerald-400/10 text-emerald-100",
  Condução: "border-yellow-300/70 bg-yellow-400/10 text-yellow-100",
  Ressonância: "border-violet-300/70 bg-violet-400/10 text-violet-100",
  Cerco: "border-stone-200/70 bg-stone-300/10 text-stone-100",
  Instabilidade: "border-pink-300/70 bg-pink-400/10 text-pink-100",
  "Mark-5": "border-emerald-200/70 bg-emerald-300/10 text-emerald-100",
  Comando: "border-blue-200/70 bg-blue-300/10 text-blue-100",
  Finalização: "border-red-200/70 bg-red-300/10 text-red-100",
  Suporte: "border-teal-200/70 bg-teal-300/10 text-teal-100",
  Proteção: "border-cyan-200/70 bg-cyan-300/10 text-cyan-100",
  "Mark-6": "border-white/70 bg-white/10 text-white",
  Berserker: "border-red-400/80 bg-red-500/20 text-red-50",
  Resgate: "border-emerald-200/70 bg-emerald-300/10 text-emerald-100",
  Redenção: "border-amber-100/80 bg-amber-200/10 text-amber-50",
  Classificado: "border-red-400/70 bg-red-500/20 text-red-100",
};

export function Tag({ children }: { children: TagName | string }) {
  const tone = tagTone[children as TagName] ?? "border-white/15 bg-white/5 text-slate-200";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${tone}`}>
      {children}
    </span>
  );
}
