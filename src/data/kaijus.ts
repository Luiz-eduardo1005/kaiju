import type { Kaiju } from "./types";

export const kaijus: Kaiju[] = [
  {
    id: "tressarak",
    nome: "Tressarak",
    numero: "Kaiju-01",
    titulo: "O Primeiro Violador",
    image: "/images/kaijus/tressarak.png",
    statusPublico: "Morto",
    statusSecreto: "Morto clinicamente, mas fragmentos ainda podem reagir",
    primeiraAparicao: "3 de novembro de 1984",
    local: "Fossa das Marianas, Pacifico",
    altura: "96 metros visiveis quando erguido",
    comprimento: "170 metros",
    tipo: "Oceanico / Invasor da Fenda",
    nivelAmeaca: "Fundador / Historico",
    tags: ["Kaiju", "Morto", "Lendario", "Restrito"],
    descricaoFisica:
      "Tressarak era uma criatura colossal, oceanica, serpentina e blindada. Seu corpo lembrava uma mistura de crocodilo abissal, serpente marinha e tubarao pre-historico. Quando erguia o tronco acima da superficie, chegava a quase 96 metros, mas seu comprimento total passava de 170 metros. A pele era cinza-azulada, quase negra quando molhada, coberta por escamas irregulares e placas enormes. Algumas placas tinham bordas esbranquicadas, como coral morto grudado na carne. A cabeca era comprida, afiada, com uma crista ossea que parecia uma lamina partida. Os olhos eram ambar, pequenos demais para o tamanho do corpo, frios e profundos. Fendas branquiais no pescoco brilhavam em azul-esverdeado quando respirava. Seu som nao era um rugido, mas uma nota grave, continua e abissal, capaz de rachar vidro a quilometros.",
    comportamento:
      "No primeiro contato, Tressarak nao atacou imediatamente. Nadou em circulos ao redor da fenda, como se procurasse ou guardasse algo. Depois avancou contra instalacoes militares no Pacifico.",
    habilidades: [
      "Regeneracao lenta.",
      "Blindagem natural extrema.",
      "Som abissal de baixa frequencia.",
      "Resistencia a misseis e torpedos.",
      "Nucleo peitoral protegido por placas moveis.",
    ],
    historiaPublica:
      "A versao oficial diz que Tressarak foi derrotado por uma operacao naval comandada pelo Almirante Viktor Leonov, que coordenou um ataque submarino contra o ponto vital da criatura.",
    historiaSecreta:
      "Quem realmente identificou o nucleo e executou o golpe decisivo foi Helena Sato, que entrou em um minisubmarino experimental com explosivos de perfuracao e atingiu o nucleo quando as placas peitorais se abriram.",
    comoFoiDerrotado:
      "Carga perfurante submarina diretamente no nucleo peitoral, causando colapso interno e queda do corpo no oceano.",
    relacaoComJaegers:
      "Surgiu antes dos Jaegers. Sua existencia foi um dos fatores que levaram a conclusao de que a humanidade precisava lutar em escala colossal.",
    armaRelacionada: "No 01 - Lamina Tressarak.",
    ganchos: [
      "O canto de Tressarak ainda pode ser ouvido por usuarios compativeis.",
      "Fragmentos do corpo podem estar ativos.",
      "O primeiro Kaiju talvez nao fosse apenas invasor.",
    ],
  },
  {
    id: "gorath",
    nome: "Gorath",
    numero: "Kaiju-02",
    titulo: "O Carregador de Terra / Devastador Sismico",
    image: "/images/kaijus/gorath.png",
    statusPublico: "Morto",
    statusSecreto: "Fragmentos sismicos preservados em instalacoes restritas",
    primeiraAparicao: "1991",
    local: "Deserto de Gobi",
    altura: "72 metros",
    tipo: "Terrestre / Sismico",
    nivelAmeaca: "Extremo",
    tags: ["Kaiju", "Morto", "Restrito"],
    descricaoFisica:
      "Gorath era mais baixo que Tressarak, mas muito mais largo, denso e pesado. Seu corpo lembrava uma fusao de gorila, rinoceronte e tartaruga ancestral. Os bracos eram enormes, quase tocando o chao, e os punhos pareciam blocos de concreto vivo. A pele era preta, grossa, oleosa e enrugada como couro queimado. As costas eram protegidas por placas arredondadas, como uma carapaca incompleta e quebrada. A cabeca era achatada, com mandibula projetada para frente. No inicio parecia nao ter dentes, apenas placas osseas como uma prensa. Quando rugia, a boca se abria em quatro partes e revelava fileiras internas de dentes pequenos. Os olhos vermelhos eram cobertos por membranas cinzentas. Gorath era praticamente cego e percebia o mundo por vibracao.",
    comportamento:
      "Avancava de forma lenta, pesada e inevitavel. Nao cacava como predador rapido; simplesmente esmagava tudo em sua direcao. Reagia a vibracoes, explosoes, passos, tuneis e estruturas subterraneas.",
    habilidades: [
      "Ondas sismicas geradas pelos punhos.",
      "Capacidade de colapsar tuneis, bunkers, predios e bases.",
      "Resistencia absurda a explosivos.",
      "Percepcao por vibracao.",
      "Forca fisica extrema.",
    ],
    historiaPublica:
      "Gorath foi derrotado apos dias de combate por bombardeios pesados, cargas subterraneas e o colapso controlado de uma formacao rochosa sobre seu corpo.",
    historiaSecreta:
      "Tecidos sismicos e ossos dos antebracos de Gorath foram preservados. Decadas depois, esses restos originaram as Manoplas Gorath.",
    comoFoiDerrotado:
      "Bombardeios, minas subterraneas e queda controlada de uma formacao rochosa que esmagou sua estrutura principal.",
    relacaoComJaegers:
      "Gorath surgiu antes dos Jaegers, mas reforcou a necessidade de criar maquinas capazes de conter fisicamente Kaijus.",
    armaRelacionada: "No 02 - Manoplas Gorath.",
  },
  {
    id: "mirekai",
    nome: "Mirekai",
    numero: "Kaiju-03",
    titulo: "A Mae de Vidro",
    image: "/images/kaijus/mirekai.png",
    statusPublico: "Morta",
    statusSecreto: "Fragmentos sensoriais preservados; contaminacao residual monitorada",
    primeiraAparicao: "1998",
    local: "Litoral do Chile",
    altura: "64 metros",
    tipo: "Biologico / Incubadora / Contaminante",
    nivelAmeaca: "Biologico extremo",
    tags: ["Kaiju", "Morto", "Restrito"],
    descricaoFisica:
      "Mirekai era completamente diferente dos dois primeiros Kaijus. Seu corpo era alongado, elegante e perturbador, lembrando uma mistura de arraia, louva-a-deus e criatura abissal. A pele era translucida em varias regioes, permitindo ver orgaos internos luminosos, veios azulados e violetas e membranas pulsantes. Nas costas havia placas finas como vidro, que tremiam quando ela emitia sinais. O rosto era quase liso, com uma mandibula vertical que se abria de cima para baixo. Os olhos ficavam espalhados em duas fileiras laterais, pequenos, leitosos e sem foco humano. Ela era bela de um jeito errado: silenciosa, alienigena, hipnotica e repulsiva.",
    comportamento:
      "Permaneceu submersa por dias antes de agir. Liberava organismos contaminantes na agua e parecia mais interessada em espalhar vida Kaiju do que destruir diretamente.",
    habilidades: [
      "Liberacao de micro-organismos Kaiju.",
      "Criacao de Yoju/Filhotes de Vidro.",
      "Comunicacao biologica por vibracao.",
      "Contaminacao de fauna e cadaveres.",
      "Ferimentos diretos podiam espalhar mais contaminacao.",
    ],
    historiaPublica:
      "Mirekai foi derrotada por isolamento costeiro, agentes quimicos, fogo controlado e ataque coordenado ao ponto vital.",
    historiaSecreta:
      "Helena Sato orientou secretamente a operacao. Ela confirmou que nucleos Kaiju funcionavam como ancoras dimensionais.",
    comoFoiDerrotado:
      "Contencao biologica, fogo quimico e ataque ao nucleo depois de identificar a estrutura vital.",
    armaRelacionada: "No 03 - Veu Mirekai.",
  },
  {
    id: "raijin-delta",
    nome: "Raijin-Delta",
    numero: "Kaiju-04",
    titulo: "O Relampago Vivo",
    image: "/images/kaijus/raijin-delta.png",
    statusPublico: "Morto",
    statusSecreto: "Tecido condutor preservado",
    primeiraAparicao: "2006",
    local: "Hong Kong",
    altura: "82 metros",
    tipo: "Eletrico / Alta mobilidade",
    nivelAmeaca: "Extremo",
    tags: ["Kaiju", "Morto", "Lendario"],
    descricaoFisica:
      "Raijin-Delta tinha corpo semi-bipede, estreito, musculoso e extremamente agil. Os bracos eram longos, com tres garras em cada mao. As pernas eram dobradas para tras, como as de um predador veloz, permitindo saltos violentos entre predios e deslocamentos absurdos. A pele era azul-escura com manchas amareladas, embora quase ninguem visse sua cor real por causa das descargas eletricas constantes. Ao longo da coluna havia espinhos finos, semelhantes a para-raios, que canalizavam eletricidade. O cranio era triangular, agressivo, com mandibulas laterais que se abriam antes do rugido. Os olhos eram brancos, sem pupila, brilhando como lampadas queimadas.",
    comportamento:
      "Movia-se rapido demais para artilharia. Escalava predios, saltava entre estruturas, mergulhava na baia e reaparecia em outro ponto.",
    habilidades: [
      "Pulsos eletromagneticos.",
      "Descargas eletricas.",
      "Alta mobilidade.",
      "Saltos extremos.",
      "Resistencia parcial a tecnologia guiada.",
      "Canalizacao eletrica pelos espinhos dorsais.",
    ],
    historiaPublica:
      "Foi derrotado pelo Atlas-Prime na Batalha de Hong Kong. Os pilotos Elias Ward e Ren Akiyama imobilizaram a criatura e sobrecarregaram o reator do Jaeger, atingindo seu nucleo.",
    historiaSecreta:
      "A batalha revelou a fragilidade dos primeiros Jaegers, mas foi vendida ao publico como uma vitoria limpa e heroica.",
    comoFoiDerrotado:
      "Atlas-Prime segurou Raijin-Delta pelo pescoco e sobrecarregou o reator por alguns segundos, carbonizando suas placas e permitindo atingir o nucleo.",
    relacaoComJaegers:
      "Primeiro grande Kaiju derrotado por um Jaeger. Sua morte inaugurou a Era dos Jaegers.",
    armaRelacionada: "No 04 - Traje Raijin.",
  },
  {
    id: "behemoth-kai",
    nome: "Behemoth-Kai",
    numero: "Kaiju-05",
    titulo: "O Rei que Nao Acordou",
    image: "/images/kaijus/behemoth-kai.png",
    statusPublico: "Tita nao-hostil / desaparecido",
    statusSecreto: "Guardiao da Terra Interna",
    primeiraAparicao: "2013",
    local: "Zona Primordial / Ilha da Caveira",
    altura: "110 metros",
    tipo: "Tita Primordial / Nativo",
    nivelAmeaca: "Classe Tita / Incerto",
    tags: ["Kaiju", "Desaparecido", "Nivel Omega", "Classificado"],
    descricaoFisica:
      "Behemoth-Kai parecia uma montanha viva. Seu corpo lembrava um gorila colossal com tracos reptilianos. A pele era marrom-escura, grossa, marcada por cicatrizes antigas. Os ombros eram largos como encostas. Os bracos eram enormes e cobertos por placas osseas naturais. O peito tinha pelos grossos misturados com musgo, cipos e fungos, como se a floresta tivesse crescido sobre ele. A cabeca era larga e quase nobre, com mandibula forte e olhos dourados. Diferente dos invasores, Behemoth-Kai nao parecia uma aberracao dimensional. Parecia antigo. Parecia parte do mundo.",
    comportamento:
      "Dormia no centro da Zona Primordial, confundido com uma montanha. Despertou quando humanos tentaram extrair amostras de seu corpo. Destruiu a base responsavel e desapareceu em cavernas ligadas a Terra Interna.",
    historiaPublica: "Classificado como criatura titanica nativa, nao abatida.",
    historiaSecreta:
      "Helena Sato acreditava que ele protegia uma porta para a Terra Interna e que nao era inimigo da humanidade por natureza.",
    armaRelacionada:
      "No 05 - Machado Behemoth, criado a partir de uma lasca ossea arrancada durante o incidente. E uma arma proibida porque nao veio de um Kaiju morto.",
  },
  {
    id: "slathern",
    nome: "Slathern",
    numero: "Kaiju-06",
    titulo: "O General da Fenda",
    image: "/images/kaijus/slathern.png",
    statusPublico: "Morto",
    statusSecreto: "Fragmentos neurais preservados; influencia cognitiva ainda ativa",
    primeiraAparicao: "2020",
    local: "Alto-mar, proximo a fenda ativa",
    altura: "138 metros",
    tipo: "Comandante / Estrategico",
    nivelAmeaca: "Catastrofico",
    tags: ["Kaiju", "Morto", "Nivel Omega", "Classificado"],
    descricaoFisica:
      "Slathern era o maior invasor registrado ate entao. Tinha corpo comprido, postura de predador e tres caudas musculares que funcionavam como chicotes e estabilizadores. A pele era roxa escura, quase preta, com veios vermelhos pulsando sob placas osseas. Nas costas, espinhos grossos e tortos pareciam torres quebradas. O peito era protegido por carapaca tripla. A cabeca era larga, com seis olhos vermelhos, tres de cada lado. Ele nao focava em um inimigo; observava o campo inteiro. A boca possuia duas camadas de mandibula, sendo que uma segunda arcada avancava de dentro para fora.",
    comportamento:
      "Slathern comandava. Sons graves emitidos por ele alteravam o comportamento de outros Kaijus, fazendo-os flanquear, recuar, proteger nucleos e atacar pontos fracos de Jaegers.",
    habilidades: [
      "Coordenacao de outros Kaijus.",
      "Tres caudas de combate.",
      "Carapaca tripla.",
      "Inteligencia tatica.",
      "Resistencia extrema.",
    ],
    historiaPublica:
      "Foi derrotado pelo Jaeger Mourning Star em uma missao suicida com reator instavel.",
    historiaSecreta:
      "O piloto Julian Cross morreu antes da detonacao. Amara Sato-Qadir assumiu o Drift sozinha por 94 segundos e arrancou o nucleo de Slathern com as maos mecanicas do Mourning Star. Jaegers destruidos: Atlas-Prime II, Cherno-Valkyr, Horizon Fang.",
    armaRelacionada: "No 06 - Coroa Slathern.",
  },
  {
    id: "kamuro",
    nome: "Kamuro",
    numero: "Kaiju-07",
    titulo: "O Homem-Vazio",
    image: "/images/kaijus/kamuro.png",
    statusPublico: "Morto",
    statusSecreto: "Ultimas palavras apagadas dos registros",
    primeiraAparicao: "2028",
    local: "Toquio",
    altura: "58 metros",
    tipo: "Humanoide / Adaptativo",
    nivelAmeaca: "Extremo urbano",
    tags: ["Kaiju", "Morto", "Experimental", "Classificado"],
    descricaoFisica:
      "Kamuro apareceu primeiro como um homem nu, magro, coberto de pele cinza. Depois cresceu ate 58 metros em poucos minutos. Seu corpo era humanoide, mas errado em todos os detalhes: bracos longos demais, dedos finos, costelas marcadas sob a pele, pescoco alongado, rosto sem nariz e sem labios. A pele era cinza-clara, lisa em algumas partes e rachada em outras, como concreto vivo. Os olhos eram completamente negros, com um ponto azul minusculo no centro.",
    comportamento:
      "Falava palavras copiadas de transmissoes militares. Aprendia durante o combate. Adaptava pele, ossos e nucleo conforme recebia dano.",
    habilidades: [
      "Adaptacao a dano.",
      "Deslocamento de nucleo.",
      "Resistencia progressiva.",
      "Imitacao vocal.",
      "Crescimento rapido.",
    ],
    historiaPublica:
      "Derrotado por unidades de traje e armas enumeradas em ambiente urbano, com suporte indireto de Jaegers.",
    historiaSecreta: "Antes de morrer, disse: \"Voces tambem foram feitos.\" A frase foi apagada.",
    armaRelacionada: "No 07 - Pele Kamuro.",
  },
  {
    id: "noctilio",
    nome: "Noctilio",
    numero: "Kaiju-08",
    titulo: "O Deus que Caiu do Ceu",
    image: "/images/kaijus/noctilio.png",
    statusPublico: "Morto",
    statusSecreto: "Origem extraterrestre ou extradimensional nao confirmada",
    primeiraAparicao: "2035",
    local: "Atlantico",
    altura: "101 metros",
    tipo: "Alado / Ativador de Fendas",
    nivelAmeaca: "Global",
    tags: ["Kaiju", "Morto", "Nivel Omega", "Classificado"],
    descricaoFisica:
      "Noctilio tinha corpo alto, fino e alado. As asas nao eram de pena nem membrana comum, mas placas articuladas de quitina escura com bordas luminosas. O corpo era coberto por escamas prateadas e pretas. Possuia quatro bracos: dois grandes terminando em garras e dois menores proximos ao peito, dobrados como se rezasse. A cabeca lembrava a de um dragao sem olhos frontais. Os olhos ficavam nas laterais e brilhavam em azul palido. A cauda era longa e terminava em lamina natural.",
    comportamento:
      "Ao pousar no oceano, nao atacou imediatamente. Olhou para a lua e emitiu um sinal que ativou todas as fendas conhecidas por 17 segundos.",
    habilidades: [
      "Voo.",
      "Ativacao de fendas.",
      "Subnucleos multiplos nos bracos menores.",
      "Coordenacao indireta de eventos globais.",
      "Resistencia aerea extrema.",
    ],
    historiaPublica: "Derrotado por dois Jaegers, equipes de traje e sistemas coordenados.",
    historiaSecreta:
      "O usuario da Coroa Slathern desapareceu apos a batalha. Seu ultimo registro foi: \"Eu vi o outro lado. Eles nao estao vindo. Eles estao voltando.\"",
  },
];
