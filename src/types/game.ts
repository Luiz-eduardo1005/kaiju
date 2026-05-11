export type UserRole = "player" | "master";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  role: UserRole;
  created_at?: string;
};

export type CharacterSheet = {
  id: string;
  user_id: string;
  character_name: string;
  age: number | null;
  background: string | null;
  current_hp: number;
  max_hp: number;
  strength: number;
  agility: number;
  constitution: number;
  mind: number;
  willpower: number;
  technique: number;
  speed: number;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Wallet = {
  id: string;
  user_id: string;
  balance: number;
  updated_at?: string;
};

export type ShopItem = {
  id: string;
  name: string;
  category: string;
  store: string;
  price: number;
  description: string;
  effect_type: "heal" | "buff_stat" | "utility" | "food_buff" | "protection";
  effect_value: number | null;
  effect_stat: string | null;
  duration_type: "instant" | "turn" | "manual_confirm" | "timed" | "equipped" | null;
  duration_seconds: number | null;
  stock: number | null;
  is_active?: boolean;
};

export type InventoryItem = {
  id: string;
  user_id: string;
  item_id: string;
  custom_item_id?: string | null;
  item_type?: CustomItemType | string | null;
  item_name: string;
  category: string;
  quantity: number;
  description: string | null;
  effects?: CustomItemEffect[] | null;
  effect_type: string | null;
  effect_value: number | null;
  effect_stat: string | null;
  duration_type: string | null;
  duration_seconds: number | null;
  rarity?: CustomItemRarity | string | null;
  price?: number | null;
  weight?: number | null;
  visible_to_player?: boolean | null;
  master_only?: boolean | null;
  equipped?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export const CUSTOM_ITEM_CATEGORIES = [
  "Arma",
  "Equipamento",
  "Consumivel",
  "Roupa",
  "Ferramenta",
  "Item de missão",
  "Material Kaiju",
  "Outro",
] as const;

export const CUSTOM_ITEM_TYPES = [
  "Consumivel",
  "Equipavel",
  "Material",
  "Arma",
  "Armadura",
  "Dispositivo",
  "Remedio",
  "Comida",
  "Bebida",
  "Outro",
] as const;

export const CUSTOM_ITEM_RARITIES = ["Comum", "Incomum", "Raro", "Épico", "Lendário", "Experimental", "Classificado"] as const;

export const CUSTOM_ITEM_DURATIONS = ["Permanente", "Temporário", "Um turno", "Até o mestre remover"] as const;

export type CustomItemCategory = (typeof CUSTOM_ITEM_CATEGORIES)[number];
export type CustomItemType = (typeof CUSTOM_ITEM_TYPES)[number];
export type CustomItemRarity = (typeof CUSTOM_ITEM_RARITIES)[number];
export type CustomItemDuration = (typeof CUSTOM_ITEM_DURATIONS)[number];
export type ItemTransferStatus = "pending" | "accepted" | "declined" | "completed";
export type ItemTransferType = "direct" | "trade";

export type CustomItemEffectType =
  | "recover_resource"
  | "reduce_fatigue"
  | "temporary_attribute_buff"
  | "temporary_attribute_debuff"
  | "equipment_attribute_bonus"
  | "equipment_attribute_penalty"
  | "damage_resource"
  | "cure_condition"
  | "apply_condition"
  | "remove_condition"
  | "narrative";

export type CustomItemEffect = {
  id: string;
  type: CustomItemEffectType;
  resource?: "hp" | "fadiga" | string | null;
  attribute?: StatKey | string | null;
  condition?: string | null;
  value?: number | null;
  duration?: number | null;
  messageDuration?: number | null;
  label?: string | null;
};

export type CustomItem = {
  id: string;
  name: string;
  item_type?: CustomItemType | string | null;
  category: CustomItemCategory | string;
  rarity: CustomItemRarity | string;
  description: string | null;
  mechanical_effect: string | null;
  effects?: CustomItemEffect[] | null;
  bonus_stat: StatKey | string | null;
  bonus_value: number | null;
  duration_type: CustomItemDuration | string | null;
  price: number | null;
  weight: number | null;
  visible_to_player: boolean;
  master_only: boolean;
  secret_notes: string | null;
  created_by: string | null;
  created_at?: string;
  updated_at?: string;
};

export type MasterInventoryItem = {
  id: string;
  item_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
};

export type MasterInventoryWithItem = MasterInventoryItem & {
  custom_items: CustomItem | null;
};

export type ItemTransfer = {
  id: string;
  from_user_id: string | null;
  to_user_id: string;
  item_id: string;
  item_name: string;
  item_snapshot: Record<string, unknown> | null;
  quantity: number;
  status: ItemTransferStatus;
  transfer_type: ItemTransferType;
  requested_money: number | null;
  requested_item_id: string | null;
  requested_item_name: string | null;
  created_at: string;
  updated_at?: string;
};

export type ActiveEffect = {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  effect_type: string;
  effect_stat: string | null;
  effect_value: number;
  duration_type: string;
  duration_seconds: number | null;
  started_at: string;
  paused_at: string | null;
  is_paused: boolean;
  is_active: boolean;
  requires_master_confirmation: boolean;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  description: string;
  related_item_id: string | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  user_id: string | null;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  description: string;
  created_at: string;
};

export type PlayerNote = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
};

export type JaegerPartState = "operational" | "damaged" | "impaired" | "destroyed" | "detached";

export type JaegerPartStatus = {
  id: string;
  jaeger_id: string;
  part_id: string;
  status: JaegerPartState;
  integrity: number;
  note: string | null;
  equipment_note: string | null;
  updated_by: string | null;
  created_at?: string;
  updated_at?: string;
};

export type JaegerAssignmentStatus = "active" | "training" | "temporary" | "historical" | "revoked" | "dead_pair" | "classified";

export type JaegerPilotAssignment = {
  id: string;
  jaeger_id: string;
  pilot_left_id: string | null;
  pilot_right_id: string | null;
  pilot_left_label: string | null;
  pilot_right_label: string | null;
  visible_to_pilots: boolean;
  assignment_status: JaegerAssignmentStatus;
  notes: string | null;
  assigned_by: string | null;
  created_at?: string;
  updated_at?: string;
};

export type StatKey =
  | "strength"
  | "agility"
  | "constitution"
  | "mind"
  | "willpower"
  | "technique";
