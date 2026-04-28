"use client";

import { useEffect, useState } from "react";
import { ActiveEffectsPanel } from "@/components/effects/ActiveEffectsPanel";
import { LoginRequired } from "@/components/game/login-required";
import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";
import { PendingTradesPanel } from "@/components/inventory/PendingTradesPanel";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/context/auth-context";
import { applyItemEffect, canEquipItem, equipItem, unequipItem } from "@/lib/game/applyItemEffect";
import { createAuditLog } from "@/lib/game/auditLog";
import { acceptTradeProposal, createTradeProposal, declineTradeProposal, sendInventoryItemDirect } from "@/lib/game/inventoryTransfer";
import { bootstrapPlayer } from "@/lib/game/profile";
import { updateActiveEffects } from "@/lib/game/effects";
import { supabase } from "@/lib/supabase";
import type { ActiveEffect, CharacterSheet, InventoryItem, ItemTransfer, Profile, Wallet } from "@/types/game";

export default function InventoryPage() {
  return (
    <PageShell eyebrow="Carga pessoal" title="Inventário" subtitle="Itens comprados, consumíveis, ferramentas e efeitos ativos do player.">
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
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [effects, setEffects] = useState<ActiveEffect[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [transfers, setTransfers] = useState<ItemTransfer[]>([]);
  const [modal, setModal] = useState<{ type: "send" | "trade"; item: InventoryItem } | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);
  const [acceptingTrade, setAcceptingTrade] = useState<ItemTransfer | null>(null);
  const [selectedPaymentItemId, setSelectedPaymentItemId] = useState("");
  const [targetPlayerId, setTargetPlayerId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [requestedMoney, setRequestedMoney] = useState("");
  const [requestedItemName, setRequestedItemName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function normalizeInventoryRows(rows: InventoryItem[]) {
    const grouped = new Map<string, InventoryItem[]>();
    rows.forEach((item) => {
      const key = item.custom_item_id ? `custom:${item.custom_item_id}` : `shop:${item.item_id}`;
      grouped.set(key, [...(grouped.get(key) ?? []), item]);
    });

    const normalized: InventoryItem[] = [];
    for (const group of grouped.values()) {
      if (group.length === 1) {
        normalized.push(group[0]);
        continue;
      }

      const [primary, ...duplicates] = group.sort((a, b) => String(a.created_at ?? "").localeCompare(String(b.created_at ?? "")));
      const totalQuantity = group.reduce((total, item) => total + Number(item.quantity || 0), 0);

      const { error: updateError } = await supabase
        .from("inventory_items")
        .update({ quantity: totalQuantity, updated_at: new Date().toISOString() })
        .eq("id", primary.id);
      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from("inventory_items")
        .delete()
        .in(
          "id",
          duplicates.map((item) => item.id),
        );
      if (deleteError) throw deleteError;

      normalized.push({ ...primary, quantity: totalQuantity });
    }

    return normalized.sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
  }

  async function load(userId: string) {
    const [inventoryResult, effectResult, walletResult, profilesResult, transfersResult, sheetResult] = await Promise.all([
      supabase.from("inventory_items").select("*").eq("user_id", userId).gt("quantity", 0).order("created_at", { ascending: false }),
      supabase.from("active_effects").select("*").eq("user_id", userId).eq("is_active", true),
      supabase.from("wallets").select("*").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle<Wallet>(),
      supabase.from("profiles").select("*").order("username"),
      supabase
        .from("item_transfers")
        .select("*")
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("character_sheets")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<CharacterSheet>(),
    ]);
    if (inventoryResult.error) throw inventoryResult.error;
    if (effectResult.error) throw effectResult.error;
    if (walletResult.error) throw walletResult.error;
    if (profilesResult.error) throw profilesResult.error;
    if (transfersResult.error) throw transfersResult.error;
    if (sheetResult.error) throw sheetResult.error;
    setItems(await normalizeInventoryRows((inventoryResult.data as InventoryItem[]) ?? []));
    setEffects((await updateActiveEffects(userId)).filter((effect) => effect.effect_type !== "message"));
    if (sheetResult.data) setSheet(sheetResult.data);
    if (walletResult.data) setWallet(walletResult.data);
    setProfiles(((profilesResult.data as Profile[]) ?? []).filter((item) => item.id !== userId));
    setTransfers((transfersResult.data as ItemTransfer[]) ?? []);
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

  useEffect(() => {
    if (!user) return;

    const interval = window.setInterval(() => {
      void updateActiveEffects(user.id).then((nextEffects) => setEffects(nextEffects.filter((effect) => effect.effect_type !== "message"))).catch((error) => setMessage(error.message));
    }, 30000);

    return () => window.clearInterval(interval);
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

  async function toggleEquipItem(item: InventoryItem) {
    if (!profile || !user) return;
    setBusy(true);
    setMessage("");
    try {
      const equipped = effects.some((effect) => effect.item_id === item.item_id && effect.duration_type === "equipped" && effect.is_active);
      if (equipped) {
        await unequipItem(profile, item);
        setMessage(`${item.item_name} desequipado.`);
      } else {
        await equipItem(profile, item);
        setMessage(`${item.item_name} equipado.`);
      }
      await load(user.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao alterar equipamento.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDeleteItem() {
    if (!deleteItem || !profile || !user) return;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.from("inventory_items").delete().eq("id", deleteItem.id);
      if (error) throw error;
      await createAuditLog({
        user_id: profile.id,
        actor_id: profile.id,
        action: "inventory_item_deleted",
        entity_type: "inventory_item",
        entity_id: deleteItem.id,
        old_value: { item: deleteItem.item_name, quantity: deleteItem.quantity },
        description: `${profile.display_name ?? profile.username} excluiu ${deleteItem.item_name} x${deleteItem.quantity} do inventário.`,
      });
      setDeleteItem(null);
      await load(user.id);
      setMessage(`${deleteItem.item_name} excluído do inventário.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao excluir item.");
    } finally {
      setBusy(false);
    }
  }

  function openModal(type: "send" | "trade", item: InventoryItem) {
    setModal({ type, item });
    setTargetPlayerId("");
    setQuantity("1");
    setRequestedMoney("");
    setRequestedItemName("");
    setMessage("");
  }

  async function submitTransferModal() {
    if (!profile || !user || !modal) return;
    const target = profiles.find((item) => item.id === targetPlayerId);
    const parsedQuantity = Number(quantity);
    if (!target) {
      setMessage("Escolha um player.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      if (modal.type === "send") {
        await sendInventoryItemDirect({
          from: profile,
          to: target,
          item: modal.item,
          quantity: parsedQuantity,
        });
        setMessage(`${modal.item.item_name} enviado para ${target.display_name || target.username}.`);
      } else {
        await createTradeProposal({
          from: profile,
          to: target,
          offeredItem: modal.item,
          quantity: parsedQuantity,
          requestedMoney: requestedMoney.trim() ? Number(requestedMoney) : null,
          requestedItemName,
        });
        setMessage(`Proposta de troca enviada para ${target.display_name || target.username}.`);
      }
      setModal(null);
      await load(user.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao movimentar item.");
    } finally {
      setBusy(false);
    }
  }

  async function acceptTransfer(transfer: ItemTransfer) {
    if (!profile || !user) return;
    setBusy(true);
    setMessage("");
    try {
      const requestedItem = transfer.requested_item_name ? items.find((item) => item.id === selectedPaymentItemId) : null;
      if (transfer.requested_item_name && !requestedItem) {
        setMessage("Selecione o item que você vai entregar nessa troca.");
        setBusy(false);
        return;
      }
      await acceptTradeProposal({
        actor: profile,
        transfer,
        fromProfile: profiles.find((item) => item.id === transfer.from_user_id),
        requestedItem,
      });
      await load(user.id);
      setAcceptingTrade(null);
      setSelectedPaymentItemId("");
        setMessage("Troca aceita e concluída.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao aceitar troca.");
    } finally {
      setBusy(false);
    }
  }

  function profileName(id: string | null) {
    const tradeProfile = profiles.find((item) => item.id === id);
    return tradeProfile?.display_name || tradeProfile?.username || "Player";
  }

  function selectedPaymentItem() {
    return items.find((item) => item.id === selectedPaymentItemId) ?? null;
  }

  function canAcceptTrade(transfer: ItemTransfer) {
    const hasMoney = !transfer.requested_money || !wallet || Number(wallet.balance) >= Number(transfer.requested_money);
    const hasSelectedItem = !transfer.requested_item_name || Boolean(selectedPaymentItemId);
    return hasMoney && hasSelectedItem && !busy;
  }

  async function declineTransfer(transfer: ItemTransfer) {
    if (!profile || !user) return;
    setBusy(true);
    setMessage("");
    try {
      await declineTradeProposal(profile, transfer);
      await load(user.id);
      setMessage("Troca recusada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao recusar troca.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {deleteItem ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-300/35 bg-slate-950 p-6 shadow-[0_0_70px_rgba(239,68,68,0.22)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-red-300">Excluir item</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">{deleteItem.item_name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Tem certeza que quer excluir este item do inventário? Essa ação remove todas as {deleteItem.quantity} unidade(s).
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteItem(null)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-200">Cancelar</button>
              <button disabled={busy} onClick={() => void confirmDeleteItem()} className="rounded-xl border border-red-300/45 bg-red-500/15 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-100 disabled:opacity-50">Excluir</button>
            </div>
          </div>
        </div>
      ) : null}
      {acceptingTrade ? (
        <div className="fixed inset-0 z-[94] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-emerald-300/35 bg-slate-950 p-6 shadow-[0_0_90px_rgba(16,185,129,0.24)]">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />
            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-emerald-300">Contrato de troca</p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-3xl font-black uppercase text-white">{acceptingTrade.item_name}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Proposta enviada por <strong className="text-emerald-100">{profileName(acceptingTrade.from_user_id)}</strong>
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-200">Qtd</p>
                  <p className="text-2xl font-black text-white">{acceptingTrade.quantity}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-950/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Você recebe</p>
                  <p className="mt-2 text-xl font-black text-white">{acceptingTrade.item_name} x{acceptingTrade.quantity}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">O item sai do inventário de {profileName(acceptingTrade.from_user_id)} somente quando a troca for concluída.</p>
                </div>
                <div className="rounded-2xl border border-amber-300/20 bg-amber-950/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">Você entrega</p>
                  <div className="mt-2 space-y-2 text-white">
                    {acceptingTrade.requested_money ? <p className="text-xl font-black">${acceptingTrade.requested_money}</p> : null}
                    {acceptingTrade.requested_item_name ? <p className="text-xl font-black">{acceptingTrade.requested_item_name}</p> : null}
                    {!acceptingTrade.requested_money && !acceptingTrade.requested_item_name ? <p className="text-xl font-black">Nada informado</p> : null}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">Seu saldo atual: ${wallet?.balance ?? 0}</p>
                </div>
              </div>

              {acceptingTrade.requested_money && wallet && Number(wallet.balance) < acceptingTrade.requested_money ? (
                <p className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm font-bold text-red-100">Saldo insuficiente para aceitar essa troca.</p>
              ) : null}

              {acceptingTrade.requested_item_name ? (
                <label className="mt-4 grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">Selecione o item que você vai entregar</span>
                  <select value={selectedPaymentItemId} onChange={(event) => setSelectedPaymentItemId(event.target.value)} className="rounded-2xl border border-emerald-200/25 bg-black/50 px-4 py-3 text-white outline-none">
                    <option value="">Escolher item</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>{item.item_name} x{item.quantity}</option>
                    ))}
                  </select>
                  {selectedPaymentItem() ? (
                    <span className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-xs text-emerald-50">
                      Item selecionado: {selectedPaymentItem()?.item_name} x1
                    </span>
                  ) : null}
                </label>
              ) : null}

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button onClick={() => { setAcceptingTrade(null); setSelectedPaymentItemId(""); }} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-200">Voltar</button>
                <button
                  disabled={!canAcceptTrade(acceptingTrade)}
                  onClick={() => void acceptTransfer(acceptingTrade)}
                  className="rounded-xl border border-emerald-300/45 bg-emerald-500/15 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-100 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Concluindo..." : "Aceitar e concluir"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {modal ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-300/30 bg-slate-950 p-6 shadow-[0_0_70px_rgba(6,182,212,0.22)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-300">{modal.type === "send" ? "Envio direto" : "Proposta de troca"}</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">{modal.item.item_name}</h2>
            <p className="mt-2 text-sm text-slate-400">Você possui {modal.item.quantity} unidade(s).</p>
            <div className="mt-5 grid gap-3">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Player</span>
                <select value={targetPlayerId} onChange={(event) => setTargetPlayerId(event.target.value)} className="rounded-2xl border border-cyan-200/25 bg-black/50 px-4 py-3 text-white outline-none">
                  <option value="">Escolher player</option>
                  {profiles.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.display_name || item.username}
                    </option>
                  ))}
                </select>
                {!profiles.length ? (
                  <span className="text-xs leading-5 text-amber-200">
                    Nenhum destinatario carregado. Rode o SQL profiles-list-policy.sql no Supabase para liberar a lista de players.
                  </span>
                ) : null}
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Quantidade</span>
                <input value={quantity} onChange={(event) => setQuantity(event.target.value)} type="number" min="1" max={modal.item.quantity} className="rounded-2xl border border-cyan-200/25 bg-black/50 px-4 py-3 text-white outline-none" />
              </label>
              {modal.type === "trade" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Dinheiro pedido</span>
                    <input value={requestedMoney} onChange={(event) => setRequestedMoney(event.target.value)} type="number" min="0" placeholder="$0" className="rounded-2xl border border-cyan-200/25 bg-black/50 px-4 py-3 text-white outline-none" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Item pedido</span>
                    <input value={requestedItemName} onChange={(event) => setRequestedItemName(event.target.value)} placeholder="Nome exato do item" className="rounded-2xl border border-cyan-200/25 bg-black/50 px-4 py-3 text-white outline-none" />
                  </label>
                </div>
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button onClick={() => setModal(null)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-200">Cancelar</button>
              <button disabled={busy} onClick={() => void submitTransferModal()} className="rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-50 disabled:opacity-50">
                {modal.type === "send" ? "Enviar item" : "Enviar proposta"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/85 p-6 shadow-[0_0_50px_rgba(6,182,212,0.12)]">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-400/10 blur-[80px]" />
        <div className="relative grid gap-4 md:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Vida atual</p>
            <h2 className="mt-2 text-4xl font-black text-white">
              {sheet?.current_hp ?? 0}/{sheet?.max_hp ?? 0} HP
            </h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Itens carregados</p>
            <p className="mt-1 text-3xl font-black text-white">{items.reduce((total, item) => total + item.quantity, 0)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Categorias</p>
            <p className="mt-1 text-3xl font-black text-white">{new Set(items.map((item) => item.category)).size}</p>
          </div>
        </div>
        {message ? <p className="relative mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-100">{message}</p> : null}
      </section>
      <ActiveEffectsPanel effects={effects} />
      {profile ? (
        <PendingTradesPanel
          transfers={transfers}
          profiles={profiles}
          currentProfile={profile}
          onAccept={(transfer) => {
            setAcceptingTrade(transfer);
            setSelectedPaymentItemId("");
            setMessage("");
          }}
          onDecline={(transfer) => void declineTransfer(transfer)}
          disabled={busy}
        />
      ) : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.length ? (
          items.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onUse={useItem}
              onSend={(selected) => openModal("send", selected)}
              onTrade={(selected) => openModal("trade", selected)}
              onDelete={(selected) => setDeleteItem(selected)}
              onToggleEquip={canEquipItem(item) ? (selected) => void toggleEquipItem(selected) : undefined}
              equipped={effects.some((effect) => effect.item_id === item.item_id && effect.duration_type === "equipped" && effect.is_active)}
              disabled={busy}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-cyan-300/20 bg-slate-950/80 p-8 text-center md:col-span-2 xl:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">Inventário vazio</p>
            <h2 className="mt-3 text-3xl font-black text-white">Nenhum item carregado.</h2>
            <p className="mt-2 text-sm text-slate-400">Compre itens na loja ou receba equipamentos do mestre para eles aparecerem aqui.</p>
          </div>
        )}
      </section>
    </div>
  );
}
