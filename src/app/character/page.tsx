"use client";

import { useEffect, useState } from "react";
import { ActiveEffectsPanel } from "@/components/effects/ActiveEffectsPanel";
import { LoginRequired } from "@/components/game/login-required";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/game/auditLog";
import { calculateFinalStats, updateActiveEffects } from "@/lib/game/effects";
import { bootstrapPlayer } from "@/lib/game/profile";
import type { ActiveEffect, CharacterSheet, Profile, StatKey } from "@/types/game";

const statFields: { key: StatKey; label: string; description: string }[] = [
  {
    key: "strength",
    label: "FORÇA",
    description: "Usar para levantar peso, combate físico, segurar impacto e mover objetos pesados.",
  },
  {
    key: "agility",
    label: "AGILIDADE",
    description: "Usar para desviar, correr, reagir rápido, equilíbrio e movimentos precisos.",
  },
  {
    key: "constitution",
    label: "CONSTITUIÇÃO",
    description: "Usar para resistir dano, não desmaiar, aguentar dor, fadiga e impactos.",
  },
  {
    key: "mind",
    label: "MENTE",
    description: "Usar para estratégia, percepção, interpretação de situações e tomada de decisão.",
  },
  {
    key: "willpower",
    label: "VONTADE",
    description: "Usar para resistir medo, manter controle emocional, suportar pressão e não entrar em pânico.",
  },
  {
    key: "technique",
    label: "DRIFT",
    description: "Usar para conexão neural, pilotar Jaeger, sincronizar com parceiro e resistir ao colapso mental.",
  },
];

const sheetFieldLabels: Partial<Record<keyof CharacterSheet, string>> = {
  character_name: "Nome",
  age: "Idade",
  background: "Background",
  current_hp: "Vida Atual",
  max_hp: "Vida Máxima",
  strength: "Força",
  agility: "Agilidade",
  constitution: "Constituição",
  mind: "Mente",
  willpower: "Vontade",
  technique: "Drift",
  notes: "Notas",
};

function getChangedSheetValues(oldSheet: CharacterSheet | null, newSheet: CharacterSheet) {
  if (!oldSheet) {
    return {
      oldValue: null,
      newValue: newSheet as unknown as Record<string, unknown>,
      labels: ["Ficha completa"],
    };
  }

  const oldValue: Record<string, unknown> = {};
  const newValue: Record<string, unknown> = {};
  const labels: string[] = [];

  for (const [field, label] of Object.entries(sheetFieldLabels) as [keyof CharacterSheet, string][]) {
    if (oldSheet[field] !== newSheet[field]) {
      oldValue[field] = oldSheet[field];
      newValue[field] = newSheet[field];
      labels.push(label);
    }
  }

  return { oldValue, newValue, labels };
}

export default function CharacterPage() {
  return (
    <PageShell eyebrow="Registro de personagem" title="Ficha" subtitle="Ficha editável do player, com logs automáticos para cada alteração.">
      <LoginRequired>
        <CharacterEditor />
      </LoginRequired>
    </PageShell>
  );
}

function CharacterEditor() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sheet, setSheet] = useState<CharacterSheet | null>(null);
  const [effects, setEffects] = useState<ActiveEffect[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [numberDrafts, setNumberDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    bootstrapPlayer(user)
      .then(async (data) => {
        setProfile(data.profile);
        setSheet(data.sheet);
        setEffects((await updateActiveEffects(user.id)).filter((effect) => effect.effect_type !== "message"));
      })
      .catch((error) => setMessage(error.message));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const interval = window.setInterval(() => {
      void updateActiveEffects(user.id).then((nextEffects) => setEffects(nextEffects.filter((effect) => effect.effect_type !== "message"))).catch((error) => setMessage(error.message));
    }, 30000);

    return () => window.clearInterval(interval);
  }, [user]);

  async function saveSheet() {
    if (!user || !profile || !sheet) return;
    setSaving(true);
    setMessage("");

    const { data: oldSheet } = await supabase.from("character_sheets").select("*").eq("id", sheet.id).single<CharacterSheet>();
    const changes = getChangedSheetValues(oldSheet ?? null, sheet);

    if (!changes.labels.length) {
      setSaving(false);
      setMessage("Nenhuma alteração detectada na ficha.");
      return;
    }

    const { error } = await supabase.from("character_sheets").update({ ...sheet, updated_at: new Date().toISOString() }).eq("id", sheet.id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    await createAuditLog({
      user_id: user.id,
      actor_id: user.id,
      action: changes.labels.length === 1 ? "character_stat_updated" : "character_sheet_updated",
      entity_type: "character_sheet",
      entity_id: sheet.id,
      old_value: changes.oldValue,
      new_value: changes.newValue,
      description: `${profile.display_name ?? profile.username} alterou ${changes.labels.join(", ")} na ficha.`,
    });

    setSaving(false);
    setMessage("Ficha salva e log registrada.");
  }

  if (!sheet) {
    return <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5 text-cyan-100">Carregando ficha...</div>;
  }

  function getNumberDraft(key: keyof CharacterSheet, fallback: number | null) {
    return numberDrafts[key] ?? String(fallback ?? "");
  }

  function updateNumberDraft(key: keyof CharacterSheet, value: string) {
    setNumberDrafts((current) => ({ ...current, [key]: value }));
    if (value.trim() === "") return;

    const nextValue = Number(value);
    if (!Number.isNaN(nextValue)) {
      setSheet((currentSheet) => (currentSheet ? { ...currentSheet, [key]: nextValue } : currentSheet));
    }
  }

  const finalStats = calculateFinalStats(sheet, effects);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Nome</span>
            <input className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={sheet.character_name ?? ""} onChange={(e) => setSheet({ ...sheet, character_name: e.target.value })} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Idade</span>
            <input type="number" className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={getNumberDraft("age", sheet.age)} onChange={(e) => updateNumberDraft("age", e.target.value)} />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Background</span>
            <textarea className="min-h-28 rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={sheet.background ?? ""} onChange={(e) => setSheet({ ...sheet, background: e.target.value })} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Vida Atual</span>
            <input type="number" className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={getNumberDraft("current_hp", sheet.current_hp)} onChange={(e) => updateNumberDraft("current_hp", e.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Vida Maxima</span>
            <input type="number" className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={getNumberDraft("max_hp", sheet.max_hp)} onChange={(e) => updateNumberDraft("max_hp", e.target.value)} />
          </label>
          {statFields.map((field) => (
            <label key={field.key} className="grid gap-2 rounded-2xl border border-cyan-300/10 bg-black/20 p-3">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                {field.label}
                {finalStats[field.key].positive ? <span className="ml-2 text-emerald-300">+{finalStats[field.key].positive}</span> : null}
                {finalStats[field.key].negative ? <span className="ml-2 text-red-300">{finalStats[field.key].negative}</span> : null}
                {finalStats[field.key].positive || finalStats[field.key].negative ? (
                  <span className="ml-2 text-white">= {finalStats[field.key].final}</span>
                ) : null}
              </span>
              <span className="text-xs leading-5 text-slate-400">{field.description}</span>
              <input type="number" className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={getNumberDraft(field.key, sheet[field.key])} onChange={(e) => updateNumberDraft(field.key, e.target.value)} />
            </label>
          ))}
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Notas</span>
            <textarea className="min-h-28 rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={sheet.notes ?? ""} onChange={(e) => setSheet({ ...sheet, notes: e.target.value })} />
          </label>
        </div>
        <button onClick={saveSheet} disabled={saving} className="mt-5 rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-cyan-50">
          {saving ? "Salvando..." : "Salvar ficha"}
        </button>
        {message ? <p className="mt-4 text-sm text-cyan-100">{message}</p> : null}
      </section>
      <ActiveEffectsPanel effects={effects} />
    </div>
  );
}
