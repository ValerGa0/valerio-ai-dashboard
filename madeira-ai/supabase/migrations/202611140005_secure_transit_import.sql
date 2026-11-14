-- One-time import guard for the Preview-only GTFS importer.
create table if not exists private.transit_import_tokens(token_hash text primary key,expires_at timestamptz not null,claimed_at timestamptz);
create or replace function public.claim_transit_import_token(p_token_hash text) returns boolean
language plpgsql security definer set search_path='' as $$
declare affected integer;
begin
 update private.transit_import_tokens set claimed_at=now()
 where token_hash=p_token_hash and claimed_at is null and expires_at>now();
 get diagnostics affected=row_count;
 return affected=1;
end;
$$;
revoke all on function public.claim_transit_import_token(text) from public,anon,authenticated;
grant execute on function public.claim_transit_import_token(text) to service_role;
