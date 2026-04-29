-- Sistema de status visual dos Jaegers.
-- Rode este arquivo inteiro no Supabase SQL Editor.
-- Não apaga dados e não recria tabelas existentes.

create table if not exists public.jaeger_part_statuses (
  id uuid primary key default gen_random_uuid(),
  jaeger_id text not null,
  part_id text not null,
  status text not null default 'operational'
    check (status in ('operational', 'damaged', 'impaired', 'destroyed', 'detached')),
  integrity integer not null default 100 check (integrity >= 0 and integrity <= 100),
  note text,
  equipment_note text,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (jaeger_id, part_id)
);

alter table public.jaeger_part_statuses enable row level security;

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

drop policy if exists "jaeger_part_statuses_public_select" on public.jaeger_part_statuses;
create policy "jaeger_part_statuses_public_select"
on public.jaeger_part_statuses for select
using (true);

drop policy if exists "jaeger_part_statuses_master_insert" on public.jaeger_part_statuses;
create policy "jaeger_part_statuses_master_insert"
on public.jaeger_part_statuses for insert
to authenticated
with check (public.is_master());

drop policy if exists "jaeger_part_statuses_master_update" on public.jaeger_part_statuses;
create policy "jaeger_part_statuses_master_update"
on public.jaeger_part_statuses for update
to authenticated
using (public.is_master())
with check (public.is_master());

drop policy if exists "jaeger_part_statuses_master_delete" on public.jaeger_part_statuses;
create policy "jaeger_part_statuses_master_delete"
on public.jaeger_part_statuses for delete
to authenticated
using (public.is_master());

drop trigger if exists touch_jaeger_part_statuses_updated_at on public.jaeger_part_statuses;
create trigger touch_jaeger_part_statuses_updated_at
before update on public.jaeger_part_statuses
for each row execute function public.touch_updated_at();

insert into public.jaeger_part_statuses (jaeger_id, part_id, status, integrity)
select jaeger_id, part_id, 'operational', 100
from (
  values
    ('atlas-prime', 'head'),
    ('atlas-prime', 'chest'),
    ('atlas-prime', 'core'),
    ('atlas-prime', 'left_arm'),
    ('atlas-prime', 'right_arm'),
    ('atlas-prime', 'left_leg'),
    ('atlas-prime', 'right_leg'),
    ('vanguard-01', 'head'),
    ('vanguard-01', 'chest'),
    ('vanguard-01', 'core'),
    ('vanguard-01', 'left_arm'),
    ('vanguard-01', 'right_arm'),
    ('vanguard-01', 'left_leg'),
    ('vanguard-01', 'right_leg'),
    ('iron-saint', 'head'),
    ('iron-saint', 'chest'),
    ('iron-saint', 'core'),
    ('iron-saint', 'left_arm'),
    ('iron-saint', 'right_arm'),
    ('iron-saint', 'left_leg'),
    ('iron-saint', 'right_leg')
) as seed(jaeger_id, part_id)
on conflict (jaeger_id, part_id) do nothing;
