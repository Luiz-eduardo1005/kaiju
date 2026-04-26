import Link from "next/link";
import type { TagName } from "@/data";
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
  const content = (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950/75 p-5 shadow-[0_0_35px_rgba(6,182,212,0.08)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_0_45px_rgba(6,182,212,0.18)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-60" />
      <div className="absolute right-4 top-4 h-16 w-16 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-sm transition group-hover:bg-cyan-300/10" />
      <div className="relative flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300/70">
              {restricted ? "Arquivo restrito" : subtitle ?? "Dossie operacional"}
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
  return <Link href={href}>{content}</Link>;
}
