import type { Weapon } from "./types";

export const weapons: Weapon[] = [
  {
    id: "lamina-tressarak",
    numero: "Arma No 01",
    nome: "Lamina Tressarak",
    origem: "Tressarak",
    tipo: "Lamina biologica / arma de desorganizacao tecidual",
    status: "Ativa / restrita",
    tags: ["Arma Enumerada", "Restrito", "Ativo"],
    descricao:
      "A Lamina Tressarak foi a primeira arma enumerada funcional. Criada a partir da crista craniana, fibras nervosas e fragmentos estabilizados de Tressarak. Nao e uma espada comum. Sua borda vibra em frequencia abissal, semelhante ao canto que o primeiro Kaiju emitia quando vivo.",
    habilidades: [
      "Desorganiza tecido Kaiju.",
      "Enfraquece placas, musculos e carapacas.",
      "Abre brechas em inimigos resistentes.",
    ],
    efeitosColaterais:
      "Usuarios ouvem sons do fundo do oceano, tem sonhos com pressao abissal e alguns relatam sensacao de afogamento durante o sono.",
    historicoCriacao:
      "Demorou decadas para ser criada. Os primeiros testes tentando fundir osso Kaiju com metal falharam violentamente. Helena Sato percebeu que tecido Kaiju nao podia ser tratado como materia morta, e sim como sistema vivo domesticado.",
  },
  {
    id: "manoplas-gorath",
    numero: "Arma No 02",
    nome: "Manoplas Gorath",
    origem: "Gorath",
    tipo: "Manoplas de impacto sismico",
    status: "Ativas / restritas",
    tags: ["Arma Enumerada", "Restrito", "Ativo"],
    descricao:
      "Criadas com ossos dos antebracos, tendoes e tecido sismico de Gorath. Sao manoplas gigantescas usadas em trajes pesados.",
    habilidades: [
      "Socos capazes de quebrar carapacas.",
      "Ondas de choque curtas.",
      "Deteccao de inimigos subterraneos por impacto.",
    ],
    efeitosColaterais:
      "O coracao do usuario comeca a sincronizar com os pulsos da arma. Usuarios incompativeis sofrem arritmia, hemorragia interna ou colapso cardiaco.",
  },
  {
    id: "veu-mirekai",
    numero: "Arma No 03",
    nome: "Veu Mirekai",
    origem: "Mirekai",
    tipo: "Traje sensorial / deteccao biologica",
    status: "Ativo / uso tatico",
    tags: ["Arma Enumerada", "Ativo"],
    descricao:
      "Feito a partir das membranas sensoriais de Mirekai. Nao e arma de dano direto. Permite detectar vida Kaiju, ovos, tuneis, contaminacao e fendas pequenas.",
    habilidades: [
      "Percepcao de colmeia.",
      "Deteccao de organismos Kaiju.",
      "Mapeamento biologico.",
    ],
    efeitosColaterais:
      "Usuarios comecam a confundir pensamentos proprios com impulsos biologicos externos. Alguns ouvem sussurros de criaturas proximas.",
  },
  {
    id: "traje-raijin",
    numero: "Arma No 04",
    nome: "Traje Raijin",
    origem: "Raijin-Delta",
    tipo: "Traje de alta mobilidade eletrica",
    status: "Ativo / elite",
    tags: ["Arma Enumerada", "Traje", "Ativo"],
    descricao:
      "Criado com fibras musculares e espinhos condutores de Raijin-Delta. O traje e preto e azul, com linhas amarelas e azuis que brilham quando ativado.",
    habilidades: [
      "Arrancadas curtas.",
      "Saltos extremos.",
      "Laminas eletricas.",
      "Resistencia parcial a EMP.",
    ],
    efeitosColaterais:
      "Acelera o sistema nervoso. Usuarios sofrem tremores, apagoes, perda de memoria curta e sensacao de tempo distorcido.",
  },
  {
    id: "machado-behemoth",
    numero: "Arma No 05",
    nome: "Machado Behemoth",
    origem: "Behemoth-Kai",
    tipo: "Arma pesada proibida",
    status: "Proibida / classificada",
    tags: ["Arma Enumerada", "Classificado", "Nivel Omega"],
    descricao:
      "Criado a partir de uma lasca ossea de Behemoth-Kai, arrancada durante o incidente na Zona Primordial. E uma arma controversa porque nao veio de um Kaiju morto, mas de um Tita vivo.",
    habilidades: [
      "Absorve energia de fenda.",
      "Devolve energia em forma de corte.",
      "Pode ser usado por Jaegers ou trajes de cerco.",
    ],
    efeitosColaterais:
      "Sempre que ativado, Behemoth-Kai parece sentir. Ha registros de atividade sismica na Zona Primordial apos testes.",
  },
  {
    id: "coroa-slathern",
    numero: "Arma No 06",
    nome: "Coroa Slathern",
    origem: "Slathern",
    tipo: "Interface neural de comando",
    status: "Altamente restrita / perigosa",
    tags: ["Arma Enumerada", "Restrito", "Nivel Omega"],
    descricao:
      "Criada com tecido cerebral e placas sensoriais de Slathern. Permite comandar drones, torretas, sistemas de defesa, unidades de traje e partes de Jaegers por pensamento.",
    habilidades: [
      "Comando neural em rede.",
      "Coordenacao tatica extrema.",
      "Sincronia de multiplas unidades.",
    ],
    efeitosColaterais:
      "Sussurra taticas alienigenas na mente do usuario. Usuarios comecam a entender como os Kaijus pensam e, as vezes, passam a concordar com eles.",
  },
  {
    id: "pele-kamuro",
    numero: "Arma No 07",
    nome: "Pele Kamuro",
    origem: "Kamuro",
    tipo: "Traje adaptativo",
    status: "Experimental",
    tags: ["Arma Enumerada", "Experimental", "Classificado"],
    descricao:
      "Traje feito a partir da pele adaptativa de Kamuro. Muda densidade, textura e resistencia conforme o dano recebido.",
    habilidades: [
      "Adaptacao contra corte.",
      "Adaptacao contra fogo.",
      "Endurecimento contra impacto.",
      "Resistencia progressiva.",
    ],
    efeitosColaterais:
      "O traje se adapta ao medo do usuario. Em estado de panico, pode interpretar aliados como ameaca.",
  },
];
