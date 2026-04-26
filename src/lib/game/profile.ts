"use client";

import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { CharacterSheet, Profile, Wallet } from "@/types/game";

export function usernameFromEmail(email?: string | null) {
  if (!email) return "player";
  if (email.startsWith("player1@")) return "player1";
  if (email.startsWith("player2@")) return "player2";
  if (email.startsWith("player3@")) return "player3";
  if (email.startsWith("mestre@")) return "mestre";
  return email.split("@")[0] ?? "player";
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single<Profile>();
  if (error) throw error;
  return data;
}

export async function ensureProfile(user: User) {
  const username = usernameFromEmail(user.email);
  const displayName = user.user_metadata.character_name || user.user_metadata.display_name || username;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        username,
        display_name: displayName,
        role: username === "mestre" ? "master" : "player",
      },
      { onConflict: "id" },
    )
    .select("*")
    .single<Profile>();

  if (error) throw error;
  return data;
}

export async function ensureCharacterSheet(userId: string, username: string) {
  const existing = await supabase.from("character_sheets").select("*").eq("user_id", userId).maybeSingle<CharacterSheet>();
  if (existing.error) throw existing.error;
  if (existing.data) return existing.data;

  const { data, error } = await supabase
    .from("character_sheets")
    .insert({
      user_id: userId,
      character_name: username === "player1" ? "Player 1" : username === "player2" ? "Player 2" : username,
      current_hp: 40,
      max_hp: 40,
    })
    .select("*")
    .single<CharacterSheet>();

  if (error) throw error;
  return data;
}

export async function ensureWallet(userId: string) {
  const existing = await supabase.from("wallets").select("*").eq("user_id", userId).maybeSingle<Wallet>();
  if (existing.error) throw existing.error;
  if (existing.data) return existing.data;

  const { data, error } = await supabase
    .from("wallets")
    .insert({ user_id: userId, balance: 250 })
    .select("*")
    .single<Wallet>();

  if (error) throw error;
  return data;
}

export async function bootstrapPlayer(user: User) {
  const profile = await ensureProfile(user);
  const [sheet, wallet] = await Promise.all([ensureCharacterSheet(user.id, profile.username), ensureWallet(user.id)]);
  return { profile, sheet, wallet };
}
