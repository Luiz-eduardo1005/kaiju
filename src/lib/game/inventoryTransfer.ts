"use client";

import { supabase } from "@/lib/supabase";
import type { InventoryItem, ItemTransfer, Profile } from "@/types/game";
import { createAuditLog } from "./auditLog";

function displayName(profile?: Profile | null) {
  if (!profile) return "Player";
  return profile.display_name || profile.username;
}

function snapshotItem(item: InventoryItem) {
  return {
    custom_item_id: item.custom_item_id ?? null,
    item_type: item.item_type ?? null,
    item_id: item.item_id,
    item_name: item.item_name,
    category: item.category,
    description: item.description,
    effects: item.effects ?? [],
    effect_type: item.effect_type,
    effect_value: item.effect_value,
    effect_stat: item.effect_stat,
    duration_type: item.duration_type,
    duration_seconds: item.duration_seconds,
    rarity: item.rarity ?? null,
    price: item.price ?? null,
    weight: item.weight ?? null,
    visible_to_player: item.visible_to_player ?? true,
    master_only: item.master_only ?? false,
  };
}

async function removeInventoryQuantity(item: InventoryItem, quantity: number) {
  if (quantity <= 0) throw new Error("Quantidade invalida.");
  if (item.quantity < quantity) throw new Error("Você não tem essa quantidade.");

  const nextQuantity = item.quantity - quantity;
  if (nextQuantity > 0) {
    const { error } = await supabase.from("inventory_items").update({ quantity: nextQuantity }).eq("id", item.id);
    if (error) throw error;
    return nextQuantity;
  }

  const { error } = await supabase.from("inventory_items").delete().eq("id", item.id);
  if (error) throw error;
  return 0;
}

async function addInventoryQuantity(userId: string, item: InventoryItem, quantity: number) {
  const { error } = await supabase.from("inventory_items").insert({
    user_id: userId,
    custom_item_id: item.custom_item_id ?? null,
    item_type: item.item_type ?? null,
    item_id: item.item_id,
    item_name: item.item_name,
    category: item.category,
    quantity,
    description: item.description,
    effects: item.effects ?? [],
    effect_type: item.effect_type,
    effect_value: item.effect_value,
    effect_stat: item.effect_stat,
    duration_type: item.duration_type,
    duration_seconds: item.duration_seconds,
    rarity: item.rarity,
    price: item.price,
    weight: item.weight,
    visible_to_player: item.visible_to_player ?? true,
    master_only: item.master_only ?? false,
  });
  if (error) throw error;
}

export async function sendInventoryItemDirect(input: {
  from: Profile;
  to: Profile;
  item: InventoryItem;
  quantity: number;
}) {
  if (input.from.id === input.to.id) throw new Error("Escolha outro player.");

  const { error } = await supabase.from("item_transfers").insert({
    from_user_id: input.from.id,
    to_user_id: input.to.id,
    item_id: input.item.item_id,
    item_name: input.item.item_name,
    item_snapshot: snapshotItem(input.item),
    quantity: input.quantity,
    status: "completed",
    transfer_type: "direct",
  });
  if (error) throw error;

  await addInventoryQuantity(input.to.id, input.item, input.quantity);
  await removeInventoryQuantity(input.item, input.quantity);

  await createAuditLog({
    user_id: input.to.id,
    actor_id: input.from.id,
    action: "player_item_sent",
    entity_type: "inventory_item",
    entity_id: input.item.id,
    old_value: { from_quantity: input.item.quantity },
    new_value: { item: input.item.item_name, quantity: input.quantity, to: displayName(input.to) },
    description: `${displayName(input.from)} enviou ${input.item.item_name} x${input.quantity} para ${displayName(input.to)}.`,
  });
}

export async function createTradeProposal(input: {
  from: Profile;
  to: Profile;
  offeredItem: InventoryItem;
  quantity: number;
  requestedMoney?: number | null;
  requestedItemName?: string | null;
}) {
  if (input.from.id === input.to.id) throw new Error("Escolha outro player.");
  if (input.quantity <= 0 || input.offeredItem.quantity < input.quantity) throw new Error("Quantidade invalida para proposta.");

  const requestedMoney = input.requestedMoney && input.requestedMoney > 0 ? input.requestedMoney : null;
  const requestedItemName = input.requestedItemName?.trim() || null;
  if (!requestedMoney && !requestedItemName) throw new Error("Informe dinheiro ou item pedido para a troca.");

  const { data, error } = await supabase
    .from("item_transfers")
    .insert({
      from_user_id: input.from.id,
      to_user_id: input.to.id,
      item_id: input.offeredItem.item_id,
      item_name: input.offeredItem.item_name,
      item_snapshot: snapshotItem(input.offeredItem),
      quantity: input.quantity,
      status: "pending",
      transfer_type: "trade",
      requested_money: requestedMoney,
      requested_item_name: requestedItemName,
    })
    .select("*")
    .single<ItemTransfer>();
  if (error) throw error;

  await createAuditLog({
    user_id: input.to.id,
    actor_id: input.from.id,
    action: "item_trade_proposed",
    entity_type: "item_transfer",
    entity_id: data.id,
    new_value: {
      offered: input.offeredItem.item_name,
      quantity: input.quantity,
      requested_money: requestedMoney,
      requested_item_name: requestedItemName,
    },
    description: `${displayName(input.from)} propos troca com ${input.offeredItem.item_name} x${input.quantity} para ${displayName(input.to)}.`,
  });

  return data;
}

export async function acceptTradeProposal(input: {
  actor: Profile;
  transfer: ItemTransfer;
  fromProfile?: Profile | null;
  requestedItem?: InventoryItem | null;
}) {
  if (input.actor.id !== input.transfer.to_user_id) throw new Error("Apenas o destinatário pode aceitar esta troca.");
  if (input.transfer.status !== "pending") throw new Error("Esta troca não está pendente.");
  if (!input.transfer.from_user_id) throw new Error("Player de origem não encontrado.");

  const { error } = await supabase.rpc("accept_item_trade_v2", {
    p_transfer_id: input.transfer.id,
    p_requested_inventory_item_id: input.requestedItem?.id ?? null,
  });
  if (error) throw error;

  await createAuditLog({
    user_id: input.actor.id,
    actor_id: input.actor.id,
    action: "item_trade_accepted",
    entity_type: "item_transfer",
    entity_id: input.transfer.id,
    new_value: {
      accepted: true,
      offered: input.transfer.item_name,
      quantity: input.transfer.quantity,
      requested_money: input.transfer.requested_money,
      requested_item_name: input.transfer.requested_item_name,
    },
    description: `${displayName(input.actor)} aceitou troca de ${displayName(input.fromProfile)}: ${input.transfer.item_name} x${input.transfer.quantity}.`,
  });
}

export async function declineTradeProposal(actor: Profile, transfer: ItemTransfer) {
  if (actor.id !== transfer.to_user_id) throw new Error("Apenas o destinatário pode recusar esta troca.");
  if (transfer.status !== "pending") throw new Error("Esta troca não está pendente.");

  const { error } = await supabase.from("item_transfers").update({ status: "declined" }).eq("id", transfer.id);
  if (error) throw error;

  await createAuditLog({
    user_id: actor.id,
    actor_id: actor.id,
    action: "item_trade_declined",
    entity_type: "item_transfer",
    entity_id: transfer.id,
    old_value: { status: "pending" },
    new_value: { status: "declined" },
    description: `${displayName(actor)} recusou troca envolvendo ${transfer.item_name}.`,
  });
}
