insert into public.island_planning_documents
(municipality_id,document_type,title,status,document_date,effective_date,source_id,source_url,document_url,summary,checked_at)
values
('funchal','pdm','Plano Diretor Municipal do Funchal — procedimento de revisão em conferência procedimental','under_revision','2026-11-13',null,'prit','https://prit.madeira.gov.pt/publico/planos','https://prit.madeira.gov.pt/publico/planos','The regional PRIT public portal lists a Funchal PDM procedure at the procedural-conference stage with a start date of 13 November 2026. This is a process milestone, not an approved or in-force revised plan. Verify the current plan and all later milestones before any parcel assessment.',now())
on conflict do nothing;
