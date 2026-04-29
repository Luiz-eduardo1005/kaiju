import type { Jaeger } from "./types";

export const jaegers: Jaeger[] = [
  {
    id: "atlas-prime",
    nome: "Atlas-Prime",
    geracao: "Proto / Primeira geracao",
    altura: "78 metros",
    statusPublico: "Em testes / ainda sem vitória comprovada",
    statusSecreto: "Funcional, mas instável; o Drift ainda quase matou pilotos em sincronizações ruins",
    pilotos: "Pilotos ainda em seleção pelo Programa Atlas",
    funcao: "Primeiro Jaeger funcional / protótipo de combate pesado",
    tags: ["Jaeger", "Experimental", "Público"],
    descricao:
      "Atlas-Prime é o primeiro Jaeger funcional da humanidade. Não é elegante nem refinado. É pesado, bruto, com blindagem naval reaproveitada, placas cinzentas imensas, articulações expostas, cabos ainda visíveis em partes do corpo e um reator selado no peito. Em 2006, ele representa a maior esperança do Programa Atlas: uma plataforma de guerra que aprendeu a ficar de pé antes de provar que consegue sobreviver a uma batalha real.",
    historia:
      "Em 2006, Atlas-Prime ainda não inaugurou uma era de vitórias. Ele já andou em testes, já moveu braços, já resistiu a impactos simulados e já quase matou pilotos em sincronizações ruins. O Programa Atlas busca candidatos capazes de suportar o Drift para transformar o protótipo em arma real.",
    segredo:
      "Atlas-Prime é funcional, mas não confiável. O Drift ainda é pouco compreendido, o sistema neural tem efeitos colaterais graves e a máquina pode se tornar um caixão de metal se a conexão falhar durante combate real.",
  },
  {
    id: "vanguard-01",
    nome: "Vanguard-01",
    geracao: "Primeira fase / suporte experimental",
    altura: "70 metros",
    statusPublico: "Protótipo de suporte / parcialmente operacional",
    statusSecreto:
      "Ainda não está pronto para combate real contra Kaijus de classe alta; sofre perda de sincronia em movimentos de impacto",
    pilotos: "Duplas de teste do Programa Atlas",
    funcao: "Suporte, testes de mobilidade, contenção auxiliar e treinamento avançado",
    tags: ["Jaeger", "Experimental", "Público"],
    descricao:
      "Vanguard-01 é um dos primeiros Jaegers de suporte criados depois dos testes estruturais do Atlas-Prime. Ele é menor, mais simples e mais limitado, com cerca de 70 metros de altura. Sua blindagem é menos pesada que a do Atlas, mas seu sistema hidráulico responde melhor em movimentos básicos.",
    historia:
      "Vanguard-01 é apresentado internamente como uma unidade de apoio, criada para testar mobilidade, equilíbrio e resposta em campo. Não é tratado como o símbolo do projeto, mas como prova de que outros Jaegers podem existir além do Atlas-Prime.",
    segredo:
      "Em combate real, Vanguard-01 provavelmente seria usado apenas como suporte, distração, contenção ou evacuação pesada. Seu Drift é mais instável que o do Atlas-Prime e ainda perde sincronia em impactos fortes.",
  },
  {
    id: "iron-saint",
    nome: "Iron Saint",
    geracao: "Primeira fase / defesa pesada",
    altura: "Em montagem",
    statusPublico: "Em construção / testes parciais",
    statusSecreto:
      "Ainda não consegue realizar Drift completo; há preocupação de que sua massa seja grande demais para resposta neural rápida",
    pilotos: "Nenhuma dupla definitiva",
    funcao: "Defesa pesada, contenção, bloqueio de avanços Kaiju e proteção de áreas estratégicas",
    tags: ["Jaeger", "Experimental", "Restrito"],
    descricao:
      "Iron Saint é um Jaeger pesado ainda em fase de montagem em 2006. Seu corpo é largo, com estrutura mais defensiva, placas frontais espessas e braços projetados para agarrar e segurar criaturas colossais. Diferente do Atlas-Prime, que foi criado para provar que um Jaeger podia lutar, Iron Saint está sendo criado para provar que um Jaeger pode resistir.",
    historia:
      "Poucos sabem da existência completa do Iron Saint. Ele circula entre recrutas como uma segunda linha de defesa em desenvolvimento. Dentro da Base Atlas, alguns candidatos conseguem ver partes dele nos hangares: um braço preso por correntes, uma perna incompleta e placas de blindagem sendo soldadas.",
    segredo:
      "Se finalizado, Iron Saint pode ser excelente para defesa, mas péssimo contra Kaijus rápidos. Seus testes por partes ainda não provam que a máquina sobreviveria a uma conexão neural completa.",
  },
  {
    id: "atlas-prime-ii",
    nome: "Atlas-Prime II",
    geracao: "Segunda geracao derivada do Atlas",
    statusPublico: "Destruído por Slathern",
    statusSecreto: "Cockpit arrancado; restos parcialmente não recuperados",
    funcao: "Combate pesado é símbolo de continuidade",
    tags: ["Jaeger", "Morto", "Classificado"],
    descricao:
      "Criado como sucessor simbolico do primeiro Atlas. Mais avancado, mais rápido e mais estavel que o original, mas ainda carregava o peso emocional do nome Atlas.",
    historia: "Foi destruído por Slathern durante a batalha que encerrou a Era Dourada dos Jaegers.",
  },
  {
    id: "cherno-valkyr",
    nome: "Cherno-Valkyr",
    geracao: "Jaeger pesado",
    statusPublico: "Destruído por Slathern",
    funcao: "Tanque nuclear ambulante",
    tags: ["Jaeger", "Morto", "Lendário"],
    descricao:
      "Jaeger lento, pesado, de blindagem extrema. Projetado para aguentar dano enquanto outros Jaegers atacavam. Tinha reator altamente protegido e estrutura robusta.",
    historia: "Foi partido ao meio por Slathern.",
  },
  {
    id: "horizon-fang",
    nome: "Horizon Fang",
    geracao: "Jaeger de mobilidade",
    statusPublico: "Destruído por Slathern",
    funcao: "Velocidade e laminas",
    tags: ["Jaeger", "Morto", "Lendário"],
    descricao:
      "Jaeger mais leve, ágil e agressivo, equipado com laminas retrateis. Criado para flanquear Kaijus e atacar pontos fracos.",
    historia: "Foi afogado e esmagado contra o fundo do mar por Slathern.",
  },
  {
    id: "mourning-star",
    nome: "Mourning Star",
    geracao: "Projeto secreto",
    statusPublico: "Sacrificado contra Slathern",
    statusSecreto: "Amara Sato-Qadir assumiu o Drift sozinha e venceu",
    funcao: "Contenção extrema / arma final",
    tags: ["Jaeger", "Nível Omega", "Classificado"],
    descricao:
      "Jaeger experimental com reator instável no peito. Projetado como último recurso contra ameaças impossíveis. Oficialmente era uma plataforma de contenção; secretamente era uma bomba ambulante.",
    historia:
      "Derrotou Slathern. A versão publica atribui a vitória ao Comandante Julian Cross. A verdade é que Amara Sato-Qadir assumiu o Drift sozinha por 94 segundos e arrancou o núcleo do Kaiju.",
  },
  {
    id: "crimson-daito",
    nome: "Crimson Daito",
    geracao: "Jaeger urbano",
    statusPublico: "Operacional ou reserva",
    funcao: "Combate urbano e defesa de metropoles",
    tags: ["Jaeger", "Ativo"],
    descricao:
      "Jaeger projetado para operar próximo a cidades densas, com movimentos mais precisos e protocolos de dano colateral reduzido.",
  },
  {
    id: "aegis-meridian",
    nome: "Aegis Meridian",
    geracao: "Defesa costeira",
    statusPublico: "Operacional",
    funcao: "Defesa de muralhas, portos e bases costeiras",
    tags: ["Jaeger", "Ativo"],
    descricao:
      "Jaeger especializado em defesa de posicoes estrategicas, equipado com escudos, sistemas de ancoragem e armamento de contenção.",
  },
];
