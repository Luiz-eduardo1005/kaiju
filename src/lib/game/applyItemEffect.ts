"use client";

import { supabase } from "@/lib/supabase";
import type { CharacterSheet, CustomItemEffect, InventoryItem, Profile } from "@/types/game";
import { createAuditLog } from "./auditLog";
import { normalizeStatKey } from "./effects";
import { effectSummary, effectValue, isEquipmentEffect, isTemporaryEffect } from "./itemEffectCatalog";

type EffectResult = { message?: string; current_hp?: number };

function isPermanentItem(item: InventoryItem) {
  return item.duration_type === "Permanente" || item.duration_type === "permanent" || item.duration_type === "equipped";
}

function itemType(item: InventoryItem) {
  return String(item.item_type ?? item.category ?? "").toLowerCase();
}

function hasEquipmentEffect(item: InventoryItem) {
  return Boolean(item.effects?.some(isEquipmentEffect));
}

function isEquippableItem(item: InventoryItem) {
  const type = itemType(item);
  return (
    item.duration_type === "equipped" ||
    hasEquipmentEffect(item) ||
    type.includes("equip") ||
    type.includes("arma") ||
    type.includes("armadura") ||
    type.includes("dispositivo") ||
    type.includes("roupa") ||
    item.category?.toLowerCase().includes("roupa") ||
    item.category?.toLowerCase().includes("equipamento") ||
    item.category?.toLowerCase().includes("conten")
  );
}

function isConsumableItem(item: InventoryItem) {
  const type = itemType(item);
  if (isEquippableItem(item) && item.effects?.every(isEquipmentEffect)) return false;
  return (
    type.includes("consum") ||
    type.includes("comida") ||
    type.includes("bebida") ||
    type.includes("remedio") ||
    type.includes("rem") ||
    item.duration_type === "instant" ||
    item.effect_type === "heal" ||
    item.effect_type === "food_buff"
  );
}

async function reduceInventoryQuantity(item: InventoryItem) {
  const nextQuantity = item.quantity - 1;
  const quantityResult =
    nextQuantity <= 0
      ? await supabase.from("inventory_items").delete().eq("id", item.id)
      : await supabase.from("inventory_items").update({ quantity: nextQuantity, updated_at: new Date().toISOString() }).eq("id", item.id);
  if (quantityResult.error) throw quantityResult.error;
  return nextQuantity;
}

async function createMessageEffect(profile: Profile, item: InventoryItem, messageValue: number, durationSeconds = 600, stat: string | null = null) {
  const { error } = await supabase.from("active_effects").insert({
    user_id: profile.id,
    item_id: item.item_id,
    item_name: item.item_name,
    effect_type: "message",
    effect_stat: stat,
    effect_value: messageValue,
    duration_type: "timed",
    duration_seconds: durationSeconds,
    requires_master_confirmation: false,
  });
  if (error) throw error;
}

async function applyRecovery(profile: Profile, item: InventoryItem, sheet: CharacterSheet, effect: CustomItemEffect): Promise<EffectResult> {
  const resource = effect.resource ?? "hp";
  const value = Math.abs(Number(effect.value ?? 0));
  if (resource === "hp") {
    const nextHp = Math.min(sheet.max_hp, sheet.current_hp + value);
    const recovered = nextHp - sheet.current_hp;
    const { error } = await supabase.from("character_sheets").update({ current_hp: nextHp }).eq("id", sheet.id);
    if (error) throw error;
    return { current_hp: nextHp, message: `recuperou ${recovered} HP` };
  }

  await createMessageEffect(profile, item, value, effect.messageDuration ?? 600, resource);
  return { message: `recuperou ${value} de ${resource}` };
}

async function applyDamage(profile: Profile, item: InventoryItem, sheet: CharacterSheet, effect: CustomItemEffect): Promise<EffectResult> {
  const resource = effect.resource ?? "hp";
  const value = Math.abs(Number(effect.value ?? 0));
  if (resource === "hp") {
    const nextHp = Math.max(0, sheet.current_hp - value);
    const { error } = await supabase.from("character_sheets").update({ current_hp: nextHp }).eq("id", sheet.id);
    if (error) throw error;
    await createMessageEffect(profile, item, -value, effect.messageDuration ?? 600, "current_hp");
    return { current_hp: nextHp, message: `sofreu ${value} de dano` };
  }

  await createMessageEffect(profile, item, -value, effect.messageDuration ?? 600, resource);
  return { message: `reduziu ${value} de ${resource}` };
}

async function createStatEffect(profile: Profile, item: InventoryItem, effect: CustomItemEffect, durationType: "timed" | "equipped"): Promise<EffectResult> {
  const normalizedStat = normalizeStatKey(effect.attribute);
  if (!normalizedStat) throw new Error("Este efeito tem atributo invalido.");
  const signedValue = effectValue(effect);
  const { error } = await supabase.from("active_effects").insert({
    user_id: profile.id,
    item_id: item.item_id,
    item_name: item.item_name,
    effect_type: durationType === "equipped" ? "equipment_buff" : "buff_stat",
    effect_stat: normalizedStat,
    effect_value: signedValue,
    duration_type: durationType,
    duration_seconds: durationType === "timed" ? effect.duration ?? 600 : null,
    requires_master_confirmation: false,
  });
  if (error) throw error;
  return { message: effectSummary(effect) };
}

async function createNarrativeEffect(profile: Profile, item: InventoryItem, effect: CustomItemEffect): Promise<EffectResult> {
  const { error } = await supabase.from("active_effects").insert({
    user_id: profile.id,
    item_id: item.item_id,
    item_name: item.item_name,
    effect_type: effect.type.includes("condition") ? "condition" : "message",
    effect_stat: effect.condition ?? null,
    effect_value: Number(effect.value ?? 0),
    duration_type: isTemporaryEffect(effect) ? "timed" : "timed",
    duration_seconds: effect.duration ?? effect.messageDuration ?? 600,
    requires_master_confirmation: false,
  });
  if (error) throw error;
  return { message: effectSummary(effect) };
}

async function applySingleEffect(profile: Profile, item: InventoryItem, sheet: CharacterSheet, effect: CustomItemEffect): Promise<EffectResult> {
  if (effect.type === "recover_resource" || effect.type === "reduce_fatigue") {
    const normalizedEffect = effect.type === "reduce_fatigue" ? { ...effect, resource: "fadiga" } : effect;
    return applyRecovery(profile, item, sheet, normalizedEffect);
  }
  if (effect.type === "damage_resource") return applyDamage(profile, item, sheet, effect);
  if (effect.type === "temporary_attribute_buff" || effect.type === "temporary_attribute_debuff") {
    return createStatEffect(profile, item, effect, "timed");
  }
  if (isEquipmentEffect(effect)) {
    throw new Error("Este efeito funciona ao equipar o item, não ao usar.");
  }
  return createNarrativeEffect(profile, item, effect);
}

async function applyLegacyEffect(profile: Profile, item: InventoryItem, sheet: CharacterSheet): Promise<EffectResult> {
  if (item.effect_type === "heal") {
    return applyRecovery(profile, item, sheet, {
      id: item.item_id,
      type: "recover_resource",
      resource: "hp",
      value: item.effect_value ?? 0,
      messageDuration: 600,
    });
  }

  if (item.effect_type === "buff_stat" || item.effect_type === "food_buff") {
    return createStatEffect(
      profile,
      item,
      {
        id: item.item_id,
        type: Number(item.effect_value ?? 0) >= 0 ? "temporary_attribute_buff" : "temporary_attribute_debuff",
        attribute: item.effect_stat,
        value: item.effect_value ?? 0,
        duration: item.duration_seconds ?? 600,
      },
      item.duration_type === "equipped" ? "equipped" : "timed",
    );
  }

  await createMessageEffect(profile, item, 0, 600, null);
  return { message: "Uso narrativo registrado." };
}

export async function applyItemEffect(profile: Profile, item: InventoryItem, sheet: CharacterSheet) {
  if (item.quantity <= 0) throw new Error("Item sem quantidade disponivel.");
  if (hasEquipmentEffect(item) && !item.effects?.some((effect) => !isEquipmentEffect(effect))) {
    throw new Error("Este item deve ser equipado para ativar o efeito.");
  }

  const effects = item.effects?.length ? item.effects : null;
  const currentSheet = { ...sheet };
  const results: EffectResult[] = [];

  if (effects) {
    for (const effect of effects.filter((effect) => !isEquipmentEffect(effect))) {
      const result = await applySingleEffect(profile, item, currentSheet, effect);
      if (typeof result.current_hp === "number") currentSheet.current_hp = result.current_hp;
      results.push(result);
    }
  } else {
    const result = await applyLegacyEffect(profile, item, currentSheet);
    if (typeof result.current_hp === "number") currentSheet.current_hp = result.current_hp;
    results.push(result);
  }

  const shouldConsume = isConsumableItem(item) && !isPermanentItem(item);
  const nextQuantity = shouldConsume ? await reduceInventoryQuantity(item) : item.quantity;

  await createAuditLog({
    user_id: profile.id,
    actor_id: profile.id,
    action: "item_used",
    entity_type: "inventory_item",
    entity_id: item.id,
    old_value: { current_hp: sheet.current_hp, quantity: item.quantity },
    new_value: { current_hp: currentSheet.current_hp, quantity: nextQuantity, effects: results },
    description: `${profile.display_name ?? profile.username} usou ${item.item_name}. ${results.map((result) => result.message).filter(Boolean).join("; ")}`,
  });
}

export async function equipItem(profile: Profile, item: InventoryItem) {
  if (!isEquippableItem(item)) throw new Error("Este item não é equipável.");

  const existing = await supabase
    .from("active_effects")
    .select("*")
    .eq("user_id", profile.id)
    .eq("item_id", item.item_id)
    .eq("duration_type", "equipped")
    .eq("is_active", true);
  if (existing.error) throw existing.error;
  if (existing.data?.length) throw new Error("Este item já está equipado.");

  const equipmentEffects = item.effects?.filter(isEquipmentEffect) ?? [];
  if (equipmentEffects.length) {
    for (const effect of equipmentEffects) {
      await createStatEffect(profile, item, effect, "equipped");
    }
  } else {
    const normalizedStat = normalizeStatKey(item.effect_stat);
    const hasStatEffect = normalizedStat && Number(item.effect_value || 0) !== 0;
    const { error } = await supabase.from("active_effects").insert({
      user_id: profile.id,
      item_id: item.item_id,
      item_name: item.item_name,
      effect_type: hasStatEffect ? "equipment_buff" : "equipment",
      effect_stat: normalizedStat,
      effect_value: item.effect_value ?? 0,
      duration_type: "equipped",
      duration_seconds: null,
      requires_master_confirmation: false,
    });
    if (error) throw error;
  }

  await createAuditLog({
    user_id: profile.id,
    actor_id: profile.id,
    action: "item_equipped",
    entity_type: "inventory_item",
    entity_id: item.id,
    new_value: { item: item.item_name, effects: equipmentEffects },
    description: `${profile.display_name ?? profile.username} equipou ${item.item_name}.`,
  });
}

export async function unequipItem(profile: Profile, item: InventoryItem) {
  const { error } = await supabase
    .from("active_effects")
    .update({ is_active: false })
    .eq("user_id", profile.id)
    .eq("item_id", item.item_id)
    .eq("duration_type", "equipped")
    .eq("is_active", true);
  if (error) throw error;

  await createAuditLog({
    user_id: profile.id,
    actor_id: profile.id,
    action: "item_unequipped",
    entity_type: "inventory_item",
    entity_id: item.id,
    old_value: { item: item.item_name },
    description: `${profile.display_name ?? profile.username} desequipou ${item.item_name}.`,
  });
}

export function canEquipItem(item: InventoryItem) {
  return isEquippableItem(item);
}
