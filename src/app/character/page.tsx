"use client";

import { useEffect, useState } from "react";
import { ActiveEffectsPanel } from "@/components/effects/ActiveEffectsPanel";
import { LoginRequired } from "@/components/game/login-required";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/game/auditLog";
import { bootstrapPlayer } from "@/lib/game/profile";
import type { ActiveEffect, CharacterSheet, Profile, StatKey } from "@/types/game";

const statFields: { key: StatKey; label: string }[] = [
  { key: "strength", label: "Forca" },
  { key: "agility", label: "Agilidade" },
  { key: "constitution", label: "Constituicao" },
  { key: "mind", label: "Mente" },
  { key: "willpower", label: "Vontade" },
  { key: "technique", label: "Tecnica" },
  { key: "speed", label: "Velocidade" },
];

export default function CharacterPage() {
  return (
    <PageShell eyebrow="Registro de personagem" title="Ficha" subtitle="Ficha editavel do player, com logs automaticos para cada alteracao.">
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

  useEffect(() => {
    if (!user) return;
    bootstrapPlayer(user)
      .then(async (data) => {
        setProfile(data.profile);
        setSheet(data.sheet);
        const { data: effectData } = await supabase.from("active_effects").select("*").eq("user_id", user.id).eq("is_active", true);
        setEffects((effectData as ActiveEffect[]) ?? []);
      })
      .catch((error) => setMessage(error.message));
  }, [user]);

  async function saveSheet() {
    if (!user || !profile || !sheet) return;
    setSaving(true);
    setMessage("");

    const { data: oldSheet } = await supabase.from("character_sheets").select("*").eq("id", sheet.id).single<CharacterSheet>();
    const { error } = await supabase.from("character_sheets").update({ ...sheet, updated_at: new Date().toISOString() }).eq("id", sheet.id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    await createAuditLog({
      user_id: user.id,
      actor_id: user.id,
      action: "character_sheet_updated",
      entity_type: "character_sheet",
      entity_id: sheet.id,
      old_value: oldSheet ?? null,
      new_value: sheet,
      description: `${profile.display_name ?? profile.username} atualizou a ficha do personagem.`,
    });

    setSaving(false);
    setMessage("Ficha salva e log registrada.");
  }

  if (!sheet) {
    return <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-5 text-cyan-100">Carregando ficha...</div>;
  }

  const activeBonuses = effects.reduce<Record<string, number>>((acc, effect) => {
    if (effect.effect_stat && !effect.is_paused) acc[effect.effect_stat] = (acc[effect.effect_stat] ?? 0) + effect.effect_value;
    return acc;
  }, {});

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
            <input type="number" className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={sheet.age ?? 0} onChange={(e) => setSheet({ ...sheet, age: Number(e.target.value) })} />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Background</span>
            <textarea className="min-h-28 rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={sheet.background ?? ""} onChange={(e) => setSheet({ ...sheet, background: e.target.value })} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Vida Atual</span>
            <input type="number" className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={sheet.current_hp} onChange={(e) => setSheet({ ...sheet, current_hp: Number(e.target.value) })} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Vida Maxima</span>
            <input type="number" className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={sheet.max_hp} onChange={(e) => setSheet({ ...sheet, max_hp: Number(e.target.value) })} />
          </label>
          {statFields.map((field) => (
            <label key={field.key} className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                {field.label} {activeBonuses[field.key] ? `(+${activeBonuses[field.key]}) = ${sheet[field.key] + activeBonuses[field.key]}` : ""}
              </span>
              <input type="number" className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" value={sheet[field.key]} onChange={(e) => setSheet({ ...sheet, [field.key]: Number(e.target.value) })} />
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
