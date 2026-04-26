"use client";

import type { Transaction } from "@/types/game";

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5">
      <h2 className="text-sm font-black uppercase tracking-[0.28em] text-cyan-200">Historico de Transacoes</h2>
      <div className="mt-4 space-y-3">
        {transactions.length ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">{transaction.type}</p>
                <p className={transaction.amount >= 0 ? "font-black text-emerald-200" : "font-black text-red-200"}>
                  {transaction.amount >= 0 ? "+" : ""}${transaction.amount}
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-300">{transaction.description}</p>
              <p className="mt-2 text-xs text-slate-500">{new Date(transaction.created_at).toLocaleString("pt-BR")}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">Nenhuma transacao registrada.</p>
        )}
      </div>
    </section>
  );
}
