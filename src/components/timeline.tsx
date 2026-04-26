"use client";

import type { TimelineEvent } from "@/data";
import { useMode } from "@/context/mode-context";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const { isMaster } = useMode();
  const visibleEvents = events.filter((event) => !event.visibility || isMaster);

  return (
    <ol className="relative space-y-4 border-l border-cyan-300/20 pl-6">
      {visibleEvents.map((event) => (
        <li key={`${event.year}-${event.title}`} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <span className="absolute -left-[33px] top-5 h-3 w-3 rounded-full border border-cyan-200 bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">{event.year}</p>
          <h3 className="mt-1 text-lg font-black text-white">{event.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{event.text}</p>
        </li>
      ))}
    </ol>
  );
}
