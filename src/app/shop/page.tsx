"use client";

import { useEffect, useState } from "react";
import { LoginRequired } from "@/components/game/login-required";
import { PageShell } from "@/components/page-shell";
import { ShopItemCard } from "@/components/shop/ShopItemCard";
import { useAuth } from "@/context/auth-context";
import { shopItemsSeed, shopStores } from "@/data/shop-items";
import { bootstrapPlayer } from "@/lib/game/profile";
import { purchaseItem } from "@/lib/game/wallet";
import { supabase } from "@/lib/supabase";
import type { Profile, ShopItem, Wallet } from "@/types/game";

export default function ShopPage() {
  return (
    <PageShell
      eyebrow="Comercio de Nova Aurora / 2006"
      title="Loja"
      subtitle="Itens civis e militares básicos: comida, medicamentos comuns, roupas, campo, limpeza, contenção e treinamento."
    >
      <LoginRequired>
        <ShopPanel />
      </LoginRequired>
    </PageShell>
  );
}

function ShopPanel() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [items, setItems] = useState<ShopItem[]>(shopItemsSeed);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function refreshWallet(userId: string) {
    const { data } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle<Wallet>();
    if (data) setWallet(data);
  }

  useEffect(() => {
    if (!user) return;
    bootstrapPlayer(user)
      .then(({ profile, wallet }) => {
        setProfile(profile);
        setWallet(wallet);
        setItems(shopItemsSeed);
      })
      .catch((error) => setMessage(error.message));
  }, [user]);

  async function buy(item: ShopItem, quantity: number) {
    if (!profile) return;
    setBusy(true);
    setMessage("");
    try {
      await purchaseItem(profile, item, quantity);
      await refreshWallet(profile.id);
      setMessage(`${item.name} x${quantity} comprado e enviado ao inventário.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao comprar item.");
    } finally {
      setBusy(false);
    }
  }

  const filtered = items.filter((item) => item.store === selectedStore);

  const storeDescriptions: Record<string, string> = {
    "Loja de Comida": "Lanches, marmitas e itens simples para candidatos, trabalhadores e civis.",
    "Loja de Medicamentos": "Bandagens, kits básicos e utilitários médicos comuns de 2006.",
    "Loja de Roupas": "Roupas civis, proteção leve e itens de clima para Nova Aurora.",
    "Loja de Equipamentos de Campo": "Ferramentas simples de navegação, comunicação e suporte em campo.",
    "Loja de Ferramentas de Limpeza / Contenção": "Equipamentos básicos para poeira, resíduos leves, vedação e amostragem.",
    "Loja de Treinamento": "Aulas e simulados civis para preparo físico e mental antes do Projeto Atlas.",
  };

  if (!selectedStore) {
    return (
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-950/80 p-6 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/80">Creditos Disponiveis</p>
          <h2 className="mt-2 text-5xl font-black tracking-tighter text-white">
            <span className="text-cyan-400">$</span>
            {wallet?.balance ?? 0}
          </h2>
          {message ? <p className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-200">{message}</p> : null}
        </section>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shopStores.map((storeName) => (
            <button
              key={storeName}
              onClick={() => setSelectedStore(storeName)}
              className="group relative flex flex-col items-start overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 p-8 text-left transition-all duration-300 hover:border-cyan-400/40 hover:bg-slate-900/60 hover:shadow-[0_0_50px_rgba(34,211,238,0.15)]"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-400/60">Setor Comercial</p>
              <h3 className="mt-4 text-2xl font-black text-white transition-colors group-hover:text-cyan-300">{storeName}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
                {storeDescriptions[storeName] || "Catalogo de itens simples para sobrevivencia, treino e operacoes."}
              </p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                Entrar na loja <span>-&gt;</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setSelectedStore(null)}
          className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-white/10 hover:text-white"
        >
          &lt;- Voltar para as lojas
        </button>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-6 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">Saldo</p>
          <p className="text-xl font-black text-white">${wallet?.balance ?? 0}</p>
        </div>
      </div>

      <header className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tight text-white">{selectedStore}</h2>
        <p className="mt-2 text-slate-400">{storeDescriptions[selectedStore]}</p>
      </header>

      {message ? <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">{message}</div> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <ShopItemCard key={item.id} item={item} onBuy={buy} disabled={busy} />
        ))}
      </section>
    </div>
  );
}
