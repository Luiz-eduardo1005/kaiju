"use client";

import { useAuth } from "@/context/auth-context";

export function LoginRequired({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5 text-cyan-100">Carregando acesso...</div>;
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-cyan-300/20 bg-slate-950/80 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">Login necessario</p>
        <h2 className="mt-3 text-3xl font-black text-white">Entre pelo botao Login no topo.</h2>
        <p className="mt-3 text-slate-300">Depois do login, ficha, banco, inventario e loja ficam conectados ao seu player.</p>
      </div>
    );
  }

  return children;
}
