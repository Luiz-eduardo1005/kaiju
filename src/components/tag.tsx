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
