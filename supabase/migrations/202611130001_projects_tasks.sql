-- VALÉRIO AI Dashboard: cloud workspace foundation
-- Apply with: supabase db push (or paste into the Supabase SQL Editor).

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  type text not null default 'Project',
  description text not null default '',
  agent text not null default 'Manager',
  stage text not null default 'Planning',
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_id_user_id_key unique (id, user_id),
  constraint projects_user_name_key unique (user_id, name)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null,
  title text not null check (char_length(trim(title)) between 1 and 240),
  assigned_agent text not null default 'Manager',
  due_label text not null default '',
  status text not null default 'queued' check (status in ('queued', 'active', 'review', 'done')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_project_owner_fkey
    foreign key (project_id, user_id)
    references public.projects (id, user_id) on delete cascade,
  constraint tasks_user_title_key unique (user_id, title)
);

create index if not exists projects_user_created_idx
  on public.projects (user_id, created_at desc);
create index if not exists tasks_user_project_created_idx
  on public.tasks (user_id, project_id, created_at desc);
create index if not exists tasks_user_status_idx
  on public.tasks (user_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "Users manage their own projects" on public.projects;
create policy "Users manage their own projects"
on public.projects for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage their own tasks" on public.tasks;
create policy "Users manage their own tasks"
on public.tasks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
