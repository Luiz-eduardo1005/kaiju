-- V2: funcao atomica para aceitar troca.
-- Cole este arquivo inteiro no Supabase SQL Editor e clique em "Run without RLS".

create or replace function public.accept_item_trade_v2(
  p_transfer_id uuid,
  p_requested_inventory_item_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $accept_trade_v2$
declare
  v_trade record;
  v_offered record;
  v_requested record;
  v_payer_wallet record;
  v_receiver_wallet record;
begin
  select * into v_trade
  from public.item_transfers
  where id = p_transfer_id
  for update;

  if not found then raise exception 'Proposta de troca nao encontrada.'; end if;
  if v_trade.status <> 'pending' then raise exception 'Esta troca nao esta pendente.'; end if;
  if v_trade.transfer_type <> 'trade' then raise exception 'Esta transferencia nao e uma proposta de troca.'; end if;
  if v_trade.to_user_id <> auth.uid() then raise exception 'Apenas o destinatario pode aceitar esta troca.'; end if;
  if v_trade.from_user_id is null then raise exception 'Player de origem nao encontrado.'; end if;

  select * into v_offered
  from public.inventory_items
  where user_id = v_trade.from_user_id
    and item_id = v_trade.item_id
    and quantity >= v_trade.quantity
  order by created_at asc
  limit 1
  for update;

  if not found then raise exception 'O item oferecido nao esta mais disponivel.'; end if;

  if coalesce(v_trade.requested_money, 0) > 0 then
    select * into v_payer_wallet
    from public.wallets
    where user_id = v_trade.to_user_id
    for update;

    if not found or v_payer_wallet.balance < v_trade.requested_money then
      raise exception 'Saldo insuficiente para aceitar essa troca.';
    end if;

    select * into v_receiver_wallet
    from public.wallets
    where user_id = v_trade.from_user_id
    for update;

    if not found then raise exception 'Carteira do player de origem nao encontrada.'; end if;
  end if;

  if v_trade.requested_item_name is not null and length(trim(v_trade.requested_item_name)) > 0 then
    if p_requested_inventory_item_id is null then raise exception 'Selecione o item que sera entregue nessa troca.'; end if;

    select * into v_requested
    from public.inventory_items
    where id = p_requested_inventory_item_id
      and user_id = v_trade.to_user_id
      and quantity > 0
    for update;

    if not found then raise exception 'Voce nao possui o item selecionado.'; end if;
  end if;

  insert into public.inventory_items (
    user_id, custom_item_id, item_type, item_id, item_name, category, quantity, description, effects,
    effect_type, effect_value, effect_stat, duration_type, duration_seconds,
    rarity, price, weight, visible_to_player, master_only
  )
  values (
    v_trade.to_user_id, v_offered.custom_item_id, v_offered.item_type, v_offered.item_id, v_offered.item_name,
    v_offered.category, v_trade.quantity, v_offered.description, coalesce(v_offered.effects, '[]'::jsonb), v_offered.effect_type,
    v_offered.effect_value, v_offered.effect_stat, v_offered.duration_type,
    v_offered.duration_seconds, v_offered.rarity, v_offered.price, v_offered.weight,
    v_offered.visible_to_player, v_offered.master_only
  );

  if v_offered.quantity = v_trade.quantity then
    delete from public.inventory_items where id = v_offered.id;
  else
    update public.inventory_items
    set quantity = v_offered.quantity - v_trade.quantity, updated_at = now()
    where id = v_offered.id;
  end if;

  if v_trade.requested_item_name is not null and length(trim(v_trade.requested_item_name)) > 0 then
    insert into public.inventory_items (
      user_id, custom_item_id, item_type, item_id, item_name, category, quantity, description, effects,
      effect_type, effect_value, effect_stat, duration_type, duration_seconds,
      rarity, price, weight, visible_to_player, master_only
    )
    values (
      v_trade.from_user_id, v_requested.custom_item_id, v_requested.item_type, v_requested.item_id, v_requested.item_name,
      v_requested.category, 1, v_requested.description, coalesce(v_requested.effects, '[]'::jsonb), v_requested.effect_type,
      v_requested.effect_value, v_requested.effect_stat, v_requested.duration_type,
      v_requested.duration_seconds, v_requested.rarity, v_requested.price, v_requested.weight,
      v_requested.visible_to_player, v_requested.master_only
    );

    if v_requested.quantity = 1 then
      delete from public.inventory_items where id = v_requested.id;
    else
      update public.inventory_items
      set quantity = v_requested.quantity - 1, updated_at = now()
      where id = v_requested.id;
    end if;
  end if;

  if coalesce(v_trade.requested_money, 0) > 0 then
    update public.wallets
    set balance = v_payer_wallet.balance - v_trade.requested_money, updated_at = now()
    where id = v_payer_wallet.id;

    update public.wallets
    set balance = v_receiver_wallet.balance + v_trade.requested_money, updated_at = now()
    where id = v_receiver_wallet.id;

    insert into public.transactions (user_id, type, amount, description)
    values
      (v_trade.to_user_id, 'transfer_out', -v_trade.requested_money, 'Pagamento de troca: $' || v_trade.requested_money || '.'),
      (v_trade.from_user_id, 'transfer_in', v_trade.requested_money, 'Recebimento de troca: $' || v_trade.requested_money || '.');
  end if;

  update public.item_transfers
  set status = 'accepted',
      updated_at = now(),
      requested_item_id = coalesce(p_requested_inventory_item_id::text, requested_item_id)
  where id = v_trade.id;
end;
$accept_trade_v2$;

revoke execute on function public.accept_item_trade_v2(uuid, uuid) from public, anon;
grant execute on function public.accept_item_trade_v2(uuid, uuid) to authenticated;
