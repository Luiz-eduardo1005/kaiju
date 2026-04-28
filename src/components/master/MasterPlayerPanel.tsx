"use client";

import type { ActiveEffect, CharacterSheet, InventoryItem, Profile, Wallet } from "@/types/game";

export function MasterPlayerPanel({
  profile,
  sheet,
  wallet,
  effects,
  inventory,
  onAdjustHp,
  onAdjustBalance,
  onEndEffect,
}: {
  profile: Profile;
  sheet?: CharacterSheet;
  wallet?: Wallet;
  effects: ActiveEffect[];
  inventory?: InventoryItem[];
  onAdjustHp: (profile: Profile, sheet: CharacterSheet) => void;
  onAdjustBalance: (profile: Profile, wallet: Wallet) => void;
  onEndEffect: (effect: ActiveEffect, profile: Profile) => void;
}) {
  return (
    <article className="rounded-2xl border border-red-400/30 bg-red-950/15 p-5">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-300">{profile.username}</p>
      <h3 className="mt-2 text-2xl font-black text-white">{profile.display_name ?? profile.username}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vida</p>
          <p className="text-xl font-black text-white">
            {sheet ? `${sheet.current_hp}/${sheet.max_hp}` : "Sem ficha"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Saldo</p>
          <p className="text-xl font-black text-white">${wallet?.balance ?? 0}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {sheet ? (
          <button onClick={() => onAdjustHp(profile, sheet)} className="rounded-xl border border-red-300/40 bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-100">
            Ajustar HP
          </button>
        ) : null}
        {wallet ? (
          <button onClick={() => onAdjustBalance(profile, wallet)} className="rounded-xl border border-red-300/40 bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-100">
            Ajustar dinheiro
          </button>
        ) : null}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-200/80">Inventário do player</p>
        {inventory?.length ? (
          <div className="grid gap-2">
            {inventory.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                <span className="text-sm font-bold text-white">{item.item_name}</span>
                <span className="rounded-full border border-red-300/20 bg-red-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-red-100">
                  x{item.quantity}
                </span>
              </div>
            ))}
            {inventory.length > 6 ? <p className="text-xs text-slate-500">+{inventory.length - 6} itens ocultos nesta previa.</p> : null}
          </div>
        ) : (
          <p className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-slate-400">Nenhum item no inventário deste player.</p>
        )}
      </div>
      <div className="mt-4 space-y-2">
        {effects.map((effect) => (
          <div key={effect.id} className="rounded-xl border border-red-300/20 bg-black/30 p-3">
            <p className="font-bold text-white">
              {effect.item_name}: {effect.effect_stat} +{effect.effect_value}
            </p>
            <button onClick={() => onEndEffect(effect, profile)} className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-red-200">
              Confirmar fim do efeito
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}
