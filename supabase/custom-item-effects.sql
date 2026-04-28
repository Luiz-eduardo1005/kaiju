-- Integracao de itens customizados com efeitos funcionais.
-- Rode este arquivo no SQL Editor do Supabase antes de criar itens com multiplos efeitos.
-- Nao apaga dados.

alter table public.custom_items
  add column if not exists item_type text,
  add column if not exists effects jsonb not null default '[]'::jsonb;

alter table public.inventory_items
  add column if not exists item_type text,
  add column if not exists effects jsonb not null default '[]'::jsonb;

update public.custom_items
set item_type = coalesce(item_type, category, 'Outro')
where item_type is null;

update public.inventory_items
set item_type = coalesce(item_type, category, 'Outro')
where item_type is null;

