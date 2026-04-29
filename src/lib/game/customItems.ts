"use client";

import { supabase } from "@/lib/supabase";
import type { CustomItem, CustomItemEffect, InventoryItem, MasterInventoryWithItem, Profile } from "@/types/game";
import { createAuditLog } from "./auditLog";
import { effectValue, isEquipmentEffect, sanitizeEffects, validateItemEffect } from "./itemEffectCatalog";

export type CustomItemFormInput = {
  name: string;
  item_type: string;
  category: string;
  rarity: string;
  description: string;
  mechanical_effect: string;
  effects: CustomItemEffect[];
  bonus_stat: string;
  bonus_value: number | null;
  duration_type: string;
  price: number | null;
  weight: number | null;
  quantity: number;
  visible_to_player: boolean;
  master_only: boolean;
  secret_notes: string;
};

function displayName(profile: Profile) {
  return profile.display_name || profile.username;
}

function normalizeItemInput(input: CustomItemFormInput, createdBy: string) {
  const effects = sanitizeEffects(input.effects ?? []);
  effects.forEach(validateItemEffect);

  return {
    name: input.name.trim(),
    item_type: input.item_type,
    category: input.category,
    rarity: input.rarity,
    description: input.description.trim() || null,
    mechanical_effect: input.mechanical_effect.trim() || null,
    effects,
    bonus_stat: input.bonus_stat || null,
    bonus_value: input.bonus_value,
    duration_type: input.duration_type || null,
    price: input.price,
    weight: input.weight,
    visible_to_player: input.visible_to_player,
    master_only: input.master_only,
    secret_notes: input.secret_notes.trim() || null,
    created_by: createdBy,
  };
}

function legacyFieldsFromEffects(item: CustomItem) {
  const effects = item.effects ?? [];
  const firstMechanical = effects.find((effect) => effect.type !== "narrative");

  if (firstMechanical?.type === "recover_resource" && firstMechanical.resource === "hp") {
    return {
      effect_type: "heal",
      effect_value: Number(firstMechanical.value ?? 0),
      effect_stat: "current_hp",
      duration_type: "instant",
      duration_seconds: null,
    };
  }

  if (firstMechanical?.type === "temporary_attribute_buff" || firstMechanical?.type === "temporary_attribute_debuff") {
    return {
      effect_type: "buff_stat",
      effect_value: effectValue(firstMechanical),
      effect_stat: firstMechanical.attribute,
      duration_type: "timed",
      duration_seconds: firstMechanical.duration ?? 600,
    };
  }

  if (firstMechanical && isEquipmentEffect(firstMechanical)) {
    return {
      effect_type: "buff_stat",
      effect_value: effectValue(firstMechanical),
      effect_stat: firstMechanical.attribute,
      duration_type: "equipped",
      duration_seconds: null,
    };
  }

  const hasBonus = Boolean(item.bonus_stat && Number(item.bonus_value || 0) !== 0);
  return {
    effect_type: hasBonus ? "buff_stat" : "utility",
    effect_value: item.bonus_value,
    effect_stat: item.bonus_stat,
    duration_type: item.duration_type,
    duration_seconds: null,
  };
}

export function customItemToInventoryPayload(item: CustomItem, userId: string, quantity: number) {
  const legacy = legacyFieldsFromEffects(item);
  return {
    user_id: userId,
    item_id: item.id,
    custom_item_id: item.id,
    item_type: item.item_type,
    item_name: item.name,
    category: item.category,
    quantity,
    description: item.description,
    effects: item.effects ?? [],
    effect_type: legacy.effect_type,
    effect_value: legacy.effect_value,
    effect_stat: legacy.effect_stat,
    duration_type: legacy.duration_type,
    duration_seconds: legacy.duration_seconds,
    rarity: item.rarity,
    price: item.price,
    weight: item.weight,
    visible_to_player: item.visible_to_player,
    master_only: item.master_only,
  };
}

export async function listMasterInventory() {
  const { data, error } = await supabase
    .from("master_inventory")
    .select("*, custom_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as MasterInventoryWithItem[]) ?? [];
}

export async function createCustomItem(master: Profile, input: CustomItemFormInput) {
  if (input.quantity <= 0) throw new Error("Quantidade criada precisa ser maior que zero.");
  if (!input.name.trim()) throw new Error("Digite o nome do item.");

  const { data: item, error: itemError } = await supabase
    .from("custom_items")
    .insert(normalizeItemInput(input, master.id))
    .select("*")
    .single<CustomItem>();
  if (itemError) throw itemError;

  const { error: stockError } = await supabase.from("master_inventory").insert({
    item_id: item.id,
    quantity: input.quantity,
  });
  if (stockError) throw stockError;

  await createAuditLog({
    user_id: master.id,
    actor_id: master.id,
    action: "custom_item_created",
    entity_type: "custom_item",
    entity_id: item.id,
    new_value: { item: item.name, quantity: input.quantity, rarity: item.rarity },
    description: `${displayName(master)} criou item ${item.rarity}: ${item.name} x${input.quantity}.`,
  });

  return item;
}

export async function updateCustomItem(master: Profile, itemId: string, input: CustomItemFormInput, previous?: CustomItem | null) {
  if (!input.name.trim()) throw new Error("Digite o nome do item.");

  const { data, error } = await supabase
    .from("custom_items")
    .update(normalizeItemInput(input, master.id))
    .eq("id", itemId)
    .select("*")
    .single<CustomItem>();
  if (error) throw error;

  await supabase.from("master_inventory").update({ quantity: Math.max(0, input.quantity) }).eq("item_id", itemId);

  await createAuditLog({
    user_id: master.id,
    actor_id: master.id,
    action: "custom_item_updated",
    entity_type: "custom_item",
    entity_id: itemId,
    old_value: previous ? { item: previous.name, rarity: previous.rarity } : null,
    new_value: { item: data.name, rarity: data.rarity, quantity: input.quantity },
    description: `${displayName(master)} editou o item ${data.name}.`,
  });

  return data;
}

export async function duplicateCustomItem(master: Profile, item: CustomItem, quantity: number) {
  const copyInput: CustomItemFormInput = {
    name: `${item.name} (copia)`,
    item_type: item.item_type ?? "Consumivel",
    category: item.category,
    rarity: item.rarity,
    description: item.description ?? "",
    mechanical_effect: item.mechanical_effect ?? "",
    effects: item.effects ?? [],
    bonus_stat: item.bonus_stat ?? "",
    bonus_value: item.bonus_value,
    duration_type: item.duration_type ?? "",
    price: item.price,
    weight: item.weight,
    quantity: Math.max(1, quantity),
    visible_to_player: item.visible_to_player,
    master_only: item.master_only,
    secret_notes: item.secret_notes ?? "",
  };

  const copy = await createCustomItem(master, copyInput);
  await createAuditLog({
    user_id: master.id,
    actor_id: master.id,
    action: "custom_item_duplicated",
    entity_type: "custom_item",
    entity_id: copy.id,
    old_value: { item: item.name },
    new_value: { item: copy.name },
    description: `${displayName(master)} duplicou ${item.name} como ${copy.name}.`,
  });
  return copy;
}

export async function deleteCustomItem(master: Profile, entry: MasterInventoryWithItem) {
  const item = entry.custom_items;
  if (!item) throw new Error("Item não encontrado.");

  const { error } = await supabase.from("custom_items").delete().eq("id", item.id);
  if (error) throw error;

  await createAuditLog({
    user_id: master.id,
    actor_id: master.id,
    action: "custom_item_deleted",
    entity_type: "custom_item",
    entity_id: item.id,
    old_value: { item: item.name, quantity: entry.quantity },
    description: `${displayName(master)} deletou o item ${item.name} do inventário do mestre.`,
  });
}

async function addItemToPlayer(userId: string, item: CustomItem, quantity: number) {
  const payload = customItemToInventoryPayload(item, userId, quantity);
  const { data: existingRows, error: findError } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("user_id", userId)
    .eq("custom_item_id", item.id)
    .order("created_at", { ascending: true });
  if (findError) throw findError;

  const [existing, ...duplicates] = ((existingRows as InventoryItem[]) ?? []);

  if (existing) {
    const currentQuantity = [existing, ...duplicates].reduce((total, row) => total + Number(row.quantity || 0), 0);
    const { error } = await supabase
      .from("inventory_items")
      .update({
        quantity: currentQuantity + quantity,
        item_name: item.name,
        item_type: item.item_type,
        category: item.category,
        description: item.description,
        effects: item.effects ?? [],
        effect_type: payload.effect_type,
        effect_value: payload.effect_value,
        effect_stat: payload.effect_stat,
        duration_type: payload.duration_type,
        duration_seconds: payload.duration_seconds,
        rarity: item.rarity,
        price: item.price,
        weight: item.weight,
        visible_to_player: item.visible_to_player,
        master_only: item.master_only,
      })
      .eq("id", existing.id);
    if (error) throw error;
    if (duplicates.length) {
      const { error: deleteError } = await supabase.from("inventory_items").delete().in("id", duplicates.map((row) => row.id));
      if (deleteError) throw deleteError;
    }
    const { data: updated, error: verifyError } = await supabase
      .from("inventory_items")
      .select("id, quantity")
      .eq("id", existing.id)
      .single<{ id: string; quantity: number }>();
    if (verifyError) throw verifyError;
    if (!updated || updated.quantity < currentQuantity + quantity) {
      throw new Error("O item foi atualizado, mas a quantidade não foi confirmada no inventário do player.");
    }
    return;
  }

  const { data: inserted, error } = await supabase
    .from("inventory_items")
    .insert(payload)
    .select("id, quantity")
    .single<{ id: string; quantity: number }>();
  if (error) throw error;
  if (!inserted || inserted.quantity < quantity) {
    throw new Error("O item foi enviado, mas não foi confirmado no inventário do player.");
  }
}

export async function sendMasterItemToPlayer(master: Profile, entry: MasterInventoryWithItem, target: Profile, quantity: number) {
  const item = entry.custom_items;
  if (!item) throw new Error("Item não encontrado.");
  if (quantity <= 0) throw new Error("Quantidade invalida.");
  if (quantity > entry.quantity) throw new Error("O mestre não tem essa quantidade em estoque.");

  await addItemToPlayer(target.id, item, quantity);

  const nextQuantity = entry.quantity - quantity;
  if (nextQuantity > 0) {
    const { error } = await supabase.from("master_inventory").update({ quantity: nextQuantity }).eq("id", entry.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("master_inventory").delete().eq("id", entry.id);
    if (error) throw error;
  }

  await createAuditLog({
    user_id: target.id,
    actor_id: master.id,
    action: "master_item_sent",
    entity_type: "inventory_item",
    entity_id: item.id,
    old_value: { master_quantity: entry.quantity },
    new_value: { master_quantity: nextQuantity, item: item.name, quantity },
    description: `${displayName(master)} enviou ${item.name} x${quantity} para ${displayName(target)}.`,
  });
}
