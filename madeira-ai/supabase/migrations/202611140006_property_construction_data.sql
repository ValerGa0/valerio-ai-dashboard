-- Property/planning data model and official construction/housing indicators.
-- Parcel buildability is never inferred from statistical or map layers; parcel-specific confirmation remains a municipal/legal check.

create table if not exists public.island_planning_documents (
  id uuid primary key default gen_random_uuid(),
  municipality_id text not null references public.island_municipalities(id),
  document_type text not null check (document_type in ('pdm','urban_plan','ren','ran','licensing_rule','public_notice','other')),
  title text not null,
  status text not null default 'not_checked'
    check (status in ('not_checked','draft','under_revision','public_consultation','approved','in_force','superseded','expired')),
  document_date date,
  effective_date date,
  source_id text references public.island_sources(id),
  source_url text not null,
  document_url text,
  summary text not null default '',
  checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.island_land_opportunities (
  id uuid primary key default gen_random_uuid(),
  external_key text unique,
  municipality_id text not null references public.island_municipalities(id),
  title text not null,
  opportunity_type text not null
    check (opportunity_type in ('municipal_land_bank','public_sale','public_lease','public_tender','other')),
  location_label text,
  area_sqm numeric check (area_sqm is null or area_sqm > 0),
  land_classification text,
  buildability_status text not null default 'not_assessed'
    check (buildability_status in ('not_assessed','potential','restricted','confirmed_buildable','not_buildable')),
  evidence_summary text not null default '',
  source_id text references public.island_sources(id),
  source_url text not null,
  published_at date,
  expires_at date,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','source_listed','verified','needs_review','closed')),
  checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.island_construction_indicators (
  id uuid primary key default gen_random_uuid(),
  municipality_id text references public.island_municipalities(id),
  metric_key text not null,
  segment text not null default '',
  metric_label text not null,
  metric_value numeric not null,
  unit text not null,
  reference_year integer not null,
  comparison_period text not null default '',
  source_id text references public.island_sources(id),
  source_url text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists island_planning_municipality_status_idx
  on public.island_planning_documents(municipality_id,status);
create index if not exists island_land_municipality_status_idx
  on public.island_land_opportunities(municipality_id,verification_status,buildability_status);
create index if not exists island_construction_year_metric_idx
  on public.island_construction_indicators(reference_year,metric_key,municipality_id);
create unique index if not exists island_construction_metric_unique_idx
  on public.island_construction_indicators(metric_key,segment,coalesce(municipality_id,''),reference_year,source_id);

alter table public.island_planning_documents enable row level security;
alter table public.island_land_opportunities enable row level security;
alter table public.island_construction_indicators enable row level security;

drop policy if exists "Public read island planning documents" on public.island_planning_documents;
create policy "Public read island planning documents" on public.island_planning_documents for select to anon, authenticated using (true);
drop policy if exists "Public read island land opportunities" on public.island_land_opportunities;
create policy "Public read island land opportunities" on public.island_land_opportunities for select to anon, authenticated using (true);
drop policy if exists "Public read island construction indicators" on public.island_construction_indicators;
create policy "Public read island construction indicators" on public.island_construction_indicators for select to anon, authenticated using (true);

grant select on public.island_planning_documents,public.island_land_opportunities,public.island_construction_indicators to anon,authenticated;

insert into public.island_construction_indicators
(municipality_id,metric_key,segment,metric_label,metric_value,unit,reference_year,comparison_period,source_id,source_url,notes)
values
(null,'non_financial_enterprises_total','','Non-financial enterprises',37986,'enterprises',2024,'2024','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Regional total; not a named-company directory.'),
(null,'enterprise_employment_total','','Persons employed in non-financial enterprises',109379,'persons',2024,'2024','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Regional total.'),
(null,'enterprise_turnover_total','','Turnover of non-financial enterprises',11.2,'billion_eur',2024,'2024','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Rounded regional total.'),
(null,'enterprise_count_growth_pct','','Enterprise count growth',6.0,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Regional growth rate.'),
(null,'enterprise_sector_growth_pct','transport_and_storage','Enterprise growth — transport and storage',27.1,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Regional sector growth.'),
(null,'enterprise_sector_growth_pct','accommodation_and_food','Enterprise growth — accommodation and food services',12.2,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Regional sector growth.'),
(null,'enterprise_sector_growth_pct','real_estate_activities','Enterprise growth — real estate activities',9.6,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Regional sector growth.'),
(null,'enterprise_sector_growth_pct','construction','Enterprise growth — construction',9.3,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Regional sector growth.'),
('porto-moniz','municipal_enterprise_growth_pct','','Enterprise count growth — Porto Moniz',11.6,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Municipal establishment growth rate.'),
('porto-santo','municipal_enterprise_growth_pct','','Enterprise count growth — Porto Santo',11.0,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Municipal establishment growth rate.'),
('calheta','municipal_enterprise_growth_pct','','Enterprise count growth — Calheta',10.0,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Municipal establishment growth rate.'),
('ribeira-brava','municipal_enterprise_growth_pct','','Enterprise count growth — Ribeira Brava',8.5,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Municipal establishment growth rate.'),
('funchal','municipal_enterprise_growth_pct','','Enterprise count growth — Funchal',6.1,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Municipal establishment growth rate.'),
('machico','municipal_enterprise_growth_pct','','Enterprise count growth — Machico',6.0,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Municipal establishment growth rate.'),
('ponta-do-sol','municipal_enterprise_growth_pct','','Enterprise count growth — Ponta do Sol',5.8,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Municipal establishment growth rate.'),
('santana','municipal_enterprise_growth_pct','','Enterprise count growth — Santana',5.7,'percent',2024,'2024 vs 2023','drem-enterprise-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/empresas-gb/empresas1-gb/empresas1-noticias-gb/5754-13-04-2026-in-2024-the-turnover-of-non-financial-enterprise-in-the-autonomous-region-of-madeira-grew-7-4-compared-to-the-previous-year-whilst-the-number-of-persons-employed-increased-by-6-9.html','Municipal establishment growth rate.'),
(null,'construction_work_value_m_eur','','Value of work carried out by construction enterprises',1073.8,'million_eur',2024,'2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional aggregate.'),
(null,'completed_dwellings','','Estimated dwellings completed',971,'dwellings',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional estimate.'),
(null,'building_permits','','Buildings with building permits',563,'buildings',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional aggregate; count of buildings, not dwellings.'),
(null,'licensed_dwellings','','Dwellings licensed',1190,'dwellings',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional aggregate.'),
(null,'dwelling_transactions','','Dwelling transactions',3303,'transactions',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional aggregate.'),
(null,'dwelling_transaction_value_m_eur','','Value of dwelling transactions',968.8,'million_eur',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional aggregate.'),
(null,'bank_valuation_median_eur_m2','','Median bank appraisal value for housing',2249,'eur_per_m2',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional median; not a parcel valuation or offer price.'),
(null,'dwelling_sale_median_eur_m2','','Median sale price of family dwellings',2500,'eur_per_m2',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional median; not a specific property asking price.'),
(null,'dwelling_rent_median_eur_m2','','Median rent in new residential tenancy contracts',11.33,'eur_per_m2',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional median.'),
(null,'cement_sales','','Estimated cement sales',166229,'tonnes',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional aggregate.')
on conflict do nothing;
