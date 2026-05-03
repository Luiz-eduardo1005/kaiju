export type Visibility = "public" | "secret" | "masterOnly" | "classified";

export type TagName =
  | "Público"
  | "Confidencial"
  | "Restrito"
  | "Nível Omega"
  | "Morto"
  | "Ativo"
  | "Desaparecido"
  | "Experimental"
  | "Lendário"
  | "Jaeger"
  | "Kaiju"
  | "Mark-1"
  | "Canadá"
  | "Estados Unidos"
  | "Japão"
  | "Rússia"
  | "Alasca"
  | "Contenção"
  | "Artilharia"
  | "Mobilidade"
  | "Fortaleza"
  | "Linha de frente"
  | "Ofensiva"
  | "Interceptação"
  | "Mark-2"
  | "Modular"
  | "Treinamento"
  | "Sustentável"
  | "Energia"
  | "Caça"
  | "Precisão"
  | "Urbano"
  | "Mark-3"
  | "Equilíbrio"
  | "Controle"
  | "Corpo a corpo"
  | "Térmico"
  | "Brutalidade"
  | "Sustentação"
  | "Mark-4"
  | "Multivetorial"
  | "Redundância"
  | "Condução"
  | "Ressonância"
  | "Cerco"
  | "Instabilidade"
  | "Mark-5"
  | "Comando"
  | "Finalização"
  | "Suporte"
  | "Proteção"
  | "Mark-6"
  | "Berserker"
  | "Resgate"
  | "Redenção"
  | "Arma Enumerada"
  | "Traje"
  | "Cidade"
  | "NPC"
  | "Campanha"
  | "Classificado";

export type LoreCategory =
  | "historia"
  | "kaijus"
  | "jaegers"
  | "armas-enumeradas"
  | "trajes"
  | "cidade"
  | "mapa"
  | "npcs"
  | "recrutamento"
  | "campanha"
  | "arquivos-secretos"
  | "loja"
  | "inventario"
  | "banco"
  | "ficha"
  | "painel-mestre";

export type SearchableEntry = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  href: string;
  category: LoreCategory;
  status?: string;
  tags: TagName[];
  visibility?: Visibility;
};

export type HistoryEntry = {
  id: string;
  title: string;
  subtitle: string;
  visibility: Visibility;
  text: string;
  summary?: string;
  notes?: string[];
  tags: TagName[];
};

export type TimelineEvent = {
  year: string;
  title: string;
  text: string;
  visibility?: Visibility;
};

export type KaijuModeData = {
  status: string;
  firstAppearance: string;
  location: string;
  height: string;
  type: string;
  threatLevel: string;
  physicalDescription: string;
  behavior: string;
  abilities: string;
  history: string;
  howDefeated: string;
  relationToJaegers: string;
  relationToEnumeratedWeapons: string;
  hooks: string;
  classifiedNotes?: string;
};

export type Kaiju = {
  id: string;
  number: string;
  name: string;
  title: string;
  image: string;
  player: KaijuModeData;
  master: KaijuModeData;
  tags: TagName[];
};

export type Jaeger = {
  id: string;
  nome: string;
  geracao: string;
  altura?: string;
  pesoEstimado?: string;
  pilotos?: string;
  statusPublico: string;
  statusSecreto?: string;
  funcao: string;
  armamentos?: string[];
  batalhasFamosas?: string[];
  descricao: string;
  historia?: string;
  dossie?: {
    title: string;
    content: string | string[];
    classified?: boolean;
  }[];
  segredo?: string;
  transmissao?: string;
  tags: TagName[];
};

export type Weapon = {
  id: string;
  numero: string;
  nome: string;
  origem: string;
  tipo: string;
  status: string;
  primeiroUsuario?: string;
  compatibilidade?: string;
  descricao: string;
  habilidades: string[];
  efeitosColaterais?: string;
  historicoCriacao?: string;
  notasSecretas?: string;
  tags: TagName[];
};

export type Suit = {
  id: string;
  nome: string;
  geracao?: string;
  funcao: string;
  forca?: string;
  mobilidade?: string;
  resistencia?: string;
  armasAcopladas?: string[];
  compatibilidade?: string;
  descricao: string;
  usuáriosConhecidos?: string[];
  status?: string;
  tags: TagName[];
};

export type CityLocation = {
  id: string;
  nome: string;
  tipo?: string;
  status?: string;
  descricao: string;
  tags: TagName[];
};

export type Npc = {
  id: string;
  nome: string;
  visibilidade: Visibility;
  idade?: string;
  cargo?: string;
  cargoPublico?: string;
  cargoSecreto?: string;
  descricao?: string;
  descricaoPublica?: string;
  segredo?: string;
  usoNaCampanha?: string;
  tags: TagName[];
};

export type RecruitmentStep = {
  id: string;
  title: string;
  text: string;
};
