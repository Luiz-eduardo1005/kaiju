"use client";

import Link from "next/link";
import { useMode } from "@/context/mode-context";
import { LoginModal } from "./login-modal";
import { ModeToggle } from "./mode-toggle";

const nav = [
  ["História", "/historia"],
  ["Kaijus", "/kaijus"],
  ["Jaegers", "/jaegers"],
  ["Cidade", "/cidade"],
  ["Loja", "/shop"],
  ["Ficha", "/character"],
  ["Banco", "/bank"],
];

const masterNav = [
  ["Armas", "/armas-enumeradas"],
  ["Campanha", "/campanha"],
];

export function TopBar() {
  const { isMaster } = useMode();

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isMaster ? "border-red-400/25 bg-[#090205]/90" : "border-cyan-300/15 bg-[#030711]/85"
      }`}
    >
      {isMaster ? (
        <div className="border-b border-red-400/25 bg-red-950/35 px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.35em] text-red-100 shadow-[0_0_35px_rgba(239,68,68,0.16)]">
          MODO MESTRE - ACESSO CLASSIFICADO
        </div>
      ) : null}
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group">
          <p className={`text-[10px] font-black uppercase tracking-[0.35em] ${isMaster ? "text-red-300/80" : "text-cyan-300/70"}`}>
            Central Anti-Kaiju
          </p>
          <h1 className={`text-2xl font-black uppercase tracking-wide text-white ${isMaster ? "group-hover:text-red-100" : "group-hover:text-cyan-100"}`}>
            C&iacute;rculo de Fogo
          </h1>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 transition ${
                isMaster ? "hover:border-red-300/60 hover:text-red-100" : "hover:border-cyan-300/50 hover:text-cyan-100"
              }`}
            >
              {label}
            </Link>
          ))}
          {isMaster
            ? masterNav.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full border border-red-300/40 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.18)] transition hover:border-red-200 hover:bg-red-500/20"
                >
                  {label}
                </Link>
              ))
            : null}
          {isMaster ? (
            <Link
              href="/master"
              className="rounded-full border border-red-300/40 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.18)] transition hover:border-red-200 hover:bg-red-500/20"
            >
              Mestre
            </Link>
          ) : null}
          <LoginModal />
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
