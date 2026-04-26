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
  item_name: string;
  category: string;
  quantity: number;
  description: string | null;
  effect_type: string | null;
  effect_value: number | null;
  effect_stat: string | null;
  duration_type: string | null;
  duration_seconds: number | null;
  created_at?: string;
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

export type StatKey =
  | "strength"
  | "agility"
  | "constitution"
  | "mind"
  | "willpower"
  | "technique"
  | "speed";
