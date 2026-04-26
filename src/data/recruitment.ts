import type { RecruitmentStep } from "./types";

export const recruitmentSteps: RecruitmentStep[] = [
  {
    id: "chegada",
    title: "Chegada ao Centro",
    text: "Assim que o candidato atravessa o portao, o mundo muda. La fora, a cidade era barulho, gente e vida. Aqui dentro e controle. O chao e de concreto polido, marcado por linhas brancas que organizam o fluxo de pessoas. Cada linha leva para um setor diferente. O teto e alto, cheio de estruturas metalicas, cabos e passarelas. Tecnicos e soldados se movem como se aquilo fosse rotina. Ha dezenas de jovens na fila. Alguns tentam parecer confiantes. Outros respiram fundo demais. Um instrutor passa com as maos para tras e diz: \"Cabeca pra frente. Documento na mao. Quem nao seguir instrucao sai antes de comecar.\"",
  },
  {
    id: "triagem",
    title: "Triagem Inicial",
    text: "Cabines com avaliadores, tablets militares e scanners. Perguntas sobre nome, idade, residencia, historico medico, contato previo com areas Kaiju, evacuacoes e antecedentes familiares.",
  },
  {
    id: "psicologico",
    title: "Teste Psicologico",
    text: "Sala escura, cadeira fixa, tela frontal. Imagens reais de ataques Kaiju, sirenes, predios caindo e pessoas correndo. Perguntas morais: \"Voce foge ou protege quem esta atras de voce?\" \"Voce salva uma pessoa ou ganha cinco segundos para evacuar cinquenta?\" \"Voce continua lutando sabendo que nao vai sobreviver?\" Nao ha resposta certa. O objetivo e medir reacao, medo, impulso e tomada de decisao.",
  },
  {
    id: "fisico",
    title: "Teste Fisico",
    text: "Corrida com obstaculos, simulacao de evacuacao, muros baixos, grades, fumaca, chao vibrando. Depois teste de forca: levantar estrutura metalica, arrastar boneco de resgate, empurrar porta travada. Instrutores avaliam resistencia, tecnica e capacidade de continuar sob fadiga.",
  },
  {
    id: "reacao",
    title: "Teste de Reacao",
    text: "Drones pequenos simulam ameacas. Luzes piscam, sons falsos confundem, alvos se movem rapido. O candidato precisa desviar, reagir e manter foco.",
  },
  {
    id: "compatibilidade-traje",
    title: "Compatibilidade com Traje",
    text: "O candidato veste um traje basico de recrutamento. Ele e pesado, desconfortavel e pressiona o corpo. Tecnicos monitoram batimentos, resposta muscular e rejeicao. O objetivo nao e lutar bem, mas ver se o corpo suporta amplificacao mecanica.",
  },
  {
    id: "pre-drift",
    title: "Pre-Drift",
    text: "Dois candidatos sentam em cadeiras neurais. Nao e Drift completo, apenas contato superficial. O candidato sente emocoes e memorias que nao sao suas: medo, corrida, dor, sirene, agua, queda. A conexao e cortada rapidamente. Avaliadores medem resistencia, compatibilidade e risco de colapso.",
  },
  {
    id: "simulacao-final",
    title: "Simulacao Final",
    text: "Cenario com fumaca, sirene, iluminacao vermelha e um Yoju mecanico. O objetivo nao e vencer, mas agir. Proteger, recuar, atacar, orientar civis, manter calma ou travar: tudo e avaliado.",
  },
  {
    id: "resultado",
    title: "Resultado e Designacao",
    text: "Resultados possiveis: Potencial Jaeger; Compativel com Traje; Unidade de Limpeza Tatica; Suporte Tecnico; Operacoes de Contencao; Reprovado com possibilidade de nova tentativa; Reprovado permanentemente por risco neural.",
  },
];
