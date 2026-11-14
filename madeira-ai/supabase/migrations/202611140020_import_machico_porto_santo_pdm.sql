insert into public.island_planning_documents
(municipality_id,document_type,title,status,document_date,effective_date,source_id,source_url,document_url,summary,checked_at)
values
('machico','pdm','Plano Diretor Municipal de Machico (PDMM) — regulamento e cartas de condicionantes','in_force',null,null,'machico-municipality','https://cm-machico.pt/municipal/machico-atua/urbanismo/pdm-plano-diretor-municipal','https://cm-machico.pt/municipal/machico-atua/urbanismo/pdm-plano-diretor-municipal','Official municipal PDM portal lists the regulation, constraints maps and related planning documents. Applies to areas not covered by other municipal, special or sectoral plans. Check overlapping plans and the current municipal licensing rules before assessing a parcel.',now()),
('machico','licensing_rule','Regulamento Municipal de Urbanização, Edificação e Taxas (NRMUET) — Machico','in_force',null,null,'machico-municipality','https://cm-machico.pt/municipal/machico-atua/urbanismo/pdm-plano-diretor-municipal','https://cm-machico.pt/municipal/machico-atua/urbanismo/pdm-plano-diretor-municipal','Municipal urbanisation, building and fees regulation is listed alongside the PDM. Verify current consolidated text and fee schedule with the municipality before relying on any parameter.',now()),
('porto-santo','pdm','Plano Diretor Municipal do Porto Santo — plano aprovado em 1999','in_force','1999-06-02','1999-06-17','porto-santo-municipality','https://cm-portosanto.pt/documentos-online/pdm/','https://cm-portosanto.pt/documentos-online/pdm/','The municipal portal publishes the PDM regulation and land-use/constraints maps. The municipality announced a PDM revision procedure in 2023; later municipal minutes refer to proposals for partial suspensions and preventive measures in specified areas. Check the latest official acts and any area-specific suspension before parcel assessment.',now()),
('porto-santo','pdm','Revisão do Plano Diretor Municipal do Porto Santo — procedimento e participação pública','under_revision','2023-09-18',null,'porto-santo-municipality','https://cm-portosanto.pt/discussao-publica/','https://cm-portosanto.pt/discussao-publica/','Municipal portal records the public participation period for the PDM revision from 18 September to 9 October 2023. This is a procedure record, not proof that the revised plan has entered into force. Check subsequent approval, ratification and publication milestones.',now())
on conflict do nothing;

update public.island_sources
set update_note='Official Machico urbanism portal with PDM regulation, constraints maps, municipal urbanisation/building/fees regulation and urban-rehabilitation plans. The municipal transparency page notes that some property/urbanism lists have no records published. Confirm current plan versions and parcel constraints with the municipality.',
last_checked_at=now(),is_active=true
where id='machico-municipality';
update public.island_sources
set update_note='Official Porto Santo municipal PDM portal and public-participation page. The current portal lists the 1999 PDM and maps; a revision procedure was opened for public participation in September–October 2023. Later partial suspensions/preventive measures may apply in specific areas and must be checked before parcel assessment.',
last_checked_at=now(),is_active=true
where id='porto-santo-municipality';
