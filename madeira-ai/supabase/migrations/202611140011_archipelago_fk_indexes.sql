-- Cover all foreign keys introduced by the archipelago intelligence tables.
create index if not exists island_ai_analysis_runs_municipality_idx
  on public.island_ai_analysis_runs(municipality_id);
create index if not exists island_construction_indicators_municipality_idx
  on public.island_construction_indicators(municipality_id);
create index if not exists island_construction_indicators_source_idx
  on public.island_construction_indicators(source_id);
create index if not exists island_land_opportunities_source_idx
  on public.island_land_opportunities(source_id);
create index if not exists island_need_submissions_municipality_idx
  on public.island_need_submissions(municipality_id);
create index if not exists island_planning_documents_source_idx
  on public.island_planning_documents(source_id);
