import type { Npc } from "./types";

export const npcs: Npc[] = [
  {
    id: "helena-sato",
    nome: "Helena Sato",
    visibilidade: "masterOnly",
    idade: "Muito idosa em 2040",
    cargoPublico: "Desconhecido / oficialmente apagada",
    cargoSecreto: "Biologa abissal, verdadeira responsavel pela queda de Tressarak, figura central da pesquisa Kaiju",
    tags: ["NPC", "Classificado", "Nivel Omega"],
    descricao:
      "Mulher idosa, lucida, marcada por decadas de culpa, pesquisa e silencio. Foi apagada da historia oficial, mas sua influencia atravessa toda a guerra. Entende os Kaijus melhor que quase qualquer pessoa viva.",
    segredo:
      "Ela descobriu o nucleo de Tressarak, orientou operacoes posteriores, corrigiu o erro cientifico que permitiu a criacao das armas enumeradas e talvez saiba que a fenda nao e origem, mas cicatriz.",
    usoNaCampanha:
      "Pode aparecer como mentora oculta, contato secreto, prisioneira protegida ou fonte de revelacoes.",
  },
  {
    id: "viktor-leonov",
    nome: "Viktor Leonov",
    visibilidade: "public",
    cargo: "Almirante / heroi oficial",
    tags: ["NPC", "Publico"],
    descricaoPublica:
      "Comandante da operacao que derrotou Tressarak. Figura historica celebrada, com avenidas, estatuas e documentarios em seu nome.",
    segredo:
      "Nao foi o verdadeiro responsavel pela queda do primeiro Kaiju. Recebeu credito por decisao politica.",
  },
  {
    id: "amara-sato-qadir",
    nome: "Amara Sato-Qadir",
    visibilidade: "masterOnly",
    cargo: "Piloto lendaria / sobrevivente de Drift extremo",
    tags: ["NPC", "Classificado", "Lendario"],
    descricao:
      "Neta de Helena Sato e filha adotiva de Mara Qadir. Assumiu o Drift sozinha por 94 segundos durante a batalha contra Slathern, algo considerado impossivel.",
    segredo: "A verdadeira responsavel pela vitoria final contra Slathern.",
  },
  {
    id: "elias-ward",
    nome: "Elias Ward",
    visibilidade: "public",
    cargo: "Piloto do Atlas-Prime",
    tags: ["NPC", "Publico", "Lendario"],
    descricao: "Ex-piloto de caca e um dos dois pilotos do Atlas-Prime na batalha contra Raijin-Delta.",
  },
  {
    id: "ren-akiyama",
    nome: "Ren Akiyama",
    visibilidade: "public",
    cargo: "Engenheira neural e piloto do Atlas-Prime",
    tags: ["NPC", "Publico", "Lendario"],
    descricao:
      "Copiloto de Elias Ward. Percebeu o momento de carga do pulso EMP de Raijin-Delta e ajudou a executar a manobra que venceu a batalha.",
  },
  {
    id: "julian-cross",
    nome: "Julian Cross",
    visibilidade: "public",
    cargo: "Comandante / piloto celebrado do Mourning Star",
    tags: ["NPC", "Publico", "Classificado"],
    descricaoPublica: "Heroi oficial da batalha contra Slathern.",
    segredo: "Morreu antes da manobra final. O credito real deveria ser de Amara Sato-Qadir.",
  },
];
