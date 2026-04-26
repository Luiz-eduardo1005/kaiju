export const worldStatus = {
  anoAtual: "2040",
  cidadeInicial: "Nova Aurora",
  alertaAtual: "Verde",
  programaRecrutamento: "Aberto",
  atividadeKaiju: "Baixa, mas instavel",
  statusJaegers: "Operacionais",
  statusTrajes: "Em uso por unidades urbanas",
  statusArmas: "Restritas a operadores compativeis",
  eventoSecreto:
    "Fragmento do Atlas-Prime reaparece de uma fenda emitindo sinal de socorro de 2006",
};

export const dashboardSections = [
  {
    title: "Historia",
    href: "/historia",
    category: "historia",
    description: "Versao publica, linha do tempo e arquivos reais da guerra Kaiju.",
  },
  {
    title: "Kaijus",
    href: "/kaijus",
    category: "kaijus",
    description: "Dossies das criaturas, niveis de ameaca, habilidades e origens ocultas.",
  },
  {
    title: "Jaegers",
    href: "/jaegers",
    category: "jaegers",
    description: "Maquinas colossais, pilotos, batalhas famosas e perdas classificadas.",
  },
  {
    title: "Armas Enumeradas",
    href: "/armas-enumeradas",
    category: "armas-enumeradas",
    description: "Sistemas vivos domesticados, raros e perigosos, derivados de restos Kaiju.",
  },
  {
    title: "Trajes Anti-Kaiju",
    href: "/trajes",
    category: "trajes",
    description: "Unidades urbanas, limpeza biologica, simuladores e operadores de elite.",
  },
  {
    title: "Cidade",
    href: "/cidade",
    category: "cidade",
    description: "Nova Aurora, seus bairros, rotas de evacuacao e cicatrizes visiveis.",
  },
  {
    title: "Mapa",
    href: "/mapa",
    category: "mapa",
    description: "Mapa operacional textual para navegar por zonas civis, militares e restritas.",
  },
  {
    title: "NPCs",
    href: "/npcs",
    category: "npcs",
    description: "Figuras publicas, pilotos, cientistas apagados e mentores ocultos.",
  },
  {
    title: "Testes de Recrutamento",
    href: "/recrutamento",
    category: "recrutamento",
    description: "Etapas de avaliacao fisica, neural, psicologica e de simulacao.",
  },
  {
    title: "Campanha / Sessoes",
    href: "/campanha",
    category: "campanha",
    description: "Premissa inicial, abertura, ganchos e registro futuro de sessoes.",
  },
  {
    title: "Arquivos Secretos",
    href: "/arquivos-secretos",
    category: "arquivos-secretos",
    description: "Conspiracoes, verdades ocultas e documentos que nunca chegaram ao publico.",
    restricted: true,
  },
] as const;
