-- META MADEIRA: archipelago-wide public intelligence foundation.
-- Applied first to the isolated Preview Supabase project.
-- Public users can read curated data; writes remain server/admin-only until moderation workflows exist.

create table if not exists public.island_municipalities (
  id text primary key,
  island text not null check (island in ('madeira','porto_santo')),
  name_pt text not null,
  name_en text not null,
  name_ru text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.island_sources (
  id text primary key,
  name text not null,
  category text not null,
  publisher text not null,
  url text not null unique,
  authority text not null check (authority in ('official','operator','independent','community')),
  scope text not null default 'archipelago',
  update_note text not null default '',
  last_checked_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.island_directory_entries (
  id uuid primary key default gen_random_uuid(),
  external_key text unique,
  name text not null,
  category text not null,
  description text not null default '',
  municipality_id text references public.island_municipalities(id),
  parish text,
  address text,
  latitude double precision check (latitude is null or latitude between -90 and 90),
  longitude double precision check (longitude is null or longitude between -180 and 180),
  phone text,
  website text,
  source_id text references public.island_sources(id),
  source_url text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','source_listed','verified','needs_review','closed')),
  last_verified_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.island_needs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  municipality_id text references public.island_municipalities(id),
  description text not null default '',
  evidence_summary text not null default '',
  source_id text references public.island_sources(id),
  validation_status text not null default 'candidate'
    check (validation_status in ('candidate','under_review','validated','not_confirmed')),
  priority smallint not null default 3 check (priority between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.island_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  municipality_id text references public.island_municipalities(id),
  description text not null default '',
  evidence_summary text not null default '',
  related_need_id uuid references public.island_needs(id) on delete set null,
  source_id text references public.island_sources(id),
  status text not null default 'idea'
    check (status in ('idea','research','validated','partnering','in_progress','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists island_directory_municipality_category_idx
  on public.island_directory_entries(municipality_id, category);
create index if not exists island_directory_status_idx
  on public.island_directory_entries(verification_status, is_active);
create index if not exists island_needs_municipality_status_idx
  on public.island_needs(municipality_id, validation_status);
create index if not exists island_opportunities_municipality_status_idx
  on public.island_opportunities(municipality_id, status);

alter table public.island_municipalities enable row level security;
alter table public.island_sources enable row level security;
alter table public.island_directory_entries enable row level security;
alter table public.island_needs enable row level security;
alter table public.island_opportunities enable row level security;

drop policy if exists "Public read island municipalities" on public.island_municipalities;
create policy "Public read island municipalities" on public.island_municipalities for select to anon, authenticated using (true);
drop policy if exists "Public read island sources" on public.island_sources;
create policy "Public read island sources" on public.island_sources for select to anon, authenticated using (true);
drop policy if exists "Public read island directory" on public.island_directory_entries;
create policy "Public read island directory" on public.island_directory_entries for select to anon, authenticated using (true);
drop policy if exists "Public read island needs" on public.island_needs;
create policy "Public read island needs" on public.island_needs for select to anon, authenticated using (true);
drop policy if exists "Public read island opportunities" on public.island_opportunities;
create policy "Public read island opportunities" on public.island_opportunities for select to anon, authenticated using (true);

-- Supabase no longer auto-exposes new public tables to the Data API on newer projects.
grant select on public.island_municipalities, public.island_sources,
  public.island_directory_entries, public.island_needs, public.island_opportunities
  to anon, authenticated;

insert into public.island_municipalities (id,island,name_pt,name_en,name_ru) values
('calheta','madeira','Calheta','Calheta','Калета'),
('camara-de-lobos','madeira','Câmara de Lobos','Câmara de Lobos','Камара-де-Лобуш'),
('funchal','madeira','Funchal','Funchal','Фуншал'),
('machico','madeira','Machico','Machico','Машику'),
('ponta-do-sol','madeira','Ponta do Sol','Ponta do Sol','Понта-ду-Сол'),
('porto-moniz','madeira','Porto Moniz','Porto Moniz','Порту-Мониш'),
('ribeira-brava','madeira','Ribeira Brava','Ribeira Brava','Рибейра-Брава'),
('santa-cruz','madeira','Santa Cruz','Santa Cruz','Санта-Круш'),
('santana','madeira','Santana','Santana','Сантана'),
('sao-vicente','madeira','São Vicente','São Vicente','Сан-Висенти'),
('porto-santo','porto_santo','Porto Santo','Porto Santo','Порту-Санту')
on conflict (id) do update set island=excluded.island,name_pt=excluded.name_pt,name_en=excluded.name_en,name_ru=excluded.name_ru;

insert into public.island_sources (id,name,category,publisher,url,authority,scope,update_note) values
('drem','DREM — Madeira official statistics','statistics','Direção Regional de Estatística da Madeira','https://estatistica.madeira.gov.pt/','official','archipelago','Record the reference period, release date and provisional/final status.'),
('visit-madeira','Visit Madeira — official tourism portal','tourism','Associação de Promoção da Madeira','https://visitmadeira.com/en/','official','archipelago','Verify opening hours, event dates and operator details separately.'),
('ipma','IPMA — weather and sea conditions','weather','Instituto Português do Mar e da Atmosfera','https://www.ipma.pt/en/','official','archipelago','Use the latest issue time for forecasts and warnings.'),
('ifcn','IFCN — trails and nature','nature','Instituto das Florestas e Conservação da Natureza','https://ifcn.madeira.gov.pt/','official','archipelago','Check current trail restrictions and operational notices.'),
('prit','PRIT — territorial planning','property','Governo Regional da Madeira','https://prit.madeira.gov.pt/paginaInicial','official','archipelago','Map data is not a buildability guarantee; obtain parcel-specific municipal confirmation.'),
('prit-pdm','PRIT — municipal master plans','property','Governo Regional da Madeira','https://prit.madeira.gov.pt/publico/planos','official','archipelago','Use the applicable current municipal PDM and planning instruments.'),
('irig','IRIG — geographic information','maps','Governo Regional da Madeira','https://irig.madeira.gov.pt/paginaInicial','official','archipelago','Geospatial layers support research, not cadastral/legal confirmation.'),
('simplifica','SIMplifica — regional digital services','government','Governo Regional da Madeira','https://simplifica.madeira.gov.pt/','official','archipelago','Confirm eligibility, current fees and whether in-person steps are required.'),
('siga','SIGA Madeira — public transport','transport','SIGA Madeira','https://siga.madeira.gov.pt/public/','operator','madeira','Check route, date and live service notices.'),
('sesaram','SESARAM — regional health service','health','SESARAM','https://www.sesaram.pt/','official','archipelago','Confirm service availability with the provider.'),
('madeira-government','Madeira Regional Government','government','Governo Regional da Madeira','https://www.madeira.gov.pt/','official','archipelago','Prefer current notices from the responsible department.'),
('porto-moniz-municipality','Porto Moniz Municipality — visitor portal','directory','Câmara Municipal do Porto Moniz','https://www.portomoniz.pt/pt/visitantes','official','porto-moniz','Municipal discovery source; confirm current operation directly.'),
('porto-moniz-business-directory','Porto Moniz Municipality — business directory','business','Câmara Municipal do Porto Moniz','https://www.portomoniz.pt/pt/atividade-municipal/economia/diretorio-de-empresas','official','porto-moniz','Use as a lead source and verify legal status and current contacts.'),
('porto-moniz-pdm','Porto Moniz Municipality — PDM','property','Câmara Municipal do Porto Moniz','https://www.portomoniz.pt/pt/atividade-municipal/urbanismo/plano-diretor-municipal','official','porto-moniz','Obtain written parcel-specific planning confirmation.')
on conflict (id) do update set name=excluded.name,category=excluded.category,publisher=excluded.publisher,url=excluded.url,authority=excluded.authority,scope=excluded.scope,update_note=excluded.update_note;
