-- Cloud user-flow hardening for MADEIRA AI.
-- Safe to apply to the Preview database; no user data is copied or deleted.

-- Preserve the unique constraint from the initial schema without creating a
-- second, redundant unique index when the migration is applied more than once.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.saved_places'::regclass
      and conname = 'saved_places_user_place_key'
  ) then
    alter table public.saved_places
      add constraint saved_places_user_place_key unique (user_id, place_id);
  end if;
end $$;

alter policy "Users manage their own saved places"
  on public.saved_places
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "Users manage their own inquiries"
  on public.inquiries
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
