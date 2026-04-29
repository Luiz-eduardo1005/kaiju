"use client";

import { useEffect, useState } from "react";
import { JaegerDiagnostic } from "@/components/jaegers/JaegerDiagnostic";
import { supabase } from "@/lib/supabase";
import type { JaegerPartStatus } from "@/types/game";

type JaegerDiagnosticLoaderProps = {
  jaegerId: string;
  jaegerName: string;
};

export function JaegerDiagnosticLoader({ jaegerId, jaegerName }: JaegerDiagnosticLoaderProps) {
  const [statuses, setStatuses] = useState<JaegerPartStatus[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string>();
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase
      .from("jaeger_part_statuses")
      .select("*")
      .eq("jaeger_id", jaegerId)
      .then(({ data, error }) => {
        if (error) {
          setMessage("Diagnóstico usando estado padrão. Rode o SQL dos Jaegers no Supabase para salvar alterações do mestre.");
          return;
        }
        setStatuses((data as JaegerPartStatus[]) ?? []);
      });
  }, [jaegerId]);

  return (
    <div className="mt-6">
      {message ? <p className="mb-4 rounded-xl border border-amber-300/25 bg-amber-500/10 p-3 text-sm text-amber-100">{message}</p> : null}
      <JaegerDiagnostic
        jaegerId={jaegerId}
        jaegerName={jaegerName}
        statuses={statuses}
        selectedPartId={selectedPartId}
        onSelectPart={setSelectedPartId}
        interactive
      />
    </div>
  );
}
