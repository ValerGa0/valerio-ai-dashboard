-- Per-user AI analysis usage ledger. A short rolling limit protects the OpenAI-backed endpoint from accidental repeated calls.
create table if not exists public.island_ai_analysis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  municipality_id text references public.island_municipalities(id),
  created_at timestamptz not null default now()
);
create index if not exists island_ai_analysis_runs_user_date_idx
  on public.island_ai_analysis_runs(user_id,created_at desc);
alter table public.island_ai_analysis_runs enable row level security;
drop policy if exists "Users can record their own AI analysis runs" on public.island_ai_analysis_runs;
create policy "Users can record their own AI analysis runs"
  on public.island_ai_analysis_runs for insert to authenticated
  with check ((select auth.uid())=user_id);
drop policy if exists "Users can read their own AI analysis runs" on public.island_ai_analysis_runs;
create policy "Users can read their own AI analysis runs"
  on public.island_ai_analysis_runs for select to authenticated
  using ((select auth.uid())=user_id);
grant select,insert on public.island_ai_analysis_runs to authenticated;
revoke all on public.island_ai_analysis_runs from anon;
