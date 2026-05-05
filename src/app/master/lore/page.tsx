"use client";

import { LoginRequired } from "@/components/game/login-required";
import { MasterLoreArchive } from "@/components/master/MasterLoreArchive";
import { useMode } from "@/context/mode-context";

function MasterModeRequired({ children }: { children: React.ReactNode }) {
  const { isMaster } = useMode();

  if (!isMaster) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10">
        <section className="w-full rounded-[2rem] border border-red-300/25 bg-red-950/15 p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-300">Modo Mestre necessário</p>
          <h1 className="mt-3 text-4xl font-black uppercase text-white">Ative o Modo Mestre para abrir a sala de leitura.</h1>
          <p className="mt-4 text-slate-300">Essa área contém a versão completa da lore, incluindo segredos e material de mestragem.</p>
        </section>
      </main>
    );
  }

  return children;
}

export default function MasterLorePage() {
  return (
    <LoginRequired>
      <MasterModeRequired>
        <MasterLoreArchive />
      </MasterModeRequired>
    </LoginRequired>
  );
}
