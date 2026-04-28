export type WorldAlertId = "verde" | "amarelo" | "laranja" | "vermelho" | "preto";

export const WORLD_ALERT_STORAGE_KEY = "circulo-fogo-world-alert";

export const worldAlerts = [
  {
    id: "verde",
    label: "Alerta Verde",
    title: "Vigilância normal",
    status: "Monitoramento ativo",
    description:
      "Nenhum Kaiju em rota de contato. Sirenes em espera, simulados civis liberados e patrulhas costeiras em rotina.",
    masterNotes:
      "Bom estado para sessões sociais, treino, investigação urbana, compras, banco e preparação antes de uma escalada.",
    className: "border-emerald-300/50 bg-emerald-400/10 text-emerald-100",
  },
  {
    id: "amarelo",
    label: "Alerta Amarelo",
    title: "Anomalia detectada",
    status: "Atenção costeira",
    description:
      "Sensores registraram atividade incomum. Rotas de evacuação entram em pré-alerta e equipes do Projeto Atlas ficam de prontidão.",
    masterNotes:
      "Use para criar tensão sem ataque imediato: sirenes de teste, boatos, radares instáveis, Yoju isolado ou falso positivo.",
    className: "border-yellow-300/55 bg-yellow-400/10 text-yellow-100",
  },
  {
    id: "laranja",
    label: "Alerta Laranja",
    title: "Ameaça provável",
    status: "Preparação de evacuação",
    description:
      "Movimento Kaiju ou contaminação secundária é considerado possível. Hangares entram em ritmo de emergência e abrigos são preparados.",
    masterNotes:
      "Bom para missões de correria, evacuação parcial, panes no Drift, transporte de peças Jaeger ou limpeza biológica perigosa.",
    className: "border-orange-300/55 bg-orange-500/10 text-orange-100",
  },
  {
    id: "vermelho",
    label: "Alerta Vermelho",
    title: "Contato Kaiju confirmado",
    status: "Evacuação imediata",
    description:
      "Ameaça Kaiju confirmada. Rotas civis são ativadas, Base Atlas entra em emergência e todos os candidatos ficam sob comando militar.",
    masterNotes:
      "Use para combate, ataque Yoju, contato direto, falha de defesa ou primeiro teste real da resposta Atlas.",
    className: "border-red-300/60 bg-red-500/15 text-red-100",
  },
  {
    id: "preto",
    label: "Alerta Preto",
    title: "Colapso operacional",
    status: "Protocolo de sobrevivência",
    description:
      "Defesas falharam ou a ameaça superou o controle militar. Comunicações são restritas e a prioridade passa a ser sobreviver.",
    masterNotes:
      "Estado extremo. Use com cuidado para virada de arco, desastre, segredo de Base Nereu ou falha grave do Projeto Atlas.",
    className: "border-fuchsia-300/60 bg-fuchsia-500/15 text-fuchsia-100",
  },
] as const;

export function getWorldAlert(alertId?: string | null) {
  return worldAlerts.find((alert) => alert.id === alertId) ?? worldAlerts[0];
}
