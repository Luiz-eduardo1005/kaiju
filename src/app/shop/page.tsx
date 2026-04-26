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
    <PageShell eyebrow="Comercio de Nova Aurora" title="Loja" subtitle="Comida, medicamentos, roupas, equipamentos taticos ficticios, ferramentas anti-Kaiju e treino.">
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
    const { data } = await supabase.from("wallets").select("*").eq("user_id", userId).single<Wallet>();
    if (data) setWallet(data);
  }

  useEffect(() => {
    if (!user) return;
    bootstrapPlayer(user)
      .then(async ({ profile, wallet }) => {
        setProfile(profile);
        setWallet(wallet);
        const { data } = await supabase.from("shop_items").select("*").eq("is_active", true).order("store");
        if (data?.length) setItems(data as ShopItem[]);
      })
      .catch((error) => setMessage(error.message));
  }, [user]);

  async function buy(item: ShopItem) {
    if (!profile) return;
    setBusy(true);
    setMessage("");
    try {
      await purchaseItem(profile, item);
      await refreshWallet(profile.id);
      setMessage(`${item.name} comprado e enviado ao inventario.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao comprar item.");
    } finally {
      setBusy(false);
    }
  }

  const filtered = items.filter((item) => item.store === selectedStore);

  const storeDescriptions: Record<string, string> = {
    "Loja de Comida": "Suprimentos básicos, rações de campo e nutrição de emergência.",
    "Loja de Medicamentos": "Kits médicos, estimulantes e estabilizadores neurais oficiais.",
    "Loja de Roupas": "Uniformes civis, trajes reforçados e acessórios de proteção urbana.",
    "Loja de Equipamentos Táticos": "Ferramentas de campo, sensores e dispositivos de comunicação militar.",
    "Loja de Ferramentas Anti-Kaiju": "Lâminas térmicas, selantes e scanners de resíduo orgânico Kaiju.",
    "Loja de Treino": "Aulas de combate, simuladores de reflexo e condicionamento físico.",
  };

  if (!selectedStore) {
    return (
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-950/80 p-6 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/80">Créditos Disponíveis</p>
          <h2 className="mt-2 text-5xl font-black tracking-tighter text-white">
            <span className="text-cyan-400">$</span>{wallet?.balance ?? 0}
          </h2>
          {message ? <p className="mt-4 rounded-lg bg-cyan-500/10 p-3 text-sm text-cyan-200 border border-cyan-500/20">{message}</p> : null}
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
              <h3 className="mt-4 text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">{storeName}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
                {storeDescriptions[storeName] || "Catálogo de itens especializados para sobrevivência e operações."}
              </p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                Entrar na loja <span>→</span>
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
          ← Voltar para as lojas
        </button>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-6 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">Saldo</p>
          <p className="text-xl font-black text-white">${wallet?.balance ?? 0}</p>
        </div>
      </div>

      <header className="mb-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">{selectedStore}</h2>
        <p className="mt-2 text-slate-400">{storeDescriptions[selectedStore]}</p>
      </header>

      {message ? (
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">
          {message}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <ShopItemCard key={item.id} item={item} onBuy={buy} disabled={busy} />
        ))}
      </section>
    </div>
  );
}

