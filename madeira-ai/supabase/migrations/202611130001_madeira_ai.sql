-- MADEIRA AI: user accounts, saved places and enquiries.
-- Apply this migration in the Supabase SQL Editor before enabling cloud features.

create table if not exists public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null check (char_length(trim(place_id)) between 1 and 120),
  created_at timestamptz not null default now(),
  constraint saved_places_user_place_key unique (user_id, place_id)
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('travel','property','business','transport','other')),
  subject text not null check (char_length(trim(subject)) between 1 and 160),
  details text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists saved_places_user_created_idx
  on public.saved_places(user_id, created_at desc);
create index if not exists inquiries_user_created_idx
  on public.inquiries(user_id, created_at desc);

alter table public.saved_places enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "Users manage their own saved places" on public.saved_places;
create policy "Users manage their own saved places"
  on public.saved_places for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their own inquiries" on public.inquiries;
create policy "Users manage their own inquiries"
  on public.inquiries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, delete on public.saved_places to authenticated;
grant select, insert on public.inquiries to authenticated;
