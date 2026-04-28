"use client";

import { supabase } from "@/lib/supabase";
import type { ActiveEffect, CharacterSheet, StatKey } from "@/types/game";

export const STAT_LABELS: Record<string, string> = {
  strength: "Força",
  agility: "Agilidade",
  constitution: "Constituição",
  mind: "Mente",
  willpower: "Vontade",
  technique: "Drift",
  speed: "Agilidade",
  resistencia: "Constituição",
  resistencia_fisica: "Constituição",
  forca: "Força",
  agilidade: "Agilidade",
  constituicao: "Constituição",
  mente: "Mente",
  vontade: "Vontade",
  drift: "Drift",
};

const STAT_ALIASES: Record<string, StatKey> = {
  strength: "strength",
  forca: "strength",
  força: "strength",
  agility: "agility",
  agilidade: "agility",
  speed: "agility",
  velocidade: "agility",
  destreza: "agility",
  constitution: "constitution",
  constituicao: "constitution",
  constituição: "constitution",
  resistencia: "constitution",
  resistência: "constitution",
  mind: "mind",
  mente: "mind",
  inteligencia: "mind",
  inteligência: "mind",
  percepcao: "mind",
  percepção: "mind",
  willpower: "willpower",
  vontade: "willpower",
  technique: "technique",
  drift: "technique",
};

export type StatBreakdown = {
  key: StatKey;
  base: number;
  positive: number;
  negative: number;
  final: number;
};

export function normalizeStatKey(stat?: string | null): StatKey | null {
  if (!stat) return null;
  return STAT_ALIASES[stat.trim().toLowerCase()] ?? null;
}

export function getEffectExpiresAt(effect: ActiveEffect) {
  if (!effect.duration_seconds || effect.duration_type === "equipped" || effect.duration_type === "manual_confirm") return null;
  return new Date(new Date(effect.started_at).getTime() + effect.duration_seconds * 1000);
}

export function isEffectExpired(effect: ActiveEffect, now = new Date()) {
  const expiresAt = getEffectExpiresAt(effect);
  return Boolean(expiresAt && expiresAt.getTime() <= now.getTime());
}

export function getRemainingSeconds(effect: ActiveEffect, now = new Date()) {
  const expiresAt = getEffectExpiresAt(effect);
  if (!expiresAt) return null;
  return Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));
}

export function formatRemaining(seconds: number | null) {
  if (seconds === null) return null;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export async function updateActiveEffects(userId: string) {
  const { data, error } = await supabase.from("active_effects").select("*").eq("user_id", userId).eq("is_active", true);
  if (error) throw error;

  const activeEffects = ((data as ActiveEffect[]) ?? []).filter((effect) => !effect.is_paused);
  const expiredIds = activeEffects.filter((effect) => isEffectExpired(effect)).map((effect) => effect.id);

  if (expiredIds.length) {
    const { error: updateError } = await supabase.from("active_effects").update({ is_active: false }).in("id", expiredIds);
    if (updateError) throw updateError;
  }

  return activeEffects.filter((effect) => !expiredIds.includes(effect.id));
}

export function calculateActiveBonuses(effects: ActiveEffect[]) {
  const bonuses: Record<StatKey, number> = {
    strength: 0,
    agility: 0,
    constitution: 0,
    mind: 0,
    willpower: 0,
    technique: 0,
  };

  effects.forEach((effect) => {
    if (!effect.is_active || effect.is_paused || isEffectExpired(effect)) return;
    if (effect.effect_type !== "buff_stat" && effect.effect_type !== "food_buff" && effect.effect_type !== "equipment_buff") return;

    const stat = normalizeStatKey(effect.effect_stat);
    if (!stat) return;
    bonuses[stat] += Number(effect.effect_value || 0);
  });

  return bonuses;
}

export function calculateFinalStats(sheet: CharacterSheet, effects: ActiveEffect[]): Record<StatKey, StatBreakdown> {
  const bonuses = calculateActiveBonuses(effects);
  const keys: StatKey[] = ["strength", "agility", "constitution", "mind", "willpower", "technique"];

  return keys.reduce(
    (acc, key) => {
      const total = bonuses[key] ?? 0;
      acc[key] = {
        key,
        base: Number(sheet[key] || 0),
        positive: Math.max(0, total),
        negative: Math.min(0, total),
        final: Number(sheet[key] || 0) + total,
      };
      return acc;
    },
    {} as Record<StatKey, StatBreakdown>,
  );
}
