"use client";

import type { InventoryItem } from "@/types/game";
import { effectSummary, isEquipmentEffect } from "@/lib/game/itemEffectCatalog";
import { Tag } from "../tag";

const effectLabels: Record<string, string> = {
  heal: "Cura",
  buff_stat: "Bonus temporario",
  food_buff: "Bonus leve",
  utility: "Utilitario",
  protection: "Proteção",
};

const statLabels: Record<string, string> = {
  strength: "Forca",
  agility: "Agilidade",
  constitution: "Constituicao",
  mind: "Mente",
  willpower: "Vontade",
  technique: "Drift",
  speed: "Agilidade",
};

function getEffectText(item: InventoryItem) {
  if (item.effects?.length) return item.effects.map(effectSummary).join(" / ");
  if (item.effect_type === "heal") return `Recupera ate ${item.effect_value ?? 0} HP`;
  if ((item.effect_type === "buff_stat" || item.effect_type === "food_buff") && item.effect_stat) {
    return `${statLabels[item.effect_stat] ?? item.effect_stat} +${item.effect_value ?? 0}`;
  }
  if (item.effect_type === "protection") return `Proteção narrativa${item.effect_value ? ` +${item.effect_value}` : ""}`;
  return "Uso narrativo / utilitario";
}

function getDurationText(item: InventoryItem) {
  if (item.effects?.some(isEquipmentEffect) && item.effects.every(isEquipmentEffect)) return "Enquanto equipado";
  if (item.effects?.some((effect) => effect.duration)) return "Temporario / configurado";
  if (!item.duration_type || item.duration_type === "instant") return "Efeito imediato";
  if (item.duration_type === "manual_confirm") return "Até o mestre encerrar";
  if (item.duration_type === "equipped") return "Enquanto equipado";
  if (item.duration_type === "timed") return item.duration_seconds ? `${item.duration_seconds}s` : "Temporizado";
  return item.duration_type;
}

export function InventoryItemCard({
  item,
  onUse,
  onSend,
  onTrade,
  onDelete,
  onToggleEquip,
  equipped,
  disabled,
}: {
  item: InventoryItem;
  onUse: (item: InventoryItem) => void;
  onSend?: (item: InventoryItem) => void;
  onTrade?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  onToggleEquip?: (item: InventoryItem) => void;
  equipped?: boolean;
  disabled?: boolean;
}) {
  const canUse = item.quantity > 0;
  const requiresEquip = item.duration_type === "equipped" || Boolean(item.effects?.length && item.effects.every(isEquipmentEffect));
  const classified = item.rarity === "Classificado" || item.master_only;

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.6rem] border bg-slate-950/80 p-5 shadow-[0_0_35px_rgba(6,182,212,0.08)] transition hover:-translate-y-1 ${
        classified
          ? "border-red-300/45 hover:border-red-300/70 hover:shadow-[0_0_45px_rgba(239,68,68,0.18)]"
          : "border-cyan-300/20 hover:border-cyan-300/55 hover:shadow-[0_0_45px_rgba(6,182,212,0.16)]"
      }`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-300/20" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/80">{item.category}</p>
          <h3 className="mt-2 text-2xl font-black uppercase tracking-wide text-white">{item.item_name}</h3>
        </div>
        <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200">Qtd</p>
          <p className="text-xl font-black text-white">{item.quantity}</p>
        </div>
      </div>

      <p className="relative mt-4 min-h-20 text-sm leading-6 text-slate-300">
        {item.description || "Sem descrição registrada. Recompre o item na loja para atualizar os dados do inventário."}
      </p>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Efeito</p>
          <p className="mt-1 text-sm font-bold text-cyan-50">{getEffectText(item)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Duracao</p>
          <p className="mt-1 text-sm font-bold text-cyan-50">{getDurationText(item)}</p>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {item.effect_type ? <Tag>{effectLabels[item.effect_type] ?? item.effect_type}</Tag> : null}
        {item.effect_stat ? <Tag>{statLabels[item.effect_stat] ?? item.effect_stat}</Tag> : null}
        {item.item_type ? <Tag>{item.item_type}</Tag> : null}
        {item.effects?.length ? <Tag>{`${item.effects.length} efeito(s)`}</Tag> : null}
        {item.rarity ? <Tag>{item.rarity}</Tag> : null}
        {classified ? <Tag>Classificado</Tag> : null}
      </div>

      <button
        onClick={() => onUse(item)}
        disabled={disabled || !canUse || requiresEquip}
        className="relative mt-5 w-full rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.25em] text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {requiresEquip ? "Use Equipar" : item.effect_type === "utility" || item.effect_type === "protection" ? "Registrar uso" : "Usar item"}
      </button>
      {onToggleEquip ? (
        <button
          onClick={() => onToggleEquip(item)}
          disabled={disabled || !canUse}
          className={`relative mt-3 w-full rounded-xl border px-4 py-3 text-xs font-black uppercase tracking-[0.25em] transition disabled:cursor-not-allowed disabled:opacity-50 ${
            equipped
              ? "border-emerald-300/45 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25"
              : "border-cyan-300/30 bg-cyan-950/20 text-cyan-100 hover:bg-cyan-300/10"
          }`}
        >
          {equipped ? "Desequipar" : "Equipar"}
        </button>
      ) : null}
      <div className="relative mt-3 grid gap-2 sm:grid-cols-2">
        <button
          onClick={() => onSend?.(item)}
          disabled={disabled || !canUse || !onSend}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar
        </button>
        <button
          onClick={() => onTrade?.(item)}
          disabled={disabled || !canUse || !onTrade}
          className="rounded-xl border border-cyan-300/25 bg-cyan-950/20 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Propor troca
        </button>
      </div>
      {onDelete ? (
        <button
          aria-label={`Excluir ${item.item_name}`}
          onClick={() => onDelete(item)}
          disabled={disabled}
          className="relative mt-3 w-full rounded-xl border border-red-300/25 bg-red-950/20 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-100 transition hover:border-red-300/50 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Excluir item
        </button>
      ) : null}
    </article>
  );
}
