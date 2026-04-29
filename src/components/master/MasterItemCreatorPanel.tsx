"use client";

import { useEffect, useState } from "react";
import {
  createCustomItem,
  deleteCustomItem,
  duplicateCustomItem,
  listMasterInventory,
  sendMasterItemToPlayer,
  updateCustomItem,
  type CustomItemFormInput,
} from "@/lib/game/customItems";
import {
  AVAILABLE_ATTRIBUTES,
  AVAILABLE_CONDITIONS,
  AVAILABLE_EFFECT_TYPES,
  AVAILABLE_ITEM_TYPES,
  AVAILABLE_RESOURCES,
  createEmptyItemEffect,
  effectSummary,
  effectUsesField,
  sanitizeEffects,
} from "@/lib/game/itemEffectCatalog";
import type { CustomItem, CustomItemEffect, MasterInventoryWithItem, Profile } from "@/types/game";
import { CUSTOM_ITEM_CATEGORIES, CUSTOM_ITEM_RARITIES } from "@/types/game";

function FieldHelp({ children }: { children: React.ReactNode }) {
  return <span className="block text-[11px] leading-5 text-slate-400">{children}</span>;
}

function FieldLabel({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{label}</span>
      {children}
      {help ? <FieldHelp>{help}</FieldHelp> : null}
    </label>
  );
}

const emptyForm: CustomItemFormInput = {
  name: "",
  item_type: "Consumivel",
  category: "Consumivel",
  rarity: "Comum",
  description: "",
  mechanical_effect: "",
  effects: [],
  bonus_stat: "",
  bonus_value: null,
  duration_type: "Permanente",
  price: null,
  weight: null,
  quantity: 1,
  visible_to_player: true,
  master_only: false,
  secret_notes: "",
};

function rarityClass(rarity?: string | null) {
  if (rarity === "Classificado") return "border-red-300/50 bg-red-950/25 shadow-[0_0_35px_rgba(239,68,68,0.16)]";
  if (rarity === "Experimental") return "border-cyan-300/45 bg-cyan-950/20";
  if (rarity === "Lendário" || rarity === "Lendario" || rarity === "Épico" || rarity === "Epico") return "border-amber-300/45 bg-amber-950/15";
  return "border-white/10 bg-black/30";
}

function numberOrNull(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function numberOrDefault(value: string, fallback: number) {
  if (value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function formFromItem(item: CustomItem, quantity: number): CustomItemFormInput {
  return {
    name: item.name,
    item_type: item.item_type ?? "Consumivel",
    category: item.category,
    rarity: item.rarity,
    description: item.description ?? "",
    mechanical_effect: item.mechanical_effect ?? "",
    effects: item.effects ?? [],
    bonus_stat: item.bonus_stat ?? "",
    bonus_value: item.bonus_value,
    duration_type: item.duration_type ?? "Permanente",
    price: item.price,
    weight: item.weight,
    quantity,
    visible_to_player: item.visible_to_player,
    master_only: item.master_only,
    secret_notes: item.secret_notes ?? "",
  };
}

export function MasterItemCreatorPanel({
  masterProfile,
  players,
  onChanged,
}: {
  masterProfile: Profile;
  players: Profile[];
  onChanged?: () => Promise<void> | void;
}) {
  const [entries, setEntries] = useState<MasterInventoryWithItem[]>([]);
  const [form, setForm] = useState<CustomItemFormInput>(emptyForm);
  const [effectDraft, setEffectDraft] = useState<CustomItemEffect>(createEmptyItemEffect());
  const [editing, setEditing] = useState<MasterInventoryWithItem | null>(null);
  const [sendEntry, setSendEntry] = useState<MasterInventoryWithItem | null>(null);
  const [targetPlayerId, setTargetPlayerId] = useState("");
  const [sendQuantity, setSendQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setEntries(await listMasterInventory());
  }

  useEffect(() => {
    void load().catch((error) => setMessage(error.message));
  }, []);

  function updateField<K extends keyof CustomItemFormInput>(key: K, value: CustomItemFormInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateEffect<K extends keyof CustomItemEffect>(key: K, value: CustomItemEffect[K]) {
    setEffectDraft((current) => ({ ...current, [key]: value }));
  }

  function addEffect() {
    try {
      const [effect] = sanitizeEffects([effectDraft]);
      setForm((current) => ({ ...current, effects: [...current.effects, effect] }));
      setEffectDraft(createEmptyItemEffect());
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Efeito inválido.");
    }
  }

  function removeEffect(effectId: string) {
    setForm((current) => ({ ...current, effects: current.effects.filter((effect) => effect.id !== effectId) }));
  }

  async function submitForm() {
    setBusy(true);
    setMessage("");
    try {
      if (editing?.custom_items) {
        await updateCustomItem(masterProfile, editing.custom_items.id, form, editing.custom_items);
        setMessage("Item editado no inventário do mestre.");
      } else {
        await createCustomItem(masterProfile, form);
        setMessage("Item criado e adicionado ao inventário do mestre.");
      }
      setForm(emptyForm);
      setEditing(null);
      await load();
      await onChanged?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao salvar item.");
    } finally {
      setBusy(false);
    }
  }

  async function duplicate(entry: MasterInventoryWithItem) {
    if (!entry.custom_items) return;
    setBusy(true);
    setMessage("");
    try {
      await duplicateCustomItem(masterProfile, entry.custom_items, entry.quantity);
      await load();
      await onChanged?.();
      setMessage("Item duplicado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao duplicar item.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(entry: MasterInventoryWithItem) {
    setBusy(true);
    setMessage("");
    try {
      await deleteCustomItem(masterProfile, entry);
      await load();
      await onChanged?.();
      setMessage("Item removido do inventário do mestre.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao deletar item.");
    } finally {
      setBusy(false);
    }
  }

  async function sendToPlayer() {
    if (!sendEntry) return;
    const target = players.find((player) => player.id === targetPlayerId);
    const quantity = Number(sendQuantity);
    if (!target) {
      setMessage("Escolha um player.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      await sendMasterItemToPlayer(masterProfile, sendEntry, target, quantity);
      setSendEntry(null);
      setTargetPlayerId("");
      setSendQuantity("1");
      await load();
      await onChanged?.();
      setMessage("Item enviado para o player.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao enviar item.");
    } finally {
      setBusy(false);
    }
  }

  const draftDefinition = AVAILABLE_EFFECT_TYPES.find((effect) => effect.id === effectDraft.type);

  return (
    <section className="rounded-[2rem] border border-red-400/35 bg-[#130306]/90 p-5 shadow-[0_0_50px_rgba(239,68,68,0.12)]">
      {sendEntry ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-red-300/35 bg-[#140407] p-6 shadow-[0_0_70px_rgba(239,68,68,0.28)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-red-300">Distribuição do mestre</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">Enviar {sendEntry.custom_items?.name}</h2>
            <div className="mt-5 grid gap-3">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-red-200">Player</span>
                <select value={targetPlayerId} onChange={(event) => setTargetPlayerId(event.target.value)} className="rounded-2xl border border-red-200/25 bg-black/50 px-4 py-3 text-white outline-none">
                  <option value="">Escolher player</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>{player.display_name || player.username}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-red-200">Quantidade</span>
                <input value={sendQuantity} onChange={(event) => setSendQuantity(event.target.value)} type="number" min="1" max={sendEntry.quantity} className="rounded-2xl border border-red-200/25 bg-black/50 px-4 py-3 text-white outline-none" />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button onClick={() => setSendEntry(null)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-200">Cancelar</button>
              <button disabled={busy} onClick={() => void sendToPlayer()} className="rounded-xl border border-red-300/50 bg-red-500/20 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-50 disabled:opacity-50">Confirmar envio</button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-red-300">Arsenal narrativo</p>
          <h2 className="mt-1 text-2xl font-black uppercase text-white">Criação de Itens</h2>
          <p className="mt-2 text-sm text-slate-300">Crie itens com efeitos reais para HP, buffs, debuffs e equipamentos.</p>
        </div>
        {editing ? (
          <button
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-200"
          >
            Cancelar edição
          </button>
        ) : null}
      </div>

      {message ? <p className="mt-4 rounded-xl border border-red-300/25 bg-red-500/10 p-3 text-sm text-red-50">{message}</p> : null}

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1.15fr]">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="grid gap-3">
            <FieldLabel label="Nome do item" help="Exemplo: Bebida Energética, Kit Médico Pesado, Bota de Evacuação.">
              <input placeholder="Digite o nome que o player vai ver" value={form.name} onChange={(event) => updateField("name", event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-red-300/50" />
            </FieldLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              <FieldLabel label="Tipo" help="Define o botão: consumível usa, equipável equipa.">
                <select value={form.item_type} onChange={(event) => updateField("item_type", event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
                  {AVAILABLE_ITEM_TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                </select>
              </FieldLabel>
              <FieldLabel label="Categoria" help="Organiza o item no inventário e nos logs.">
                <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
                  {CUSTOM_ITEM_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                </select>
              </FieldLabel>
              <FieldLabel label="Raridade" help="Muda destaque visual; classificado fica mais restrito.">
                <select value={form.rarity} onChange={(event) => updateField("rarity", event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
                  {CUSTOM_ITEM_RARITIES.map((rarity) => <option key={rarity}>{rarity}</option>)}
                </select>
              </FieldLabel>
            </div>
            <FieldLabel label="Descrição visível" help="Texto narrativo que aparece para o player no inventário.">
              <textarea placeholder="Descreva o item em linguagem de jogo" value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={3} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
            </FieldLabel>
            <FieldLabel label="Regra narrativa" help="Opcional. Use para observações do mestre ou regra que não vira número automático.">
              <textarea placeholder="Exemplo: só funciona em área contaminada leve" value={form.mechanical_effect} onChange={(event) => updateField("mechanical_effect", event.target.value)} rows={2} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
            </FieldLabel>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-950/10 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-200">Efeitos funcionais</p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                Aqui fica o que muda a ficha de verdade. Escolha o tipo do efeito, preencha os campos que aparecem e clique em Adicionar efeito.
              </p>
              <div className="mt-3 grid gap-3">
                <FieldLabel label="Tipo de efeito" help="Recuperar recurso cura HP/fadiga. Buff temporário aparece na ficha por alguns minutos. Bônus equipado dura até desequipar.">
                  <select
                    value={effectDraft.type}
                    onChange={(event) => updateEffect("type", event.target.value as CustomItemEffect["type"])}
                    className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  >
                    {AVAILABLE_EFFECT_TYPES.map((effect) => <option key={effect.id} value={effect.id}>{effect.label}</option>)}
                  </select>
                </FieldLabel>
                <FieldLabel label="Nome curto do efeito" help="Opcional. Exemplo: Reflexos acelerados, Cura rápida, Peso instável.">
                  <input placeholder="Nome curto do efeito (opcional)" value={effectDraft.label ?? ""} onChange={(event) => updateEffect("label", event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                </FieldLabel>
                <div className="grid gap-3 sm:grid-cols-2">
                  {effectUsesField(effectDraft, "resource") ? (
                  <FieldLabel label="Recurso afetado" help="Escolha HP para curar/danar vida, ou fadiga para registrar energia/cansaço.">
                      <select value={effectDraft.resource ?? "hp"} onChange={(event) => updateEffect("resource", event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
                        {AVAILABLE_RESOURCES.map((resource) => <option key={resource.id} value={resource.id}>{resource.label}</option>)}
                      </select>
                    </FieldLabel>
                  ) : null}
                  {effectUsesField(effectDraft, "attribute") ? (
                    <FieldLabel label="Atributo afetado" help="Esse atributo vai aparecer na ficha com bônus verde ou debuff vermelho.">
                      <select value={effectDraft.attribute ?? "strength"} onChange={(event) => updateEffect("attribute", event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
                        {AVAILABLE_ATTRIBUTES.map((attribute) => <option key={attribute.id} value={attribute.id}>{attribute.label}</option>)}
                      </select>
                    </FieldLabel>
                  ) : null}
                  {effectUsesField(effectDraft, "condition") ? (
                    <FieldLabel label="Condição" help="Condições são marcadores narrativos, como contaminado ou atordoado.">
                      <select value={effectDraft.condition ?? "ferido"} onChange={(event) => updateEffect("condition", event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
                        {AVAILABLE_CONDITIONS.map((condition) => <option key={condition.id} value={condition.id}>{condition.label}</option>)}
                      </select>
                    </FieldLabel>
                  ) : null}
                  {effectUsesField(effectDraft, "value") ? (
                    <FieldLabel label="Valor" help="Quanto cura, causa dano ou muda atributo. Exemplo: 5 para +5 Agilidade.">
                      <input placeholder="Valor do efeito" value={effectDraft.value ?? ""} onChange={(event) => updateEffect("value", numberOrNull(event.target.value))} type="number" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                    </FieldLabel>
                  ) : null}
                  {effectUsesField(effectDraft, "duration") ? (
                    <FieldLabel label="Duração" help="Tempo em minutos. Exemplo: 10 vira 10:00 nos efeitos ativos.">
                      <input placeholder="Duração em minutos" value={Math.round(Number(effectDraft.duration ?? 0) / 60) || ""} onChange={(event) => updateEffect("duration", numberOrDefault(event.target.value, 0) * 60)} type="number" min="1" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                    </FieldLabel>
                  ) : null}
                  {effectUsesField(effectDraft, "messageDuration") ? (
                    <FieldLabel label="Duração da mensagem" help="Quanto tempo uma nota temporária fica visível, quando o efeito for narrativo.">
                      <input placeholder="Mensagem em minutos" value={Math.round(Number(effectDraft.messageDuration ?? 0) / 60) || ""} onChange={(event) => updateEffect("messageDuration", numberOrDefault(event.target.value, 0) * 60)} type="number" min="1" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                    </FieldLabel>
                  ) : null}
                </div>
                <button onClick={addEffect} className="rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.25em] text-cyan-50 transition hover:bg-cyan-300/20">
                  Adicionar efeito
                </button>
                {draftDefinition ? <p className="text-xs text-cyan-100/80">Efeito selecionado agora: {draftDefinition.label}. Ele só entra no item depois de clicar em Adicionar efeito.</p> : null}
                {form.effects.length ? (
                  <div className="grid gap-2">
                    {form.effects.map((effect) => (
                      <div key={effect.id} className="flex items-center justify-between gap-3 rounded-xl border border-cyan-300/15 bg-black/30 p-3 text-sm text-cyan-50">
                        <span>{effectSummary(effect)}</span>
                        <button onClick={() => removeEffect(effect.id)} className="rounded-lg border border-red-300/30 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-100">Remover</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Sem efeito funcional ainda. O item ainda pode ser narrativo.</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <FieldLabel label="Preço" help="Valor em dólar, se for vendido ou usado em troca.">
                <input placeholder="Preço em $" value={form.price ?? ""} onChange={(event) => updateField("price", numberOrNull(event.target.value))} type="number" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              </FieldLabel>
              <FieldLabel label="Peso" help="Opcional. Serve para controle narrativo de carga.">
                <input placeholder="Peso narrativo" value={form.weight ?? ""} onChange={(event) => updateField("weight", numberOrNull(event.target.value))} type="number" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              </FieldLabel>
              <FieldLabel label="Quantidade criada" help="Quantas unidades entram no inventário do mestre.">
                <input placeholder="Quantidade" value={form.quantity === 0 ? "" : form.quantity} onChange={(event) => updateField("quantity", Math.max(0, Number(event.target.value) || 0))} type="number" className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              </FieldLabel>
            </div>
            <div className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3 py-2">
                <input type="checkbox" checked={form.visible_to_player} onChange={(event) => updateField("visible_to_player", event.target.checked)} />
                Visível para player
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3 py-2">
                <input type="checkbox" checked={form.master_only} onChange={(event) => updateField("master_only", event.target.checked)} />
                Só mestre / classificado
              </label>
            </div>
            <textarea placeholder="Observações secretas do mestre" value={form.secret_notes} onChange={(event) => updateField("secret_notes", event.target.value)} rows={2} className="rounded-xl border border-red-300/20 bg-red-950/10 px-4 py-3 text-white outline-none" />
            <button disabled={busy} onClick={() => void submitForm()} className="rounded-xl border border-red-300/50 bg-red-500/20 px-4 py-3 text-xs font-black uppercase tracking-[0.25em] text-red-50 transition hover:bg-red-500/30 disabled:opacity-50">
              {editing ? "Salvar alterações" : "Criar item"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-red-200">Inventário do Mestre</p>
          {entries.length ? entries.map((entry) => {
            const item = entry.custom_items;
            if (!item) return null;
            return (
              <article key={entry.id} className={`rounded-2xl border p-4 ${rarityClass(item.rarity)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-200">{item.item_type ?? "Item"} / {item.category} / {item.rarity}</p>
                    <h3 className="mt-1 text-xl font-black uppercase text-white">{item.name}</h3>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Qtd</p>
                    <p className="text-xl font-black text-white">{entry.quantity}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.description || "Sem descrição pública."}</p>
                {item.effects?.length ? (
                  <div className="mt-3 grid gap-2">
                    {item.effects.map((effect) => <p key={effect.id} className="rounded-xl border border-cyan-300/15 bg-cyan-950/10 p-2 text-xs text-cyan-100">{effectSummary(effect)}</p>)}
                  </div>
                ) : null}
                {item.secret_notes ? <p className="mt-3 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-xs text-red-100">Notas secretas: {item.secret_notes}</p> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => setSendEntry(entry)} className="rounded-xl border border-red-300/40 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-100">Enviar</button>
                  <button onClick={() => { setEditing(entry); setForm(formFromItem(item, entry.quantity)); }} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200">Editar</button>
                  <button disabled={busy} onClick={() => void duplicate(entry)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 disabled:opacity-50">Duplicar</button>
                  <button disabled={busy} onClick={() => void remove(entry)} className="rounded-xl border border-red-300/20 bg-red-950/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-200 disabled:opacity-50">Deletar</button>
                </div>
              </article>
            );
          }) : (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-slate-300">Nenhum item criado ainda.</div>
          )}
        </div>
      </div>
    </section>
  );
}
