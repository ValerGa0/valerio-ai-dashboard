-- Cloud user-flow hardening for MADEIRA AI.
-- Safe to apply to the Preview database; no user data is copied or deleted.

create unique index if not exists saved_places_user_place_unique
  on public.saved_places (user_id, place_id);

alter policy "Users manage their own saved places"
  on public.saved_places
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "Users manage their own inquiries"
  on public.inquiries
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
