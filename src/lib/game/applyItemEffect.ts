"use client";

import { supabase } from "@/lib/supabase";
import type { CharacterSheet, InventoryItem, Profile } from "@/types/game";
import { createAuditLog } from "./auditLog";

export async function applyItemEffect(profile: Profile, item: InventoryItem, sheet: CharacterSheet) {
  if (item.quantity <= 0) throw new Error("Item sem quantidade disponivel.");

  const nextQuantity = item.quantity - 1;
  const { error: quantityError } = await supabase
    .from("inventory_items")
    .update({ quantity: nextQuantity })
    .eq("id", item.id);
  if (quantityError) throw quantityError;

  if (item.effect_type === "heal") {
    const healValue = item.effect_value ?? 0;
    const nextHp = Math.min(sheet.max_hp, sheet.current_hp + healValue);
    const recovered = nextHp - sheet.current_hp;

    const { error } = await supabase.from("character_sheets").update({ current_hp: nextHp }).eq("id", sheet.id);
    if (error) throw error;

    await createAuditLog({
      user_id: profile.id,
      actor_id: profile.id,
      action: "item_used",
      entity_type: "inventory_item",
      entity_id: item.id,
      old_value: { current_hp: sheet.current_hp, quantity: item.quantity },
      new_value: { current_hp: nextHp, quantity: nextQuantity },
      description:
        recovered < healValue
          ? `${profile.display_name ?? profile.username} usou ${item.item_name} e recuperou ${recovered} HP. Cura limitada pela vida maxima.`
          : `${profile.display_name ?? profile.username} usou ${item.item_name} e recuperou ${recovered} HP.`,
    });
    return;
  }

  if (item.effect_type === "buff_stat" || item.effect_type === "food_buff") {
    const { error } = await supabase.from("active_effects").insert({
      user_id: profile.id,
      item_id: item.item_id,
      item_name: item.item_name,
      effect_type: item.effect_type,
      effect_stat: item.effect_stat,
      effect_value: item.effect_value ?? 0,
      duration_type: item.duration_type ?? "manual_confirm",
      duration_seconds: item.duration_seconds,
      requires_master_confirmation: item.duration_type === "manual_confirm",
    });
    if (error) throw error;

    await createAuditLog({
      user_id: profile.id,
      actor_id: profile.id,
      action: "item_used_effect_created",
      entity_type: "active_effect",
      entity_id: item.item_id,
      old_value: { quantity: item.quantity },
      new_value: { quantity: nextQuantity, effect_stat: item.effect_stat, effect_value: item.effect_value },
      description: `${profile.display_name ?? profile.username} usou ${item.item_name}. ${item.effect_stat} +${item.effect_value} ate confirmacao do mestre.`,
    });
    return;
  }

  await createAuditLog({
    user_id: profile.id,
    actor_id: profile.id,
    action: "item_used",
    entity_type: "inventory_item",
    entity_id: item.id,
    old_value: { quantity: item.quantity },
    new_value: { quantity: nextQuantity },
    description: `${profile.display_name ?? profile.username} usou ${item.item_name}.`,
  });
}
