import type { JaegerPartState, JaegerPartStatus } from "@/types/game";

export type JaegerPartDefinition = {
  id: string;
  label: string;
  shortLabel: string;
  positionClass: string;
  calloutClass: string;
  detachedClass: string;
  clipPath: string;
  line: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
};

export const JAEGER_PARTS: JaegerPartDefinition[] = [
  {
    id: "head",
    label: "Cabeça / Sensores",
    shortLabel: "Cabeça",
    positionClass: "left-[44%] top-[6%] h-[10%] w-[12%]",
    calloutClass: "left-[5%] top-[6%]",
    detachedClass: "-translate-y-7 rotate-3",
    clipPath: "polygon(24% 0%, 76% 0%, 96% 25%, 88% 78%, 50% 100%, 12% 78%, 4% 25%)",
    line: { x1: 26, y1: 14, x2: 48, y2: 11 },
  },
  {
    id: "chest",
    label: "Peitoral / Blindagem",
    shortLabel: "Peitoral",
    positionClass: "left-[35%] top-[18%] h-[18%] w-[30%]",
    calloutClass: "right-[5%] top-[9%]",
    detachedClass: "translate-x-1 -translate-y-3",
    clipPath: "polygon(13% 0%, 87% 0%, 100% 34%, 78% 100%, 22% 100%, 0% 34%)",
    line: { x1: 74, y1: 18, x2: 58, y2: 26 },
  },
  {
    id: "core",
    label: "Torso / Reator",
    shortLabel: "Torso",
    positionClass: "left-[40%] top-[38%] h-[17%] w-[20%]",
    calloutClass: "right-[5%] top-[42%]",
    detachedClass: "translate-y-5 rotate-2",
    clipPath: "polygon(16% 0%, 84% 0%, 96% 68%, 70% 100%, 30% 100%, 4% 68%)",
    line: { x1: 74, y1: 49, x2: 57, y2: 45 },
  },
  {
    id: "left_arm",
    label: "Braço esquerdo",
    shortLabel: "Braço E",
    positionClass: "left-[25%] top-[21%] h-[32%] w-[10%] -rotate-[10deg]",
    calloutClass: "left-[5%] top-[34%]",
    detachedClass: "-translate-x-10 translate-y-4 -rotate-12",
    clipPath: "polygon(38% 0%, 100% 9%, 78% 100%, 12% 92%, 0% 30%)",
    line: { x1: 26, y1: 43, x2: 30, y2: 37 },
  },
  {
    id: "right_arm",
    label: "Braço direito",
    shortLabel: "Braço D",
    positionClass: "right-[25%] top-[21%] h-[32%] w-[10%] rotate-[10deg]",
    calloutClass: "right-[5%] top-[64%]",
    detachedClass: "translate-x-10 translate-y-4 rotate-12",
    clipPath: "polygon(0% 9%, 62% 0%, 100% 30%, 88% 92%, 22% 100%)",
    line: { x1: 74, y1: 72, x2: 70, y2: 37 },
  },
  {
    id: "left_leg",
    label: "Perna esquerda",
    shortLabel: "Perna E",
    positionClass: "left-[38%] top-[57%] h-[36%] w-[9%] -rotate-[3deg]",
    calloutClass: "left-[5%] bottom-[7%]",
    detachedClass: "-translate-x-7 translate-y-7 rotate-6",
    clipPath: "polygon(18% 0%, 88% 0%, 100% 72%, 78% 100%, 18% 100%, 0% 70%)",
    line: { x1: 28, y1: 82, x2: 43, y2: 76 },
  },
  {
    id: "right_leg",
    label: "Perna direita",
    shortLabel: "Perna D",
    positionClass: "right-[38%] top-[57%] h-[36%] w-[9%] rotate-[3deg]",
    calloutClass: "right-[5%] bottom-[7%]",
    detachedClass: "translate-x-7 translate-y-7 -rotate-6",
    clipPath: "polygon(12% 0%, 82% 0%, 100% 70%, 82% 100%, 22% 100%, 0% 72%)",
    line: { x1: 72, y1: 82, x2: 57, y2: 76 },
  },
];

export const JAEGER_BLUEPRINTS: Record<string, string> = {
  "atlas-prime": "/jaegers/atlas-prime-blueprint.svg",
};

export const JAEGER_STATUS_OPTIONS: Array<{ id: JaegerPartState; label: string; summary: string; color: string }> = [
  { id: "operational", label: "Operacional", summary: "100% funcional", color: "Verde" },
  { id: "damaged", label: "Danificado", summary: "Funciona, mas sofreu dano", color: "Amarelo" },
  { id: "impaired", label: "Operação limitada", summary: "Funciona parcialmente ou perdeu função", color: "Laranja" },
  { id: "destroyed", label: "Destruído", summary: "Sem função operacional", color: "Vermelho" },
  { id: "detached", label: "Arrancado", summary: "Separado do corpo principal", color: "Vermelho extremo" },
];

export const JAEGER_STATUS_LABELS = Object.fromEntries(JAEGER_STATUS_OPTIONS.map((option) => [option.id, option.label])) as Record<JaegerPartState, string>;

export function defaultPartStatus(jaegerId: string, partId: string): JaegerPartStatus {
  return {
    id: `${jaegerId}-${partId}`,
    jaeger_id: jaegerId,
    part_id: partId,
    status: "operational",
    integrity: 100,
    note: null,
    equipment_note: null,
    updated_by: null,
  };
}

export function mergeJaegerStatuses(jaegerId: string, rows: JaegerPartStatus[] = []) {
  return JAEGER_PARTS.map((part) => {
    const found = rows.find((row) => row.part_id === part.id);
    return found ?? defaultPartStatus(jaegerId, part.id);
  });
}

export function jaegerStatusTone(status: JaegerPartState) {
  const tones: Record<JaegerPartState, { part: string; label: string; glow: string; border: string; stroke: string }> = {
    operational: {
      part: "border-emerald-300/75 bg-emerald-400/25 shadow-[0_0_34px_rgba(52,211,153,0.34)]",
      label: "text-emerald-100",
      glow: "from-emerald-400/30",
      border: "border-emerald-300/35 bg-emerald-500/10",
      stroke: "stroke-emerald-200/55",
    },
    damaged: {
      part: "border-yellow-300/80 bg-yellow-300/30 shadow-[0_0_34px_rgba(250,204,21,0.32)]",
      label: "text-yellow-100",
      glow: "from-yellow-400/30",
      border: "border-yellow-300/35 bg-yellow-500/10",
      stroke: "stroke-yellow-200/60",
    },
    impaired: {
      part: "border-orange-300/85 bg-orange-400/30 shadow-[0_0_36px_rgba(251,146,60,0.35)]",
      label: "text-orange-100",
      glow: "from-orange-400/35",
      border: "border-orange-300/40 bg-orange-500/10",
      stroke: "stroke-orange-200/65",
    },
    destroyed: {
      part: "border-red-300/90 bg-red-500/35 shadow-[0_0_38px_rgba(248,113,113,0.4)]",
      label: "text-red-100",
      glow: "from-red-400/40",
      border: "border-red-300/45 bg-red-500/12",
      stroke: "stroke-red-200/70",
    },
    detached: {
      part: "border-red-200 bg-red-700/40 opacity-85 shadow-[0_0_44px_rgba(248,113,113,0.5)]",
      label: "text-red-100",
      glow: "from-red-500/45",
      border: "border-red-200/50 bg-red-600/15",
      stroke: "stroke-red-100/75",
    },
  };

  return tones[status];
}

export function calculateJaegerIntegrity(statuses: JaegerPartStatus[]) {
  if (!statuses.length) return 100;
  const total = statuses.reduce((sum, part) => sum + Math.max(0, Math.min(100, Number(part.integrity) || 0)), 0);
  return Math.round(total / statuses.length);
}

export function summarizeJaegerReadiness(statuses: JaegerPartStatus[]) {
  if (statuses.some((part) => part.status === "detached" || part.status === "destroyed")) return "Crítico";
  if (statuses.some((part) => part.status === "impaired")) return "Operação limitada";
  if (statuses.some((part) => part.status === "damaged")) return "Danificado, mas operacional";
  return "Operacional";
}
