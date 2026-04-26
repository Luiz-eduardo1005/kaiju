"use client";

import { useState } from "react";
import { useMode } from "@/context/mode-context";

export function ModeToggle() {
  const { mode, setMode } = useMode();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleModeChange() {
    if (mode === "master") {
      setMode("player");
      return;
    }

    if (password === "1005@@") {
      setMode("master");
      setIsOpen(false);
      setPassword("");
      setError("");
      return;
    }

    setIsOpen(true);
  }

  function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password === "1005@@") {
      setMode("master");
      setIsOpen(false);
      setPassword("");
      setError("");
      return;
    }

    setError("Senha incorreta. Acesso mestre negado.");
  }

  function closeModal() {
    setIsOpen(false);
    setPassword("");
    setError("");
  }

  return (
    <>
      <button
        onClick={handleModeChange}
        className="group relative overflow-hidden rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.18)] transition hover:border-red-400/70 hover:text-white"
      >
        <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
        <span className="relative">{mode === "player" ? "Modo Player" : "Modo Mestre"}</span>
      </button>

      {isOpen ? (
        <div className="fixed left-0 top-0 z-[100] grid h-[100dvh] w-screen place-items-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-md">
          <div className="scanline relative my-auto max-h-[calc(100dvh-4rem)] w-full max-w-md overflow-hidden rounded-3xl border border-red-400/45 bg-slate-950/95 p-6 shadow-[0_0_80px_rgba(239,68,68,0.22)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <div className="absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-red-500/20 blur-3xl" />
            <div className="absolute bottom-[-80px] left-[-80px] h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />

            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.38em] text-red-300">Acesso restrito</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-wide text-white">Modo Mestre</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Insira a senha de autorizacao para liberar arquivos classificados, verdades ocultas e notas privadas da campanha.
              </p>

              <form onSubmit={submitPassword} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">Senha de autorizacao</span>
                  <input
                    autoFocus
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    className="mt-2 h-12 w-full rounded-xl border border-cyan-300/25 bg-black/60 px-4 font-mono text-lg tracking-[0.2em] text-cyan-50 outline-none transition placeholder:text-slate-600 focus:border-red-300/80 focus:shadow-[0_0_28px_rgba(239,68,68,0.18)]"
                    placeholder="••••••"
                  />
                </label>

                {error ? (
                  <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl border border-red-300/60 bg-red-500/20 px-4 py-3 text-xs font-black uppercase tracking-[0.28em] text-red-50 transition hover:bg-red-500/30"
                  >
                    Liberar
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-100"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
