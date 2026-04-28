-- Transferencia atomica de dinheiro entre players.
-- Rode este arquivo inteiro no SQL Editor do Supabase.
-- Se aparecer o aviso de RLS para tabela nova, clique em "Run without RLS".

create or replace function public.transfer_money_v2(
  p_to_user_id uuid,
  p_amount numeric,
  p_description text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $bank_transfer_v2$
declare
  v_from_user_id uuid := auth.uid();
  v_from_wallet record;
  v_to_wallet record;
  v_from_profile record;
  v_to_profile record;
  v_from_next numeric;
  v_to_next numeric;
  v_description text;
begin
  if v_from_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  if p_to_user_id is null then
    raise exception 'Destinatario invalido.';
  end if;

  if p_to_user_id = v_from_user_id then
    raise exception 'Voce nao pode transferir dinheiro para si mesmo.';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Valor invalido.';
  end if;

  select *
  into v_from_wallet
  from public.wallets
  where user_id = v_from_user_id
  for update;

  if not found then
    raise exception 'Carteira de origem nao encontrada.';
  end if;

  select *
  into v_to_wallet
  from public.wallets
  where user_id = p_to_user_id
  for update;

  if not found then
    raise exception 'Carteira do destinatario nao encontrada.';
  end if;

  if v_from_wallet.balance < p_amount then
    raise exception 'Saldo insuficiente.';
  end if;

  select *
  into v_from_profile
  from public.profiles
  where id = v_from_user_id;

  select *
  into v_to_profile
  from public.profiles
  where id = p_to_user_id;

  v_from_next := v_from_wallet.balance - p_amount;
  v_to_next := v_to_wallet.balance + p_amount;
  v_description := coalesce(nullif(trim(p_description), ''), 'Transferencia Rapida para ' || coalesce(v_to_profile.display_name, v_to_profile.username, 'player'));

  update public.wallets
  set balance = v_from_next,
      updated_at = now()
  where id = v_from_wallet.id;

  update public.wallets
  set balance = v_to_next,
      updated_at = now()
  where id = v_to_wallet.id;

  insert into public.transactions (user_id, type, amount, description)
  values
    (v_from_user_id, 'transfer_out', -p_amount, v_description),
    (p_to_user_id, 'transfer_in', p_amount, 'Transferencia recebida de ' || coalesce(v_from_profile.display_name, v_from_profile.username, 'player'));

  insert into public.audit_logs (
    user_id,
    actor_id,
    action,
    entity_type,
    old_value,
    new_value,
    description
  )
  values (
    v_from_user_id,
    v_from_user_id,
    'money_transferred',
    'wallet',
    jsonb_build_object(
      'from_user_id', v_from_user_id,
      'to_user_id', p_to_user_id,
      'from_balance', v_from_wallet.balance,
      'to_balance', v_to_wallet.balance
    ),
    jsonb_build_object(
      'from_user_id', v_from_user_id,
      'to_user_id', p_to_user_id,
      'from_balance', v_from_next,
      'to_balance', v_to_next,
      'amount', p_amount
    ),
    coalesce(v_from_profile.username, 'player') || ' transferiu $' || p_amount || ' para ' || coalesce(v_to_profile.username, 'player') || '.'
  );
end;
$bank_transfer_v2$;

revoke execute on function public.transfer_money_v2(uuid, numeric, text) from public, anon;
grant execute on function public.transfer_money_v2(uuid, numeric, text) to authenticated;
