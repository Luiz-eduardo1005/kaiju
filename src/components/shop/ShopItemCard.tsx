"use client";

import { useState } from "react";
import type { ShopItem } from "@/types/game";
import { Tag } from "../tag";

export function ShopItemCard({
  item,
  onBuy,
  disabled,
}: {
  item: ShopItem;
  onBuy: (item: ShopItem, quantity: number) => void;
  disabled?: boolean;
}) {
  const [quantity, setQuantity] = useState("1");
  const parsedQuantity = Number(quantity);
  const safeQuantity = Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? Math.floor(parsedQuantity) : 0;
  const totalPrice = item.price * (safeQuantity || 1);

  return (
    <article className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5 shadow-[0_0_35px_rgba(6,182,212,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300">{item.store}</p>
          <h3 className="mt-2 text-xl font-black text-white">{item.name}</h3>
        </div>
        <Tag>{item.category}</Tag>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Tag>{item.effect_type}</Tag>
        {item.effect_stat ? <Tag>{`${item.effect_stat} +${item.effect_value}`}</Tag> : null}
      </div>
      <label className="mt-5 grid gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/70">Quantidade</span>
        <input
          inputMode="numeric"
          min="1"
          value={quantity}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (nextValue === "" || /^\d+$/.test(nextValue)) setQuantity(nextValue);
          }}
          onBlur={() => {
            if (!safeQuantity) setQuantity("1");
          }}
          className="rounded-xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-300/60"
        />
      </label>
      <button
        onClick={() => onBuy(item, safeQuantity)}
        disabled={disabled || !safeQuantity}
        className="mt-5 w-full rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.25em] text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Comprar ${totalPrice}
      </button>
    </article>
  );
}
