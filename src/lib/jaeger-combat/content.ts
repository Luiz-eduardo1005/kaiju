import { readFileSync } from "node:fs";
import path from "node:path";
import {
  getJaegerCombatEntry,
  jaegerCombatIndex,
  MARK_V_NOT_IMPORTED_MESSAGE,
  type JaegerCombatIndexEntry,
} from "@/content/jaeger-combat/manifests/jaegerCombatIndex";
import { extractJaegerCombatSection, parseJaegerCombatBlocks } from "@/lib/jaeger-combat/parser";

export type JaegerCombatContentBundle = {
  entry: JaegerCombatIndexEntry;
  rawContent: string;
  jaegerContent: string;
  blocks: ReturnType<typeof parseJaegerCombatBlocks>;
};

const rawContentCache = new Map<string, string>();

function readRawCombatFile(sourceFile: string) {
  if (rawContentCache.has(sourceFile)) return rawContentCache.get(sourceFile) ?? "";
  const filePath = path.join(process.cwd(), "src", "content", "jaeger-combat", "raw", sourceFile);
  const content = readFileSync(filePath, "utf8");
  rawContentCache.set(sourceFile, content);
  return content;
}

export function getJaegerCombatContent(jaegerId: string): JaegerCombatContentBundle | null {
  const entry = getJaegerCombatEntry(jaegerId);
  if (!entry) return null;

  if (!entry.hasCombatSheet || !entry.sourceFile) {
    return {
      entry,
      rawContent: MARK_V_NOT_IMPORTED_MESSAGE,
      jaegerContent: MARK_V_NOT_IMPORTED_MESSAGE,
      blocks: parseJaegerCombatBlocks(MARK_V_NOT_IMPORTED_MESSAGE),
    };
  }

  const rawContent = readRawCombatFile(entry.sourceFile);
  const jaegerContent = extractJaegerCombatSection(rawContent, entry);
  return {
    entry,
    rawContent,
    jaegerContent,
    blocks: parseJaegerCombatBlocks(jaegerContent),
  };
}

export function getAllJaegerCombatContent() {
  return jaegerCombatIndex.map((entry) => getJaegerCombatContent(entry.jaegerId)).filter(Boolean) as JaegerCombatContentBundle[];
}
