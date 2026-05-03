"use client";

import { useEffect, useState } from "react";
import { LoginRequired } from "@/components/game/login-required";
import { MasterJaegerStatusPanel } from "@/components/master/MasterJaegerStatusPanel";
import { MasterItemCreatorPanel } from "@/components/master/MasterItemCreatorPanel";
import { MasterLorePanel } from "@/components/master/MasterLorePanel";
import { MasterPlayerPanel } from "@/components/master/MasterPlayerPanel";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/context/auth-context";
import { useMode } from "@/context/mode-context";
import { getWorldAlert, worldAlerts, WORLD_ALERT_STORAGE_KEY, type WorldAlertId } from "@/data/alerts";
import { createAuditLog } from "@/lib/game/auditLog";
import { bootstrapPlayer, getProfile } from "@/lib/game/profile";
import { supabase } from "@/lib/supabase";
import type { ActiveEffect, AuditLog, CharacterSheet, InventoryItem, Profile, Wallet } from "@/types/game";

const actionLabels: Record<string, string> = {
  character_sheet_updated: "Ficha alterada",
  character_stat_updated: "Atributo alterado",
  item_purchased: "Compra realizada",
  item_used: "Item usado",
  item_used_effect_created: "Efeito ativado",
  money_transferred: "Transferência realizada",
  master_hp_adjusted: "Vida ajustada pelo mestre",
  master_balance_adjusted: "Saldo ajustado pelo mestre",
  master_effect_ended: "Efeito encerrado pelo mestre",
  custom_item_created: "Item criado",
  custom_item_updated: "Item editado",
  custom_item_deleted: "Item deletado",
  custom_item_duplicated: "Item duplicado",
  master_item_sent: "Item enviado pelo mestre",
  player_item_sent: "Item enviado por player",
  item_trade_proposed: "Troca proposta",
  item_trade_accepted: "Troca aceita",
  item_trade_declined: "Troca recusada",
  inventory_item_deleted: "Item excluído",
  jaeger_status_updated: "Status de Jaeger atualizado",
};

const entityLabels: Record<string, string> = {
  character_sheet: "Ficha",
  inventory_item: "Inventário",
  shop_item: "Loja",
  wallet: "Banco",
  active_effect: "Efeito ativo",
  custom_item: "Item customizado",
  item_transfer: "Troca",
  jaeger_status: "Jaeger",
};

const auditFieldLabels: Record<string, string> = {
  character_name: "Nome",
  age: "Idade",
  background: "Background",
  current_hp: "HP",
  max_hp: "HP Máximo",
  strength: "Força",
  agility: "Agilidade",
  constitution: "Constituição",
  mind: "Mente",
  willpower: "Vontade",
  technique: "Drift",
  notes: "Notas",
  balance: "Dinheiro",
  quantity: "Quantidade",
  item: "Item",
  item_name: "Item",
  rarity: "Raridade",
  requested_money: "Dinheiro pedido",
  requested_item_name: "Item pedido",
  offered: "Item oferecido",
  accepted: "Aceita",
  to: "Destino",
  master_quantity: "Estoque do mestre",
  effect_stat: "Atributo",
  effect_value: "Bonus",
  is_active: "Ativo",
  jaeger_id: "Jaeger",
  part_id: "Parte",
  status: "Status",
  integrity: "Integridade",
  note: "Nota",
  equipment_note: "Função/equipamento",
};

const hiddenAuditFields = new Set(["id", "user_id", "actor_id", "created_at", "updated_at", "entity_id"]);

type MasterEditDialog = {
  type: "hp" | "balance";
  title: string;
  label: string;
  targetProfile: Profile;
  currentValue: string;
  sheet?: CharacterSheet;
  wallet?: Wallet;
};

function displayProfileName(profile?: Profile | null) {
  if (!profile) return "Sistema";
  return profile.display_name || profile.username;
}

function formatAuditField(key: string) {
  return auditFieldLabels[key] ?? key;
}

function getAuditDisplayKeys(oldValue: Record<string, unknown> | null, newValue: Record<string, unknown> | null) {
  const keys = new Set([...Object.keys(oldValue ?? {}), ...Object.keys(newValue ?? {})]);
  const changedKeys = Array.from(keys).filter((key) => !hiddenAuditFields.has(key) && oldValue?.[key] !== newValue?.[key]);

  if (changedKeys.length) return changedKeys;
  return Array.from(keys).filter((key) => !hiddenAuditFields.has(key));
}

function formatAuditValue(value: Record<string, unknown> | null, keys?: string[]) {
  if (!value) return "Sem dados";
  const entries = Object.entries(value)
    .filter(([key, entryValue]) => !hiddenAuditFields.has(key) && (!keys || keys.includes(key)) && entryValue !== undefined)
    .map(([key, entryValue]) => `${formatAuditField(key)}: ${String(entryValue)}`)
    .join(" | ");

  return entries || "Sem alteração relevante";
}

function formatAuditTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

function CollapsibleMasterCard({
  eyebrow,
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-[2rem] border border-red-400/30 bg-[#100307]/85 p-5 shadow-[0_0_45px_rgba(239,68,68,0.1)]">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex w-full flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
        <span>
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-red-300">{eyebrow}</span>
          <span className="mt-1 block text-2xl font-black uppercase text-white">{title}</span>
          <span className="mt-2 block text-sm text-slate-300">{subtitle}</span>
        </span>
        <span className="rounded-2xl border border-red-300/35 bg-red-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-red-50">
          {open ? "Fechar" : "Abrir"}
        </span>
      </button>
      {open ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

function MasterWorldAlertPanel() {
  const [alertId, setAlertId] = useState<WorldAlertId>(() => {
    if (typeof window === "undefined") return "verde";
    return (window.localStorage.getItem(WORLD_ALERT_STORAGE_KEY) as WorldAlertId | null) ?? "verde";
  });
  const currentAlert = getWorldAlert(alertId);

  function updateAlert(nextAlertId: WorldAlertId) {
    setAlertId(nextAlertId);
    window.localStorage.setItem(WORLD_ALERT_STORAGE_KEY, nextAlertId);
    window.dispatchEvent(new CustomEvent("world-alert-updated"));
  }

  return (
    <CollapsibleMasterCard
      eyebrow="Comando global"
      title="Alertas do Mundo"
      subtitle="Troque o nível de alerta público da campanha e use as notas de mestre para guiar a próxima cena."
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-red-200">Alerta ativo</span>
            <select
              value={alertId}
              onChange={(event) => updateAlert(event.target.value as WorldAlertId)}
              className="rounded-2xl border border-red-200/25 bg-black/60 px-4 py-3 text-white outline-none"
            >
              {worldAlerts.map((alert) => (
                <option key={alert.id} value={alert.id}>
                  {alert.label} - {alert.status}
                </option>
              ))}
            </select>
          </label>
          <div className={`mt-4 rounded-2xl border p-4 ${currentAlert.className}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.28em]">{currentAlert.label}</p>
            <h3 className="mt-2 text-2xl font-black uppercase text-white">{currentAlert.title}</h3>
            <p className="mt-2 text-sm font-bold">{currentAlert.status}</p>
          </div>
        </div>
        <div className="grid gap-3">
          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-950/10 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Mensagem pública</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{currentAlert.description}</p>
          </div>
          <div className="rounded-2xl border border-red-300/20 bg-red-950/20 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-200">Uso do mestre</p>
            <p className="mt-2 text-sm leading-6 text-red-50/90">{currentAlert.masterNotes}</p>
          </div>
        </div>
      </div>
    </CollapsibleMasterCard>
  );
}

export default function MasterPage() {
  return (
    <PageShell eyebrow="Nível Omega" title="Painel do Mestre" subtitle="Gerencie players, vida, saldo, efeitos ativos e auditoria da campanha.">
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
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState<MasterEditDialog | null>(null);
  const [dialogValue, setDialogValue] = useState("");

  async function loadAll() {
    const [profilesResult, sheetsResult, walletsResult, effectsResult, inventoryResult, logsResult] = await Promise.all([
      supabase.from("profiles").select("*").order("username"),
      supabase.from("character_sheets").select("*"),
      supabase.from("wallets").select("*"),
      supabase.from("active_effects").select("*").eq("is_active", true),
      supabase.from("inventory_items").select("*").gt("quantity", 0).order("created_at", { ascending: false }),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(80),
    ]);
    setProfiles((profilesResult.data as Profile[]) ?? []);
    setSheets((sheetsResult.data as CharacterSheet[]) ?? []);
    setWallets((walletsResult.data as Wallet[]) ?? []);
    setEffects((effectsResult.data as ActiveEffect[]) ?? []);
    setInventoryItems((inventoryResult.data as InventoryItem[]) ?? []);
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
    setDialog({
      type: "hp",
      title: "Ajustar vida do player",
      label: `Novo HP de ${displayProfileName(targetProfile)}. Use atual/max, exemplo: 40/40`,
      targetProfile,
      currentValue: `${sheet.current_hp}/${sheet.max_hp}`,
      sheet,
    });
    setDialogValue(`${sheet.current_hp}/${sheet.max_hp}`);
  }

  async function adjustBalance(targetProfile: Profile, wallet: Wallet) {
    setDialog({
      type: "balance",
      title: "Ajustar dinheiro do player",
      label: `Novo dinheiro de ${displayProfileName(targetProfile)}`,
      targetProfile,
      currentValue: `$${Number(wallet.balance)}`,
      wallet,
    });
    setDialogValue(String(wallet.balance));
  }

  async function submitDialog() {
    if (!user) return;
    if (!dialog) return;

    if (dialog.type === "hp" && dialog.sheet) {
      const [currentRaw, maxRaw] = dialogValue.split("/").map((part) => part.trim());
      const nextCurrentHp = Number(currentRaw);
      const nextMaxHp = maxRaw === undefined || maxRaw === "" ? dialog.sheet.max_hp : Number(maxRaw);

      if (Number.isNaN(nextCurrentHp) || Number.isNaN(nextMaxHp)) {
        setMessage("Digite o HP em formato válido. Exemplo: 40/40 ou 70.");
        return;
      }

      await supabase
        .from("character_sheets")
        .update({ current_hp: nextCurrentHp, max_hp: nextMaxHp })
        .eq("id", dialog.sheet.id);
      await createAuditLog({
        user_id: dialog.targetProfile.id,
        actor_id: user.id,
        action: "master_hp_adjusted",
        entity_type: "character_sheet",
        entity_id: dialog.sheet.id,
        old_value: { current_hp: dialog.sheet.current_hp, max_hp: dialog.sheet.max_hp },
        new_value: { current_hp: nextCurrentHp, max_hp: nextMaxHp },
        description: `Mestre ajustou HP de ${dialog.targetProfile.username} de ${dialog.sheet.current_hp}/${dialog.sheet.max_hp} para ${nextCurrentHp}/${nextMaxHp}.`,
      });
    }

    if (dialog.type === "balance" && dialog.wallet) {
      const nextValue = Number(dialogValue);
      if (Number.isNaN(nextValue)) {
        setMessage("Digite um número válido.");
        return;
      }

      await supabase.from("wallets").update({ balance: nextValue }).eq("id", dialog.wallet.id);
      await supabase.from("transactions").insert({
        user_id: dialog.targetProfile.id,
        type: "master_adjustment",
        amount: nextValue - Number(dialog.wallet.balance),
        description: `Ajuste do Mestre: dinheiro alterado para $${nextValue}.`,
      });
      await createAuditLog({
        user_id: dialog.targetProfile.id,
        actor_id: user.id,
        action: "master_balance_adjusted",
        entity_type: "wallet",
        entity_id: dialog.wallet.id,
        old_value: { balance: dialog.wallet.balance },
        new_value: { balance: nextValue },
        description: `Mestre ajustou dinheiro de ${dialog.targetProfile.username} de $${dialog.wallet.balance} para $${nextValue}.`,
      });
    }

    setDialog(null);
    setDialogValue("");
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
        <p className="mt-3 text-slate-300">O card e as funções administrativas ficam ocultos no modo público.</p>
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
          Entre pelo botão Login usando o usuário mestre. O Modo Mestre libera a interface, mas o Supabase ainda exige uma conta master para editar dados de todos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {dialog ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-red-300/35 bg-[#140407] p-6 shadow-[0_0_70px_rgba(239,68,68,0.28)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-red-300">Painel do Mestre</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">{dialog.title}</h2>
            <p className="mt-2 text-sm text-slate-300">
              Valor atual: <strong className="text-red-100">{dialog.currentValue}</strong>
            </p>
            <label className="mt-5 grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.24em] text-red-200">{dialog.label}</span>
              <input
                autoFocus
                type="text"
                inputMode={dialog.type === "hp" ? "text" : "decimal"}
                value={dialogValue}
                onChange={(event) => setDialogValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void submitDialog();
                  if (event.key === "Escape") setDialog(null);
                }}
                className="rounded-2xl border border-red-200/30 bg-black/50 px-4 py-3 text-xl font-black text-white outline-none transition focus:border-red-200 focus:shadow-[0_0_28px_rgba(248,113,113,0.2)]"
              />
            </label>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDialog(null)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={() => void submitDialog()}
                className="rounded-2xl border border-red-300/50 bg-red-500/20 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-50 shadow-[0_0_28px_rgba(239,68,68,0.18)] transition hover:bg-red-500/30"
              >
                Confirmar ajuste
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {message ? <p className="rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-red-100">{message}</p> : null}
      <MasterWorldAlertPanel />
      <CollapsibleMasterCard
        eyebrow="Hangar Atlas"
        title="Status dos Jaegers"
        subtitle="Atualize dano, integridade, partes arrancadas e funções afetadas dos Jaegers visíveis para os players."
      >
        <MasterJaegerStatusPanel masterProfile={profile} />
      </CollapsibleMasterCard>
      <CollapsibleMasterCard
        eyebrow="Arsenal narrativo"
        title="Criação de Itens"
        subtitle="Crie, edite, estoque e envie itens personalizados apenas quando precisar abrir esse menu."
      >
        <MasterItemCreatorPanel masterProfile={profile} players={profiles.filter((item) => item.id !== profile.id)} onChanged={loadAll} />
      </CollapsibleMasterCard>
      <CollapsibleMasterCard
        eyebrow="Dossiê Omega"
        title="Informações do Mestre"
        subtitle="Leia, filtre e navegue pela lore completa do RPG sem sair do painel. O texto original entra aqui sem resumo."
        defaultOpen
      >
        <MasterLorePanel />
      </CollapsibleMasterCard>
      <CollapsibleMasterCard
        eyebrow="Controle de players"
        title="Players"
        subtitle="Abra para ajustar HP, dinheiro, inventário e efeitos ativos de cada player."
      >
        <section className="grid gap-4 xl:grid-cols-2">
          {profiles
            .filter((item) => item.role === "player")
            .map((item) => (
              <MasterPlayerPanel
                key={item.id}
                profile={item}
                sheet={sheets.find((sheet) => sheet.user_id === item.id)}
                wallet={wallets.find((wallet) => wallet.user_id === item.id)}
                effects={effects.filter((effect) => effect.user_id === item.id && effect.effect_type !== "message")}
                inventory={inventoryItems.filter((inventoryItem) => inventoryItem.user_id === item.id)}
                onAdjustHp={adjustHp}
                onAdjustBalance={adjustBalance}
                onEndEffect={endEffect}
              />
            ))}
        </section>
      </CollapsibleMasterCard>
      <section className="rounded-2xl border border-red-400/30 bg-red-950/15 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-300">Terminal de auditoria</p>
            <h2 className="mt-1 text-2xl font-black uppercase text-white">Logs precisos da campanha</h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-200">{logs.length} registros recentes</p>
        </div>
        <div className="mt-4 space-y-3">
          {logs.length ? (
            logs.map((log) => {
              const targetProfile = profiles.find((item) => item.id === log.user_id);
              const actorProfile = profiles.find((item) => item.id === log.actor_id);
              const auditKeys = getAuditDisplayKeys(log.old_value, log.new_value);
              return (
                <div key={log.id} className="rounded-xl border border-white/10 bg-black/35 p-4 shadow-[0_0_24px_rgba(239,68,68,0.08)]">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-300">
                        {actionLabels[log.action] ?? log.action}
                      </p>
                      <p className="mt-2 text-sm font-bold text-slate-100">{log.description}</p>
                    </div>
                    <p className="shrink-0 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-red-100">
                      {formatAuditTime(log.created_at)}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-lg border border-white/10 bg-slate-950/70 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Player afetado</p>
                      <p className="mt-1 text-sm font-bold text-white">{displayProfileName(targetProfile)}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-slate-950/70 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Autor</p>
                      <p className="mt-1 text-sm font-bold text-white">{displayProfileName(actorProfile)}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-slate-950/70 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Área</p>
                      <p className="mt-1 text-sm font-bold text-white">{entityLabels[log.entity_type] ?? log.entity_type}</p>
                    </div>
                  </div>

                  {(log.old_value || log.new_value) ? (
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-amber-300/15 bg-amber-950/10 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200/80">Antes</p>
                        <p className="mt-1 break-words font-mono text-xs text-amber-50/80">{formatAuditValue(log.old_value, auditKeys)}</p>
                      </div>
                      <div className="rounded-lg border border-emerald-300/15 bg-emerald-950/10 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/80">Depois</p>
                        <p className="mt-1 break-words font-mono text-xs text-emerald-50/80">{formatAuditValue(log.new_value, auditKeys)}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
              Nenhum log encontrado ainda. Compras, usos de itens, edições de ficha e ajustes do mestre vão aparecer aqui.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
