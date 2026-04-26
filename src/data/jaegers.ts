import type { Jaeger } from "./types";

export const jaegers: Jaeger[] = [
  {
    id: "atlas-prime",
    nome: "Atlas-Prime",
    geracao: "Proto / Primeira geracao",
    altura: "78 metros",
    statusPublico: "Destruido / preservado historicamente",
    statusSecreto: "Fragmento reaparece em 2040 vindo da fenda",
    pilotos: "Elias Ward e Ren Akiyama",
    funcao: "Primeiro Jaeger funcional / combate pesado",
    tags: ["Jaeger", "Lendario", "Classificado"],
    descricao:
      "Atlas-Prime era o primeiro Jaeger funcional da humanidade. Nao era elegante nem refinado. Era pesado, bruto, com blindagem naval reaproveitada, placas cinzentas imensas, articulacoes expostas, reator nuclear selado no peito e uma estrutura que parecia mais uma plataforma de guerra que aprendeu a andar do que um robo heroico. Mesmo assim, ele andou. E quando andou, mudou o mundo.",
    historia: "Derrotou Raijin-Delta em Hong Kong, em 2006, inaugurando a Era dos Jaegers.",
    segredo:
      "Em 2040, um fragmento do Atlas-Prime reaparece de uma fenda, coberto de tecido Kaiju vivo e transmitindo uma mensagem de socorro de 2006.",
    transmissao:
      "\"Aqui e Atlas-Prime... Pilotos ainda em Drift... Nao fechem a fenda... Tem algo usando nossos mortos... Helena estava certa... Eles aprenderam a construir Jaegers tambem.\"",
  },
  {
    id: "atlas-prime-ii",
    nome: "Atlas-Prime II",
    geracao: "Segunda geracao derivada do Atlas",
    statusPublico: "Destruido por Slathern",
    statusSecreto: "Cockpit arrancado; restos parcialmente nao recuperados",
    funcao: "Combate pesado e simbolo de continuidade",
    tags: ["Jaeger", "Morto", "Classificado"],
    descricao:
      "Criado como sucessor simbolico do primeiro Atlas. Mais avancado, mais rapido e mais estavel que o original, mas ainda carregava o peso emocional do nome Atlas.",
    historia: "Foi destruido por Slathern durante a batalha que encerrou a Era Dourada dos Jaegers.",
  },
  {
    id: "cherno-valkyr",
    nome: "Cherno-Valkyr",
    geracao: "Jaeger pesado",
    statusPublico: "Destruido por Slathern",
    funcao: "Tanque nuclear ambulante",
    tags: ["Jaeger", "Morto", "Lendario"],
    descricao:
      "Jaeger lento, pesado, de blindagem extrema. Projetado para aguentar dano enquanto outros Jaegers atacavam. Tinha reator altamente protegido e estrutura robusta.",
    historia: "Foi partido ao meio por Slathern.",
  },
  {
    id: "horizon-fang",
    nome: "Horizon Fang",
    geracao: "Jaeger de mobilidade",
    statusPublico: "Destruido por Slathern",
    funcao: "Velocidade e laminas",
    tags: ["Jaeger", "Morto", "Lendario"],
    descricao:
      "Jaeger mais leve, agil e agressivo, equipado com laminas retrateis. Criado para flanquear Kaijus e atacar pontos fracos.",
    historia: "Foi afogado e esmagado contra o fundo do mar por Slathern.",
  },
  {
    id: "mourning-star",
    nome: "Mourning Star",
    geracao: "Projeto secreto",
    statusPublico: "Sacrificado contra Slathern",
    statusSecreto: "Amara Sato-Qadir assumiu o Drift sozinha e venceu",
    funcao: "Contencao extrema / arma final",
    tags: ["Jaeger", "Nivel Omega", "Classificado"],
    descricao:
      "Jaeger experimental com reator instavel no peito. Projetado como ultimo recurso contra ameacas impossiveis. Oficialmente era uma plataforma de contencao; secretamente era uma bomba ambulante.",
    historia:
      "Derrotou Slathern. A versao publica atribui a vitoria ao Comandante Julian Cross. A verdade e que Amara Sato-Qadir assumiu o Drift sozinha por 94 segundos e arrancou o nucleo do Kaiju.",
  },
  {
    id: "crimson-daito",
    nome: "Crimson Daito",
    geracao: "Jaeger urbano",
    statusPublico: "Operacional ou reserva",
    funcao: "Combate urbano e defesa de metropoles",
    tags: ["Jaeger", "Ativo"],
    descricao:
      "Jaeger projetado para operar proximo a cidades densas, com movimentos mais precisos e protocolos de dano colateral reduzido.",
  },
  {
    id: "aegis-meridian",
    nome: "Aegis Meridian",
    geracao: "Defesa costeira",
    statusPublico: "Operacional",
    funcao: "Defesa de muralhas, portos e bases costeiras",
    tags: ["Jaeger", "Ativo"],
    descricao:
      "Jaeger especializado em defesa de posicoes estrategicas, equipado com escudos, sistemas de ancoragem e armamento de contencao.",
  },
];
