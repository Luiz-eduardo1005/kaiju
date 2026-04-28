-- Correcoes para avisos do Supabase Database Linter.
-- Rode este arquivo inteiro no SQL Editor.
-- Nao apaga dados e nao recria tabelas.

-- 1) Corrige "Function Search Path Mutable" em username_from_email.
create or replace function public.username_from_email(email text)
returns text
language sql
immutable
set search_path = public, pg_temp
as $$
  select case
    when email is null then 'player'
    when email like 'player1@%' then 'player1'
    when email like 'player2@%' then 'player2'
    when email like 'player3@%' then 'player3'
    when email like 'mestre@%' then 'mestre'
    else split_part(email, '@', 1)
  end;
$$;

-- 2) Corrige "Function Search Path Mutable" em touch_updated_at.
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

-- 3) Garante search_path fixo em funcoes SECURITY DEFINER.
create or replace function public.is_master()
returns boolean
language sql
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'master'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  generated_username text;
begin
  generated_username := public.username_from_email(new.email);

  insert into public.profiles (id, username, display_name, role)
  values (
    new.id,
    generated_username,
    coalesce(new.raw_user_meta_data->>'character_name', new.raw_user_meta_data->>'display_name', generated_username),
    case when generated_username = 'mestre' then 'master' else 'player' end
  )
  on conflict (id) do update
  set
    username = excluded.username,
    display_name = excluded.display_name,
    role = excluded.role;

  return new;
end;
$$;

-- 4) Remove chamada direta via RPC onde e seguro.
-- handle_new_user() e trigger interno, entao anon/authenticated nao precisam chamar.
-- is_master() e usada nas policies RLS; por seguranca do funcionamento do app,
-- mantemos authenticated com EXECUTE e removemos anon/public.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_master() from public, anon;
grant execute on function public.is_master() to authenticated;
