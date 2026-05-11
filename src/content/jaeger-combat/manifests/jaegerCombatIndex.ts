export const MARK_V_NOT_IMPORTED_MESSAGE = "Ficha de combate Mark V ainda não importada.";

export type JaegerCombatMark = "mark-1" | "mark-2" | "mark-3" | "mark-4" | "mark-5" | "mark-6";
export type JaegerCombatSourceFile = "mark-1.md" | "mark-2.md" | "mark-3.md" | "mark-4.md" | "mark-5.md" | "mark-6.md";
export type JaegerCombatVisibility = "master" | "pilot" | "public";

export type JaegerCombatIndexEntry = {
  jaegerId: string;
  mark: JaegerCombatMark;
  sourceFile: JaegerCombatSourceFile | null;
  title: string;
  hasCombatSheet: boolean;
  visibilityDefault: JaegerCombatVisibility;
  pilotVisibleSections: string[];
  masterOnlySections: string[];
  tags: string[];
  order: number;
};

const pilotVisibleSections = [
  "identidade",
  "atributos",
  "combate",
  "ataques-rapidos",
  "manobras",
  "ficha-rapida",
  "interacao-com-atributos-dos-players",
  "dano-atual-visivel",
  "calor-estresse-fluxo",
  "instrucoes-operacionais",
];

const masterOnlySections = [
  "nota-do-mestre",
  "somente-mestre",
  "segredos",
  "classificado",
  "balanceamento",
  "uso-narrativo-restrito",
  "dev-organizacao",
];

function entry(
  order: number,
  jaegerId: string,
  title: string,
  mark: JaegerCombatMark,
  sourceFile: JaegerCombatSourceFile | null,
): JaegerCombatIndexEntry {
  return {
    jaegerId,
    mark,
    sourceFile,
    title,
    hasCombatSheet: sourceFile !== null,
    visibilityDefault: "master",
    pilotVisibleSections,
    masterOnlySections,
    tags: [mark, "combate", "jaeger", sourceFile ? "ficha-importada" : "ficha-pendente"],
    order,
  };
}

export const jaegerCombatIndex: JaegerCombatIndexEntry[] = [
  entry(1, "brawler-yukon", "Brawler Yukon", "mark-1", "mark-1.md"),
  entry(2, "coyote-tango", "Coyote Tango", "mark-1", "mark-1.md"),
  entry(3, "horizon-brave", "Horizon Brave", "mark-1", "mark-1.md"),
  entry(4, "tacit-ronin", "Tacit Ronin", "mark-1", "mark-1.md"),
  entry(5, "romeo-blue", "Romeo Blue", "mark-1", "mark-1.md"),
  entry(6, "cherno-alpha", "Cherno Alpha", "mark-1", "mark-1.md"),
  entry(7, "diablo-intercept", "Diablo Intercept", "mark-2", "mark-2.md"),
  entry(8, "solar-prophet", "Solar Prophet", "mark-2", "mark-2.md"),
  entry(9, "puma-real", "Puma Real", "mark-2", "mark-2.md"),
  entry(10, "eden-assassin", "Eden Assassin", "mark-2", "mark-2.md"),
  entry(11, "gipsy-danger", "Gipsy Danger", "mark-3", "mark-3.md"),
  entry(12, "matador-fury", "Matador Fury", "mark-3", "mark-3.md"),
  entry(13, "shaolin-rogue", "Shaolin Rogue", "mark-3", "mark-3.md"),
  entry(14, "vulcan-specter", "Vulcan Specter", "mark-3", "mark-3.md"),
  entry(15, "chrome-brutus", "Chrome Brutus", "mark-3", "mark-3.md"),
  entry(16, "atlas-destroyer", "Atlas Destroyer", "mark-3", "mark-3.md"),
  entry(17, "crimson-typhoon", "Crimson Typhoon", "mark-4", "mark-4.md"),
  entry(18, "hydra-corinthian", "Hydra Corinthian", "mark-4", "mark-4.md"),
  entry(19, "nova-hyperion", "Nova Hyperion", "mark-4", "mark-4.md"),
  entry(20, "echo-saber", "Echo Saber", "mark-4", "mark-4.md"),
  entry(21, "mammoth-apostle", "Mammoth Apostle", "mark-5", null),
  entry(22, "chaos-nemesis", "Chaos Nemesis", "mark-5", null),
  entry(23, "horizon-bravo", "Horizon Bravo", "mark-5", null),
  entry(24, "striker-eureka", "Striker Eureka", "mark-5", "mark-5.md"),
  entry(25, "bracer-phoenix", "Bracer Phoenix", "mark-5", "mark-5.md"),
  entry(26, "chronos-berserker", "Chronos Berserker", "mark-5", "mark-5.md"),
  entry(27, "guardian-bravo", "Guardian Bravo", "mark-6", "mark-6.md"),
  entry(28, "titan-redeemer", "Titan Redeemer", "mark-6", "mark-6.md"),
  entry(29, "saber-athena", "Saber Athena", "mark-6", "mark-6.md"),
  entry(30, "gipsy-avenger", "Gipsy Avenger", "mark-6", "mark-6.md"),
  entry(31, "november-ajax", "November Ajax", "mark-6", "mark-6.md"),
  entry(32, "valor-omega", "Valor Omega", "mark-6", "mark-6.md"),
  entry(33, "murder-witch", "Murder Witch", "mark-6", "mark-6.md"),
  entry(34, "hunter-vertigo", "Hunter Vertigo", "mark-6", "mark-6.md"),
];

export function getJaegerCombatEntry(jaegerId: string) {
  return jaegerCombatIndex.find((entryItem) => entryItem.jaegerId === jaegerId) ?? null;
}
