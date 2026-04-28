import type { CityLocation } from "./types";

export const cityOverview = {
  nome: "Nova Aurora - 2006",
  tipo: "Cidade costeira / região de campanha",
  localizacao: "Costa militarizada próxima à Base Naval Atlas",
  status: "Ativa",
  alertaAtual: "Verde",
  descricao:
    "Nova Aurora em 2006 é uma cidade costeira em transformação. Ela ainda não tem o aspecto ultra-futurista de décadas posteriores, mas já carrega as marcas da Guerra Kaiju. À primeira vista, parece uma grande cidade portuária: trânsito, mercados, prédios residenciais, escolas, estações, bairros industriais e áreas comerciais. Mas, em cada esquina, existem sinais de que o mundo mudou.\n\nHá placas de evacuação presas em postes, sirenes instaladas em prédios públicos, abrigos subterrâneos próximos a estações e rotas coloridas pintadas no chão. A população tenta viver normalmente, mas todos sabem o que fazer quando um alerta toca.\n\nA cidade tem cheiro de mar, combustível, concreto molhado e metal. Caminhões militares passam com frequência. Helicópteros cortam o céu em dias de treinamento. Perto da zona portuária, é possível ver hangares e guindastes ligados ao Projeto Atlas.\n\nNova Aurora não é uma cidade destruída. Ela é uma cidade adaptada. As pessoas ainda trabalham, estudam, comem em lanchonetes, discutem no trânsito e vivem suas vidas. Mas a presença da ameaça Kaiju está sempre ali, no fundo, como uma sirene que ainda não tocou.",
  descricaoSecreta:
    "Nova Aurora foi escolhida como uma das cidades estratégicas de apoio ao Projeto Atlas por sua localização costeira, infraestrutura portuária e distância controlável de áreas civis densas. Partes da cidade são usadas para logística militar, transporte de peças de Jaeger e testes de evacuação. Existem túneis, depósitos e áreas restritas que oficialmente são apenas instalações portuárias, mas que servem ao Projeto Atlas.",
};

export const cityLocations: CityLocation[] = [
  {
    id: "zona-portuaria-nova-aurora",
    nome: "Zona Portuária de Nova Aurora",
    tipo: "Porto / área industrial",
    status: "Ativa",
    tags: ["Cidade", "Publico"],
    descricao:
      "Região de docas, guindastes, armazéns, navios de carga e postos militares discretos. Parte do porto ainda funciona como área civil, mas algumas docas foram adaptadas para logística do Projeto Atlas.",
  },
  {
    id: "bairro-residencial-player",
    nome: "Bairro Residencial do Player",
    tipo: "Zona civil",
    status: "Habitado",
    tags: ["Cidade", "Publico"],
    descricao:
      "Bairro comum de Nova Aurora, com prédios baixos, comércio pequeno, escolas, mercados e rotas de evacuação pintadas no chão. É o melhor lugar para mostrar que a vida comum continua mesmo sob a sombra dos Kaijus.",
  },
  {
    id: "estacao-central",
    nome: "Estação Central",
    tipo: "Transporte / abrigo parcial",
    status: "Movimentada",
    tags: ["Cidade", "Publico"],
    descricao:
      "Centro de transporte da cidade. Placas antigas dividem espaço com instruções de emergência, linhas azuis de evacuação e avisos sobre simulados civis.",
  },
  {
    id: "abrigo-subterraneo-04",
    nome: "Abrigo Subterrâneo 04",
    tipo: "Abrigo civil",
    status: "Operacional",
    tags: ["Cidade", "Publico"],
    descricao:
      "Abrigo sob uma área de grande circulação, abastecido para emergências curtas. A maioria dos moradores já entrou aqui em simulados, mas poucos sabem como seria esperar um alerta real terminar.",
  },
  {
    id: "avenida-leonov",
    nome: "Avenida Leonov",
    tipo: "Marco público",
    status: "Ativa",
    tags: ["Cidade", "Publico"],
    descricao:
      "Avenida batizada em homenagem ao almirante Viktor Leonov, herói oficial da queda de Tressarak. Monumentos, propagandas de recrutamento e cartazes do Programa Atlas aparecem ao longo da via.",
  },
  {
    id: "distrito-industrial",
    nome: "Distrito Industrial",
    tipo: "Fábricas / manutenção",
    status: "Militarização crescente",
    tags: ["Cidade", "Publico"],
    descricao:
      "Área de fábricas, oficinas, galpões e empresas contratadas para fornecer peças, cabos, blindagem e equipamentos de suporte ao Projeto Atlas.",
  },
  {
    id: "rota-azul-evacuacao",
    nome: "Rota Azul de Evacuação",
    tipo: "Corredor de emergência",
    status: "Sinalizada",
    tags: ["Cidade", "Publico"],
    descricao:
      "Linhas azuis pintadas no chão conectam escolas, estações, praças e abrigos. Crianças aprendem desde cedo a seguir essas rotas quando as sirenes tocam.",
  },
  {
    id: "mercado-velho",
    nome: "Mercado Velho",
    tipo: "Comércio civil",
    status: "Ativo",
    tags: ["Cidade", "Publico"],
    descricao:
      "Mercado popular onde trabalhadores, candidatos e famílias compram comida, roupas, pilhas, lanternas, mapas e itens de emergência. É um bom ponto para rumores e cenas urbanas.",
  },
  {
    id: "terminal-militar-restrito",
    nome: "Terminal Militar Restrito",
    tipo: "Área militar",
    status: "Acesso controlado",
    tags: ["Cidade", "Restrito"],
    descricao:
      "Terminal oficialmente ligado ao transporte de carga portuária, mas usado para mover peças, blindagens e equipamentos do Projeto Atlas. Guardas impedem aproximação civil.",
  },
  {
    id: "estrada-base-atlas",
    nome: "Estrada de Acesso à Base Naval Atlas",
    tipo: "Estrada militar",
    status: "Monitorada",
    tags: ["Cidade", "Publico"],
    descricao:
      "Estrada costeira que liga Nova Aurora à Base Naval Atlas. Em dias de teste, caminhões militares e ônibus de candidatos seguem por ela sob chuva, vento e sirenes de treinamento.",
  },
  {
    id: "base-naval-atlas",
    nome: "Base Naval Atlas",
    tipo: "Instalação militar experimental",
    status: "Ativa",
    tags: ["Cidade", "Restrito", "Jaeger"],
    descricao:
      "Antiga instalação portuária militar adaptada para testes do Projeto Atlas. Possui hangares, docas modificadas, simuladores físicos, enfermarias, salas de Pré-Drift e áreas onde candidatos não autorizados não deveriam entrar.",
  },
  {
    id: "hangares-projeto-atlas",
    nome: "Hangares do Projeto Atlas",
    tipo: "Hangar Jaeger",
    status: "Altamente restrito",
    tags: ["Cidade", "Restrito", "Jaeger"],
    descricao:
      "Estruturas colossais com guindastes, correntes, trilhos e plataformas suspensas. Atlas-Prime domina o espaço; partes de Vanguard-01 e Iron Saint revelam que o Projeto Atlas está tentando criar uma linha inteira de Jaegers.",
  },
  {
    id: "base-nereu",
    nome: "Base Nereu",
    tipo: "Instalação secreta",
    status: "Não existe oficialmente",
    tags: ["Cidade", "Classificado", "Nivel Omega"],
    descricao:
      "Instalação secreta no Pacífico profundo criada para estudar restos de Tressarak e outros materiais Kaiju. O player não deve conhecer esse lugar no início, mas o mestre pode usá-lo como origem de arquivos ocultos, memórias de Drift e segredos sobre Helena Sato.",
  },
];
