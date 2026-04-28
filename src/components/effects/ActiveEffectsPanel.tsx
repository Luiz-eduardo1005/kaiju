"use client";

import type { ActiveEffect } from "@/types/game";
import { formatRemaining, getRemainingSeconds, STAT_LABELS } from "@/lib/game/effects";

function effectDescription(effect: ActiveEffect) {
  const value = Number(effect.effect_value || 0);
  const sign = value >= 0 ? "+" : "";

  if (effect.effect_type === "message") {
    return effect.effect_stat === "current_hp" ? `Recuperou ${value} HP` : "Uso registrado";
  }

  if (effect.effect_type === "equipment" && !effect.effect_stat) {
    return "Equipamento ativo";
  }

  if (effect.effect_stat) {
    return `${sign}${value} ${STAT_LABELS[effect.effect_stat] ?? effect.effect_stat}`;
  }

  return effect.effect_type;
}

function durationText(effect: ActiveEffect) {
  if (effect.is_paused) return "Pausado";
  if (effect.duration_type === "equipped") return "Enquanto equipado";
  if (effect.duration_type === "manual_confirm") return "Até o mestre remover";

  const remaining = formatRemaining(getRemainingSeconds(effect));
  return remaining ? `${remaining} restantes` : effect.duration_type;
}

export function ActiveEffectsPanel({ effects }: { effects: ActiveEffect[] }) {
  const active = effects.filter((effect) => effect.is_active);

  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5">
      <h2 className="text-sm font-black uppercase tracking-[0.28em] text-cyan-200">Efeitos Ativos</h2>
      {active.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {active.map((effect) => {
            const value = Number(effect.effect_value || 0);
            const isNegative = value < 0;
            const isEquipment = effect.duration_type === "equipped";

            return (
              <div
                key={effect.id}
                className={`rounded-xl border p-4 ${
                  isEquipment
                    ? "border-cyan-300/25 bg-cyan-950/15"
                    : isNegative
                      ? "border-red-300/25 bg-red-950/15"
                      : "border-emerald-300/20 bg-emerald-950/10"
                }`}
              >
                <p className="font-black text-white">{effect.item_name}</p>
                <p className={`text-sm font-bold ${isNegative ? "text-red-200" : "text-emerald-200"}`}>
                  {effectDescription(effect)}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-300">{durationText(effect)}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">Nenhum efeito ativo no momento.</p>
      )}
    </section>
  );
}
