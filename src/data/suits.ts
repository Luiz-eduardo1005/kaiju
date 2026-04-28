import type { Suit } from "./types";

export const suits: Suit[] = [
  {
    id: "traje-limpeza-biologica-2006",
    nome: "Traje Industrial de Limpeza Biológica",
    geracao: "Industrial / Era 2006",
    funcao: "Limpeza biológica pós-Kaiju e contato com resíduos leves",
    status: "Uso por equipes de limpeza biológica",
    resistencia: "Proteção limitada contra fluidos, esporos e poeira contaminada",
    armasAcopladas: ["Ferramentas industriais", "Selantes", "Pulverizadores manuais"],
    tags: ["Traje", "Ativo", "Publico"],
    descricao:
      "Em 2006, o que existe são trajes industriais de limpeza biológica, trajes químicos reforçados e equipamentos de contenção usados por equipes que entram em áreas contaminadas após eventos Kaiju. Eles não foram feitos para combate direto contra Kaijus, mas para sobreviver a resíduos, fluidos, esporos e organismos menores. Falhas de vedação, contaminação por fragmentos ativos e exposição a resíduos Kaiju já causaram mortes.",
  },
  {
    id: "traje-contencao-quimica-classe-c",
    nome: "Traje de Contenção Química Classe C",
    geracao: "Químico reforçado / Era 2006",
    funcao: "Isolamento de contaminação leve e entrada curta em zonas de risco",
    status: "Operacional limitado",
    resistencia: "Vedacao parcial e filtros industriais",
    armasAcopladas: ["Filtro industrial", "Luvas pesadas", "Máscara de respiração"],
    tags: ["Traje", "Ativo", "Publico"],
    descricao:
      "Traje químico reforçado usado por equipes civis e militares em zonas com poeira, fumaça, fluidos suspeitos ou resquícios biológicos menores. Ele oferece proteção narrativa contra exposição leve, mas é insuficiente contra ameaças reais, contato direto com tecido Kaiju ativo ou infestação Yoju.",
  },
  {
    id: "equipamento-resposta-pos-kaiju",
    nome: "Equipamento de Resposta Pos-Kaiju",
    geracao: "Kit de campo / Era 2006",
    funcao: "Sinalização, vedação, amostragem e resposta emergencial após incidente Kaiju",
    status: "Uso em treinamento e operacoes de apoio",
    resistencia: "Depende das pecas usadas em campo",
    armasAcopladas: ["Fita de vedação", "Caixa de amostras", "Detector químico simples", "Máscara industrial"],
    tags: ["Traje", "Experimental", "Publico"],
    descricao:
      "Conjunto de peças de campo usado por equipes que chegam depois de alertas, evacuações ou contato com resíduos. Não é tecnologia avançada nem traje militar anti-Kaiju confiável. Serve para marcar áreas, recolher amostras, vedar rachaduras e tentar manter operadores vivos até a chegada de suporte especializado.",
  },
];
