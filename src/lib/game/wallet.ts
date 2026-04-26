"use client";

import { supabase } from "@/lib/supabase";
import type { Profile, ShopItem, Wallet } from "@/types/game";
import { createAuditLog } from "./auditLog";

export async function getWallet(userId: string) {
  const { data, error } = await supabase.from("wallets").select("*").eq("user_id", userId).single<Wallet>();
  if (error) throw error;
  return data;
}

export async function purchaseItem(profile: Profile, item: ShopItem) {
  const wallet = await getWallet(profile.id);

  if (Number(wallet.balance) < item.price) {
    throw new Error("Saldo insuficiente.");
  }

  const nextBalance = Number(wallet.balance) - item.price;
  const { error: walletError } = await supabase.from("wallets").update({ balance: nextBalance }).eq("user_id", profile.id);
  if (walletError) throw walletError;

  const existing = await supabase
    .from("inventory_items")
    .select("*")
    .eq("user_id", profile.id)
    .eq("item_id", item.id)
    .maybeSingle<{ id: string; quantity: number }>();
  if (existing.error) throw existing.error;

  if (existing.data) {
    const { error } = await supabase
      .from("inventory_items")
      .update({ quantity: existing.data.quantity + 1 })
      .eq("id", existing.data.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("inventory_items").insert({
      user_id: profile.id,
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      quantity: 1,
      description: item.description,
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
    amount: -item.price,
    description: `${profile.display_name ?? profile.username} comprou ${item.name} por $${item.price}.`,
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
    new_value: { balance: nextBalance, item: item.name },
    description: `${profile.display_name ?? profile.username} comprou ${item.name} por $${item.price}.`,
  });
}

export async function transferMoney(input: {
  from: Profile;
  to: Profile;
  amount: number;
  description: string;
}) {
  const fromWallet = await getWallet(input.from.id);
  const toWallet = await getWallet(input.to.id);

  if (input.amount <= 0) throw new Error("Valor invalido.");
  if (Number(fromWallet.balance) < input.amount) throw new Error("Saldo insuficiente.");

  const fromNext = Number(fromWallet.balance) - input.amount;
  const toNext = Number(toWallet.balance) + input.amount;

  const { error: debitError } = await supabase.from("wallets").update({ balance: fromNext }).eq("user_id", input.from.id);
  if (debitError) throw debitError;

  const { error: creditError } = await supabase.from("wallets").update({ balance: toNext }).eq("user_id", input.to.id);
  if (creditError) throw creditError;

  const description = input.description || `Transferencia Rapida para ${input.to.username}`;
  const { error: transactionError } = await supabase.from("transactions").insert([
    { user_id: input.from.id, type: "transfer_out", amount: -input.amount, description },
    { user_id: input.to.id, type: "transfer_in", amount: input.amount, description: `Transferencia recebida de ${input.from.username}` },
  ]);
  if (transactionError) throw transactionError;

  await createAuditLog({
    user_id: input.from.id,
    actor_id: input.from.id,
    action: "money_transferred",
    entity_type: "wallet",
    description: `${input.from.username} transferiu $${input.amount} para ${input.to.username}.`,
    old_value: { from: fromWallet.balance, to: toWallet.balance },
    new_value: { from: fromNext, to: toNext },
  });
}
