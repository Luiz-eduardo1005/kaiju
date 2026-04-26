"use client";

import { useEffect, useState } from "react";
import { ActiveEffectsPanel } from "@/components/effects/ActiveEffectsPanel";
import { LoginRequired } from "@/components/game/login-required";
import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/context/auth-context";
import { applyItemEffect } from "@/lib/game/applyItemEffect";
import { bootstrapPlayer } from "@/lib/game/profile";
import { supabase } from "@/lib/supabase";
import type { ActiveEffect, CharacterSheet, InventoryItem, Profile } from "@/types/game";

export default function InventoryPage() {
  return (
    <PageShell eyebrow="Carga pessoal" title="Inventario" subtitle="Itens comprados, consumiveis, ferramentas e efeitos ativos do player.">
      <LoginRequired>
        <InventoryPanel />
      </LoginRequired>
    </PageShell>
  );
}

function InventoryPanel() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sheet, setSheet] = useState<CharacterSheet | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [effects, setEffects] = useState<ActiveEffect[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(userId: string) {
    const [inventoryResult, effectResult, sheetResult] = await Promise.all([
      supabase.from("inventory_items").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("active_effects").select("*").eq("user_id", userId).eq("is_active", true),
      supabase.from("character_sheets").select("*").eq("user_id", userId).single<CharacterSheet>(),
    ]);
    setItems((inventoryResult.data as InventoryItem[]) ?? []);
    setEffects((effectResult.data as ActiveEffect[]) ?? []);
    if (sheetResult.data) setSheet(sheetResult.data);
  }

  useEffect(() => {
    if (!user) return;
    bootstrapPlayer(user)
      .then(async ({ profile, sheet }) => {
        setProfile(profile);
        setSheet(sheet);
        await load(user.id);
      })
      .catch((error) => setMessage(error.message));
  }, [user]);

  async function useItem(item: InventoryItem) {
    if (!profile || !sheet || !user) return;
    setBusy(true);
    setMessage("");
    try {
      await applyItemEffect(profile, item, sheet);
      await load(user.id);
      setMessage(`${item.item_name} usado.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao usar item.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Vida atual</p>
        <h2 className="mt-2 text-4xl font-black text-white">
          {sheet?.current_hp ?? 0}/{sheet?.max_hp ?? 0} HP
        </h2>
        {message ? <p className="mt-3 text-sm text-cyan-100">{message}</p> : null}
      </section>
      <ActiveEffectsPanel effects={effects} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.length ? items.map((item) => <InventoryItemCard key={item.id} item={item} onUse={useItem} disabled={busy} />) : <p className="text-slate-300">Inventario vazio.</p>}
      </section>
    </div>
  );
}
