insert into public.island_planning_documents
(municipality_id,document_type,title,status,document_date,effective_date,source_id,source_url,document_url,summary,checked_at)
values
('camara-de-lobos','pdm','Revisão do Plano Diretor Municipal de Câmara de Lobos — Resolução n.º 134/2019','in_force','2019-03-28','2019-03-29','camara-de-lobos-municipality','https://www.cm-camaradelobos.pt/servicos/urbanismo/pdm-plano-diretor-municipal','https://www.cm-camaradelobos.pt/servicos/urbanismo/pdm-plano-diretor-municipal','Official municipal PDM portal lists the regulation, constraints maps, land-use/order maps, risk map and related territorial documents. The municipality reports the revised PDM entered into force on 29 March 2019. Plan-level reference only; parcel-specific restrictions must be checked against all maps and rules.',now()),
('sao-vicente','pdm','1.ª Revisão do Plano Diretor Municipal de São Vicente — Resolução n.º 532/2019','in_force','2019-08-14','2019-08-21','sao-vicente-municipality','https://cm-saovicente.pt/atividade-municipal/urbanismo/pdm-plano-diretor-municipal','https://joram.madeira.gov.pt/joram/1serie/Ano%20de%202019/ISerie-134-2019-08-20sup.pdf','The regional government ratified the first revision of the São Vicente PDM by Resolution 532/2019. The official publication includes the regulation, land-use plan and constraints maps. Parcel-specific development requires municipal confirmation.',now()),
('ribeira-brava','pdm','1.ª Alteração à 1.ª Revisão do Plano Diretor Municipal da Ribeira Brava — Aviso n.º 321/2025','in_force','2025-09-05','2025-09-19','ribeira-brava-municipality','https://cm-ribeirabrava.pt/','https://cm-ribeirabrava.pt/wp-content/uploads/2025/09/IISerie-169-2025-09-18.pdf','Municipal assembly approved the first amendment on 5 September 2025; official notice 321/2025 was published 18 September 2025. The notice states the amendments enter into force on the working day after publication. Use the republished regulation and associated map documents for planning checks.',now()),
('ribeira-brava','licensing_rule','Regulamento Municipal de Urbanização e Edificação da Ribeira Brava — Aviso n.º 23027/2025/2','in_force','2025-09-05','2025-09-18','ribeira-brava-municipality','https://cm-ribeirabrava.pt/portugues-regulamento-de-urbanizacao-e-edificacao/','https://diariodarepublica.pt/dr/detalhe/aviso/23027-2025-935608692','Municipal urbanisation and building regulation approved 5 September 2025 and published 17 September 2025; entered into force the following day. This is a local licensing/construction rule and should be read with the PDM and national/regional law.',now())
on conflict do nothing;

update public.island_sources
set update_note='Official municipal PDM portal with 2019 revised plan: regulation, constraints maps, land-use/order maps, risk map and related documents. PDM reportedly entered into force 29 March 2019. Parcel-specific checks require full map and regulation review.',
last_checked_at=now(),is_active=true
where id='camara-de-lobos-municipality';
update public.island_sources
set update_note='Official São Vicente municipal PDM portal and JORAM Resolution 532/2019. The first revision was ratified in August 2019; official publication includes regulation, land-use and constraints maps. Parcel-specific checks require municipal confirmation.',
last_checked_at=now(),is_active=true
where id='sao-vicente-municipality';
update public.island_sources
set update_note='Official municipal planning portal and published 2025 amendment to the PDM (Aviso 321/2025). Also hosts the 2025 municipal urbanisation/building regulation. Always consult the consolidated PDM, map layers and licensing rules; do not infer parcel buildability from a summary.',
last_checked_at=now(),is_active=true
where id='ribeira-brava-municipality';
