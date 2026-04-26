-- Crônicas dos Titãs - schema de jogo
-- Este arquivo recria as tabelas de ficha, inventário, banco, loja, efeitos e auditoria.
-- Use no SQL Editor do Supabase. Se voce ja tiver dados importantes, faça backup antes.

drop table if exists public.audit_logs cascade;
drop table if exists public.active_effects cascade;
drop table if exists public.transactions cascade;
drop table if exists public.inventory_items cascade;
drop table if exists public.wallets cascade;
drop table if exists public.character_sheets cascade;
drop table if exists public.shop_items cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  role text not null default 'player' check (role in ('player', 'master')),
  created_at timestamptz not null default now()
);

create table public.character_sheets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  character_name text not null default 'Novo Recruta',
  age integer,
  background text,
  current_hp integer not null default 40,
  max_hp integer not null default 40,
  strength integer not null default 0,
  agility integer not null default 0,
  constitution integer not null default 0,
  mind integer not null default 0,
  willpower integer not null default 0,
  technique integer not null default 0,
  speed integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null,
  item_name text not null,
  category text not null,
  quantity integer not null default 1,
  description text,
  effect_type text,
  effect_value integer,
  effect_stat text,
  duration_type text,
  duration_seconds integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shop_items (
  id text primary key,
  name text not null,
  category text not null,
  store text not null,
  price numeric not null default 0,
  description text,
  effect_type text,
  effect_value integer,
  effect_stat text,
  duration_type text,
  duration_seconds integer,
  stock integer,
  is_active boolean not null default true
);

create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  balance numeric not null default 0,
  updated_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  amount numeric not null,
  description text not null,
  related_item_id text,
  created_at timestamptz not null default now()
);

create table public.active_effects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null,
  item_name text not null,
  effect_type text not null,
  effect_stat text,
  effect_value integer not null default 0,
  duration_type text not null,
  duration_seconds integer,
  started_at timestamptz not null default now(),
  paused_at timestamptz,
  is_paused boolean not null default false,
  is_active boolean not null default true,
  requires_master_confirmation boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  description text not null,
  created_at timestamptz not null default now()
);

create or replace function public.username_from_email(email text)
returns text
language sql
immutable
as $$
  select case
    when email like 'player1@%' then 'player1'
    when email like 'player2@%' then 'player2'
    when email like 'player3@%' then 'player3'
    when email like 'mestre@%' then 'mestre'
    else split_part(email, '@', 1)
  end;
$$;

create or replace function public.is_master()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'master'
  );
$$;

alter table public.profiles enable row level security;
alter table public.character_sheets enable row level security;
alter table public.inventory_items enable row level security;
alter table public.shop_items enable row level security;
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;
alter table public.active_effects enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_own_or_master_select" on public.profiles for select using (id = auth.uid() or public.is_master());
create policy "profiles_own_insert" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_own_update" on public.profiles for update using (id = auth.uid() or public.is_master()) with check (id = auth.uid() or public.is_master());

create policy "sheets_own_or_master_all" on public.character_sheets for all using (user_id = auth.uid() or public.is_master()) with check (user_id = auth.uid() or public.is_master());
create policy "inventory_own_or_master_all" on public.inventory_items for all using (user_id = auth.uid() or public.is_master()) with check (user_id = auth.uid() or public.is_master());
create policy "wallets_own_or_master_all" on public.wallets for all using (user_id = auth.uid() or public.is_master()) with check (user_id = auth.uid() or public.is_master());
create policy "transactions_own_or_master_select" on public.transactions for select using (user_id = auth.uid() or public.is_master());
create policy "transactions_own_or_master_insert" on public.transactions for insert with check (user_id = auth.uid() or public.is_master());
create policy "effects_own_or_master_all" on public.active_effects for all using (user_id = auth.uid() or public.is_master()) with check (user_id = auth.uid() or public.is_master());
create policy "audit_own_or_master_select" on public.audit_logs for select using (user_id = auth.uid() or actor_id = auth.uid() or public.is_master());
create policy "audit_authenticated_insert" on public.audit_logs for insert to authenticated with check (actor_id = auth.uid() or user_id = auth.uid() or public.is_master());
create policy "shop_select_authenticated" on public.shop_items for select to authenticated using (is_active or public.is_master());
create policy "shop_master_all" on public.shop_items for all using (public.is_master()) with check (public.is_master());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
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
    case when generated_username = 'mestre' then 'master' else coalesce(new.raw_user_meta_data->>'role', 'player') end
  )
  on conflict (id) do nothing;

  insert into public.character_sheets (user_id, character_name)
  values (
    new.id,
    case
      when generated_username = 'player1' then 'Player 1'
      when generated_username = 'player2' then 'Player 2'
      when generated_username = 'player3' then 'Player 3'
      when generated_username = 'mestre' then 'Mestre'
      else generated_username
    end
  )
  on conflict do nothing;

  insert into public.wallets (user_id, balance)
  values (new.id, 250)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Depois de criar seu usuario de mestre no Auth, este ajuste garante o role correto:
-- update public.profiles
-- set role = 'master', username = 'mestre', display_name = 'Mestre'
-- where id = (select id from auth.users where email = 'mestre@cronicas-titas.example.com');
