export type Visibility = "public" | "secret" | "masterOnly" | "classified";

export type TagName =
  | "Publico"
  | "Confidencial"
  | "Restrito"
  | "Nivel Omega"
  | "Morto"
  | "Ativo"
  | "Desaparecido"
  | "Experimental"
  | "Lendario"
  | "Jaeger"
  | "Kaiju"
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
  | "arquivos-secretos";

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

export type Kaiju = {
  id: string;
  nome: string;
  numero: string;
  titulo: string;
  image: string;
  primeiraAparicao: string;
  local: string;
  altura: string;
  comprimento?: string;
  tipo: string;
  nivelAmeaca: string;
  statusPublico: string;
  statusSecreto?: string;
  descricaoFisica: string;
  comportamento?: string;
  habilidades?: string[];
  historiaPublica?: string;
  historiaSecreta?: string;
  comoFoiDerrotado?: string;
  relacaoComJaegers?: string;
  armaRelacionada?: string;
  ganchos?: string[];
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
  usuariosConhecidos?: string[];
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
