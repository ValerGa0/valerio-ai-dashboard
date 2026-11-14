-- META MADEIRA: indexes for foreign-key lookups in directory, needs and opportunities.
create index if not exists island_directory_source_idx on public.island_directory_entries(source_id);
create index if not exists island_needs_source_idx on public.island_needs(source_id);
create index if not exists island_opportunities_need_idx on public.island_opportunities(related_need_id);
create index if not exists island_opportunities_source_idx on public.island_opportunities(source_id);
