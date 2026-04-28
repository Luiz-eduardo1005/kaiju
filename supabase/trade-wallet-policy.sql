-- Permite concluir pagamento de dinheiro em propostas de troca.
-- Sem isso, quem aceita consegue debitar a propria carteira, mas o RLS pode bloquear
-- o credito na carteira de quem criou a proposta.

drop policy if exists "wallets_trade_credit_update" on public.wallets;

create policy "wallets_trade_credit_update"
on public.wallets
for update
to authenticated
using (
  public.is_master()
  or user_id = auth.uid()
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.to_user_id = auth.uid()
      and transfer.from_user_id = wallets.user_id
      and transfer.status = 'pending'
      and transfer.transfer_type = 'trade'
      and transfer.requested_money is not null
      and transfer.requested_money > 0
  )
)
with check (
  public.is_master()
  or user_id = auth.uid()
  or exists (
    select 1
    from public.item_transfers transfer
    where transfer.to_user_id = auth.uid()
      and transfer.from_user_id = wallets.user_id
      and transfer.status = 'pending'
      and transfer.transfer_type = 'trade'
      and transfer.requested_money is not null
      and transfer.requested_money > 0
  )
);

drop policy if exists "inventory_items_trade_requested_item_insert" on public.inventory_items;

create policy "inventory_items_trade_requested_item_insert"
on public.inventory_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.item_transfers transfer
    where transfer.to_user_id = auth.uid()
      and transfer.from_user_id = inventory_items.user_id
      and transfer.status = 'pending'
      and transfer.transfer_type = 'trade'
      and transfer.requested_item_name is not null
  )
);
