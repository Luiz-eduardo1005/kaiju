import type { Suit } from "./types";

export const suits: Suit[] = [
  {
    id: "tak-40",
    nome: "TAK-40",
    geracao: "Padrao 2040",
    funcao: "Operacao urbana e contencao de Yoju",
    status: "Em uso por unidades urbanas",
    forca: "Ampliada",
    mobilidade: "Tatica urbana",
    resistencia: "Contaminacao leve e impacto moderado",
    tags: ["Traje", "Ativo", "Publico"],
    descricao:
      "Traje anti-Kaiju padrao usado por unidades urbanas. Amplifica forca, protege contra contaminacao leve, possui sensores biologicos e suporte de armas acopladas. Nao e feito para enfrentar Kaijus colossais, mas e essencial contra ameacas menores, tuneis, areas contaminadas e evacuacao armada.",
  },
  {
    id: "limpeza-biologica-classe-c",
    nome: "Unidade de Limpeza Biologica Classe C",
    funcao: "Remocao, corte e neutralizacao de restos Kaiju",
    status: "Operacional",
    resistencia: "Protecao quimica e biologica pesada",
    armasAcopladas: ["Laminas termicas", "Mangueiras de selante", "Recipientes de contencao"],
    tags: ["Traje", "Ativo", "Publico"],
    descricao:
      "Traje pesado, amarelo-acinzentado, usado por equipes de limpeza. Possui mascara completa, visor escuro, protecao quimica, laminas termicas, mangueiras de selante e recipientes de contencao. Operadores de limpeza nao sao tratados como herois, mas fazem um dos trabalhos mais perigosos do mundo.",
  },
  {
    id: "simulador-compatibilidade-inicial",
    nome: "Simulador de Compatibilidade Inicial",
    funcao: "Testes de entrada",
    status: "Uso em recrutamento",
    compatibilidade: "Avalia resistencia fisica, resposta neural e rejeicao corporal",
    tags: ["Traje", "Publico"],
    descricao:
      "Traje basico usado no recrutamento para medir resistencia fisica, resposta neural, tolerancia a peso, coordenacao motora e rejeicao corporal.",
  },
];
