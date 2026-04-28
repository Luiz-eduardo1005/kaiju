"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

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

export function LoginModal() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loginName = user?.email ? userLabelsByEmail[user.email] : null;

  function closeModal() {
    setIsOpen(false);
    setUsername("");
    setPassword("");
    setMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const email = allowedUsers[normalizeUsername(username)];

    if (!email) {
      setSubmitting(false);
      setMessage("Usuário não autorizado.");
      return;
    }

    const result = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (result.error) {
      setMessage("User ou senha incorretos.");
      return;
    }

    closeModal();
  }

  async function signOut() {
    await supabase.auth.signOut();
    closeModal();
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 transition hover:border-cyan-300/50 hover:text-cyan-100"
      >
        {loginName ? `User: ${loginName}` : "Login"}
      </button>

      {isOpen ? (
        <div className="fixed left-0 top-0 z-[100] grid h-[100dvh] w-screen place-items-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-md">
          <div className="scanline relative my-auto w-full max-w-md overflow-hidden rounded-3xl border border-cyan-300/40 bg-slate-950/95 p-6 shadow-[0_0_80px_rgba(34,211,238,0.2)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <div className="absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-[-80px] left-[-80px] h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />

            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.38em] text-cyan-300">Acesso de player</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-wide text-white">Login</h2>

              {loading ? (
                <p className="mt-5 text-sm text-slate-300">Carregando credenciais...</p>
              ) : user ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">Autenticado</p>
                    <p className="mt-2 text-xl font-black text-white">{loginName ?? "Player"}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-50 transition hover:bg-cyan-300/20"
                    >
                      Continuar
                    </button>
                    <button
                      type="button"
                      onClick={signOut}
                      className="flex-1 rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.28em] text-red-100 transition hover:bg-red-500/20"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">User</span>
                    <input
                      autoFocus
                      required
                      value={username}
                      onChange={(event) => {
                        setUsername(event.target.value);
                        setMessage("");
                      }}
                      className="mt-2 h-12 w-full rounded-xl border border-cyan-300/25 bg-black/60 px-4 font-mono text-cyan-50 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/80 focus:shadow-[0_0_28px_rgba(34,211,238,0.18)]"
                      placeholder="User"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">Senha</span>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setMessage("");
                      }}
                      className="mt-2 h-12 w-full rounded-xl border border-cyan-300/25 bg-black/60 px-4 font-mono text-cyan-50 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/80 focus:shadow-[0_0_28px_rgba(34,211,238,0.18)]"
                      placeholder="Senha"
                    />
                  </label>

                  {message ? (
                    <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
                      {message}
                    </p>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-xl border border-cyan-300/60 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? "Entrando..." : "Entrar"}
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
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
