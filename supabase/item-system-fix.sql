-- Patch seguro para corrigir/envios de itens sem recriar nem apagar dados.
-- Rode este arquivo inteiro no Supabase SQL Editor.

alter table public.item_transfers
  add column if not exists requested_money numeric,
  add column if not exists requested_item_id text,
  add column if not exists requested_item_name text;

alter table public.inventory_items
  add column if not exists custom_item_id uuid references public.custom_items(id) on delete set null,
  add column if not exists rarity text,
  add column if not exists price numeric,
  add column if not exists weight numeric,
  add column if not exists visible_to_player boolean not null default true,
  add column if not exists master_only boolean not null default false;

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
      and (
        transfer.item_id = inventory_items.item_id
        or (inventory_items.custom_item_id is not null and transfer.item_id = inventory_items.custom_item_id::text)
      )
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
      and (
        transfer.item_id = inventory_items.item_id
        or (inventory_items.custom_item_id is not null and transfer.item_id = inventory_items.custom_item_id::text)
      )
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
      and (
        transfer.item_id = inventory_items.item_id
        or (inventory_items.custom_item_id is not null and transfer.item_id = inventory_items.custom_item_id::text)
      )
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
      and (
        transfer.item_id = inventory_items.item_id
        or (inventory_items.custom_item_id is not null and transfer.item_id = inventory_items.custom_item_id::text)
      )
      and transfer.status in ('pending', 'accepted')
  )
);
