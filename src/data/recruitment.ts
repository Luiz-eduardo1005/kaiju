import type { RecruitmentStep } from "./types";

export const recruitmentSteps: RecruitmentStep[] = [
  {
    id: "chegada-base-atlas",
    title: "Chegada à Base Naval Atlas",
    text: "Você chega à Base Naval Atlas em uma manhã cinza, com chuva fina, vento frio vindo do mar e cheiro de ferrugem, combustível e metal molhado. Ao redor, dezenas de candidatos esperam em silêncio: soldados, civis, atletas, técnicos e pessoas desesperadas por uma chance. Ao fundo, hangares enormes rangem com guindastes e correntes. Na entrada, uma placa de aço anuncia: PROJETO ATLAS - SELEÇÃO NEURAL E FÍSICA - 2006 - ACESSO RESTRITO.",
  },
  {
    id: "triagem-militar-medica",
    title: "Triagem Militar e Médica",
    text: "Avaliadores confirmam identidade, histórico médico, evacuações anteriores, exposição a resíduos Kaiju e antecedentes familiares. O teste mede controle emocional inicial. Rolagem sugerida: Mente ou Vontade, dificuldade 12.",
  },
  {
    id: "teste-fisico-bruto",
    title: "Teste Físico Bruto",
    text: "Percurso com chuva, metal escorregadio, escombros, pesos e simulação de evacuação. O candidato pode vencer por resistência, força ou improviso. Rolagens sugeridas: Agilidade ou Constituição dificuldade 15; Força dificuldade 16 para levantar escombro; Mente dificuldade 14 para improvisar alavanca.",
  },
  {
    id: "teste-reflexo-comando",
    title: "Teste de Reflexo e Comando",
    text: "Luzes, alarmes, comandos contraditórios e alvos mecânicos testam resposta sob pressão. Rolagens sugeridas: Agilidade dificuldade 15, Mente dificuldade 14 e Vontade dificuldade 13.",
  },
  {
    id: "resistencia-impacto",
    title: "Resistência a Impacto",
    text: "O candidato é preso em uma estrutura de simulação que treme, inclina e replica choque de cabine. Rolagens sugeridas: Constituição dificuldade 15, Vontade dificuldade 15 e Mente dificuldade 14.",
  },
  {
    id: "avaliacao-psicológica",
    title: "Avaliação Psicológica",
    text: "Perguntas morais e imagens de ataques Kaiju medem medo, impulso, obediência e capacidade de decisão. Não há resposta limpa. Rolagens sugeridas: Vontade dificuldade 15, Mente dificuldade 13 e Vontade ou Drift dificuldade 16.",
  },
  {
    id: "pre-drift",
    title: "Pré-Drift",
    text: "Dois candidatos sentam em cadeiras neurais. Não é Drift completo, apenas contato superficial. O candidato sente emoções e memórias que não são suas. Rolagens sugeridas: Vontade dificuldade 16 para bloquear, Drift dificuldade 15 para aceitar conexão e Mente dificuldade 14 para explorar memórias.",
  },
  {
    id: "simulador-fisico-jaeger",
    title: "Simulador Físico de Jaeger",
    text: "A fase final mede se o candidato consegue transformar intenção compartilhada em movimento mecânico. Rolagens sugeridas: Drift dificuldade 14 para movimento básico; Drift + Constituição dificuldade 15 para andar; Drift + Força dificuldade 16 para bloquear impacto; Drift + Agilidade dificuldade 17 para reagir a comando inesperado.",
  },
  {
    id: "resultado-programa-atlas",
    title: "Resultado e Designação",
    text: "Resultados possíveis: candidato compatível com Jaeger, suporte neural, operação de campo, unidade de limpeza biológica, contenção ou risco neural. Falhar não encerra a campanha; pode abrir outra rota dentro da Guerra Kaiju de 2006.",
  },
];
