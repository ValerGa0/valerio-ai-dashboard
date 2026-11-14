insert into public.island_planning_documents
(municipality_id,document_type,title,status,document_date,effective_date,source_id,source_url,document_url,summary,checked_at)
values
('ponta-do-sol','PDM','1.ª Revisão do Plano Diretor Municipal de Ponta do Sol (Resolução n.º 464/2013)','in_force','2013-05-16','2013-05-23','ponta-do-sol-municipality','https://www.cm-pontadosol.pt/viver/atividade-municipal/urbanismo/plano-diretor-municipal','https://urbanismo.cm-pontadosol.pt/','Municipal plan in force according to the municipality portal. The urbanism portal provides regulation, constraints map, land-use map and other elements. This is a plan-level reference, not a parcel-specific buildability decision.',now()),
('calheta','PDM','Alteração à 1.ª Revisão do Plano Diretor Municipal da Calheta — Resolução n.º 114/2026','in_force','2026-03-12','2026-03-19','calheta-municipality','https://www.cmcalheta.pt/pt/atividade-municipal/urbanismo/plano-diretor-municipal','https://www.cmcalheta.pt/images/documentos/ordenamento_territorio/pdm_2026/avisos_e_regulamento/ISerie-048-2026-03-18sup2.pdf','The regional government ratified provisions of the 1st PDM revision amendment that were inconsistent with the Madeira coastal programme. The resolution was published 18 March 2026 and entered into force the following day. Consult the consolidated regulation and graphic plans before any parcel assessment.',now()),
('calheta','PDM_MAP','Planta de Ordenamento — Classificação e Qualificação do Solo (Calheta, alteração 2026)','in_force','2026-02-01','2026-03-19','calheta-municipality','https://www.cmcalheta.pt/pt/atividade-municipal/urbanismo/plano-diretor-municipal','https://www.cmcalheta.pt/images/documentos/ordenamento_territorio/pdm_2026/relatorio/Anexo%20III%20-%201.A-%20ORD_alt.pdf','Official land classification and qualification map at 1:10,000. Map categories require interpretation against the regulation and all constraints; not a parcel-specific building permit or legal opinion.',now())
on conflict do nothing;

update public.island_sources
set update_note='Official Ponta do Sol urbanism portal: vigente 1st PDM revision approved by Government Resolution 464/2013, plus regulation, land-use plan, constraints map and related planning documents. Parcel-specific buildability must be confirmed in writing with the municipality.',
last_checked_at=now(),is_active=true
where id='ponta-do-sol-municipality';
update public.island_sources
set update_note='Official Calheta PDM portal. Includes 2026 amendment to the 1st revision, regulation and land-classification/qualification maps, constraints maps and environmental/heritage layers. Resolution 114/2026 was published 18 March 2026 and entered into force the next day.',
last_checked_at=now(),is_active=true
where id='calheta-municipality';
