import type { JaegerCombatIndexEntry } from "@/content/jaeger-combat/manifests/jaegerCombatIndex";

export const JAEGER_COMBAT_CATEGORIES = [
  "ATRIBUTOS",
  "COMBATE",
  "ATAQUE",
  "MANOBRA",
  "DEFESA",
  "SISTEMA ESPECIAL",
  "DANO / AVARIA",
  "CALOR",
  "ESTRESSE",
  "FLUXO / SINCRONIA",
  "CONDIÇÃO APLICADA",
  "CONDIÇÃO SOFRIDA",
  "FICHA RÁPIDA",
  "USO EM MESA",
  "USO NARRATIVO",
  "SOMENTE MESTRE",
  "VISÍVEL AO PILOTO",
  "SEGREDO / CLASSIFICADO",
  "BALANCEAMENTO",
  "DEV / ORGANIZAÇÃO",
  "Texto Integral / Outros Blocos",
] as const;

export type JaegerCombatCategory = (typeof JAEGER_COMBAT_CATEGORIES)[number];

export const MASTER_ONLY_COMBAT_CATEGORIES = new Set<JaegerCombatCategory>([
  "SOMENTE MESTRE",
  "SEGREDO / CLASSIFICADO",
  "BALANCEAMENTO",
  "DEV / ORGANIZAÇÃO",
]);

export type JaegerCombatBlock = {
  id: string;
  heading: string;
  level: number;
  rawText: string;
  category: JaegerCombatCategory;
};

export function normalizeCombatText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function classifyBlock(rawText: string, heading: string): JaegerCombatCategory {
  const value = normalizeCombatText(`${heading}\n${rawText}`);

  if (value.includes("segredo") || value.includes("classificado")) return "SEGREDO / CLASSIFICADO";
  if (value.includes("balanceamento")) return "BALANCEAMENTO";
  if (value.includes("somente mestre") || value.includes("nota do mestre") || value.includes("mestre:")) return "SOMENTE MESTRE";
  if (value.includes("dev") || value.includes("organizacao") || value.includes("conversao") || value.includes("arquivo de fichas")) return "DEV / ORGANIZAÇÃO";
  if (value.includes("visivel ao piloto") || value.includes("visivel para piloto")) return "VISÍVEL AO PILOTO";
  if (value.includes("condicoes que aplica") || value.includes("condicao aplicada")) return "CONDIÇÃO APLICADA";
  if (value.includes("condicoes que sofre") || value.includes("condicao sofrida")) return "CONDIÇÃO SOFRIDA";
  if (value.includes("fluxo") || value.includes("sincronia") || value.includes("drift") || value.includes("ressonancia")) return "FLUXO / SINCRONIA";
  if (value.includes("calor")) return "CALOR";
  if (value.includes("estresse")) return "ESTRESSE";
  if (value.includes("dano") || value.includes("avaria") || value.includes("integridade") || value.includes("local de impacto")) return "DANO / AVARIA";
  if (value.includes("ficha rapida") || value.includes("leitura rapida")) return "FICHA RÁPIDA";
  if (value.includes("sistema especial") || value.includes("marcador especial") || value.includes("sistemas")) return "SISTEMA ESPECIAL";
  if (value.includes("manobra")) return "MANOBRA";
  if (value.includes("ataque") || value.includes("armamento") || value.includes("arma")) return "ATAQUE";
  if (value.includes("defesa") || value.includes("blindagem") || value.includes("escudo")) return "DEFESA";
  if (value.includes("uso em mesa") || value.includes("rolagem") || value.includes("teste")) return "USO EM MESA";
  if (value.includes("uso narrativo") || value.includes("narrativo") || value.includes("papel em campanha")) return "USO NARRATIVO";
  if (value.includes("combate")) return "COMBATE";
  if (value.includes("atributo") || value.includes("forca") || value.includes("agilidade") || value.includes("constituicao")) return "ATRIBUTOS";

  return "Texto Integral / Outros Blocos";
}

export function extractJaegerCombatSection(content: string, entry: JaegerCombatIndexEntry) {
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/);
  const titleNeedle = normalizeCombatText(entry.title);
  const startIndex = lines.findIndex((line) => /^#{1,3}\s+/.test(line) && normalizeCombatText(line).includes(titleNeedle));

  if (startIndex < 0) return content;

  let endIndex = lines.length;
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    if (/^#\s+/.test(lines[index])) {
      endIndex = index;
      break;
    }
  }

  return lines.slice(startIndex, endIndex).join("\n").trim();
}

export function parseJaegerCombatBlocks(content: string): JaegerCombatBlock[] {
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/);
  const blocks: JaegerCombatBlock[] = [];
  let currentLines: string[] = [];
  let currentHeading = "Texto Integral / Outros Blocos";
  let currentLevel = 0;

  function pushBlock() {
    const rawText = currentLines.join("\n").trim();
    if (!rawText) return;
    blocks.push({
      id: `combat-block-${blocks.length + 1}`,
      heading: currentHeading,
      level: currentLevel,
      rawText,
      category: classifyBlock(rawText, currentHeading),
    });
  }

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      pushBlock();
      currentLevel = headingMatch[1].length;
      currentHeading = headingMatch[2].trim();
      currentLines = [line];
      continue;
    }
    currentLines.push(line);
  }

  pushBlock();
  return blocks.length
    ? blocks
    : [
        {
          id: "combat-block-1",
          heading: "Texto Integral / Outros Blocos",
          level: 0,
          rawText: content,
          category: "Texto Integral / Outros Blocos",
        },
      ];
}

export function filterBlocksForPilot(blocks: JaegerCombatBlock[]) {
  return blocks.filter((block) => !MASTER_ONLY_COMBAT_CATEGORIES.has(block.category));
}
