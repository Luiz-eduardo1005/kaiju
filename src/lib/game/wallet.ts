"use client";

import { supabase } from "@/lib/supabase";
import type { Profile, ShopItem, Wallet } from "@/types/game";
import { createAuditLog } from "./auditLog";

export async function getWallet(userId: string) {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<Wallet>();
  if (error) throw error;
  if (!data) throw new Error("Carteira nao encontrada.");
  return data;
}

export async function purchaseItem(profile: Profile, item: ShopItem, quantity = 1) {
  const safeQuantity = Math.floor(Number(quantity));
  if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
    throw new Error("Quantidade inválida.");
  }

  const wallet = await getWallet(profile.id);
  const totalPrice = item.price * safeQuantity;

  if (Number(wallet.balance) < totalPrice) {
    throw new Error("Saldo insuficiente.");
  }

  const nextBalance = Number(wallet.balance) - totalPrice;
  const { error: walletError } = await supabase.from("wallets").update({ balance: nextBalance }).eq("user_id", profile.id);
  if (walletError) throw walletError;

  const existing = await supabase
    .from("inventory_items")
    .select("*")
    .eq("user_id", profile.id)
    .eq("item_id", item.id)
    .order("created_at", { ascending: true });
  if (existing.error) throw existing.error;

  const existingRows = (existing.data as { id: string; quantity: number }[]) ?? [];
  const [primary, ...duplicates] = existingRows;

  if (primary) {
    const currentQuantity = existingRows.reduce((total, row) => total + Number(row.quantity || 0), 0);
    const { error } = await supabase
      .from("inventory_items")
      .update({
        quantity: currentQuantity + safeQuantity,
        item_name: item.name,
        item_type: item.category,
        category: item.category,
        description: item.description,
        effects: [],
        effect_type: item.effect_type,
        effect_value: item.effect_value,
        effect_stat: item.effect_stat,
        duration_type: item.duration_type,
        duration_seconds: item.duration_seconds,
      })
      .eq("id", primary.id);
    if (error) throw error;

    if (duplicates.length) {
      const { error: deleteError } = await supabase
        .from("inventory_items")
        .delete()
        .in(
          "id",
          duplicates.map((row) => row.id),
        );
      if (deleteError) throw deleteError;
    }
  } else {
    const { error } = await supabase.from("inventory_items").insert({
      user_id: profile.id,
      item_id: item.id,
      item_type: item.category,
      item_name: item.name,
      category: item.category,
      quantity: safeQuantity,
      description: item.description,
      effects: [],
      effect_type: item.effect_type,
      effect_value: item.effect_value,
      effect_stat: item.effect_stat,
      duration_type: item.duration_type,
      duration_seconds: item.duration_seconds,
    });
    if (error) throw error;
  }

  const { error: transactionError } = await supabase.from("transactions").insert({
    user_id: profile.id,
    type: "purchase",
    amount: -totalPrice,
    description: `${profile.display_name ?? profile.username} comprou ${item.name} x${safeQuantity} por $${totalPrice}.`,
    related_item_id: item.id,
  });
  if (transactionError) throw transactionError;

  await createAuditLog({
    user_id: profile.id,
    actor_id: profile.id,
    action: "item_purchased",
    entity_type: "shop_item",
    entity_id: item.id,
    old_value: { balance: wallet.balance },
    new_value: { balance: nextBalance, item: item.name, quantity: safeQuantity },
    description: `${profile.display_name ?? profile.username} comprou ${item.name} x${safeQuantity} por $${totalPrice}.`,
  });
}

export async function transferMoney(input: {
  from: Profile;
  to: Profile;
  amount: number;
  description: string;
}) {
  if (input.amount <= 0) throw new Error("Valor invalido.");

  const { error } = await supabase.rpc("transfer_money_v2", {
    p_to_user_id: input.to.id,
    p_amount: input.amount,
    p_description: input.description || null,
  });

  if (error) throw error;
}
