-- Sistema de itens customizados, inventario do mestre e trocas.
-- Seguro para rodar em uma base existente: nao apaga dados atuais.

create table if not exists public.custom_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  rarity text not null default 'Comum',
  description text,
  mechanical_effect text,
  bonus_stat text,
  bonus_value integer,
  duration_type text,
  price numeric,
  weight numeric,
  visible_to_player boolean not null default true,
  master_only boolean not null default false,
  secret_notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inventory_items
  add column if not exists custom_item_id uuid references public.custom_items(id) on delete set null,
  add column if not exists rarity text,
  add column if not exists price numeric,
  add column if not exists weight numeric,
  add column if not exists visible_to_player boolean not null default true,
  add column if not exists master_only boolean not null default false;

create table if not exists public.master_inventory (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.custom_items(id) on delete cascade,
  quantity integer not null default 1 check (quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(item_id)
);

create table if not exists public.item_transfers (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references public.profiles(id) on delete set null,
  to_user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null,
  item_name text not null,
  item_snapshot jsonb,
  quantity integer not null check (quantity > 0),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'completed')),
  transfer_type text not null check (transfer_type in ('direct', 'trade')),
  requested_money numeric,
  requested_item_id text,
  requested_item_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists custom_items_touch_updated_at on public.custom_items;
create trigger custom_items_touch_updated_at
before update on public.custom_items
for each row execute function public.touch_updated_at();

drop trigger if exists master_inventory_touch_updated_at on public.master_inventory;
create trigger master_inventory_touch_updated_at
before update on public.master_inventory
for each row execute function public.touch_updated_at();

drop trigger if exists item_transfers_touch_updated_at on public.item_transfers;
create trigger item_transfers_touch_updated_at
before update on public.item_transfers
for each row execute function public.touch_updated_at();

alter table public.custom_items enable row level security;
alter table public.master_inventory enable row level security;
alter table public.item_transfers enable row level security;

drop policy if exists "custom_items_master_all" on public.custom_items;
create policy "custom_items_master_all"
on public.custom_items
for all
using (public.is_master())
with check (public.is_master());

drop policy if exists "custom_items_player_visible_select" on public.custom_items;
create policy "custom_items_player_visible_select"
on public.custom_items
for select
using (visible_to_player = true and master_only = false);

drop policy if exists "master_inventory_master_all" on public.master_inventory;
create policy "master_inventory_master_all"
on public.master_inventory
for all
using (public.is_master())
with check (public.is_master());

drop policy if exists "item_transfers_related_select" on public.item_transfers;
create policy "item_transfers_related_select"
on public.item_transfers
for select
using (public.is_master() or from_user_id = auth.uid() or to_user_id = auth.uid());

drop policy if exists "item_transfers_related_insert" on public.item_transfers;
create policy "item_transfers_related_insert"
on public.item_transfers
for insert
with check (public.is_master() or from_user_id = auth.uid());

drop policy if exists "item_transfers_related_update" on public.item_transfers;
create policy "item_transfers_related_update"
on public.item_transfers
for update
using (public.is_master() or from_user_id = auth.uid() or to_user_id = auth.uid())
with check (public.is_master() or from_user_id = auth.uid() or to_user_id = auth.uid());

drop policy if exists "inventory_items_transfer_related_select" on public.inventory_items;
create policy "inventory_items_transfer_related_select"
on public.inventory_items
for select
using (
  public.is_master()
  or user_id = auth.uid()
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.to_user_id = auth.uid()
      and transfer.from_user_id = inventory_items.user_id
      and transfer.item_id = inventory_items.item_id
      and transfer.status in ('pending', 'accepted')
  )
);

drop policy if exists "inventory_items_transfer_related_insert" on public.inventory_items;
create policy "inventory_items_transfer_related_insert"
on public.inventory_items
for insert
with check (
  public.is_master()
  or user_id = auth.uid()
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.from_user_id = auth.uid()
      and transfer.to_user_id = inventory_items.user_id
      and (
        transfer.item_id = inventory_items.item_id
        or (inventory_items.custom_item_id is not null and transfer.item_id = inventory_items.custom_item_id::text)
      )
      and transfer.status in ('completed', 'accepted')
  )
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.to_user_id = auth.uid()
      and transfer.from_user_id = inventory_items.user_id
      and transfer.requested_item_name ilike inventory_items.item_name
      and transfer.status = 'accepted'
  )
);

drop policy if exists "inventory_items_transfer_related_update" on public.inventory_items;
create policy "inventory_items_transfer_related_update"
on public.inventory_items
for update
using (
  public.is_master()
  or user_id = auth.uid()
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.to_user_id = auth.uid()
      and transfer.from_user_id = inventory_items.user_id
      and transfer.item_id = inventory_items.item_id
      and transfer.status in ('pending', 'accepted')
  )
)
with check (
  public.is_master()
  or user_id = auth.uid()
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.from_user_id = auth.uid()
      and transfer.to_user_id = inventory_items.user_id
      and (
        transfer.item_id = inventory_items.item_id
        or (inventory_items.custom_item_id is not null and transfer.item_id = inventory_items.custom_item_id::text)
      )
      and transfer.status in ('completed', 'accepted')
  )
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.to_user_id = auth.uid()
      and transfer.from_user_id = inventory_items.user_id
      and transfer.item_id = inventory_items.item_id
      and transfer.status in ('pending', 'accepted')
  )
);

drop policy if exists "inventory_items_transfer_related_delete" on public.inventory_items;
create policy "inventory_items_transfer_related_delete"
on public.inventory_items
for delete
using (
  public.is_master()
  or user_id = auth.uid()
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.to_user_id = auth.uid()
      and transfer.from_user_id = inventory_items.user_id
      and transfer.item_id = inventory_items.item_id
      and transfer.status in ('pending', 'accepted')
  )
);
