"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";

export function PlayerAuthPanel() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const allowedUsers: Record<string, string> = {
    player1: "player1@cronicas-titas.example.com",
    player2: "player2@cronicas-titas.example.com",
    player3: "player3@cronicas-titas.example.com",
    mestre: "mestre@cronicas-titas.example.com",
  };

  const userLabelsByEmail: Record<string, string> = {
    "player1@cronicas-titas.example.com": "player1",
    "player2@cronicas-titas.example.com": "player2",
    "player3@cronicas-titas.example.com": "player3",
    "mestre@cronicas-titas.example.com": "mestre",
  };

  function normalizeUsername(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, "");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const normalizedUsername = normalizeUsername(username);
    const email = allowedUsers[normalizedUsername];

    if (!email) {
      setSubmitting(false);
      setMessage("Usuário não autorizado.");
      return;
    }

    const result = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Acesso liberado. Perfil de player carregado.");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-cyan-300/20 bg-slate-950/80 p-6 text-cyan-100">
        Carregando credenciais do player...
      </div>
    );
  }

  if (user) {
    const loginName = user.email ? userLabelsByEmail[user.email] : null;
    const name = user.user_metadata.character_name || user.user_metadata.display_name || loginName || "Player";
    return (
      <section className="rounded-3xl border border-emerald-300/30 bg-emerald-950/10 p-6 shadow-[0_0_45px_rgba(16,185,129,0.08)]">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-300">Login autenticado</p>
        <h2 className="mt-3 text-3xl font-black text-white">{name}</h2>
        {loginName ? <p className="mt-2 text-slate-300">User: {loginName}</p> : null}
        <button
          onClick={signOut}
          className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.25em] text-slate-200 transition hover:border-red-300/50 hover:text-red-100"
        >
          Sair
        </button>
      </section>
    );
  }

  return (
    <section className="grid min-h-[58vh] place-items-center">
      <div className="scanline relative w-full max-w-md overflow-hidden rounded-3xl border border-cyan-300/35 bg-slate-950/95 p-6 shadow-[0_0_70px_rgba(34,211,238,0.18)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
      <div className="absolute right-[-80px] top-[-80px] h-52 w-52 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute bottom-[-80px] left-[-80px] h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">Acesso restrito de player</p>
        <h2 className="mt-3 text-3xl font-black uppercase text-white">Login</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Entre com o usuário entregue pelo Mestre.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">User</span>
            <input
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-12 rounded-xl border border-white/10 bg-black/50 px-4 text-white outline-none focus:border-cyan-300/70"
              placeholder="User"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Senha</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-xl border border-white/10 bg-black/50 px-4 text-white outline-none focus:border-cyan-300/70"
              placeholder="Minimo 6 caracteres"
            />
          </label>

          {message ? (
            <p className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-50">
              {message}
            </p>
          ) : null}

          <button
            disabled={submitting}
            className="rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Processando..." : "Entrar"}
          </button>
        </form>
      </div>
      </div>
    </section>
  );
}
