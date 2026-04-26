"use client";

import type { InventoryItem } from "@/types/game";
import { Tag } from "../tag";

export function InventoryItemCard({
  item,
  onUse,
  disabled,
}: {
  item: InventoryItem;
  onUse: (item: InventoryItem) => void;
  disabled?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300">{item.category}</p>
          <h3 className="mt-2 text-xl font-black text-white">{item.item_name}</h3>
        </div>
        <Tag>{`x${item.quantity}`}</Tag>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.effect_type ? <Tag>{item.effect_type}</Tag> : null}
        {item.effect_stat ? <Tag>{`${item.effect_stat} +${item.effect_value}`}</Tag> : null}
      </div>
      <button
        onClick={() => onUse(item)}
        disabled={disabled || item.quantity <= 0}
        className="mt-5 w-full rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.25em] text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Usar
      </button>
    </article>
  );
}
