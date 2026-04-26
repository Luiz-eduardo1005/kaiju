"use client";

import { useMode } from "@/context/mode-context";

export function ModeToggle() {
  const { mode, toggleMode } = useMode();

  return (
    <button
      onClick={toggleMode}
      className="group relative overflow-hidden rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.18)] transition hover:border-red-400/70 hover:text-white"
    >
      <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
      <span className="relative">{mode === "player" ? "Modo Player" : "Modo Mestre"}</span>
    </button>
  );
}
