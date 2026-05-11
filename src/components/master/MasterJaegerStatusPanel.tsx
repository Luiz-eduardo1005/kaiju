"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { JaegerDiagnostic } from "@/components/jaegers/JaegerDiagnostic";
import { jaegers } from "@/data";
import { JAEGER_PARTS, JAEGER_STATUS_OPTIONS, mergeJaegerStatuses } from "@/lib/game/jaegerDiagnostics";
import { createAuditLog } from "@/lib/game/auditLog";
import { supabase } from "@/lib/supabase";
import type { JaegerPartState, JaegerPartStatus, Profile } from "@/types/game";

type MasterJaegerStatusPanelProps = {
  masterProfile: Profile;
};

const editableJaegers = jaegers;

export function MasterJaegerStatusPanel({ masterProfile }: MasterJaegerStatusPanelProps) {
  const [jaegerId, setJaegerId] = useState(editableJaegers[0]?.id ?? "");
  const [statuses, setStatuses] = useState<JaegerPartStatus[]>([]);
  const [selectedPartId, setSelectedPartId] = useState("chest");
  const [status, setStatus] = useState<JaegerPartState>("operational");
  const [integrity, setIntegrity] = useState("100");
  const [note, setNote] = useState("");
  const [equipmentNote, setEquipmentNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const selectedJaeger = editableJaegers.find((jaeger) => jaeger.id === jaegerId) ?? editableJaegers[0];
  const mergedStatuses = useMemo(() => mergeJaegerStatuses(jaegerId, statuses), [jaegerId, statuses]);
  const selectedPart = JAEGER_PARTS.find((part) => part.id === selectedPartId) ?? JAEGER_PARTS[0];
  const selectedStatusOption = JAEGER_STATUS_OPTIONS.find((option) => option.id === status) ?? JAEGER_STATUS_OPTIONS[0];

  const loadStatuses = useCallback(async (nextJaegerId = jaegerId) => {
    const { data, error } = await supabase.from("jaeger_part_statuses").select("*").eq("jaeger_id", nextJaegerId);
    if (error) {
      setMessage("Tabela de status dos Jaegers ainda não encontrada. Rode o SQL do sistema de status dos Jaegers.");
      setStatuses([]);
      return;
    }
    setStatuses((data as JaegerPartStatus[]) ?? []);
  }, [jaegerId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStatuses(jaegerId);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [jaegerId, loadStatuses]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const current = mergedStatuses.find((part) => part.part_id === selectedPartId);
      if (!current) return;
      setStatus(current.status);
      setIntegrity(String(current.integrity));
      setNote(current.note ?? "");
      setEquipmentNote(current.equipment_note ?? "");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [mergedStatuses, selectedPartId]);

  async function savePartStatus() {
    const nextIntegrity = Math.max(0, Math.min(100, Number(integrity)));
    if (Number.isNaN(nextIntegrity)) {
      setMessage("Integridade precisa ser um número de 0 a 100.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const payload = {
        jaeger_id: jaegerId,
        part_id: selectedPartId,
        status,
        integrity: nextIntegrity,
        note: note.trim() || null,
        equipment_note: equipmentNote.trim() || null,
        updated_by: masterProfile.id,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("jaeger_part_statuses").upsert(payload, { onConflict: "jaeger_id,part_id" });
      if (error) throw error;

      await createAuditLog({
        user_id: null,
        actor_id: masterProfile.id,
        action: "jaeger_status_updated",
        entity_type: "jaeger_status",
        entity_id: `${jaegerId}:${selectedPartId}`,
        old_value: null,
        new_value: payload,
        description: `Mestre atualizou ${selectedPart.label} de ${selectedJaeger.nome}.`,
      });

      setMessage("Status do Jaeger atualizado.");
      await loadStatuses(jaegerId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao salvar status do Jaeger.");
    } finally {
      setBusy(false);
    }
  }

  if (!selectedJaeger) {
    return (
      <section className="rounded-[1.75rem] border border-red-300/20 bg-black/35 p-4 text-sm leading-6 text-red-100">
        Nenhum Jaeger cadastrado no hangar para edição de status.
      </section>
    );
  }

  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-[1.75rem] border border-red-300/20 bg-black/35 p-4">
        <div className="mb-4 rounded-2xl border border-red-200/15 bg-red-950/20 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-200/80">Controle de hangar</p>
          <h3 className="mt-2 text-xl font-black uppercase text-white">{selectedJaeger.nome}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Escolha uma parte, defina o estado dela e escreva o dano que os players podem ver. Se marcar como arrancado, a peça se separa visualmente no diagnóstico.
          </p>
        </div>

        <div className="grid min-w-0 gap-4 xl:grid-cols-[0.85fr_1fr_1fr]">
          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-red-200">Jaeger</span>
            <select
              value={jaegerId}
              onChange={(event) => {
                setJaegerId(event.target.value);
                setSelectedPartId("chest");
              }}
              className="w-full min-w-0 rounded-2xl border border-red-200/25 bg-black/60 px-4 py-3 text-white outline-none"
            >
              {editableJaegers.map((jaeger) => (
                <option key={jaeger.id} value={jaeger.id}>
                  {jaeger.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-red-200">Parte selecionada</span>
            <select
              value={selectedPartId}
              onChange={(event) => setSelectedPartId(event.target.value)}
              className="w-full min-w-0 rounded-2xl border border-red-200/25 bg-black/60 px-4 py-3 text-white outline-none"
            >
              {JAEGER_PARTS.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-red-200">Estado</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as JaegerPartState)}
              className="w-full min-w-0 rounded-2xl border border-red-200/25 bg-black/60 px-4 py-3 text-white outline-none"
            >
              {JAEGER_STATUS_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="rounded-xl border border-red-200/10 bg-black/30 px-3 py-2 text-xs leading-5 text-slate-300">
              {selectedStatusOption.color}: {selectedStatusOption.summary}
            </span>
          </label>
        </div>

        <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[0.38fr_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-red-200">Integridade %</span>
            <input
              type="number"
              min={0}
              max={100}
              value={integrity}
              onChange={(event) => setIntegrity(event.target.value)}
              className="w-full min-w-0 rounded-2xl border border-red-200/25 bg-black/60 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-red-200">Dano / observação pública</span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ex: blindagem trincada, hidráulica falhando..."
              className="w-full min-w-0 rounded-2xl border border-red-200/25 bg-black/60 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-red-200">Função ou equipamento afetado</span>
            <input
              value={equipmentNote}
              onChange={(event) => setEquipmentNote(event.target.value)}
              placeholder="Ex: lança-mísseis não abre, sensores instáveis..."
              className="w-full min-w-0 rounded-2xl border border-red-200/25 bg-black/60 px-4 py-3 text-white outline-none"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <p className="rounded-2xl border border-red-200/10 bg-black/25 p-3 text-sm leading-6 text-slate-300">
            Dica: você também pode clicar direto no boneco abaixo para selecionar a parte do Jaeger.
          </p>
          <button
            type="button"
            onClick={() => void savePartStatus()}
            disabled={busy}
            className="w-full rounded-2xl border border-red-300/50 bg-red-500/20 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-red-50 transition hover:bg-red-500/30 disabled:opacity-50 lg:w-auto"
          >
            {busy ? "Salvando..." : "Salvar status"}
          </button>
        </div>

        {message ? <p className="mt-4 rounded-xl border border-red-300/25 bg-red-500/10 p-3 text-sm text-red-100">{message}</p> : null}
      </div>

      <JaegerDiagnostic
        jaegerId={selectedJaeger.id}
        jaegerName={selectedJaeger.nome}
        statuses={mergedStatuses}
        selectedPartId={selectedPartId}
        onSelectPart={setSelectedPartId}
        interactive
      />
    </section>
  );
}
