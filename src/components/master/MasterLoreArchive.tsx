"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { masterLoreAccessLabels, masterLoreParts, type MasterLoreAccessLayer, type MasterLorePart } from "@/data/master-lore";

type LoreCardType =
  | "ler_para_players"
  | "somente_mestre"
  | "segredo_futuro"
  | "revelar_se_investigarem"
  | "pergunta_de_mesa"
  | "consequencia_condicional"
  | "cenario_como_arsenal"
  | "combate_jogavel"
  | "fluxo_par_k01"
  | "nota_continuidade"
  | "limpeza_editorial"
  | "texto_base";

type LoreBlock = {
  blockId: string;
  rawText: string;
  cardType: LoreCardType;
  tags: string[];
  confidence: "alta" | "media" | "baixa";
  visibility: "players" | "mestre" | "segredo" | "condicional" | "sistema";
};

const accessOrder: Array<MasterLoreAccessLayer | "all"> = [
  "all",
  "mestre_alto_escalao",
  "misto_publico_com_classificado",
  "historia_principal_ppdc_com_bastidores",
  "players_celula_k_com_mestre",
  "mesa_jogavel_players",
  "mesa_jogavel_com_segredos_de_mestre",
];

const tabs = [
  { id: "integral", label: "Texto integral" },
  { id: "marcacoes", label: "Marcações" },
  { id: "entidades", label: "Entidades" },
  { id: "continuidade", label: "Continuidade" },
] as const;

type LoreTab = (typeof tabs)[number]["id"];

const accessTone: Record<MasterLoreAccessLayer, string> = {
  mestre_alto_escalao: "border-red-300/45 bg-red-500/15 text-red-100",
  misto_publico_com_classificado: "border-amber-300/45 bg-amber-500/10 text-amber-100",
  historia_principal_ppdc_com_bastidores: "border-cyan-300/35 bg-cyan-500/10 text-cyan-100",
  players_celula_k_com_mestre: "border-emerald-300/35 bg-emerald-500/10 text-emerald-100",
  mesa_jogavel_players: "border-sky-300/35 bg-sky-500/10 text-sky-100",
  mesa_jogavel_com_segredos_de_mestre: "border-fuchsia-300/35 bg-fuchsia-500/10 text-fuchsia-100",
  revisar_manual: "border-slate-300/30 bg-slate-500/10 text-slate-100",
};

const cardDefinitions: Record<
  LoreCardType,
  {
    label: string;
    subtitle: string;
    tone: string;
    accent: string;
    alert?: string;
  }
> = {
  ler_para_players: {
    label: "LER PARA PLAYERS",
    subtitle: "Pode ser narrado em voz alta",
    tone: "border-sky-300/35 bg-sky-500/10 text-sky-50",
    accent: "bg-sky-300",
  },
  somente_mestre: {
    label: "SOMENTE MESTRE",
    subtitle: "Não narrar diretamente aos players",
    tone: "border-red-300/35 bg-red-500/10 text-red-50",
    accent: "bg-red-300",
    alert: "Use como bastidor de condução. Não transforme em verdade declarada para os personagens.",
  },
  segredo_futuro: {
    label: "SEGREDO FUTURO",
    subtitle: "Spoiler de longo prazo",
    tone: "border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-50",
    accent: "bg-fuchsia-300",
    alert: "Não narrar aos players nesta fase.",
  },
  revelar_se_investigarem: {
    label: "REVELAR SE INVESTIGAREM",
    subtitle: "Pista condicional",
    tone: "border-emerald-300/35 bg-emerald-500/10 text-emerald-50",
    accent: "bg-emerald-300",
  },
  pergunta_de_mesa: {
    label: "PERGUNTA DE MESA",
    subtitle: "Pausar e perguntar aos players",
    tone: "border-yellow-300/40 bg-yellow-500/10 text-yellow-50",
    accent: "bg-yellow-300",
  },
  consequencia_condicional: {
    label: "CONSEQUÊNCIA CONDICIONAL",
    subtitle: "Aplicar apenas se a escolha da mesa levar a isso",
    tone: "border-orange-300/40 bg-orange-500/10 text-orange-50",
    accent: "bg-orange-300",
  },
  cenario_como_arsenal: {
    label: "CENÁRIO COMO ARSENAL",
    subtitle: "Elemento tático do ambiente",
    tone: "border-cyan-300/35 bg-cyan-500/10 text-cyan-50",
    accent: "bg-cyan-300",
  },
  combate_jogavel: {
    label: "COMBATE JOGÁVEL",
    subtitle: "Material de mesa",
    tone: "border-rose-300/40 bg-rose-500/10 text-rose-50",
    accent: "bg-rose-300",
  },
  fluxo_par_k01: {
    label: "FLUXO / PAR K-01",
    subtitle: "Cena neural, memória ou sincronia",
    tone: "border-violet-300/40 bg-violet-500/10 text-violet-50",
    accent: "bg-violet-300",
  },
  nota_continuidade: {
    label: "NOTA DE CONTINUIDADE",
    subtitle: "Manter coerência da campanha",
    tone: "border-slate-300/30 bg-slate-500/10 text-slate-50",
    accent: "bg-slate-300",
  },
  limpeza_editorial: {
    label: "POSSÍVEL LIMPEZA EDITORIAL",
    subtitle: "Revisar manualmente, não remover automaticamente",
    tone: "border-zinc-300/25 bg-zinc-500/10 text-zinc-100",
    accent: "bg-zinc-300",
    alert: "Texto preservado. Se for comentário colado, o mestre decide depois.",
  },
  texto_base: {
    label: "TEXTO BASE",
    subtitle: "Trecho integral preservado",
    tone: "border-white/10 bg-white/[0.035] text-slate-100",
    accent: "bg-white/40",
  },
};

const cardTypeOptions: Array<"all" | LoreCardType> = [
  "all",
  "ler_para_players",
  "somente_mestre",
  "segredo_futuro",
  "revelar_se_investigarem",
  "pergunta_de_mesa",
  "consequencia_condicional",
  "cenario_como_arsenal",
  "combate_jogavel",
  "fluxo_par_k01",
  "nota_continuidade",
  "limpeza_editorial",
  "texto_base",
];

const specialCardTypes: LoreCardType[] = [
  "somente_mestre",
  "segredo_futuro",
  "revelar_se_investigarem",
  "pergunta_de_mesa",
  "consequencia_condicional",
  "cenario_como_arsenal",
  "combate_jogavel",
  "fluxo_par_k01",
  "nota_continuidade",
  "limpeza_editorial",
];

const defaultCollapsedCardTypes: LoreCardType[] = [
  "segredo_futuro",
  "somente_mestre",
  "revelar_se_investigarem",
  "consequencia_condicional",
  "limpeza_editorial",
];

const badgeTone: Record<string, string> = {
  "LER PARA PLAYERS": "border-sky-300/40 bg-sky-500/15 text-sky-50",
  NARRÁVEL: "border-sky-300/40 bg-sky-500/15 text-sky-50",
  "PÚBLICO FILTRADO + MESTRE COMPLETO": "border-amber-300/40 bg-amber-500/15 text-amber-50",
  "SOMENTE MESTRE": "border-red-300/40 bg-red-500/15 text-red-50",
  "NÃO REVELAR AINDA": "border-fuchsia-300/45 bg-fuchsia-500/15 text-fuchsia-50",
  "REVELAR SE INVESTIGAREM": "border-emerald-300/40 bg-emerald-500/15 text-emerald-50",
  "PERGUNTA DE MESA": "border-cyan-300/40 bg-cyan-500/15 text-cyan-50",
  "CONSEQUÊNCIA CONDICIONAL": "border-yellow-300/40 bg-yellow-500/15 text-yellow-50",
  "COMBATE JOGÁVEL": "border-orange-300/45 bg-orange-500/15 text-orange-50",
  "CENÁRIO COMO ARSENAL": "border-lime-300/35 bg-lime-500/10 text-lime-50",
  "REVISÃO R": "border-orange-300/45 bg-orange-500/15 text-orange-50",
  FLUXO: "border-cyan-300/40 bg-cyan-500/15 text-cyan-50",
  ORFEU: "border-cyan-300/40 bg-cyan-500/15 text-cyan-50",
  CHAU: "border-amber-300/45 bg-amber-500/15 text-amber-50",
  "TERRA OCA": "border-fuchsia-300/45 bg-fuchsia-500/15 text-fuchsia-50",
  PRECURSORES: "border-fuchsia-300/45 bg-fuchsia-500/15 text-fuchsia-50",
  JAEGER: "border-blue-300/35 bg-blue-500/10 text-blue-50",
  KAIJU: "border-red-300/40 bg-red-500/15 text-red-50",
};

const FAVORITES_STORAGE_KEY = "kaiju-master-lore-favorites";
const PROGRESS_STORAGE_KEY = "kaiju-master-lore-progress";

function partCode(part: MasterLorePart) {
  if (part.partLabel) return part.partLabel;
  if (part.partMajor === 0) return `0.${part.partMinor}`;
  if (part.partMinor === 0) return String(part.partMajor);
  return `${part.partMajor}.${part.partMinor}`;
}

function matchesSearch(part: MasterLorePart, query: string) {
  if (!query.trim()) return true;
  const normalizedQuery = query.trim().toLowerCase();
  const searchable = [
    part.title,
    part.audience,
    part.masterUse,
    part.arc,
    part.status,
    ...part.visibilityBadges,
    ...part.sessionTags,
    ...part.subtitles,
    ...part.detectedDates,
    ...part.visibleNpcs,
    ...part.backstageNpcs,
    ...part.entities,
    ...part.technologies,
    ...part.kaijus,
    ...part.jaegers,
    part.content,
  ]
    .join("\n")
    .toLowerCase();
  return searchable.includes(normalizedQuery);
}

function getStoredStringArray(key: string) {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

function getInitialProgress() {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function splitIntoRawBlocks(content: string) {
  const pieces = content.split(/(\r?\n\r?\n)/);
  const blocks: string[] = [];
  for (let index = 0; index < pieces.length; index += 2) {
    const rawText = `${pieces[index] ?? ""}${pieces[index + 1] ?? ""}`;
    if (rawText.length) blocks.push(rawText);
  }
  return blocks;
}

function textIncludes(text: string, terms: string[]) {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function blockTags(rawText: string, part: MasterLorePart) {
  const tags = new Set<string>();
  for (const tag of part.sessionTags) {
    if (textIncludes(rawText, [tag])) tags.add(tag);
  }
  if (textIncludes(rawText, ["Horizon Brave", "Tacit Ronin", "Brawler Yukon", "Coyote Tango", "Jaeger"])) tags.add("JAEGER");
  if (textIncludes(rawText, ["Kaiju", "Brine", "Hookwake", "Bellhusk", "Tressarak", "Gorath", "Mirekai"])) tags.add("KAIJU");
  if (textIncludes(rawText, ["Fluxo", "Par K-01", "Conn-Pod", "Ressonância", "sincronia", "Estresse", "Drift"])) tags.add("FLUXO");
  if (textIncludes(rawText, ["Orfeu", "MSD-1", "MSD-2", "Nó Fantasma", "Rede"])) tags.add("ORFEU");
  if (textIncludes(rawText, ["Terra Oca"])) tags.add("TERRA OCA");
  if (textIncludes(rawText, ["Precursores"])) tags.add("PRECURSORES");
  if (textIncludes(rawText, ["Chau", "mercado negro"])) tags.add("CHAU");
  return Array.from(tags);
}

function classifyBlock(part: MasterLorePart, rawText: string, index: number): LoreBlock {
  const lower = rawText.toLowerCase();
  const startsWithConditional = /^\s*(se|caso)\b/i.test(rawText);
  const hasQuestion = rawText.includes("?") || rawText.includes("?”") || rawText.includes('?"');
  const hasSeveralConditionalLines = (rawText.match(/(^|\n)\s*(se|caso)\b/gi) ?? []).length >= 2;
  const isEditorial = textIncludes(rawText, [
    "Perfeito.",
    "Você tem razão",
    "Na próxima parte",
    "O que vem na Parte",
    "Como isso entra no RPG",
    "Mini resumo",
    "Se quiser",
    "vou refazer",
    "vou manter exatamente",
  ]);
  const isQuestion = hasQuestion && textIncludes(rawText, ["O mestre pergunta", "mestre pode perguntar", "mestre deve perguntar", "Vocês", "Como vocês", "O que vocês", "A decisão fica"]);
  const isConsequence =
    hasSeveralConditionalLines ||
    textIncludes(rawText, ["Falha parcial", "Falha grave", "Custo", "consequência", "consequências", "se falharem", "se tiverem sucesso"]) ||
    (lower.includes("se ") && textIncludes(rawText, ["players", "Horizon", "Ronin", "Célula K", "risco", "dano"]));
  const isInvestigation = textIncludes(rawText, ["Se perguntarem", "Se investigarem", "análise", "dados brutos", "pista", "perguntarem sobre", "pedir dados", "pedir leitura", "revelar apenas"]);
  const hasScenarioAsset = textIncludes(rawText, ["cargueiro", "contêiner", "guindaste", "cabo", "píer", "tanque", "banco de areia", "recife", "rochedo", "boia", "ferry", "barco", "plataforma", "ponte", "ônibus", "rota civil", "doca"]);
  const isScenario = hasScenarioAsset && textIncludes(rawText, ["cenário como arsenal", "usar", "podem usar", "tático", "barreira", "cobertura", "vantagem", "risco", "se usarem"]);
  const isFlux = textIncludes(rawText, ["Fluxo", "Par K-01", "Conn-Pod", "Ressonância", "sincronia", "Estresse do Fluxo", "sobrecorreção", "Drift"]);
  const isFutureSecret =
    textIncludes(rawText, ["segredo futuro", "não revelar ainda", "não revelar aos players", "Bio-Jaeger", "buraco de minhoca", "destino futuro", "Nó Fantasma", "verdade da Fenda", "retorno do personagem do mestre"]);
  const isMasterOnly = textIncludes(rawText, ["Notas do mestre", "Resultado canônico", "função narrativa", "deve ensinar", "não revelar", "continuidade", "canônico", "mestre sabe", "segredo", "somente mestre"]);
  const isCombat = part.isPlayableCombat && textIncludes(rawText, ["combate", "Kaiju", "ataque", "objetivo", "fase", "Horizon", "Ronin", "campo", "finalização"]);
  const isContinuity = textIncludes(rawText, ["O que vem na Parte", "continuidade", "resultado canônico", "resultado sugerido", "termina com", "prepara a próxima", "conecta com"]);

  let cardType: LoreCardType = "texto_base";
  let visibility: LoreBlock["visibility"] = "players";
  let confidence: LoreBlock["confidence"] = "media";

  if (isEditorial) {
    cardType = "limpeza_editorial";
    visibility = "sistema";
    confidence = "alta";
  } else if (isQuestion) {
    cardType = "pergunta_de_mesa";
    visibility = "players";
    confidence = "alta";
  } else if (isInvestigation) {
    cardType = "revelar_se_investigarem";
    visibility = "condicional";
    confidence = "media";
  } else if (isConsequence) {
    cardType = "consequencia_condicional";
    visibility = "mestre";
    confidence = startsWithConditional || hasSeveralConditionalLines ? "alta" : "media";
  } else if (isCombat) {
    cardType = "combate_jogavel";
    visibility = "mestre";
    confidence = "media";
  } else if (isScenario) {
    cardType = "cenario_como_arsenal";
    visibility = "players";
    confidence = "media";
  } else if (isFlux) {
    cardType = "fluxo_par_k01";
    visibility = "mestre";
    confidence = "media";
  } else if (isFutureSecret) {
    cardType = "segredo_futuro";
    visibility = "segredo";
    confidence = part.accessLayer === "mestre_alto_escalao" ? "alta" : "media";
  } else if (isMasterOnly) {
    cardType = "somente_mestre";
    visibility = "mestre";
    confidence = "media";
  } else if (isContinuity) {
    cardType = "nota_continuidade";
    visibility = "sistema";
    confidence = "media";
  }

  return {
    blockId: `${part.id}-bloco-${String(index + 1).padStart(3, "0")}`,
    rawText,
    cardType,
    tags: blockTags(rawText, part),
    confidence,
    visibility,
  };
}

function buildLoreBlocks(part: MasterLorePart) {
  return splitIntoRawBlocks(part.content).map((rawText, index) => classifyBlock(part, rawText, index));
}

function isSpecialType(type: LoreCardType) {
  return specialCardTypes.includes(type);
}

function sectionBannerType(part: MasterLorePart): LoreCardType | null {
  if (part.accessLayer === "mestre_alto_escalao") return "segredo_futuro";
  if (part.accessLayer === "mesa_jogavel_com_segredos_de_mestre") return "somente_mestre";
  if (part.isPlayableCombat) return "combate_jogavel";
  return null;
}

function Badge({ label }: { label: string }) {
  return <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${badgeTone[label] ?? "border-white/10 bg-white/5 text-slate-200"}`}>{label}</span>;
}

function EmptyState({ children }: { children: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm font-semibold leading-6 text-slate-400">{children}</div>;
}

function TextBlock({ children, tone = "default" }: { children: string; tone?: "default" | "warning" | "question" | "success" }) {
  const toneClass =
    tone === "warning"
      ? "border-fuchsia-300/30 bg-fuchsia-500/10 text-fuchsia-50"
      : tone === "question"
        ? "border-cyan-300/30 bg-cyan-500/10 text-cyan-50"
        : tone === "success"
          ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-50"
          : "border-white/10 bg-white/[0.03] text-slate-100";
  return <pre className={`whitespace-pre-wrap rounded-2xl border p-4 font-sans text-sm font-semibold leading-7 ${toneClass}`}>{children}</pre>;
}

function ListPanel({ title, items, empty, tone = "default" }: { title: string; items: string[]; empty: string; tone?: "default" | "warning" | "question" | "success" }) {
  return (
    <section className="grid gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200">{title}</p>
      {items.length ? items.map((item, index) => <TextBlock key={`${title}-${index}`} tone={tone}>{item}</TextBlock>) : <EmptyState>{empty}</EmptyState>}
    </section>
  );
}

function EntityPills({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <span key={`${title}-${item}`} className="rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-50">{item}</span>) : <span className="text-sm font-semibold text-slate-500">Nada detectado automaticamente.</span>}
      </div>
    </section>
  );
}

function SectionBanner({ type }: { type: LoreCardType }) {
  const definition = cardDefinitions[type];
  return (
    <div className={`rounded-[1.4rem] border px-5 py-4 ${definition.tone}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-10 w-1.5 rounded-full ${definition.accent}`} />
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em]">{definition.label}</p>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-100">{definition.alert ?? definition.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function NormalLoreBlock({ block }: { block: LoreBlock }) {
  const isHeading = /^\s*#{1,3}\s/.test(block.rawText);
  const cleanHeading = block.rawText.replace(/^\s*#{1,3}\s*/, "");
  return (
    <div className="group grid gap-2 md:grid-cols-[5.5rem_minmax(0,1fr)]">
      <div className="hidden pt-1 md:block">
        {block.tags.length ? (
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-2 py-1 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
            {block.tags[0]}
          </span>
        ) : null}
      </div>
      {isHeading ? (
        <h3 className="whitespace-pre-wrap pt-4 text-2xl font-black uppercase leading-tight text-white md:text-3xl">{cleanHeading}</h3>
      ) : (
        <pre className="whitespace-pre-wrap font-sans text-lg font-semibold leading-9 text-slate-100 md:text-[1.18rem] md:leading-[2.35rem]">{block.rawText}</pre>
      )}
    </div>
  );
}

function LoreCard({
  block,
  effectiveType,
  collapsed,
  fixed,
  read,
  revealed,
  note,
  onCopy,
  onToggleCollapse,
  onToggleFixed,
  onToggleRead,
  onToggleRevealed,
  onTypeChange,
  onNoteChange,
}: {
  block: LoreBlock;
  effectiveType: LoreCardType;
  collapsed: boolean;
  fixed: boolean;
  read: boolean;
  revealed: boolean;
  note: string;
  onCopy: () => void;
  onToggleCollapse: () => void;
  onToggleFixed: () => void;
  onToggleRead: () => void;
  onToggleRevealed: () => void;
  onTypeChange: (type: LoreCardType) => void;
  onNoteChange: (note: string) => void;
}) {
  const definition = cardDefinitions[effectiveType];
  return (
    <section className={`overflow-hidden rounded-[1.65rem] border ${definition.tone} ${fixed ? "ring-2 ring-amber-300/40" : ""} ${read ? "opacity-80" : ""}`}>
      <div className="flex flex-col gap-3 border-b border-white/10 bg-black/20 p-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex gap-3">
          <span className={`mt-1 h-12 w-1.5 rounded-full ${definition.accent}`} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.26em]">{definition.label}</p>
              <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-300">
                {block.confidence === "baixa" ? "Classificação sugerida, revisar" : `Confiança ${block.confidence}`}
              </span>
              {fixed ? <span className="rounded-full border border-amber-300/30 bg-amber-500/15 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-amber-50">Fixado</span> : null}
              {revealed ? <span className="rounded-full border border-emerald-300/30 bg-emerald-500/15 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-50">Revelado</span> : null}
            </div>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-300">{definition.subtitle}</p>
            {definition.alert ? <p className="mt-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs font-bold leading-5 text-white">{definition.alert}</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onCopy} className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-50">Copiar</button>
          <button type="button" onClick={onToggleCollapse} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-200">{collapsed ? "Abrir" : "Colapsar"}</button>
          <button type="button" onClick={onToggleRead} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-200">{read ? "Lido" : "Marcar lido"}</button>
          <button type="button" onClick={onToggleFixed} className="rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-50">{fixed ? "Desfixar" : "Fixar"}</button>
          <button type="button" onClick={onToggleRevealed} className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-50">{revealed ? "Ocultar revelado" : "Revelado aos players"}</button>
        </div>
      </div>

      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {block.tags.map((tag) => <Badge key={`${block.blockId}-${tag}`} label={tag} />)}
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300">{block.visibility}</span>
        </div>
        <div className="grid gap-3 md:grid-cols-[18rem_1fr]">
          <label className="grid gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Mudar tipo</span>
            <select value={effectiveType} onChange={(event) => onTypeChange(event.target.value as LoreCardType)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-white outline-none">
              {cardTypeOptions.filter((type) => type !== "all").map((type) => <option key={type} value={type}>{cardDefinitions[type].label}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Nota manual do mestre</span>
            <input value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="Condição, NPC que revela, teste, risco..." className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-white outline-none placeholder:text-slate-600" />
          </label>
        </div>
        {!collapsed ? <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#030711] p-5 font-sans text-base font-semibold leading-8 text-slate-100">{block.rawText}</pre> : null}
      </div>
    </section>
  );
}

export function MasterLoreArchive() {
  const [selectedId, setSelectedId] = useState(masterLoreParts.at(-1)?.id ?? masterLoreParts[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<LoreTab>("integral");
  const [accessFilter, setAccessFilter] = useState<MasterLoreAccessLayer | "all">("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [cardTypeFilter, setCardTypeFilter] = useState<"all" | LoreCardType>("all");
  const [showOnlyMarked, setShowOnlyMarked] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getStoredStringArray(FAVORITES_STORAGE_KEY));
  const [progressByPart, setProgressByPart] = useState<Record<string, string>>(getInitialProgress);
  const [collapsedBlockIds, setCollapsedBlockIds] = useState<string[]>([]);
  const [fixedBlockIds, setFixedBlockIds] = useState<string[]>([]);
  const [readBlockIds, setReadBlockIds] = useState<string[]>([]);
  const [revealedBlockIds, setRevealedBlockIds] = useState<string[]>([]);
  const [cardOverrides, setCardOverrides] = useState<Record<string, LoreCardType>>({});
  const [blockNotes, setBlockNotes] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const availableTags = Array.from(new Set(masterLoreParts.flatMap((part) => part.sessionTags))).sort();
  const filteredParts = masterLoreParts.filter((part) => {
    const matchesAccess = accessFilter === "all" || part.accessLayer === accessFilter;
    const matchesTag = tagFilter === "all" || part.sessionTags.includes(tagFilter) || part.visibilityBadges.includes(tagFilter);
    return matchesAccess && matchesTag && matchesSearch(part, deferredQuery);
  });
  const selectedPart = filteredParts.find((part) => part.id === selectedId) ?? filteredParts[0] ?? masterLoreParts.find((part) => part.id === selectedId) ?? masterLoreParts[0];
  const loreBlocks = selectedPart ? buildLoreBlocks(selectedPart) : [];
  const favoriteParts = favoriteIds
    .map((id) => (masterLoreParts as readonly MasterLorePart[]).find((part) => part.id === id))
    .filter((part): part is MasterLorePart => part !== undefined);
  const isSelectedFavorite = selectedPart ? favoriteIds.includes(selectedPart.id) : false;
  const selectedProgress = selectedPart ? (progressByPart[selectedPart.id] ?? "não iniciado") : "não iniciado";
  const questionBlocks = loreBlocks.filter((block) => (cardOverrides[block.blockId] ?? block.cardType) === "pergunta_de_mesa");
  const consequenceBlocks = loreBlocks.filter((block) => (cardOverrides[block.blockId] ?? block.cardType) === "consequencia_condicional");
  const secretBlocks = loreBlocks.filter((block) => ["segredo_futuro", "somente_mestre"].includes(cardOverrides[block.blockId] ?? block.cardType));
  const scenarioBlocks = loreBlocks.filter((block) => (cardOverrides[block.blockId] ?? block.cardType) === "cenario_como_arsenal");
  const markedBlocks = loreBlocks.filter((block) => isSpecialType(cardOverrides[block.blockId] ?? block.cardType));
  const sectionBanner = selectedPart ? sectionBannerType(selectedPart) : null;
  const filteredIntegralBlocks = loreBlocks.filter((block) => {
    const effectiveType = cardOverrides[block.blockId] ?? block.cardType;
    const isSpecial = isSpecialType(effectiveType);
    if (cardTypeFilter !== "all") return effectiveType === cardTypeFilter;
    if (showOnlyMarked) return isSpecial;
    return true;
  });

  function updateFavorites(nextFavorites: string[]) {
    setFavoriteIds(nextFavorites);
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
  }

  function updateProgress(partId: string, value: string) {
    const nextProgress = { ...progressByPart, [partId]: value };
    setProgressByPart(nextProgress);
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress));
  }

  function toggleListValue(values: string[], setValues: (next: string[]) => void, value: string) {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [value, ...values]);
  }

  function toggleSelectedFavorite() {
    if (!selectedPart) return;
    if (favoriteIds.includes(selectedPart.id)) {
      updateFavorites(favoriteIds.filter((id) => id !== selectedPart.id));
      return;
    }
    updateFavorites([selectedPart.id, ...favoriteIds].slice(0, 8));
  }

  async function copySelectedPart() {
    if (!selectedPart) return;
    const textByTab: Record<LoreTab, string> = {
      integral: selectedPart.content,
      marcacoes: markedBlocks.map((block) => `[${cardDefinitions[cardOverrides[block.blockId] ?? block.cardType].label}]\n${block.rawText}`).join("\n"),
      entidades: selectedPart.entities.join("\n"),
      continuidade: selectedPart.continuityNotes.join("\n"),
    };
    await navigator.clipboard.writeText(textByTab[activeTab] || selectedPart.content);
  }

  async function copyBlock(rawText: string) {
    await navigator.clipboard.writeText(rawText);
  }

  function renderCards(blocks: LoreBlock[], empty: string) {
    if (!blocks.length) return <EmptyState>{empty}</EmptyState>;
    return (
      <div className="grid gap-4">
        {blocks.map((block) => {
          const effectiveType = cardOverrides[block.blockId] ?? block.cardType;
          return (
            <LoreCard
              key={block.blockId}
              block={block}
              effectiveType={effectiveType}
              collapsed={collapsedBlockIds.includes(block.blockId)}
              fixed={fixedBlockIds.includes(block.blockId)}
              read={readBlockIds.includes(block.blockId)}
              revealed={revealedBlockIds.includes(block.blockId)}
              note={blockNotes[block.blockId] ?? ""}
              onCopy={() => void copyBlock(block.rawText)}
              onToggleCollapse={() => toggleListValue(collapsedBlockIds, setCollapsedBlockIds, block.blockId)}
              onToggleFixed={() => toggleListValue(fixedBlockIds, setFixedBlockIds, block.blockId)}
              onToggleRead={() => toggleListValue(readBlockIds, setReadBlockIds, block.blockId)}
              onToggleRevealed={() => toggleListValue(revealedBlockIds, setRevealedBlockIds, block.blockId)}
              onTypeChange={(type) => setCardOverrides((current) => ({ ...current, [block.blockId]: type }))}
              onNoteChange={(note) => setBlockNotes((current) => ({ ...current, [block.blockId]: note }))}
            />
          );
        })}
      </div>
    );
  }

  function renderIntegralBlocks() {
    if (!filteredIntegralBlocks.length) return <EmptyState>Nenhum trecho encontrado com os filtros atuais.</EmptyState>;
    return (
      <div className="grid gap-2 rounded-[2rem] border border-white/10 bg-[#050813] px-5 py-7 shadow-inner shadow-black/50 md:px-9 md:py-10">
        {sectionBanner && !showOnlyMarked && cardTypeFilter === "all" ? <SectionBanner type={sectionBanner} /> : null}
        {filteredIntegralBlocks.map((block) => {
          const effectiveType = cardOverrides[block.blockId] ?? block.cardType;
          if (!isSpecialType(effectiveType)) return <NormalLoreBlock key={block.blockId} block={block} />;
          return (
            <LoreCard
              key={block.blockId}
              block={block}
              effectiveType={effectiveType}
              collapsed={defaultCollapsedCardTypes.includes(effectiveType) ? !collapsedBlockIds.includes(block.blockId) : collapsedBlockIds.includes(block.blockId)}
              fixed={fixedBlockIds.includes(block.blockId)}
              read={readBlockIds.includes(block.blockId)}
              revealed={revealedBlockIds.includes(block.blockId)}
              note={blockNotes[block.blockId] ?? ""}
              onCopy={() => void copyBlock(block.rawText)}
              onToggleCollapse={() => toggleListValue(collapsedBlockIds, setCollapsedBlockIds, block.blockId)}
              onToggleFixed={() => toggleListValue(fixedBlockIds, setFixedBlockIds, block.blockId)}
              onToggleRead={() => toggleListValue(readBlockIds, setReadBlockIds, block.blockId)}
              onToggleRevealed={() => toggleListValue(revealedBlockIds, setRevealedBlockIds, block.blockId)}
              onTypeChange={(type) => setCardOverrides((current) => ({ ...current, [block.blockId]: type }))}
              onNoteChange={(note) => setBlockNotes((current) => ({ ...current, [block.blockId]: note }))}
            />
          );
        })}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050006] text-white">
      <section className="sticky top-0 z-40 border-b border-red-300/20 bg-[#070108]/95 px-4 py-4 backdrop-blur-xl">
        <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <Link href="/master" className="font-mono text-[10px] font-black uppercase tracking-[0.35em] text-red-300 transition hover:text-red-100">
              Voltar ao painel mestre
            </Link>
            <h1 className="mt-2 text-3xl font-black uppercase leading-none text-white md:text-5xl">Sala de Leitura Segura</h1>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_15rem_15rem_auto] xl:min-w-[66rem]">
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-red-200">Buscar</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tressarak, Orfeu, Chau, pergunta..."
                className="rounded-2xl border border-red-200/25 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-red-200"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-red-200">Camada</span>
              <select value={accessFilter} onChange={(event) => setAccessFilter(event.target.value as MasterLoreAccessLayer | "all")} className="rounded-2xl border border-red-200/25 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-red-200">
                {accessOrder.map((access) => <option key={access} value={access}>{access === "all" ? "Todas" : masterLoreAccessLabels[access]}</option>)}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-red-200">Etiqueta</span>
              <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} className="rounded-2xl border border-red-200/25 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-red-200">
                <option value="all">Todas</option>
                {availableTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => void copySelectedPart()} className="self-end rounded-2xl border border-cyan-300/35 bg-cyan-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-50 transition hover:bg-cyan-500/20">
              Copiar aba
            </button>
          </div>
        </div>
      </section>

      <section className="grid w-full gap-4 px-2 py-4 sm:px-3 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-36 xl:h-[calc(100vh-10rem)]">
          <div className="rounded-[2rem] border border-red-300/20 bg-[#09020a]/95 p-4 shadow-[0_0_60px_rgba(239,68,68,0.1)]">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-red-300">Partes da história</p>
                <h2 className="mt-1 text-2xl font-black uppercase text-white">Índice tático</h2>
              </div>
              <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-200">{filteredParts.length}</p>
            </div>

            <div className="mt-4 flex max-h-80 gap-3 overflow-x-auto pb-2 xl:max-h-[calc(100vh-18rem)] xl:flex-col xl:overflow-y-auto xl:overflow-x-hidden xl:pr-1">
              {favoriteParts.length ? (
                <div className="min-w-72 rounded-2xl border border-amber-300/20 bg-amber-500/10 p-3 xl:min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-100">Fixados</p>
                  <div className="mt-3 space-y-2">
                    {favoriteParts.map((part) => (
                      <button key={`fav-${part.id}`} type="button" onClick={() => setSelectedId(part.id)} className="w-full rounded-xl border border-amber-300/20 bg-black/25 px-3 py-2 text-left text-xs font-black uppercase leading-4 text-amber-50 transition hover:bg-amber-500/10">
                        {partCode(part)} | {part.title.replace(/^PARTE\s+/, "")}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {filteredParts.map((part) => {
                const selected = selectedPart?.id === part.id;
                return (
                  <button key={part.id} type="button" onClick={() => setSelectedId(part.id)} className={`min-w-72 rounded-2xl border p-4 text-left transition xl:min-w-0 ${selected ? "border-red-200 bg-red-500/20 shadow-[0_0_28px_rgba(239,68,68,0.18)]" : "border-white/10 bg-white/[0.03] hover:border-red-300/35 hover:bg-red-500/10"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-cyan-100">{partCode(part)}</span>
                      <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${accessTone[part.accessLayer]}`}>{masterLoreAccessLabels[part.accessLayer]}</span>
                    </div>
                    <h3 className="mt-3 text-base font-black uppercase leading-5 text-white">{part.title.replace(/^PARTE\s+/, "")}</h3>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-400">{part.arc}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {part.sessionTags.slice(0, 4).map((tag) => <Badge key={`${part.id}-${tag}`} label={tag} />)}
                    </div>
                    <p className="mt-3 text-xs font-bold leading-5 text-slate-500">Linhas {part.lineStart}-{part.lineEnd}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {selectedPart ? (
          <article className="min-w-0 overflow-hidden rounded-[2.25rem] border border-red-300/25 bg-[#070a13] shadow-[0_0_80px_rgba(239,68,68,0.13)]">
            <header className="border-b border-white/10 bg-gradient-to-r from-red-950/45 via-slate-950 to-cyan-950/20 p-5 md:p-7">
              <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-red-300">Dossiê aberto</p>
                  <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-white md:text-5xl">{selectedPart.title}</h2>
                  <p className="mt-4 max-w-6xl text-sm font-bold leading-6 text-slate-300">{selectedPart.masterUse}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 2xl:min-w-[36rem]">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Arco</p>
                    <p className="mt-1 text-xs font-black text-white">{selectedPart.arc}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Status</p>
                    <p className="mt-1 text-xs font-black text-white">{selectedPart.status}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Quem vê</p>
                    <p className="mt-1 text-xs font-black text-white">{selectedPart.audience}</p>
                  </div>
                  <div className={`rounded-2xl border p-3 ${accessTone[selectedPart.accessLayer]}`}>
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-80">Camada</p>
                    <p className="mt-1 text-xs font-black">{masterLoreAccessLabels[selectedPart.accessLayer]}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={toggleSelectedFavorite} className="rounded-2xl border border-amber-300/35 bg-amber-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-amber-50 transition hover:bg-amber-500/20">
                  {isSelectedFavorite ? "Remover dos fixados" : "Fixar para sessão"}
                </button>
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Progresso</span>
                  <select value={selectedProgress} onChange={(event) => updateProgress(selectedPart.id, event.target.value)} className="bg-transparent text-xs font-black uppercase text-white outline-none">
                    {["não iniciado", "em leitura", "já narrado", "pergunta feita", "segredo revelado", "consequência aplicada", "parte concluída"].map((status) => <option key={status} value={status} className="bg-slate-950">{status}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selectedPart.visibilityBadges.map((badge) => <Badge key={`${selectedPart.id}-${badge}`} label={badge} />)}
              </div>
            </header>

            <div className="border-b border-white/10 bg-[#03050b] px-3 py-3 md:px-5 lg:px-7">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map((tabItem) => (
                  <button key={tabItem.id} type="button" onClick={() => setActiveTab(tabItem.id)} className={`shrink-0 rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${activeTab === tabItem.id ? "border-cyan-200 bg-cyan-500/20 text-cyan-50" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/30"}`}>
                    {tabItem.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#02040a] px-3 py-5 md:px-5 lg:px-7 2xl:px-9">
              {activeTab === "integral" ? (
                <div className="grid gap-5">
                  <section className="grid gap-4 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 p-5 xl:grid-cols-[1fr_auto] xl:items-end">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-100">Texto integral</p>
                      <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-cyan-50">
                        Leitura única e contínua. Narração comum fica limpa; só perguntas, segredos, pistas, consequências e pontos de condução viram marcação.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[12rem_16rem_auto]">
                      <button type="button" onClick={() => setShowOnlyMarked((current) => !current)} className={`rounded-xl border px-3 py-3 text-[10px] font-black uppercase tracking-[0.18em] transition ${showOnlyMarked ? "border-yellow-200 bg-yellow-500/20 text-yellow-50" : "border-white/10 bg-black/25 text-slate-200 hover:border-yellow-300/30"}`}>
                        {showOnlyMarked ? "Ver texto todo" : "Só marcações"}
                      </button>
                      <label className="grid gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100">Filtro de marcação</span>
                        <select value={cardTypeFilter} onChange={(event) => setCardTypeFilter(event.target.value as "all" | LoreCardType)} className="rounded-xl border border-cyan-300/20 bg-slate-950 px-3 py-2 text-xs font-bold text-white outline-none">
                          {cardTypeOptions.filter((type) => type !== "ler_para_players" && type !== "texto_base").map((type) => <option key={type} value={type}>{type === "all" ? "Todas as marcações" : cardDefinitions[type].label}</option>)}
                        </select>
                      </label>
                      <button type="button" onClick={() => setCardTypeFilter("all")} className="self-end rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-200 transition hover:border-cyan-300/30">
                        Limpar filtro
                      </button>
                    </div>
                  </section>
                  {renderIntegralBlocks()}
                </div>
              ) : null}

              {activeTab === "marcacoes" ? (
                <div className="grid gap-5">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <ListPanel title="Perguntas de mesa" items={questionBlocks.map((block) => block.rawText)} empty="Nenhuma pergunta detectada nesta parte." tone="question" />
                    <ListPanel title="Segredos e bastidores" items={secretBlocks.map((block) => block.rawText)} empty="Nenhum segredo/bastidor detectado nesta parte." tone="warning" />
                    <ListPanel title="Consequências condicionais" items={consequenceBlocks.map((block) => block.rawText)} empty="Nenhuma consequência detectada nesta parte." />
                    <ListPanel title="Cenário como arsenal" items={scenarioBlocks.map((block) => block.rawText)} empty="Nenhum elemento tático detectado nesta parte." tone="success" />
                  </div>
                  <ListPanel title="Notas de mestre" items={selectedPart.privateGuidance} empty="Nenhuma nota de mestre detectada." />
                  <ListPanel title="Alertas de spoiler" items={selectedPart.spoilerWarnings} empty="Sem alerta forte de spoiler detectado." tone="warning" />
                  {renderCards(markedBlocks, "Nenhuma marcação especial detectada automaticamente. O texto integral continua preservado na aba principal.")}
                </div>
              ) : null}

              {activeTab === "entidades" ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <EntityPills title="NPCs visíveis ou citados em cena" items={selectedPart.visibleNpcs} />
                  <EntityPills title="NPCs de bastidor" items={selectedPart.backstageNpcs} />
                  <EntityPills title="Jaegers" items={selectedPart.jaegers} />
                  <EntityPills title="Kaijus" items={selectedPart.kaijus} />
                  <EntityPills title="Tecnologias / mistérios" items={selectedPart.technologies} />
                  <EntityPills title="Cenário como arsenal" items={selectedPart.sceneAssets} />
                </div>
              ) : null}

              {activeTab === "continuidade" ? (
                <div className="grid gap-5">
                  <ListPanel title="Continuidade canônica" items={selectedPart.continuityNotes} empty="Nenhuma nota canônica automática detectada." />
                  <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200">Identificação da parte</p>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {[
                        ["Parte", partCode(selectedPart)],
                        ["Linhas", `${selectedPart.lineStart}-${selectedPart.lineEnd}`],
                        ["Fonte", selectedPart.sourceFile],
                        ["Datas", selectedPart.detectedDates.join(", ") || "Não detectada"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
                          <p className="mt-1 text-sm font-black text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : null}
            </div>
          </article>
        ) : (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center text-slate-300">Nenhuma parte encontrada com os filtros atuais.</section>
        )}
      </section>
    </main>
  );
}
