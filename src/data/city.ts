import type { CityLocation } from "./types";

export const cityOverview = {
  nome: "Nova Aurora",
  tipo: "Metropole costeira reconstruida",
  localizacao: "Costa do Pacifico, proxima a rotas de defesa e bases Jaeger",
  status: "Operacional",
  alertaAtual: "Verde",
  descricao:
    "Nova Aurora nao parece destruida. Ela tem cicatrizes, mas nao e uma cidade apagada. E uma cidade que aprendeu a conviver com o impossivel. Predios altos refletem a luz da manha em fachadas de vidro reforcado. Teloes passam anuncios de comida, roupas, shows, aplicativos, academias e propagandas de recrutamento militar. As ruas tem movimento normal: gente indo trabalhar, estudante atrasado, vendedor abrindo barraca, entregador discutindo no transito, crianca com uniforme escolar segurando lanche na mao.\n\nA diferenca esta nos detalhes.\n\nEm cada esquina existe uma placa de evacuacao. Nao grande e assustadora, mas integrada a cidade como placa de transito. ROTA AZUL - ABRIGO 04. ROTA AMARELA - ESTACAO SUBTERRANEA. AREA DE VEDACAO AUTOMATICA EM CASO DE ALERTA. As pessoas passam por essas placas sem olhar. Para elas, isso e tao normal quanto semaforo.",
};

export const cityLocations: CityLocation[] = [
  {
    id: "bairro-residencial-player",
    nome: "Bairro Residencial do Player",
    tags: ["Cidade", "Publico"],
    descricao:
      "Bairro residencial vertical, construido depois dos primeiros ataques Kaiju. Predios altos, retos e funcionais. Moradia de trabalhadores, tecnicos, estudantes, familias pequenas, aposentados de corporacoes e jovens que vivem entre rotina e sirene.",
  },
  {
    id: "apartamento-player",
    nome: "Apartamento do Player",
    tags: ["Cidade", "Publico"],
    descricao:
      "Apartamento pequeno, funcional e subsidiado. Paredes reforcadas com composto de concreto e polimero resistente. Janela de vidro triplo com blindagem retratil. Chao levemente emborrachado para absorcao de impacto. Mochila de evacuacao sempre pronta com mascara de filtragem, garrafa de agua, radio portatil e kit de primeiros socorros. Painel principal na parede mostra noticias, nivel de alerta, clima e propaganda do Programa de Defesa Anti-Kaiju.",
  },
  {
    id: "avenida-marechal-leonov",
    nome: "Avenida Marechal Leonov",
    tags: ["Cidade", "Publico"],
    descricao:
      "Avenida principal batizada com o nome do heroi oficial do primeiro Kaiju. Movimentada, larga, com onibus eletricos, carros, bicicletas e pedestres. Calcadas largas projetadas para evacuacao. Linhas coloridas no chao indicam rotas de abrigo, acesso militar, rota hospitalar e isolamento biologico.",
  },
  {
    id: "rua-do-canal",
    nome: "Rua do Canal",
    tags: ["Cidade", "Publico"],
    descricao:
      "Regiao mais baixa e antiga, perto de um canal de drenagem. Predios reconstruidos varias vezes, concreto remendado, sensores biologicos nas grades e placas avisando para nao tocar em material organico desconhecido. E uma area comum para pequenos alertas e operacoes de contencao.",
  },
  {
    id: "travessa-kuroda",
    nome: "Travessa Kuroda",
    tags: ["Cidade", "Publico"],
    descricao:
      "Rua estreita, humana e antiga, com comercios pequenos, varandas com roupas penduradas, cheiro de comida frita, barbearia, musica baixa e grafites de Jaegers. Um grafite famoso mostra Atlas-Prime segurando um Kaiju pelo pescoco. Outro mostra um operador de traje com a frase: \"Nem todo heroi tem 80 metros.\"",
  },
  {
    id: "estacao-antiga",
    nome: "Estacao Antiga",
    tags: ["Cidade", "Publico"],
    descricao:
      "Antiga estacao de transporte adaptada como abrigo. Mistura fluxo cotidiano com infraestrutura de emergencia. Trabalhadores de limpeza biologica costumam passar por ali apos turnos pesados.",
  },
  {
    id: "praca-dos-pilotos",
    nome: "Praca dos Pilotos",
    tags: ["Cidade", "Publico"],
    descricao:
      "Praca grande proxima ao centro de recrutamento. No centro ha uma estatua de dois pilotos lado a lado, capacetes de Drift debaixo do braco, com a mao metalica de um Jaeger emergindo do chao atras deles. No pedestal esta escrito: \"Dois coracoes. Uma maquina. Uma muralha.\"",
  },
  {
    id: "centro-recrutamento-setor-leste",
    nome: "Centro de Recrutamento Anti-Kaiju - Setor Leste",
    tags: ["Cidade", "Publico"],
    descricao:
      "Predio enorme, misto de base militar, universidade, hospital e hangar. Fachada de concreto claro, aco escuro e vidro blindado. Entrada com drones de seguranca, bandeiras, filas de jovens e teloes exibindo Jaegers, equipes de traje e operadores de limpeza. Letreiro: PROGRAMA INTEGRADO DE DEFESA KAIJU - RECRUTAMENTO / JAEGER / TRAJES / LIMPEZA TATICA / SUPORTE TECNICO.",
  },
  {
    id: "base-jaeger",
    nome: "Base Jaeger",
    tags: ["Cidade", "Restrito"],
    descricao:
      "Complexo costeiro com docas, trilhos pesados, guindastes gigantes, hangares, torres de radar, plataformas de manutencao e muralha oceanica. De varios pontos da cidade e possivel ver a silhueta de um Jaeger preso a estrutura de manutencao.",
  },
];
