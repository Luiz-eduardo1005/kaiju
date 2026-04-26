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
  const [store, setStore] = useState(shopStores[0]);
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

  const filtered = items.filter((item) => item.store === store);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Saldo atual</p>
        <h2 className="mt-2 text-4xl font-black text-white">${wallet?.balance ?? 0}</h2>
        {message ? <p className="mt-3 text-sm text-cyan-100">{message}</p> : null}
      </section>
      <div className="flex flex-wrap gap-2">
        {shopStores.map((storeName) => (
          <button key={storeName} onClick={() => setStore(storeName)} className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.18em] ${store === storeName ? "border-cyan-300 bg-cyan-300/15 text-cyan-50" : "border-white/10 bg-white/5 text-slate-300"}`}>
            {storeName}
          </button>
        ))}
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <ShopItemCard key={item.id} item={item} onBuy={buy} disabled={busy} />
        ))}
      </section>
    </div>
  );
}
