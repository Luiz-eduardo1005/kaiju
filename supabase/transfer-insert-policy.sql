-- Patch minimo para permitir que um player envie item para outro player.
-- Rode este bloco inteiro no Supabase SQL Editor.

drop policy if exists "inventory_items_transfer_insert_minimal" on public.inventory_items;

create policy "inventory_items_transfer_insert_minimal"
on public.inventory_items
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.is_master()
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.from_user_id = auth.uid()
      and transfer.to_user_id = inventory_items.user_id
      and transfer.status in ('completed', 'accepted')
  )
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.to_user_id = auth.uid()
      and transfer.from_user_id = inventory_items.user_id
      and transfer.status = 'accepted'
  )
);
