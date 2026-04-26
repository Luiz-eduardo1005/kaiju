"use client";

import type { Visibility } from "@/data";
import { useMode } from "@/context/mode-context";

function paragraphs(text: string) {
  return text.split(/\n{2,}/).filter(Boolean);
}

export function PublicBlock({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-cyan-950/10 p-5">
      {title ? <h2 className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-cyan-200">{title}</h2> : null}
      <div className="prose prose-invert max-w-none text-slate-200 prose-p:leading-8">{children}</div>
    </section>
  );
}

export function ClassifiedBlock({
  title = "Arquivo Classificado",
  children,
  visibility = "classified",
}: {
  title?: string;
  children: React.ReactNode;
  visibility?: Visibility;
}) {
  const { isMaster } = useMode();
  if (!isMaster && ["secret", "masterOnly", "classified"].includes(visibility)) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-red-400/45 bg-red-950/20 p-5 shadow-[0_0_40px_rgba(239,68,68,0.12)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-red-200">Classificado</p>
      <h2 className="mb-4 text-xl font-black uppercase tracking-wide text-red-50">{title}</h2>
      <div className="prose prose-invert max-w-none text-red-50/90 prose-p:leading-8">{children}</div>
    </section>
  );
}

export function TextContent({ text }: { text: string }) {
  return (
    <>
      {paragraphs(text).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
}
