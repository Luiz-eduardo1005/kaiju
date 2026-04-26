"use client";

import { useEffect, useState } from "react";
import { LoginRequired } from "@/components/game/login-required";
import { MasterPlayerPanel } from "@/components/master/MasterPlayerPanel";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/context/auth-context";
import { useMode } from "@/context/mode-context";
import { createAuditLog } from "@/lib/game/auditLog";
import { bootstrapPlayer, getProfile } from "@/lib/game/profile";
import { supabase } from "@/lib/supabase";
import type { ActiveEffect, AuditLog, CharacterSheet, Profile, Wallet } from "@/types/game";

export default function MasterPage() {
  return (
    <PageShell eyebrow="Nivel Omega" title="Painel do Mestre" subtitle="Gerencie players, vida, saldo, efeitos ativos e auditoria da campanha.">
      <LoginRequired>
        <MasterPanel />
      </LoginRequired>
    </PageShell>
  );
}

function MasterPanel() {
  const { user } = useAuth();
  const { isMaster } = useMode();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [sheets, setSheets] = useState<CharacterSheet[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [effects, setEffects] = useState<ActiveEffect[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [message, setMessage] = useState("");

  async function loadAll() {
    const [profilesResult, sheetsResult, walletsResult, effectsResult, logsResult] = await Promise.all([
      supabase.from("profiles").select("*").order("username"),
      supabase.from("character_sheets").select("*"),
      supabase.from("wallets").select("*"),
      supabase.from("active_effects").select("*").eq("is_active", true),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(80),
    ]);
    setProfiles((profilesResult.data as Profile[]) ?? []);
    setSheets((sheetsResult.data as CharacterSheet[]) ?? []);
    setWallets((walletsResult.data as Wallet[]) ?? []);
    setEffects((effectsResult.data as ActiveEffect[]) ?? []);
    setLogs((logsResult.data as AuditLog[]) ?? []);
  }

  useEffect(() => {
    if (!user) return;
    bootstrapPlayer(user)
      .then(async () => {
        const current = await getProfile(user.id);
        setProfile(current);
        if (current.role === "master") await loadAll();
      })
      .catch((error) => setMessage(error.message));
  }, [user]);

  async function adjustHp(targetProfile: Profile, sheet: CharacterSheet) {
    if (!user) return;
    const nextHp = Number(window.prompt(`Nova vida atual de ${targetProfile.username}:`, String(sheet.current_hp)));
    if (Number.isNaN(nextHp)) return;
    await supabase.from("character_sheets").update({ current_hp: nextHp }).eq("id", sheet.id);
    await createAuditLog({
      user_id: targetProfile.id,
      actor_id: user.id,
      action: "master_hp_adjusted",
      entity_type: "character_sheet",
      entity_id: sheet.id,
      old_value: { current_hp: sheet.current_hp },
      new_value: { current_hp: nextHp },
      description: `Mestre ajustou vida de ${targetProfile.username} de ${sheet.current_hp} para ${nextHp}.`,
    });
    await loadAll();
  }

  async function adjustBalance(targetProfile: Profile, wallet: Wallet) {
    if (!user) return;
    const nextBalance = Number(window.prompt(`Novo saldo de ${targetProfile.username}:`, String(wallet.balance)));
    if (Number.isNaN(nextBalance)) return;
    await supabase.from("wallets").update({ balance: nextBalance }).eq("id", wallet.id);
    await supabase.from("transactions").insert({
      user_id: targetProfile.id,
      type: "master_adjustment",
      amount: nextBalance - wallet.balance,
      description: `Ajuste do Mestre: saldo alterado para $${nextBalance}.`,
    });
    await createAuditLog({
      user_id: targetProfile.id,
      actor_id: user.id,
      action: "master_balance_adjusted",
      entity_type: "wallet",
      entity_id: wallet.id,
      old_value: { balance: wallet.balance },
      new_value: { balance: nextBalance },
      description: `Mestre ajustou saldo de ${targetProfile.username} de $${wallet.balance} para $${nextBalance}.`,
    });
    await loadAll();
  }

  async function endEffect(effect: ActiveEffect, targetProfile: Profile) {
    if (!user) return;
    await supabase.from("active_effects").update({ is_active: false }).eq("id", effect.id);
    await createAuditLog({
      user_id: targetProfile.id,
      actor_id: user.id,
      action: "master_effect_ended",
      entity_type: "active_effect",
      entity_id: effect.id,
      old_value: { is_active: true },
      new_value: { is_active: false },
      description: `Mestre confirmou o fim do efeito ${effect.item_name} em ${targetProfile.username}.`,
    });
    await loadAll();
  }

  if (!isMaster) {
    return (
      <div className="rounded-3xl border border-cyan-300/25 bg-cyan-950/10 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">Modo Player ativo</p>
        <h2 className="mt-3 text-3xl font-black text-white">Ative o Modo Mestre para abrir este painel.</h2>
        <p className="mt-3 text-slate-300">O card e as funcoes administrativas ficam ocultos no modo publico.</p>
      </div>
    );
  }

  if (!profile) return <p className="text-slate-300">Carregando painel...</p>;
  if (profile.role !== "master") {
    return (
      <div className="rounded-3xl border border-red-400/30 bg-red-950/20 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-300">Acesso negado</p>
        <h2 className="mt-3 text-3xl font-black text-white">Este painel exige role master.</h2>
        <p className="mt-3 text-slate-300">
          Entre pelo botao Login usando o usuario mestre. O Modo Mestre libera a interface, mas o Supabase ainda exige uma conta master para editar dados de todos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message ? <p className="rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-red-100">{message}</p> : null}
      <section className="grid gap-4 xl:grid-cols-2">
        {profiles
          .filter((item) => item.role === "player")
          .map((item) => (
            <MasterPlayerPanel
              key={item.id}
              profile={item}
              sheet={sheets.find((sheet) => sheet.user_id === item.id)}
              wallet={wallets.find((wallet) => wallet.user_id === item.id)}
              effects={effects.filter((effect) => effect.user_id === item.id)}
              onAdjustHp={adjustHp}
              onAdjustBalance={adjustBalance}
              onEndEffect={endEffect}
            />
          ))}
      </section>
      <section className="rounded-2xl border border-red-400/30 bg-red-950/15 p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.28em] text-red-200">Auditoria</h2>
        <div className="mt-4 space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-300">{log.action}</p>
              <p className="mt-2 text-sm text-slate-200">{log.description}</p>
              <p className="mt-2 text-xs text-slate-500">{new Date(log.created_at).toLocaleString("pt-BR")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
