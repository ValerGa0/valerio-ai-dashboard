-- Private resident/visitor need submissions. Raw reports are not public and are not fed to AI before moderation.
create table if not exists public.island_need_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references auth.users(id) on delete cascade,
  respondent_type text not null check (respondent_type in ('resident','visitor','business','investor','other')),
  municipality_id text references public.island_municipalities(id),
  category text not null check (category in ('housing','transport','healthcare','education','tourism','environment','public_services','business','other')),
  title text not null check (char_length(title) between 5 and 160),
  description text not null check (char_length(description) between 10 and 2000),
  consent_to_aggregate boolean not null default false check (consent_to_aggregate=true),
  status text not null default 'submitted'
    check (status in ('submitted','in_review','accepted','rejected','duplicate')),
  submitted_at timestamptz not null default now()
);

create index if not exists island_need_submissions_status_date_idx
  on public.island_need_submissions(status,submitted_at desc);
create index if not exists island_need_submissions_user_date_idx
  on public.island_need_submissions(submitted_by,submitted_at desc);

alter table public.island_need_submissions enable row level security;
drop policy if exists "Users can submit their own island needs" on public.island_need_submissions;
create policy "Users can submit their own island needs"
  on public.island_need_submissions for insert to authenticated
  with check ((select auth.uid())=submitted_by and consent_to_aggregate=true);
drop policy if exists "Users can read their own island need submissions" on public.island_need_submissions;
create policy "Users can read their own island need submissions"
  on public.island_need_submissions for select to authenticated
  using ((select auth.uid())=submitted_by);

grant select,insert on public.island_need_submissions to authenticated;
revoke all on public.island_need_submissions from anon;
