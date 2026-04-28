"use client";

import Link from "next/link";
import type { TagName } from "@/data";
import { useMode } from "@/context/mode-context";
import { Tag } from "./tag";

type CardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  tags?: TagName[];
  status?: string;
  restricted?: boolean;
};

export function Card({ title, subtitle, description, href, tags = [], status, restricted }: CardProps) {
  const { isMaster } = useMode();
  const cardTone = isMaster
    ? "border-red-400/30 bg-red-950/20 shadow-[0_0_35px_rgba(239,68,68,0.09)] hover:border-red-400/70 hover:shadow-[0_0_45px_rgba(239,68,68,0.2)]"
    : "border-cyan-300/20 bg-slate-950/75 shadow-[0_0_35px_rgba(6,182,212,0.08)] hover:border-cyan-300/60 hover:shadow-[0_0_45px_rgba(6,182,212,0.18)]";
  const lineTone = isMaster ? "via-red-400" : "via-cyan-300";
  const glowTone = isMaster ? "border-red-300/10 bg-red-400/5 group-hover:bg-red-400/10" : "border-cyan-300/10 bg-cyan-300/5 group-hover:bg-cyan-300/10";
  const eyebrowTone = isMaster ? "text-red-300/80" : "text-cyan-300/70";

  const content = (
    <article className={`group relative h-full overflow-hidden rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${cardTone}`}>
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${lineTone} to-transparent opacity-60`} />
      <div className={`absolute right-4 top-4 h-16 w-16 rounded-full border blur-sm transition ${glowTone}`} />
      <div className="relative flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.28em] ${eyebrowTone}`}>
          {restricted ? "Arquivo restrito" : subtitle ?? "Dossiê operacional"}
            </p>
            <h3 className="mt-2 text-xl font-black uppercase tracking-wide text-white">{title}</h3>
          </div>
          {status ? <Tag>{status}</Tag> : null}
        </div>
        {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}
        {tags.length ? (
          <div className="mt-auto flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );

  if (!href) return content;
  return (
    <Link
      href={href}
      aria-label={`Abrir arquivo ${title}`}
      className={`block h-full cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isMaster ? "focus-visible:ring-red-300/80" : "focus-visible:ring-cyan-300/80"
      }`}
    >
      {content}
    </Link>
  );
}
