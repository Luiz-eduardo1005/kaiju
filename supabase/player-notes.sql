-- Sistema de anotações pessoais dos players.
-- Rode este arquivo inteiro no Supabase SQL Editor.
-- Não apaga dados e não recria tabelas existentes.

create table if not exists public.player_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (length(trim(content)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.player_notes enable row level security;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy if exists "player_notes_select_own_or_master" on public.player_notes;
create policy "player_notes_select_own_or_master"
on public.player_notes for select
to authenticated
using (user_id = auth.uid() or public.is_master());

drop policy if exists "player_notes_insert_own" on public.player_notes;
create policy "player_notes_insert_own"
on public.player_notes for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "player_notes_update_own" on public.player_notes;
create policy "player_notes_update_own"
on public.player_notes for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "player_notes_delete_own" on public.player_notes;
create policy "player_notes_delete_own"
on public.player_notes for delete
to authenticated
using (user_id = auth.uid());

drop trigger if exists touch_player_notes_updated_at on public.player_notes;
create trigger touch_player_notes_updated_at
before update on public.player_notes
for each row execute function public.touch_updated_at();
