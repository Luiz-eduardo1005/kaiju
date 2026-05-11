create table if not exists jaeger_pilot_assignments (
  id uuid primary key default gen_random_uuid(),
  jaeger_id text not null,
  pilot_left_id uuid references profiles(id),
  pilot_right_id uuid references profiles(id),
  pilot_left_label text,
  pilot_right_label text,
  visible_to_pilots boolean default true,
  assignment_status text default 'active',
  notes text,
  assigned_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint jaeger_pilot_assignments_status_check check (
    assignment_status in ('active', 'training', 'temporary', 'historical', 'revoked', 'dead_pair', 'classified')
  )
);

create index if not exists jaeger_pilot_assignments_jaeger_id_idx on jaeger_pilot_assignments (jaeger_id);
create index if not exists jaeger_pilot_assignments_pilot_left_idx on jaeger_pilot_assignments (pilot_left_id);
create index if not exists jaeger_pilot_assignments_pilot_right_idx on jaeger_pilot_assignments (pilot_right_id);

alter table jaeger_pilot_assignments enable row level security;

drop policy if exists "Master can manage jaeger pilot assignments" on jaeger_pilot_assignments;
create policy "Master can manage jaeger pilot assignments"
on jaeger_pilot_assignments
for all
using (public.is_master())
with check (public.is_master());

drop policy if exists "Linked pilots can read own jaeger assignments" on jaeger_pilot_assignments;
create policy "Linked pilots can read own jaeger assignments"
on jaeger_pilot_assignments
for select
using (
  auth.uid() = pilot_left_id
  or auth.uid() = pilot_right_id
);

create or replace function touch_jaeger_pilot_assignments_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_jaeger_pilot_assignments_updated_at on jaeger_pilot_assignments;
create trigger touch_jaeger_pilot_assignments_updated_at
before update on jaeger_pilot_assignments
for each row
execute function touch_jaeger_pilot_assignments_updated_at();
