"use client";

import type { ItemTransfer, Profile } from "@/types/game";

function profileName(profiles: Profile[], id: string | null) {
  const profile = profiles.find((item) => item.id === id);
  return profile?.display_name || profile?.username || "Player";
}

function formatRequest(transfer: ItemTransfer) {
  const parts = [];
  if (transfer.requested_money) parts.push(`$${transfer.requested_money}`);
  if (transfer.requested_item_name) parts.push(transfer.requested_item_name);
  return parts.length ? parts.join(" + ") : "Nada informado";
}

export function PendingTradesPanel({
  transfers,
  profiles,
  currentProfile,
  onAccept,
  onDecline,
  disabled,
}: {
  transfers: ItemTransfer[];
  profiles: Profile[];
  currentProfile: Profile;
  onAccept: (transfer: ItemTransfer) => void;
  onDecline: (transfer: ItemTransfer) => void;
  disabled?: boolean;
}) {
  const pendingForMe = transfers.filter((transfer) => transfer.status === "pending" && transfer.to_user_id === currentProfile.id);
  const sentByMe = transfers.filter((transfer) => transfer.from_user_id === currentProfile.id).slice(0, 5);

  return (
    <section className="rounded-[1.6rem] border border-cyan-300/20 bg-slate-950/80 p-5 shadow-[0_0_35px_rgba(6,182,212,0.08)]">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-300">Trocas e envios</p>
      <h2 className="mt-2 text-2xl font-black uppercase text-white">Trocas pendentes</h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Recebidas</p>
          {pendingForMe.length ? pendingForMe.map((transfer) => (
            <article key={transfer.id} className="relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-black/35 p-4 shadow-[0_0_26px_rgba(6,182,212,0.08)]">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/10 blur-3xl" />
              <p className="relative font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300">Proposta recebida</p>
              <p className="relative mt-2 text-sm font-bold text-white">
                {profileName(profiles, transfer.from_user_id)} oferece <span className="text-cyan-100">{transfer.item_name} x{transfer.quantity}</span>
              </p>
              <div className="relative mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-cyan-300/15 bg-cyan-950/10 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Você recebe</p>
                  <p className="mt-1 text-sm font-black text-white">{transfer.item_name} x{transfer.quantity}</p>
                </div>
                <div className="rounded-xl border border-amber-300/15 bg-amber-950/10 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Você entrega</p>
                  <p className="mt-1 text-sm font-black text-white">{formatRequest(transfer)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button disabled={disabled} onClick={() => onAccept(transfer)} className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100 disabled:opacity-50">
                  Ver proposta
                </button>
                <button disabled={disabled} onClick={() => onDecline(transfer)} className="rounded-xl border border-red-300/35 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-100 disabled:opacity-50">
                  Recusar
                </button>
              </div>
            </article>
      )) : <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-400">Nenhuma troca pendente para você.</p>}
        </div>
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Enviadas recentes</p>
          {sentByMe.length ? sentByMe.map((transfer) => (
            <article key={transfer.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm font-bold text-white">
                {transfer.item_name} x{transfer.quantity} para {profileName(profiles, transfer.to_user_id)}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-200">{transfer.transfer_type} / {transfer.status}</p>
            </article>
          )) : <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-400">Nenhuma troca enviada recentemente.</p>}
        </div>
      </div>
    </section>
  );
}
