"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { jaegerCombatIndex } from "@/content/jaeger-combat/manifests/jaegerCombatIndex";
import { useMode } from "@/context/mode-context";
import { jaegers } from "@/data";

const quickLinks = [
  { label: "Painel", href: "/master", note: "Mesa de controle" },
  { label: "Lore", href: "/master/lore", note: "Informações do mestre" },
  { label: "Fichas", href: "/master/jaeger-combat", note: "Central de combate" },
  { label: "Catálogo", href: "/jaegers", note: "Dossiês públicos" },
];

const pinnedJaegerIds = ["horizon-brave", "tacit-ronin", "striker-eureka", "bracer-phoenix", "chronos-berserker", "brawler-yukon"];

type Point = {
  x: number;
  y: number;
};

function combatHref(jaegerId: string, tab = "ficha-rapida") {
  return `/master/jaeger-combat?jaeger=${encodeURIComponent(jaegerId)}&tab=${encodeURIComponent(tab)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function MasterQuickDock() {
  const { isMaster } = useMode();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [previewHref, setPreviewHref] = useState("/master/jaeger-combat");
  const [iconPosition, setIconPosition] = useState<Point | null>(null);
  const [windowPosition, setWindowPosition] = useState<Point | null>(null);
  const dragRef = useRef<{ type: "icon" | "window"; startX: number; startY: number; origin: Point; moved: boolean } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIconPosition((current) => current ?? { x: window.innerWidth - 78, y: window.innerHeight - 78 });
      setWindowPosition((current) => current ?? { x: Math.max(18, window.innerWidth - 820), y: 92 });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const jaegerItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return jaegerCombatIndex
      .map((entry) => {
        const jaeger = jaegers.find((item) => item.id === entry.jaegerId);
        return {
          entry,
          name: jaeger?.nome ?? entry.title,
          functionLabel: jaeger?.funcao ?? "Ficha de combate",
          pinned: pinnedJaegerIds.includes(entry.jaegerId),
        };
      })
      .filter((item) => {
        if (!needle) return item.pinned;
        return item.name.toLowerCase().includes(needle) || item.entry.mark.includes(needle) || item.entry.jaegerId.includes(needle);
      })
      .sort((left, right) => Number(right.pinned) - Number(left.pinned) || left.entry.order - right.entry.order)
      .slice(0, needle ? 14 : 6);
  }, [query]);

  function beginDrag(type: "icon" | "window", event: React.PointerEvent, origin: Point | null) {
    if (!origin) return;
    dragRef.current = { type, startX: event.clientX, startY: event.clientY, origin, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;

    if (drag.type === "icon") {
      setIconPosition({
        x: clamp(drag.origin.x + dx, 12, window.innerWidth - 66),
        y: clamp(drag.origin.y + dy, 12, window.innerHeight - 66),
      });
      return;
    }

    setWindowPosition({
      x: clamp(drag.origin.x + dx, 12, window.innerWidth - 360),
      y: clamp(drag.origin.y + dy, 12, window.innerHeight - 160),
    });
  }

  function endIconDrag() {
    const wasDrag = dragRef.current?.moved;
    dragRef.current = null;
    if (!wasDrag) setOpen((current) => !current);
  }

  function endWindowDrag() {
    dragRef.current = null;
  }

  function showInWindow(href: string) {
    setPreviewHref(href);
    setOpen(true);
  }

  if (!isMaster || !iconPosition || !windowPosition) return null;

  return (
    <>
      {open ? (
        <section
          className="fixed z-[74] grid min-h-[360px] min-w-[360px] resize overflow-hidden rounded-[1.4rem] border border-red-300/35 bg-[#0b0205]/95 shadow-[0_0_70px_rgba(239,68,68,0.24)] backdrop-blur-xl md:grid-cols-[260px_minmax(360px,1fr)]"
          style={{
            left: windowPosition.x,
            top: windowPosition.y,
            width: "min(860px, calc(100vw - 28px))",
            height: "min(620px, calc(100vh - 28px))",
          }}
        >
          <aside className="flex min-h-0 flex-col border-r border-red-300/20 bg-red-950/20">
            <div
              role="button"
              tabIndex={0}
              onPointerDown={(event) => beginDrag("window", event, windowPosition)}
              onPointerMove={moveDrag}
              onPointerUp={endWindowDrag}
              className="cursor-move border-b border-red-300/20 p-3"
              title="Segure e arraste para mover a janela"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-red-300">HUD do Mestre</p>
                  <h2 className="mt-1 text-lg font-black uppercase text-white">Consulta flutuante</h2>
                </div>
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200 hover:bg-white/10"
                >
                  X
                </button>
              </div>
              <p className="mt-2 text-[11px] font-bold leading-4 text-slate-400">Arraste pelo topo. Puxe o canto da janela para aumentar ou diminuir.</p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar Jaeger..."
                className="w-full rounded-2xl border border-red-200/25 bg-black/55 px-3 py-2 text-sm font-bold text-white outline-none placeholder:text-slate-500 focus:border-red-200/70"
              />

              <div className="mt-3 grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => showInWindow(link.href)}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-red-200/50 hover:bg-red-500/10"
                  >
                    <span className="block text-xs font-black uppercase text-white">{link.label}</span>
                    <span className="mt-1 block text-[10px] font-bold leading-4 text-slate-400">{link.note}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-950/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Combate</p>
                  <span className="rounded-full border border-cyan-200/20 bg-cyan-500/10 px-2 py-1 text-[10px] font-black uppercase text-cyan-100">
                    {query ? "busca" : "fixos"}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {jaegerItems.map((item) => (
                    <div key={item.entry.jaegerId} className="rounded-2xl border border-white/10 bg-black/35 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-black uppercase text-white">{item.name}</p>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            {item.entry.mark.toUpperCase()} • {item.entry.hasCombatSheet ? "ficha pronta" : "pendente"}
                          </p>
                        </div>
                        {item.pinned ? <span className="rounded-full bg-red-500/15 px-2 py-1 text-[9px] font-black text-red-100">FIXO</span> : null}
                      </div>
                      <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-4 text-slate-400">{item.functionLabel}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => showInWindow(combatHref(item.entry.jaegerId, "ficha-rapida"))}
                          className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-cyan-50 hover:bg-cyan-500/20"
                        >
                          Ficha
                        </button>
                        <button
                          type="button"
                          onClick={() => showInWindow(combatHref(item.entry.jaegerId, "ataques"))}
                          className="rounded-full border border-red-300/20 bg-red-500/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-red-50 hover:bg-red-500/20"
                        >
                          Ataques
                        </button>
                        <button
                          type="button"
                          onClick={() => showInWindow(combatHref(item.entry.jaegerId, "dano-avarias"))}
                          className="rounded-full border border-amber-300/20 bg-amber-500/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-amber-50 hover:bg-amber-500/20"
                        >
                          Dano
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex min-h-0 flex-col bg-slate-950/80">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
              <p className="truncate font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{previewHref}</p>
              <a
                href={previewHref}
                className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200 hover:bg-white/10"
              >
                Abrir página
              </a>
            </div>
            <iframe title="Consulta rápida do mestre" src={previewHref} className="h-full w-full flex-1 bg-slate-950" />
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onPointerDown={(event) => beginDrag("icon", event, iconPosition)}
        onPointerMove={moveDrag}
        onPointerUp={endIconDrag}
        className="fixed z-[75] grid size-14 cursor-grab place-items-center rounded-full border border-red-200/50 bg-[#150207] font-mono text-xl font-black text-red-50 shadow-[0_0_38px_rgba(239,68,68,0.32)] transition hover:scale-105 hover:border-red-100 active:cursor-grabbing"
        style={{ left: iconPosition.x, top: iconPosition.y }}
        title="Clique para abrir. Segure e arraste para mover."
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(248,113,113,0.34),transparent_42%)]" />
        <span className="relative">M</span>
      </button>
    </>
  );
}
