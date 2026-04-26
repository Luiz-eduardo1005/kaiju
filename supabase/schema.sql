-- Crônicas dos Titãs - schema inicial de players
-- Cole este arquivo no Supabase SQL Editor quando quiser ativar ficha, inventário, banco e loja.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'player' check (role in ('player', 'master')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age integer,
  origin text,
  designation text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.character_stats (
  character_id uuid primary key references public.characters(id) on delete cascade,
  force_score integer not null default 0,
  agility integer not null default 0,
  endurance integer not null default 0,
  intellect integer not null default 0,
  nerve integer not null default 0,
  drift_compatibility integer not null default 0,
  suit_compatibility integer not null default 0,
  enumerated_weapon_compatibility integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.wallets (
  character_id uuid primary key references public.characters(id) on delete cascade,
  credits integer not null default 0 check (credits >= 0),
  bank_balance integer not null default 0 check (bank_balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'civil',
  description text,
  price integer not null check (price >= 0),
  stock integer,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  shop_item_id uuid references public.shop_items(id) on delete set null,
  name text not null,
  category text not null default 'item',
  quantity integer not null default 1 check (quantity > 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bank_transactions (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  kind text not null check (kind in ('deposit', 'withdraw', 'purchase', 'reward', 'adjustment')),
  amount integer not null,
  description text not null,
  created_at timestamptz not null default now()
);

insert into public.shop_items (name, category, description, price, stock, is_public)
values
  ('Chocolate de Máquina', 'civil', 'Barra simples vendida em máquinas automáticas de Nova Aurora.', 5, null, true),
  ('Máscara de Filtragem Civil', 'evacuacao', 'Máscara básica para alertas de contaminação leve.', 35, null, true),
  ('Rádio Portátil de Emergência', 'evacuacao', 'Rádio compacto para rotas de abrigo e alertas locais.', 60, null, true)
on conflict do nothing;

alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.character_stats enable row level security;
alter table public.wallets enable row level security;
alter table public.shop_items enable row level security;
alter table public.inventory_items enable row level security;
alter table public.bank_transactions enable row level security;

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

create policy "profiles_select_own_or_master"
on public.profiles for select
using (id = auth.uid() or public.is_master());

create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "characters_all_own_or_master"
on public.characters for all
using (user_id = auth.uid() or public.is_master())
with check (user_id = auth.uid() or public.is_master());

create policy "character_stats_all_own_or_master"
on public.character_stats for all
using (
  exists (
    select 1 from public.characters c
    where c.id = character_id
    and (c.user_id = auth.uid() or public.is_master())
  )
)
with check (
  exists (
    select 1 from public.characters c
    where c.id = character_id
    and (c.user_id = auth.uid() or public.is_master())
  )
);

create policy "wallets_all_own_or_master"
on public.wallets for all
using (
  exists (
    select 1 from public.characters c
    where c.id = character_id
    and (c.user_id = auth.uid() or public.is_master())
  )
)
with check (
  exists (
    select 1 from public.characters c
    where c.id = character_id
    and (c.user_id = auth.uid() or public.is_master())
  )
);

create policy "shop_items_select_authenticated"
on public.shop_items for select
to authenticated
using (is_public or public.is_master());

create policy "shop_items_master_all"
on public.shop_items for all
using (public.is_master())
with check (public.is_master());

create policy "inventory_all_own_or_master"
on public.inventory_items for all
using (
  exists (
    select 1 from public.characters c
    where c.id = character_id
    and (c.user_id = auth.uid() or public.is_master())
  )
)
with check (
  exists (
    select 1 from public.characters c
    where c.id = character_id
    and (c.user_id = auth.uid() or public.is_master())
  )
);

create policy "transactions_select_own_or_master"
on public.bank_transactions for select
using (
  exists (
    select 1 from public.characters c
    where c.id = character_id
    and (c.user_id = auth.uid() or public.is_master())
  )
);

create policy "transactions_insert_own_or_master"
on public.bank_transactions for insert
with check (
  exists (
    select 1 from public.characters c
    where c.id = character_id
    and (c.user_id = auth.uid() or public.is_master())
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'character_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
