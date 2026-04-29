import type { Npc } from "./types";

export const npcs: Npc[] = [
  {
    id: "helena-sato",
    nome: "Helena Sato",
    visibilidade: "masterOnly",
    idade: "Adulta/madura em 2006",
    cargoPublico: "Nenhum / oficialmente apagada",
    cargoSecreto: "Bióloga abissal, pesquisadora Kaiju e verdadeira responsável pela queda de Tressarak",
    tags: ["NPC", "Classificado", "Nível Omega"],
    descricao:
      "Helena Sato foi apagada da história oficial, mas é uma das mentes centrais por trás da compreensão dos núcleos Kaiju. Em 2006, sua influência existe em arquivos, relatórios ocultos, Base Nereu e pesquisas que o público jamais viu.",
    segredo:
      "Ela identificou o núcleo de Tressarak, executou a manobra que matou o primeiro Kaiju e sabe que tecidos Kaiju não se comportam como matéria morta.",
    usoNaCampanha:
      "Pode surgir por documentos apagados, gravações, memórias de Drift, relatórios da Base Nereu ou contato indireto com pesquisadores do Projeto Atlas.",
  },
  {
    id: "viktor-leonov",
    nome: "Viktor Leonov",
    visibilidade: "public",
    idade: "A definir",
    cargo: "Almirante / herói oficial da queda de Tressarak",
    tags: ["NPC", "Público"],
    descricaoPublica:
      "Viktor Leonov é celebrado como o comandante responsável pela operação que derrotou Tressarak em 1984. Seu nome aparece em livros, documentários, discursos oficiais e materiais de recrutamento.",
    segredo:
      "Leonov não executou a manobra decisiva contra Tressarak. Ele recebeu crédito por uma vitória que dependeu de Helena Sato.",
    usoNaCampanha:
      "O player provavelmente conhece seu nome pelos registros históricos. Mais tarde pode encontrar inconsistências entre documentos oficiais e registros secretos.",
  },
  {
    id: "instrutores-atlas",
    nome: "Instrutores do Programa Atlas",
    visibilidade: "public",
    cargo: "Equipe militar de seleção Jaeger",
    tags: ["NPC", "Público", "Jaeger"],
    descricao:
      "Soldados, médicos e avaliadores que conduzem a seleção de candidatos em 2006. Eles não tratam o teste como sonho heroico; tratam como filtro brutal para descobrir quem não quebra antes do Drift.",
    usoNaCampanha:
      "Podem pressionar, avaliar, intimidar ou proteger candidatos durante as fases do Teste de Seleção Jaeger.",
  },
];
