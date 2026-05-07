"use client";

import { useEffect, useState } from "react";
import { TransactionList } from "@/components/bank/TransactionList";
import { LoginRequired } from "@/components/game/login-required";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/context/auth-context";
import { bootstrapPlayer, getProfile } from "@/lib/game/profile";
import { transferMoney } from "@/lib/game/wallet";
import { supabase } from "@/lib/supabase";
import type { Profile, Transaction, Wallet } from "@/types/game";

export default function BankPage() {
  return (
    <PageShell eyebrow="Banco Civil de Nova Aurora" title="Banco" subtitle="Saldo, histórico e Transferência Rápida entre players.">
      <LoginRequired>
        <BankPanel />
      </LoginRequired>
    </PageShell>
  );
}

function BankPanel() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [toUser, setToUser] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function load(userId: string) {
    const [walletResult, transactionResult, profileResult] = await Promise.all([
      supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle<Wallet>(),
      supabase.from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("username"),
    ]);
    if (walletResult.data) setWallet(walletResult.data);
    setTransactions((transactionResult.data as Transaction[]) ?? []);
    setProfiles(((profileResult.data as Profile[]) ?? []).filter((item) => item.id !== userId));
  }

  useEffect(() => {
    if (!user) return;
    bootstrapPlayer(user)
      .then(async ({ profile, wallet }) => {
        setProfile(profile);
        setWallet(wallet);
        await load(user.id);
      })
      .catch((error) => setMessage(error.message));
  }, [user]);

  async function transfer() {
    if (!profile || !user || !toUser) return;
    setMessage("");
    try {
      const parsedAmount = Number(amount);
      if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage("Digite um valor válido.");
        return;
      }
      const target = await getProfile(toUser);
      await transferMoney({ from: profile, to: target, amount: parsedAmount, description });
      await load(user.id);
      setAmount("");
      setMessage("Transferência Rápida concluída.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro na transferência.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-emerald-300/30 bg-[#04150e]/90 p-6 shadow-[0_0_70px_rgba(16,185,129,0.12)]">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-300">Terminal financeiro civil</p>
            <h2 className="mt-3 text-4xl font-black uppercase text-white md:text-6xl">Banco de Campanha</h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">Saldo, transferências e rastros econômicos dos personagens em Nova Aurora.</p>
          </div>
          <div className="rounded-2xl border border-emerald-300/25 bg-black/35 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-300">Saldo atual</p>
            <p className="mt-1 text-5xl font-black text-white">${wallet?.balance ?? 0}</p>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-emerald-300/20 bg-slate-950/80 p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.28em] text-cyan-200">Transferência Rápida</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select className="rounded-xl border border-white/10 bg-black/60 p-3 text-white" value={toUser} onChange={(e) => setToUser(e.target.value)}>
            <option value="">Destinatário</option>
            {profiles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.username}
              </option>
            ))}
          </select>
          <input type="number" className="rounded-xl border border-white/10 bg-black/60 p-3 text-white" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor" />
          <input className="rounded-xl border border-white/10 bg-black/60 p-3 text-white md:col-span-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" />
        </div>
        <button onClick={transfer} className="mt-4 rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-cyan-50">
          Transferir
        </button>
        {message ? <p className="mt-3 text-sm text-cyan-100">{message}</p> : null}
      </section>
      <TransactionList transactions={transactions} />
    </div>
  );
}
