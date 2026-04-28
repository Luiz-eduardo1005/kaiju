"use client";

import type { CustomItemEffect, CustomItemEffectType, StatKey } from "@/types/game";

export const AVAILABLE_ITEM_TYPES = [
  { id: "Consumivel", label: "Consumivel" },
  { id: "Equipavel", label: "Equipavel" },
  { id: "Material", label: "Material" },
  { id: "Arma", label: "Arma" },
  { id: "Armadura", label: "Armadura" },
  { id: "Dispositivo", label: "Dispositivo" },
  { id: "Remedio", label: "Remedio" },
  { id: "Comida", label: "Comida" },
  { id: "Bebida", label: "Bebida" },
  { id: "Outro", label: "Outro" },
] as const;

export const AVAILABLE_ITEM_CATEGORIES = [
  "Arma",
  "Equipamento",
  "Consumivel",
  "Roupa",
  "Ferramenta",
  "Item de missao",
  "Material Kaiju",
  "Outro",
] as const;

export const AVAILABLE_ATTRIBUTES: { id: StatKey; label: string }[] = [
  { id: "strength", label: "Forca" },
  { id: "agility", label: "Agilidade" },
  { id: "constitution", label: "Constituicao" },
  { id: "mind", label: "Mente" },
  { id: "willpower", label: "Vontade" },
  { id: "technique", label: "Drift" },
];

export const AVAILABLE_RESOURCES = [
  { id: "hp", label: "HP" },
  { id: "fadiga", label: "Fadiga" },
] as const;

export const AVAILABLE_CONDITIONS = [
  { id: "ferido", label: "Ferido" },
  { id: "exausto", label: "Exausto" },
  { id: "contaminado", label: "Contaminado" },
  { id: "atordoado", label: "Atordoado" },
  { id: "em_panico", label: "Em panico" },
] as const;

export const AVAILABLE_EFFECT_TYPES: {
  id: CustomItemEffectType;
  label: string;
  fields: ("resource" | "attribute" | "condition" | "value" | "duration" | "messageDuration")[];
}[] = [
  { id: "recover_resource", label: "Recuperar recurso", fields: ["resource", "value", "messageDuration"] },
  { id: "reduce_fatigue", label: "Reduzir fadiga", fields: ["value", "messageDuration"] },
  { id: "temporary_attribute_buff", label: "Buff temporario de atributo", fields: ["attribute", "value", "duration"] },
  { id: "temporary_attribute_debuff", label: "Debuff temporario de atributo", fields: ["attribute", "value", "duration"] },
  { id: "equipment_attribute_bonus", label: "Bonus enquanto equipado", fields: ["attribute", "value"] },
  { id: "equipment_attribute_penalty", label: "Penalidade enquanto equipado", fields: ["attribute", "value"] },
  { id: "damage_resource", label: "Causar dano", fields: ["resource", "value", "messageDuration"] },
  { id: "cure_condition", label: "Curar condicao", fields: ["condition", "messageDuration"] },
  { id: "apply_condition", label: "Aplicar condicao", fields: ["condition", "duration"] },
  { id: "remove_condition", label: "Remover condicao", fields: ["condition", "messageDuration"] },
  { id: "narrative", label: "Apenas narrativo / sem efeito mecanico", fields: ["messageDuration"] },
];

export function createEmptyItemEffect(): CustomItemEffect {
  return {
    id: crypto.randomUUID(),
    type: "recover_resource",
    resource: "hp",
    attribute: "strength",
    condition: "ferido",
    value: 1,
    duration: 600,
    messageDuration: 600,
    label: "",
  };
}

export function getEffectDefinition(type: CustomItemEffectType) {
  return AVAILABLE_EFFECT_TYPES.find((effect) => effect.id === type) ?? AVAILABLE_EFFECT_TYPES[0];
}

export function effectUsesField(effect: CustomItemEffect, field: "resource" | "attribute" | "condition" | "value" | "duration" | "messageDuration") {
  return getEffectDefinition(effect.type).fields.includes(field);
}

export function isEquipmentEffect(effect: CustomItemEffect) {
  return effect.type === "equipment_attribute_bonus" || effect.type === "equipment_attribute_penalty";
}

export function isTemporaryEffect(effect: CustomItemEffect) {
  return effect.type === "temporary_attribute_buff" || effect.type === "temporary_attribute_debuff" || effect.type === "apply_condition";
}

export function effectValue(effect: CustomItemEffect) {
  const value = Math.abs(Number(effect.value ?? 0));
  if (effect.type === "temporary_attribute_debuff" || effect.type === "equipment_attribute_penalty") return -value;
  return value;
}

export function effectSummary(effect: CustomItemEffect) {
  const definition = getEffectDefinition(effect.type);
  if (effect.type === "recover_resource") return `${definition.label}: ${effect.resource ?? "recurso"} +${effect.value ?? 0}`;
  if (effect.type === "reduce_fatigue") return `Reduz fadiga: ${effect.value ?? 0}`;
  if (effect.type === "damage_resource") return `Dano em ${effect.resource ?? "recurso"}: -${effect.value ?? 0}`;
  if (effect.type.includes("attribute") || effect.type.includes("equipment")) {
    const attribute = AVAILABLE_ATTRIBUTES.find((item) => item.id === effect.attribute)?.label ?? effect.attribute ?? "atributo";
    const value = effectValue(effect);
    return `${definition.label}: ${attribute} ${value >= 0 ? "+" : ""}${value}`;
  }
  if (effect.type.includes("condition")) return `${definition.label}: ${effect.condition ?? "condicao"}`;
  return effect.label || definition.label;
}

export function validateItemEffect(effect: CustomItemEffect) {
  const definition = getEffectDefinition(effect.type);
  if (definition.fields.includes("value") && Number(effect.value ?? 0) === 0) {
    throw new Error("O efeito precisa ter um valor diferente de zero.");
  }
  if (definition.fields.includes("attribute") && !effect.attribute) {
    throw new Error("Escolha o atributo afetado pelo efeito.");
  }
  if (definition.fields.includes("resource") && !effect.resource) {
    throw new Error("Escolha o recurso afetado pelo efeito.");
  }
  if (definition.fields.includes("condition") && !effect.condition) {
    throw new Error("Escolha a condicao afetada pelo efeito.");
  }
  if (definition.fields.includes("duration") && Number(effect.duration ?? 0) <= 0) {
    throw new Error("Efeitos temporarios precisam de duracao.");
  }
}

export function sanitizeEffects(effects: CustomItemEffect[]) {
  return effects.map((effect) => ({
    id: effect.id || crypto.randomUUID(),
    type: effect.type,
    resource: effect.resource || null,
    attribute: effect.attribute || null,
    condition: effect.condition || null,
    value: effect.value === null || effect.value === undefined ? null : Number(effect.value),
    duration: effect.duration === null || effect.duration === undefined ? null : Number(effect.duration),
    messageDuration: effect.messageDuration === null || effect.messageDuration === undefined ? null : Number(effect.messageDuration),
    label: effect.label?.trim() || null,
  }));
}

