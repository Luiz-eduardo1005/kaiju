import {
  campaign,
  cityLocations,
  historyEntries,
  jaegers,
  kaijus,
  npcs,
  recruitmentSteps,
  suits,
  weapons,
  type SearchableEntry,
  type TagName,
} from "@/data";

export const searchIndex: SearchableEntry[] = [
  ...historyEntries.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    description: `${item.summary ?? ""} ${item.text}`,
    href: "/historia",
    category: "historia" as const,
    tags: item.tags,
    visibility: item.visibility,
  })),
  ...kaijus.map((item) => ({
    id: item.id,
    title: `${item.number} - ${item.name}`,
    subtitle: item.title,
    description: `${item.player.physicalDescription} ${item.player.history} ${item.master.physicalDescription} ${item.master.history} ${item.master.classifiedNotes ?? ""}`,
    href: `/kaijus/${item.id}`,
    category: "kaijus" as const,
    status: item.player.status,
    tags: item.tags,
  })),
  ...jaegers.map((item) => ({
    id: item.id,
    title: item.nome,
    subtitle: item.geracao,
    description: `${item.descricao} ${item.historia ?? ""} ${item.segredo ?? ""}`,
    href: `/jaegers/${item.id}`,
    category: "jaegers" as const,
    status: item.statusPublico,
    tags: item.tags,
  })),
  ...weapons.map((item) => ({
    id: item.id,
    title: `${item.numero} - ${item.nome}`,
    subtitle: item.tipo,
    description: `${item.descricao} ${item.efeitosColaterais ?? ""} ${item.historicoCriacao ?? ""}`,
    href: "/armas-enumeradas",
    category: "armas-enumeradas" as const,
    status: item.status,
    tags: item.tags,
  })),
  ...suits.map((item) => ({
    id: item.id,
    title: item.nome,
    subtitle: item.funcao,
    description: item.descricao,
    href: "/trajes",
    category: "trajes" as const,
    status: item.status,
    tags: item.tags,
  })),
  ...cityLocations.map((item) => ({
    id: item.id,
    title: item.nome,
    description: item.descricao,
    href: "/cidade",
    category: "cidade" as const,
    status: item.status,
    tags: item.tags,
  })),
  ...npcs.map((item) => ({
    id: item.id,
    title: item.nome,
    subtitle: item.cargo ?? item.cargoPublico,
    description: `${item.descricao ?? ""} ${item.descricaoPublica ?? ""} ${item.segredo ?? ""}`,
    href: "/npcs",
    category: "npcs" as const,
    tags: item.tags,
    visibility: item.visibilidade,
  })),
  ...recruitmentSteps.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.text,
    href: "/recrutamento",
    category: "recrutamento" as const,
    tags: ["Campanha" as TagName],
  })),
  {
    id: "campanha-o-sinal-de-2006",
    title: campaign.titulo,
    subtitle: `Campanha inicial - ${campaign.ano}`,
    description: `${campaign.premissa} ${campaign.abertura} ${campaign.eventoFuturo}`,
    href: "/campanha",
    category: "campanha",
    tags: ["Campanha", "Classificado"],
  },
  {
    id: "loja",
    title: "Loja",
    subtitle: "Compras",
    description: "Comprar alimentos, medicamentos, roupas, equipamentos taticos ficticios, ferramentas anti-Kaiju e treino.",
    href: "/shop",
    category: "loja",
    tags: ["Campanha"],
  },
  {
    id: "inventario",
    title: "Inventario",
    subtitle: "Itens do player",
    description: "Ver itens comprados, usar consumiveis e acompanhar efeitos ativos.",
    href: "/inventory",
    category: "inventario",
    tags: ["Campanha"],
  },
  {
    id: "banco",
    title: "Banco",
    subtitle: "Saldo e transacoes",
    description: "Ver saldo, historico bancario e fazer Transferencia Rapida entre players.",
    href: "/bank",
    category: "banco",
    tags: ["Campanha"],
  },
  {
    id: "ficha",
    title: "Ficha",
    subtitle: "Personagem",
    description: "Editar dados, vida atual, vida maxima e status do personagem.",
    href: "/character",
    category: "ficha",
    tags: ["Campanha"],
  },
  {
    id: "painel-mestre",
    title: "Painel do Mestre",
    subtitle: "Administracao",
    description: "Gerenciar players, vida, dinheiro, efeitos, inventario e logs.",
    href: "/master",
    category: "painel-mestre",
    tags: ["Campanha", "Classificado"],
    visibility: "masterOnly",
  },
];

export function filterEntries(
  entries: SearchableEntry[],
  query: string,
  mode: "player" | "master",
  category = "todos",
  tag = "todas",
) {
  const normalized = query.trim().toLowerCase();
  return entries.filter((entry) => {
    if (mode === "player" && ["secret", "masterOnly", "classified"].includes(entry.visibility ?? "")) {
      return false;
    }

    if (category !== "todos" && entry.category !== category) return false;
    if (tag !== "todas" && !entry.tags.includes(tag as TagName)) return false;
    if (!normalized) return true;

    const haystack = [
      entry.title,
      entry.subtitle,
      entry.description,
      entry.category,
      entry.status,
      ...entry.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export const allTags = Array.from(new Set(searchIndex.flatMap((item) => item.tags))).sort();
export const allCategories = Array.from(new Set(searchIndex.map((item) => item.category))).sort();
