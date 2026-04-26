"use client";

import type { ActiveEffect } from "@/types/game";

export function ActiveEffectsPanel({ effects }: { effects: ActiveEffect[] }) {
  const active = effects.filter((effect) => effect.is_active);

  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5">
      <h2 className="text-sm font-black uppercase tracking-[0.28em] text-cyan-200">Efeitos Ativos</h2>
      {active.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {active.map((effect) => (
            <div key={effect.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-black text-white">{effect.item_name}</p>
              <p className="text-sm text-slate-300">
                {effect.effect_stat ?? effect.effect_type} +{effect.effect_value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-300">
                {effect.is_paused ? "Pausado" : effect.duration_type}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">Nenhum efeito ativo no momento.</p>
      )}
    </section>
  );
}
