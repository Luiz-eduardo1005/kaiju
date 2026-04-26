"use client";

import { supabase } from "@/lib/supabase";

export async function createAuditLog(input: {
  user_id?: string | null;
  actor_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  description: string;
}) {
  const { error } = await supabase.from("audit_logs").insert({
    user_id: input.user_id ?? null,
    actor_id: input.actor_id ?? input.user_id ?? null,
    action: input.action,
    entity_type: input.entity_type,
    entity_id: input.entity_id ?? null,
    old_value: input.old_value ?? null,
    new_value: input.new_value ?? null,
    description: input.description,
  });

  if (error) throw error;
}
