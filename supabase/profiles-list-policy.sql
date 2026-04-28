-- Permite que usuarios logados vejam a lista basica de perfis para envios e trocas.
-- Nao libera edicao. Edicao continua restrita pelas policies ja existentes.

drop policy if exists "profiles_authenticated_list_select" on public.profiles;

create policy "profiles_authenticated_list_select"
on public.profiles
for select
to authenticated
using (true);
